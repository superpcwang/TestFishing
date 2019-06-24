/// <reference path="behavior.ts" />
namespace Lib {
    export class RotationBehaviorData implements IBehaviorData {
        public name: string;
        public rotation: Vector3 = Vector3.zero;

        public setFromJson(json: any): void {
            if (json.name === undefined) {
                throw new Error("Name must be defined in rotation.");
            }
            this.name = String(json.name);

            if (json.rotation !== undefined) {
                this.rotation.setFromJson(json.rotation);
            }
        }
    }

    export class RotationBehaviorBuilder implements IBehaviorBuilder {
        public get type(): string {
            return "rotation";
        }

        public buildFromJson(json: any): IBehavior {
            let data = new RotationBehaviorData();
            data.setFromJson(json);
            return new RotationBehavior(data);
        }
    }

    export class RotationBehavior extends BaseBehavior {
        private m_rotation: Vector3;
        public constructor(data: RotationBehaviorData) {
            super(data);
            this.m_rotation = data.rotation;
        }

        public update(time: number): void {
            this.m_owner.transform.rotation.add(this.m_rotation);
            super.update(time);
        }
    }
    BehaviorManager.registerBuilder(new RotationBehaviorBuilder());
}