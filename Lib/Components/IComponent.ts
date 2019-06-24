namespace Lib {
    export interface IComponentData {
        name: string;
        setFromJson(json: any): void;
    }

    export interface IComponent {
        name: string;
        getOwner(): SimObject;
        setOwner(owner: SimObject): void;
        load(): void;
        update(time: number): void;
        render(shader: Shader): void;
    }

    export interface IComponentBuilder {
        readonly type: string;
        buildFromJson(json: any): IComponent;
    }
}