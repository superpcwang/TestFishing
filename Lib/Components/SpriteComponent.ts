/// <reference path="component.ts" />
namespace Lib {
    export class SpriteComponentData implements IComponentData {
        public name: string;
        public materialName: string;
        public width: number;
        public height: number;
        public origin: Vector3 = Vector3.zero;

        public setFromJson(json: any): void {
            if (json.name === undefined) {
                throw new Error("Sprite name is undefined in file.");
            }
            else {
                this.name = String(json.name);
            }

            if (json.materialName === undefined) {
                throw new Error("Sprite:" + this.name + " materialName is undefined in file.");
            }
            else {
                this.materialName = String(json.materialName);
            }

            if (json.width === undefined) {
                throw new Error("Sprite:" + this.name + " width is undefined in file.");
            }
            else {
                this.width = Number(json.width);
            }

            if (json.height === undefined) {
                throw new Error("Sprite:" + this.name + " height is undefined in file.");
            }
            else {
                this.height = Number(json.height);
            }

            if (json.origin !== undefined) {
                this.origin.setFromJson(json.origin);
            }
        }
    }

    export class SpriteComponentBuilder implements IComponentBuilder {
        public get type(): string {
            return "sprite";
        }

        public buildFromJson(json: any): IComponent {
            let data = new SpriteComponentData();
            data.setFromJson(json);
            return new SpriteComponent(data);
        }
    }

    export class SpriteComponent extends BaseComponent {
        private m_sprite: Sprite;

        public constructor(data: SpriteComponentData) {
            super(data);
            this.m_sprite = new Sprite(data.name, data.materialName, data.width, data.height, data.origin);
        }

        public load(): void {
            this.m_sprite.load();
        }

        public render(shader: Shader): void {
            this.m_sprite.draw(shader, this.owner.worldMatrix);
            super.render(shader);
        }
    }

    ComponentManager.registerBuilder(new SpriteComponentBuilder());
}