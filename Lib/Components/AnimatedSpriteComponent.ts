/// <reference path="component.ts" />
/// <reference path="spritecomponent.ts" />
namespace Lib {
    export class AnimatedSpriteComponentData extends SpriteComponentData implements IComponentData {
        public assetWidth: number = 0;
        public assetHeight: number = 0;
        public frameWidth: number = 0;
        public frameHeight: number = 0;
        public frameCount: number = 0;
        public frameSequence: number[] = [];
        public frameRate: number = 100;
        public playMode: string = "";
        public setFromJson(json: any): void {
            super.setFromJson(json);

            if (json.assetWidth === undefined) {
                throw new Error("Sprite:" + this.name + " assetWidth is undefined in file.");
            }
            else {
                this.assetWidth = Number(json.assetWidth);
            }

            if (json.assetHeight === undefined) {
                throw new Error("Sprite:" + this.name + " assetHeight is undefined in file.");
            }
            else {
                this.assetHeight = Number(json.assetHeight);
            }

            if (json.frameWidth === undefined) {
                throw new Error("Sprite:" + this.name + " frameWidth is undefined in file.");
            }
            else {
                this.frameWidth = Number(json.frameWidth);
            }

            if (json.frameHeight === undefined) {
                throw new Error("Sprite:" + this.name + " frameHeight is undefined in file.");
            }
            else {
                this.frameHeight = Number(json.frameHeight);
            }

            if (json.frameCount === undefined) {
                throw new Error("Sprite:" + this.name + " frameCount is undefined in file.");
            }
            else {
                this.frameCount = Number(json.frameCount);
            }

            if (json.frameSequence === undefined) {
                throw new Error("Sprite:" + this.name + " frameSequence is undefined in file.");
            }
            else {
                this.frameSequence = json.frameSequence;
            }

            if (json.frameRate !== undefined) {
                this.frameRate = Number(json.frameRate);
            }

            if (json.playMode === undefined) {
                throw new Error("Sprite:" + this.name + " playMode is undefined in file.");
            }
            else {
                this.playMode = json.playMode;
            }
        }
    }

    export class AnimatedSpriteComponentBuilder implements IComponentBuilder {
        public get type(): string {
            return "animatedSprite";
        }

        public buildFromJson(json: any): IComponent {
            let data = new AnimatedSpriteComponentData();
            data.setFromJson(json);
            return new AnimatedSpriteComponent(data);
        }
    }

    export class AnimatedSpriteComponent extends BaseComponent {
        private m_sprite: AnimatedSprite;

        public constructor(data: AnimatedSpriteComponentData) {
            super(data);
            this.m_sprite = new AnimatedSprite(
                data.name,
                data.materialName,
                data.width,
                data.height,
                data.origin,
                data.assetWidth,
                data.assetHeight,
                data.frameWidth,
                data.frameHeight,
                data.frameCount,
                data.frameSequence,
                data.frameRate,
                data.playMode
            );
        }

        public load(): void {
            this.m_sprite.load();
        }

        public update(time: number): void {
            super.update(time);
            this.m_sprite.update(time);
        }

        public render(shader: Shader): void {
            super.render(shader);
            this.m_sprite.draw(shader, this.owner.worldMatrix);
        }

        public isDone(): boolean {
            return this.m_sprite.isDone();
        }

        public reset(): void {
            this.m_sprite.reset();
        }
    }

    ComponentManager.registerBuilder(new AnimatedSpriteComponentBuilder());
}