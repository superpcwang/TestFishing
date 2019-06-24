/// <reference path="../lib/behavior/behavior.ts" />
namespace App {
    export class FishBehaviorData implements Lib.IBehaviorData {
        public name: string;
        public speed: number = 1;
        public setFromJson(json: any): void {
            if (json.name === undefined) {
                throw new Error("Name must be defined in fishBehavior.");
            }
            this.name = String(json.name);

            if (json.speed !== undefined) {
                this.speed = Number(json.speed);
            }
        }
    }

    export class FishBehaviorBuilder implements Lib.IBehaviorBuilder {
        public get type(): string {
            return "fishBehavior";
        }

        public buildFromJson(json: any): Lib.IBehavior {
            let data = new FishBehaviorData();
            data.setFromJson(json);
            return new FishBehavior(data);
        }
    }

    export class FishBehavior extends Lib.BaseBehavior implements Lib.IMessagehandler {
        private m_speed: number = 1;
        private m_life: number = 5;
        private m_fishAnimator: Lib.AnimatorComponent;
        public constructor(data: FishBehaviorData) {
            super(data);
            this.m_speed = data.speed;
            Lib.Message.subscribe("COLLISION_ENTRY", this);
        }

        public load(): void {
            super.load();
        }

        public update(time: number): void {
            super.update(time);
            this.m_owner.transform.position.x += this.m_speed;
            let x = this.m_owner.transform.position.x;
            if (x > 900) {
                this.m_owner.transform.position.x = -100;
            }

            if (this.m_fishAnimator !== undefined) {
                if (this.m_life < 0) {
                    this.m_fishAnimator.setState(1);
                    this.m_life = 1000;
                }

                if (this.m_life > 500 && this.m_fishAnimator.isDone()) {
                    this.m_fishAnimator.getOwner().transform.position.x = -220;
                    this.m_life = 5;
                    this.m_fishAnimator.setState(0);
                }
            }

        }

        public onMessage(message: Lib.Message) {
            if (message.code === "COLLISION_ENTRY") {
                let context = message.context as Lib.CollisionData;

                let fish: Lib.SimObject;
                if (context.a.name === "fish01Collision") {
                    fish = context.a.getOwner();
                }
                else if (context.b.name === "fish01Collision") {
                    fish = context.b.getOwner();
                }
                else {
                    return;
                }
                this.m_fishAnimator = fish.getComponentByName("fish01Animator") as Lib.AnimatorComponent;
                if (this.m_fishAnimator === undefined) {
                    throw new Error("Get m_fishAnimator error.");
                }
                this.m_life--;
            }
        }
    }
    Lib.BehaviorManager.registerBuilder(new FishBehaviorBuilder());
}