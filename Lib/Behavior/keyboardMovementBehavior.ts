/// <reference path="behavior.ts" />
namespace Lib {
    export class keyboardMovementBehaviorData implements IBehaviorData {
        public name: string;
        public speed: number = 1;
        public setFromJson(json: any): void {
            if (json.name === undefined) {
                throw new Error("Name must be defined in keyboardMovement.");
            }
            this.name = String(json.name);

            if (json.speed !== undefined) {
                this.speed = Number(json.speed);
            }
        }
    }

    export class keyboardMovementBehaviorBuilder implements IBehaviorBuilder {
        public get type(): string {
            return "keyboardMovement";
        }

        public buildFromJson(json: any): IBehavior {
            let data = new keyboardMovementBehaviorData();
            data.setFromJson(json);
            return new keyboardMovementBehavior(data);
        }
    }

    export class keyboardMovementBehavior extends BaseBehavior {
        public speed: number = 0.1;

        public constructor(data: keyboardMovementBehaviorData) {
            super(data);
            this.speed = data.speed;
        }

        public update(time: number): void {
            if (InputManager.isKeyDown(Keys.LEFT)) {
                this.m_owner.transform.position.x -= this.speed;
            }
            if (InputManager.isKeyDown(Keys.RIGHT)) {
                this.m_owner.transform.position.x += this.speed;
            }
            if (InputManager.isKeyDown(Keys.UP)) {
                this.m_owner.transform.position.y -= this.speed;
            }
            if (InputManager.isKeyDown(Keys.DOWN)) {
                this.m_owner.transform.position.y += this.speed;
            }
            super.update(time);
        }
    }
    BehaviorManager.registerBuilder(new keyboardMovementBehaviorBuilder());
}