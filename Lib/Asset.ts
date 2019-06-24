namespace Lib {
    export interface IAsset {
        readonly name: string;
        readonly data: any;
    }

    export interface IAssetLoader {
        readonly suppertedExtensions: string[];
        loadAsset(assetName: string): void;
    }

    export const MESSAGE_ASSET_LOADER_ASSET_LOADED = "MESSAGE_ASSET_LOADER_ASSET_LOADED::";

    export class AssetManager {
        private static m_loader: IAssetLoader[] = [];
        private static m_loadedAsset: { [name: string]: IAsset } = {};

        private constructor() {

        }

        public static initialize(): void {
            AssetManager.m_loader.push(new ImageAssetLoader() );
            AssetManager.m_loader.push(new JsonAssetLoader() );
        }

        public static registerLoader(loader: IAssetLoader): void {
            AssetManager.m_loader.push(loader);

        }

        public static onAssetLoaded(asset: IAsset): void {
            AssetManager.m_loadedAsset[asset.name] = asset;
            Message.send(MESSAGE_ASSET_LOADER_ASSET_LOADED + asset.name, this, asset);
        }

        public static loadAsset(assetName: string): void {
            //Get file extension
            let extension = assetName.split('.').pop().toLowerCase();
            for (let l of AssetManager.m_loader) {
                if (l.suppertedExtensions.indexOf(extension) !== -1) {
                    l.loadAsset(assetName);
                    return;
                }
            }
            console.warn("Unable to load asset with extension:" + extension);
        }

        public static isAssetLoader(assetName: string): boolean {
            return AssetManager.m_loadedAsset[assetName] !== undefined;
        }

        public static getAsset(assetName: string): IAsset {
            if (AssetManager.m_loadedAsset[assetName] !== undefined) {
                return AssetManager.m_loadedAsset[assetName];
            }
            else {
                AssetManager.loadAsset(assetName);
            }
            return undefined;
        }
    }

    export class ImageAsset implements IAsset {
        public readonly name: string;
        public readonly data: HTMLImageElement;
        public constructor(name: string, data: HTMLImageElement) {
            this.name = name;
            this.data = data;
        }

        public get width(): number {
            return this.data.width;
        }

        public get height(): number {
            return this.data.height;
        }
    }

    export class ImageAssetLoader implements IAssetLoader {
        public get suppertedExtensions(): string[] {
            return ["png", "gif", "jpg"];
        }

        public loadAsset(assetName: string): void {
            let image: HTMLImageElement = new Image();
            image.onload = (this.onImageLoaded.bind(this, assetName, image));
            image.src = assetName;
        }

        private onImageLoaded(assetName: string, image: HTMLImageElement): void {
            console.log("OnImageLoaded: assetName/image", assetName, image);
            let asset = new ImageAsset(assetName, image);
            AssetManager.onAssetLoaded(asset);
        }
    }

    export class JsonAsset implements IAsset {
        public readonly name: string;
        public readonly data: any;
        public constructor(name: string, data: any) {
            this.name = name;
            this.data = data;
        }
    }

    export class JsonAssetLoader implements IAssetLoader {
        public get suppertedExtensions(): string[] {
            return ["json"];
        }

        public loadAsset(assetName: string): void {
            let request: XMLHttpRequest = new XMLHttpRequest();
            request.open("GET", assetName);
            request.addEventListener("load", this.onJsonLoaded.bind(this, assetName, request));
            request.send();
        }

        private onJsonLoaded(assetName: string, request: XMLHttpRequest): void {
            console.log("onJsonLoaded: assetName/request", assetName, request);

            if (request.readyState === request.DONE) {
                let json = JSON.parse(request.responseText);
                let asset = new JsonAsset(assetName, json);
                AssetManager.onAssetLoaded(asset);
            }
        }
    }
}