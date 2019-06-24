/// <reference path="component.ts" />
/// <reference path="animatedspritecomponent.ts" />
namespace Lib {
    export class AnimatorComponentData implements IComponentData {
        public name: string;
        public animates: AnimatedSpriteComponentData[] = [];
        public setFromJson(json: any): void {
            if (json.name === undefined) {
                throw new Error("Animator name is undefined in file.");
            }
            else {
                this.name = String(json.name);
            }

            if (json.animates !== undefined) {
                for (let a in json.animates) {
                    let data = new AnimatedSpriteComponentData();
                    data.setFromJson(json.animates[a]);
                    this.animates[a] = data;
                }
            }
        }
    }

    export class AnimatorComponentBuilder implements IComponentBuilder {
        public get type(): string {
            return "animator";
        }

        public buildFromJson(json: any): IComponent {
            let data = new AnimatorComponentData();
            data.setFromJson(json);
            return new AnimatorComponent(data);
        }
    }

    export class AnimatorComponent extends BaseComponent {
        private m_animates: AnimatedSpriteComponent[] = [];
        private m_state: number = 0;
        public constructor(data: AnimatorComponentData) {
            super(data);
            if (data !== undefined) {
                for (let a in data.animates) {
                    let component = new AnimatedSpriteComponent(data.animates[a]);
                    this.m_animates[a] = component;
                }
            }
        }

        public load(): void {
            super.load();
            for (let a in this.m_animates) {
                this.m_animates[a].setOwner(this.getOwner());
                this.m_animates[a].load();
            }
            this.m_state = 0;
        }

        public update(time: number): void {
            super.update(time);
            this.m_animates[this.m_state].update(time);
        }

        public setState(state: number): void {
            this.m_state = state;
            this.m_animates[this.m_state].reset();
        }

        public isDone(): boolean {
            return this.m_animates[this.m_state].isDone();
        }

        public render(shader: Shader): void {    
            super.render(shader);
            this.m_animates[this.m_state].render(shader);
        }
    }

    ComponentManager.registerBuilder(new AnimatorComponentBuilder());
}