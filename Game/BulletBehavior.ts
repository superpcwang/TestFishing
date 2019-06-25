/// <reference path="../lib/behavior/behavior.ts" />
namespace App {
    export class BulletBehaviorData implements Lib.IBehaviorData {
        public name: string;
        public bulletSpriteData: Lib.SpriteComponentData = new Lib.SpriteComponentData();
        public bulletCollisionData: Lib.CollisionComponentData = new Lib.CollisionComponentData();
        public bulletExplosionData: Lib.AnimatedSpriteComponentData = new Lib.AnimatedSpriteComponentData();
        public setFromJson(json: any): void {
            if (json.name === undefined) {
                throw new Error("Name must be defined in fishBehavior.");
            }
            this.name = String(json.name);

            if (json.bulletSprite !== undefined) {
                this.bulletSpriteData.setFromJson(json.bulletSprite);
            }

            if (json.bulletCollision !== undefined) {
                this.bulletCollisionData.setFromJson(json.bulletCollision);
            }

            if (json.bulletExplosion !== undefined) {
                this.bulletExplosionData.setFromJson(json.bulletExplosion);
            }
        }
    }

    export class BulletBehaviorBuilder implements Lib.IBehaviorBuilder {
        public get type(): string {
            return "bulletBehavior";
        }

        public buildFromJson(json: any): Lib.IBehavior {
            let data = new BulletBehaviorData();
            data.setFromJson(json);
            return new BulletBehavior(data);
        }
    }

    export class BulletBehavior extends Lib.BaseBehavior implements Lib.IMessagehandler {
        private m_bulletSpriteData: Lib.SpriteComponentData;
        private m_bulletCollisionData: Lib.CollisionComponentData;
        private m_bulletExplosionData: Lib.AnimatedSpriteComponentData;
        private m_explosion: Lib.SimObject[] = [];
        private m_explosionAnimation: Lib.AnimatedSpriteComponent[] = [];
        private m_explosionIndex: number = 0;
        private m_bulletID: number = 1000;
        private m_cannonAnimator: Lib.AnimatorComponent;
        public constructor(data: BulletBehaviorData) {
            super(data);
            this.m_bulletSpriteData = data.bulletSpriteData;
            this.m_bulletCollisionData = data.bulletCollisionData;
            this.m_bulletExplosionData = data.bulletExplosionData;
            Lib.Message.subscribe("MOUSE_DOWN", this);
            Lib.Message.subscribe("COLLISION_ENTRY", this);
        }

        public load(): void {
            super.load();
            for (let i = 0; i <= 10; i++) {
                this.m_explosion[i] = new Lib.SimObject(this.m_bulletID, "explosion" + this.m_bulletID)
                this.m_explosionAnimation[i] = new Lib.AnimatedSpriteComponent(this.m_bulletExplosionData);
                this.m_explosion[i].addComponent(this.m_explosionAnimation[i]);
                this.m_owner.addChild(this.m_explosion[i]);
                this.m_explosion[i].load();
                this.m_bulletID++;
            }
            this.m_explosionIndex = 0;
            this.m_cannonAnimator = this.m_owner.parent.getComponentByName("cannonAnimator") as Lib.AnimatorComponent;
            if (this.m_cannonAnimator === undefined) {
                throw new Error("Get m_cannonAnimator error.");
            }
        }

        public update(time: number): void {
            super.update(time);
        }

        public onMessage(message: Lib.Message) {
            if (message.code === "MOUSE_DOWN") {
                let context = message.context as Lib.MouseContext;
                let bullet = new Lib.SimObject(this.m_bulletID, "bullet" + this.m_bulletID.toString());
                let bulletSprite = new Lib.SpriteComponent(this.m_bulletSpriteData);
                let bulletRigidbody = new Lib.RigidbodyComponent();
                let bulletCollision = new Lib.CollisionComponent(this.m_bulletCollisionData);
                let bulletVelocity = Lib.Vector3.normalize(context.position.toVector3(), this.m_owner.transform.position);
                bulletRigidbody.setVelocity(bulletVelocity.multiply(5));
                bullet.addComponent(bulletRigidbody);
                bullet.addComponent(bulletSprite);
                bullet.addComponent(bulletCollision);
                this.m_owner.addChild(bullet);
                bullet.load();

                this.m_cannonAnimator.getOwner().transform.rotation.z = Lib.Vector3.getAngle(new Lib.Vector3(0, -1, 0), bulletVelocity);
                this.m_cannonAnimator.setState(0);

                this.m_bulletID++;
            }
            else if (message.code === "COLLISION_ENTRY") {
                let context = message.context as Lib.CollisionData;
                
                let bullet: Lib.SimObject;
                
                if (context.a.name === "bulletCollision01") {
                    bullet = context.a.getOwner();
                }
                else if (context.b.name === "bulletCollision01") {
                    bullet = context.b.getOwner();
                }
                else {
                    return;
                }
                this.m_explosion[this.m_explosionIndex].transform.position.copyFrom(bullet.transform.position);
                this.m_explosionAnimation[this.m_explosionIndex].reset();
                bullet.transform.position.y = -800;
                this.m_explosionIndex++;
                if (this.m_explosionIndex >= 10) {
                    this.m_explosionIndex = 0;
                }
            }
        }
    }
    Lib.BehaviorManager.registerBuilder(new BulletBehaviorBuilder());
}