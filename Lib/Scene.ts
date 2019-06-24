namespace Lib {
    export class Scene {
        private m_root: SimObject;
        public constructor() {
            this.m_root = new SimObject(0, "__ROOT__");
        }

        public get root(): SimObject {
            return this.m_root;
        }

        public get isLoaded(): boolean {
            return this.m_root.isLoaded;
        }

        public addObject(object: SimObject): void {
            this.m_root.addChild(object);
        }

        public getObjectByName(name: string): SimObject {
            return this.m_root.getObjectByName(name);
        }

        public load(): void {
            this.m_root.load();
        }

        public update(time: number): void {
            this.m_root.update(time);
        }

        public render(shader: Shader): void {
            this.m_root.render(shader);
        }
    }
}