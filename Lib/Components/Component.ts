namespace Lib {
    export abstract class BaseComponent implements IComponent {
        protected owner: SimObject;
        protected data: IComponentData;
        public name: string = "";

        public constructor(data: IComponentData) {
            if (data !== undefined) {
                this.data = data;
                this.name = data.name
            }
        }

        public getOwner(): SimObject {
            return this.owner;
        }

        public setOwner(owner: SimObject): void {
            this.owner = owner;
        }

        public load(): void {

        }

        public update(time: number): void {

        }

        public render(shader: Shader): void {

        }
    }

    export class ComponentManager {
        private static m_registeredBuilders: { [type: string]: IComponentBuilder } = {};

        public static registerBuilder(builder: IComponentBuilder): void {
            ComponentManager.m_registeredBuilders[builder.type] = builder;
            console.log("Register component builder:" + builder.type);
        }

        //Set component from json file
        public static extractComponent(json: any): IComponent {
            if (json.type !== undefined) {
                if (ComponentManager.m_registeredBuilders[json.type] !== undefined) {
                    return ComponentManager.m_registeredBuilders[String(json.type)].buildFromJson(json);
                }
                throw new Error("Component manager error: builder is not registered.");
            }
            throw new Error("Component manager error: type is undefined.");
        }
    }
}