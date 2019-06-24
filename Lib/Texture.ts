namespace Lib {
    const LEVEL: number = 0;
    const BORDER: number = 0;
    const TEMP_IMAGE_DATA: Uint8Array = new Uint8Array([255, 255, 255, 255]);

    export class Texture implements IMessagehandler {

        private m_name: string;
        private m_handle: WebGLTexture;
        private m_isLoaded: boolean = false;
        private m_width: number;
        private m_height: number;
        public bitMode: boolean = false

        public constructor(name: string, width: number = 1, height: number = 1) {
            this.m_name = name;
            this.m_width = width;
            this.m_height = height;
            this.m_handle = gl.createTexture();

            Message.subscribe(MESSAGE_ASSET_LOADER_ASSET_LOADED + this.m_name, this);
            this.bind();

            //assign a init raw imagine texture
            gl.texImage2D(
                gl.TEXTURE_2D,
                LEVEL,
                gl.RGBA,
                1,
                1,
                BORDER,
                gl.RGBA,
                gl.UNSIGNED_BYTE,
                TEMP_IMAGE_DATA
            );

            //Get Asset
            let asset = AssetManager.getAsset(this.name) as ImageAsset;
            if (asset !== undefined) {
                this.loadTextureFromAesst(asset);
            }
        }

        public get name(): string {
            return this.m_name;
        }

        public get isLoaded(): boolean {
            return this.m_isLoaded;
        }

        public get width(): number {
            return this.m_width;
        }

        public get height(): number {
            return this.m_height;
        }

        public destory(): void {
            gl.deleteTexture(this.m_handle);
        }

        public activateAndBind(textureUnit: number = 0): void {
            gl.activeTexture(gl.TEXTURE0 + textureUnit);
            this.bind();
        }

        public bind(): void {
            gl.bindTexture(gl.TEXTURE_2D, this.m_handle);
        }

        public unbind(): void {
            gl.bindTexture(gl.TEXTURE_2D, undefined);
        }

        public onMessage(message: Message) {
            if (message.code === MESSAGE_ASSET_LOADER_ASSET_LOADED + this.m_name) {
                this.loadTextureFromAesst(message.context as ImageAsset);
            }
        }

        private loadTextureFromAesst(asset: ImageAsset): void {
            this.m_width = asset.width;
            this.m_height = asset.height;
            this.bind();

            //assign image element texture
            gl.texImage2D(gl.TEXTURE_2D, LEVEL, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, asset.data);
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

            if (this.isPowerof2()) {
                gl.generateMipmap(gl.TEXTURE_2D);
            } else {

                // Do not generate a mip map and clamp wrapping to edge.
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            }

            // TODO:  Set texture filte r ing based on configuration.
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

            this.m_isLoaded = true;
        }

        private isPowerof2(): boolean {
            return (this.isValuePowerOf2(this.m_width) && this.isValuePowerOf2(this.m_height));
        }

        private isValuePowerOf2(value: number): boolean {
            return (value & (value - 1)) == 0;
        }
    }

    class TextureReferenceNode {
        public texture: Texture;
        public referenceCount: number = 1;
        public constructor(texture: Texture) {
            this.texture = texture;
        }
    }

    export class TextureManager {
        private static m_texture: { [name: string]: TextureReferenceNode } = { };

        private constructor() {
        }

        public static getTexture(textureName: string): Texture {
            if (TextureManager.m_texture[textureName] === undefined) {
                let texture = new Texture(textureName);
                TextureManager.m_texture[textureName] = new TextureReferenceNode(texture);
            }
            else {
                TextureManager.m_texture[textureName].referenceCount++;
            }
            return TextureManager.m_texture[textureName].texture;
        }

        public static releaseTexture(name: string): void {
            if (TextureManager.m_texture[name] === undefined) {
                console.warn("Texture:" + name + "is not exist.");
            }
            else {
                TextureManager.m_texture[name].referenceCount--;
                if (TextureManager.m_texture[name].referenceCount < 1) {
                    TextureManager.m_texture[name].texture.destory();
                    TextureManager.m_texture[name] = undefined;
                    delete TextureManager.m_texture[name];
                }
            }
        }
    }
}