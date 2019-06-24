namespace Lib {
    export class SimObject {
        private m_id: number;
        private m_children: SimObject[] = [];
        private m_parent: SimObject;
        private m_isLoaded: boolean = false;
        private m_scene: Scene;
        private m_component: IComponent[] = [];
        private m_behavior: IBehavior[] = [];

        private m_localMatrix: Matrix4x4 = Matrix4x4.identity();
        private m_worldMatrix: Matrix4x4 = Matrix4x4.identity();

        public name: string;

        public transform: Transform = new Transform();

        public constructor(id: number, name: string, scene?: Scene) {
            this.m_id = id;
            this.name = name;
            this.m_scene = scene;
        }

        public get id(): number {
            return this.m_id;
        }

        public get parent(): SimObject {
            return this.m_parent;
        }

        public get worldMatrix(): Matrix4x4 {
            return this.m_worldMatrix;
        }

        public get isLoaded(): boolean {
            return this.m_isLoaded;
        }

        public get scene(): Scene {
            return this.m_scene;
        }

        public addChild(child: SimObject): void {
            child.m_parent = this;
            this.m_children.push(child);
            child.onAdded(this.m_scene);
        }

        public removeChild(child: SimObject): void {
            let index = this.m_children.indexOf(child);
            if (index !== -1) {
                child.m_parent = undefined;
                this.m_children.splice(index, 1);
            }
        }

        public getObjectByName(name: string): SimObject {
            if (this.name === name) {
                return this;
            }
            for (let child of this.m_children) {
                let result = child.getObjectByName(name);
                if (result !== undefined) {
                    return result;
                }
            }
            return undefined;
        }

        public addComponent(component: IComponent): void {
            this.m_component.push(component);
            component.setOwner(this);
        }

        public getComponentByName(name: string): IComponent {
            for (let component of this.m_component) {
                if (component.name === name) {
                    return component;
                }
            }

            for (let child of this.m_children) {
                let component = child.getComponentByName(name);
                if (component !== undefined) {
                    return component;
                }
            }

            return undefined;
        }

        public addBehavior(behavior: IBehavior): void {
            this.m_behavior.push(behavior);
            behavior.setOwner(this);
        }

        public load(): void {
            this.m_isLoaded = true;

            for (let c of this.m_component) {
                c.load();
            }

            for (let b of this.m_behavior) {
                b.load();
            }

            for (let c of this.m_children) {
                c.load();
            }
        }

        public update(time: number) {
            this.m_localMatrix = this.transform.getTransformationMatrix();
            this.updateWorldMatrix((this.m_parent !== undefined) ? this.m_parent.worldMatrix : undefined);
            for (let c of this.m_component) {
                c.update(time);
            }

            for (let b of this.m_behavior) {
                b.update(time);
            }

            for (let c of this.m_children) {
                c.update(time);
            }
        }

        public render(shader: Shader): void {
            for (let c of this.m_component) {
                c.render(shader);
            }

            for (let c of this.m_children) {
                c.render(shader);
            }
        }

        protected onAdded(scene: Scene): void {
            this.m_scene = scene;
        }

        private updateWorldMatrix(parentWorldMatrix: Matrix4x4): void {
            if (parentWorldMatrix !== undefined) {
                this.m_worldMatrix = Matrix4x4.multiply(parentWorldMatrix, this.m_localMatrix);
            }
            else {
                this.m_worldMatrix.copyFrom(this.m_localMatrix);
            }
        }

        public getWorldPosition(): Vector3 {
            return new Vector3(this.m_worldMatrix.data[12], this.m_worldMatrix.data[13], this.m_worldMatrix.data[14]);
        }
    }
}