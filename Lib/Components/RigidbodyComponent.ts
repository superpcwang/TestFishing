/// <reference path="component.ts" />
namespace Lib {
    export class RigidbodyComponentData implements IComponentData {
        public name: string;
        public velocity: Vector3 = Vector3.zero;
        public setFromJson(json: any): void {
            if (json.name === undefined) {
                throw new Error("Sprite name is undefined in file.");
            }
            this.name = String(json.name);

            if (json.velocity !== undefined) {
                this.velocity.setFromJson(json.velocity);
            }
        }
    }

    export class RigidbodyComponentBuilder implements IComponentBuilder {
        public get type(): string {
            return "rigidbody";
        }

        public buildFromJson(json: any): IComponent {
            let data = new RigidbodyComponentData();
            data.setFromJson(json);
            return new RigidbodyComponent(data);
        }
    }

    export class RigidbodyComponent extends BaseComponent {
        private m_velocity: Vector3 = Vector3.zero;
        public constructor(data?: RigidbodyComponentData) {
            super(data);
            if (data !== undefined) {
                this.m_velocity = data.velocity;
            }
        }

        public update(time: number): void {
            super.update(time);
            this.owner.transform.position.add(this.m_velocity);
            this.owner.transform.rotation.z = Vector3.getAngle(new Vector3(0, -1, 0), this.m_velocity);
        }

        public setVelocity(v: Vector3): void {
            this.m_velocity = v;
        }
    }

    ComponentManager.registerBuilder(new RigidbodyComponentBuilder());
}