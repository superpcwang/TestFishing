/// <reference path="../lib/behavior/behavior.ts" />
namespace App {
    export class FishBehaviorData implements Lib.IBehaviorData {
        public name: string;
        public speed: number = 1;
        public life: number = 5;
        public animator: string;
        public setFromJson(json: any): void {
            if (json.animator === undefined) {
                throw new Error("Animator must be defined in fishBehavior.");
            }
            this.animator = json.animator;

            if (json.name === undefined) {
                throw new Error("Name must be defined in fishBehavior.");
            }
            this.name = String(json.name);

            if (json.speed !== undefined) {
                this.speed = Number(json.speed);
            }

            if (json.life !== undefined) {
                this.life = Number(json.life);
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

    enum fishState{
        init,
        run,
        stop
    }

    export class FishBehavior extends Lib.BaseBehavior implements Lib.IMessagehandler {
        private m_speed: number = 1;
        private m_life: number = 5;
        private m_fish: Lib.SimObject;
        private m_fishAnimatorName: string;
        private m_fishAnimator: Lib.AnimatorComponent;
        private m_fishState: fishState;
        public constructor(data: FishBehaviorData) {
            super(data);
            this.m_speed = data.speed;
            this.m_fishAnimatorName = data.animator;
            this.m_life = data.life;
            this.m_fishState = fishState.run;
            Lib.Message.subscribe("COLLISION_ENTRY", this);
        }

        public load(): void {
            super.load();
            
            this.m_fish = this.m_owner;
            if (this.m_fish === undefined) {
                throw new Error("Get fish owner error.");
            }

            this.m_fishAnimator = this.m_fish.getComponentByName(this.m_fishAnimatorName) as Lib.AnimatorComponent;
            if (this.m_fishAnimator === undefined) {
                throw new Error("Get fish: " + this.m_fish.name + " animator: " + this.m_fishAnimatorName + " error.");
            }
        }

        public update(time: number): void {
            super.update(time);

            switch (this.m_fishState) {
                case fishState.init: {
                    this.m_owner.transform.position.x = -100;
                    this.m_fishState = fishState.run;
                    this.m_fishAnimator.setState(0);
                    break;
                }
                case fishState.run: {
                    this.m_owner.transform.position.x += this.m_speed;
                    if (this.m_owner.transform.position.x > 900) {
                        this.m_fishState = fishState.init;
                    }
                    if (this.m_life < 0) {
                        this.m_fishAnimator.setState(1);
                        this.m_fishState = fishState.stop;
                    }
                    break;
                }
                case fishState.stop: {
                    this.m_owner.transform.position.x += this.m_speed / 4;
                    if (this.m_fishAnimator.isDone()) {
                        this.m_fishState = fishState.init;
                        this.m_life = 5;
                    }
                    break;
                }
                default: {
                    throw new Error("Fish state error.");
                }
            }
        }

        public onMessage(message: Lib.Message) {
            if (message.code === "COLLISION_ENTRY") {
                let context = message.context as Lib.CollisionData;
                if (context.a.getOwner() != this.m_fish) {
                    if (context.b.getOwner() != this.m_fish) {
                        return;
                    }
                }
                this.m_life--;
            }
        }
    }
    Lib.BehaviorManager.registerBuilder(new FishBehaviorBuilder());
}