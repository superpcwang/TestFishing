namespace Lib {
    export enum ZoneState {
        UNINITIALIZED,
        LOADING,
        UPDATEING,
    }


    export class Zone {
        private m_id: number;
        private m_name: string;
        private m_description: string;
        private m_scene: Scene;
        private m_state: ZoneState = ZoneState.UNINITIALIZED;
        private m_globalID: number = -1;

        public constructor(id: number, name: string, description: string) {
            this.m_id = id;
            this.m_name = name;
            this.m_description = description;
            this.m_scene = new Scene();
        }

        public get id(): number {
            return this.m_id;
        }

        public get name(): string {
            return this.m_name;
        }

        public get description(): string {
            return this.m_description;
        }

        public get scene(): Scene {
            return this.m_scene;
        }

        public initialize(data: any): void {
            //phase objects
            if (data.objects === undefined) {
                throw new Error("Zone initialization error: no object list.");
            }

            for (let o in data.objects) {
                let obj = data.objects[o];
                this.loadSimobject(obj, this.m_scene.root);
            }
        }

        public load(): void {
            this.m_state = ZoneState.LOADING;
            this.m_scene.load();
            this.m_state = ZoneState.UPDATEING;
        }

        public unload(): void {

        }

        public update(time: number): void {
            if (this.m_state === ZoneState.UPDATEING) {
                this.m_scene.update(time);
            }
        }

        public render(shader: Shader): void {
            if (this.m_state === ZoneState.UPDATEING) {
                this.m_scene.render(shader);
            }
        }

        public onActivated(): void {

        }

        public onDeactivated(): void {

        }

        private loadSimobject(data: any, parent: SimObject): void {
            //phase name
            let name: string;
            if (data.name !== undefined) {
                name = String(data.name);
                console.log("load SimObject:" + name);
            }
            this.m_globalID++;
            let simObject = new SimObject(this.m_globalID, name, this.m_scene);

            //phase transform
            if (data.transform !== undefined) {
                simObject.transform.setFromJson(data.transform);
                console.log("load SimObject:" + name + " transform");
            }

            if (data.components !== undefined) {
                for (let c in data.components) {
                    let component = ComponentManager.extractComponent(data.components[c]);
                    console.log("load SimObject:" + name + " components:" + component.name);
                    simObject.addComponent(component);
                }
            }

            if (data.behaviors !== undefined) {
                for (let b in data.behaviors) {
                    let behavior = BehaviorManager.extractComponent(data.behaviors[b]);
                    console.log("load SimObject:" + name + " behaviors:" + behavior.name);
                    simObject.addBehavior(behavior);
                }
            }

            //load child
            if (data.children !== undefined) {
                for (let o in data.children) {
                    let obj = data.children[o];
                    this.loadSimobject(obj, simObject);
                }
            }

            //add to parent
            if (parent !== undefined) {
                parent.addChild(simObject);
            }
        }
    }

    export class ZoneManager implements IMessagehandler {
        private static m_globalZoneID: number = -1;
        //private static m_zones: { [id: number]: Zone } = {};
        private static m_registerZones: { [id: number]: string } = {};
        private static m_activeZone: Zone;
        private static m_inst: ZoneManager;

        private constructor() {
            
        }

        public static initialize() {
            ZoneManager.m_inst = new ZoneManager();
            //ZoneManager.m_registerZones[0] = "asset/testZone.json";
            ZoneManager.m_registerZones[0] = "asset/testZone.json";
        }

        /*
        public static createZone(name: string, description: string): number {
            ZoneManager.m_globalZoneID++;
            let zone = new TestZone(ZoneManager.m_globalZoneID, name, description);
            ZoneManager.m_zones[ZoneManager.m_globalZoneID] = zone;
            return ZoneManager.m_globalZoneID;
        }*/

        public static changeZone(id: number): void {
            if (ZoneManager.m_activeZone !== undefined) {
                ZoneManager.m_activeZone.onDeactivated();
                ZoneManager.m_activeZone.unload();
                ZoneManager.m_activeZone = undefined;
            }

            if (ZoneManager.m_registerZones[id] !== undefined) {
                if (AssetManager.isAssetLoader(ZoneManager.m_registerZones[id])) {
                    let asset = AssetManager.getAsset(ZoneManager.m_registerZones[id]);
                    ZoneManager.loadZone(asset);
                }
                else {
                    //asset is not loaded
                    Message.subscribe(
                        MESSAGE_ASSET_LOADER_ASSET_LOADED + ZoneManager.m_registerZones[id],
                        ZoneManager.m_inst
                    );
                    AssetManager.loadAsset(ZoneManager.m_registerZones[id]);
                }
            }
            else {
                throw new Error("Zone id:" + id.toString + "is not exist");
            }
        }

        public static get activeZone(): Zone {
            return this.m_activeZone;
        }

        public static update(time: number): void {
            if (ZoneManager.m_activeZone !== undefined) {
                ZoneManager.m_activeZone.update(time);
            }
        }

        public static render(shader: Shader): void {
            if (ZoneManager.m_activeZone !== undefined) {
                ZoneManager.m_activeZone.render(shader);
            }
        }

        public onMessage(message: Message) {
            if (message.code.indexOf(MESSAGE_ASSET_LOADER_ASSET_LOADED) !== -1) {
                let asset = message.context as JsonAsset;
                ZoneManager.loadZone(asset);
            }
        }

        private static loadZone(asset: JsonAsset): void {
            let data = asset.data;
            let id: number;
            if (data.id === undefined) {
                throw new Error("Zone file format error: id is not exist.");
            }
            else {
                id = Number(data.id);
            }

            let name: string;
            if (data.name === undefined) {
                throw new Error("Zone file format error: name is not exist.");
            }
            else {
                name = String(data.name);
            }

            let description: string;
            if (data.description !== undefined) {
                description = String(data.description);
            }

            ZoneManager.m_activeZone = new Zone(id, name, description);
            ZoneManager.m_activeZone.initialize(data);
            ZoneManager.m_activeZone.onActivated();
            ZoneManager.m_activeZone.load();
        }
    }
}