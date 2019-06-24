// <reference path="Zone.ts" />
/*
namespace Lib {
    export class TestZone extends Zone {
        private m_parentObject: SimObject;
        private m_parentSprite: SpriteComponent;

        private m_testObject: SimObject;
        private m_testSprite: SpriteComponent;

        public load(): void {
            //this.m_sprite = new Sprite("Test", "head");
            //this.m_sprite.load();
            //this.m_sprite.position.x = 200;
            this.m_parentObject = new SimObject(0, "parentObject");
            this.m_parentSprite = new SpriteComponent("Test", "head");
            this.m_parentObject.addComponent(this.m_parentSprite);
            this.m_parentObject.transform.position.x = 500;
            this.m_parentObject.transform.position.y = 500;

            this.m_testObject = new SimObject(0, "testObject");
            this.m_testSprite = new SpriteComponent("Test", "headSmall");
            this.m_testObject.addComponent(this.m_testSprite);

            this.m_testObject.transform.position.x = 100;
            this.m_testObject.transform.position.y = 100;

            this.m_parentObject.addChild(this.m_testObject);

            this.scene.addObject(this.m_parentObject);
            super.load();
        }

        public update(time: number): void {
            this.m_parentObject.transform.rotation.z += 0.01;
            this.m_testObject.transform.rotation.z += 0.1;
            super.update(time);
        }
        
        public render(shader: Shader): void {
            this.m_sprite.draw(shader);
            super.render(shader);
        }
    }
}
*/