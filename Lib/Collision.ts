namespace Lib {
    export class CollisionData {
        public a: CollisionComponent;
        public b: CollisionComponent;
        public time: number = 0;

        public constructor(time: number, a: CollisionComponent, b: CollisionComponent) {
            this.time = time;
            this.a = a;
            this.b = b;
        }
    }

    export class CollisionManager {
        private static m_components: CollisionComponent[] = [];
        private static m_collisionData: CollisionData[] = [];
        private static m_escapetime: number = 0;
        private static m_totalTime: number = 0;
        private constructor() {

        }

        public static initialize() {
            CollisionManager.m_totalTime = 0;
            CollisionManager.clear();
        }

        public static registerCollisionComponent(component: CollisionComponent): void {
            CollisionManager.m_components.push(component);
        }

        public static unRegisterCollisionComponent(component: CollisionComponent): void {
            let index = CollisionManager.m_components.indexOf(component);
            if (index !== -1) {
                CollisionManager.m_components.slice(index, 1);
            }
        }

        public static clear(): void {
            CollisionManager.m_components.length = 0;
        }

        public static update(time: number): void {
            if (isNaN(CollisionManager.m_totalTime)) {
                CollisionManager.m_totalTime = 0;
            }

            this.m_escapetime = time;
            CollisionManager.m_totalTime += this.m_escapetime;
            for (let c = 0; c < CollisionManager.m_components.length; ++c) {

                let comp = CollisionManager.m_components[c];
                for (let o = 0; o < CollisionManager.m_components.length; ++o) {
                    let other = CollisionManager.m_components[o];

                    // Do not check against collisions with self.
                    if (comp === other) {
                        continue;
                    }

                    // If both shapes are static, stop detection.
                    if (comp.isStatic && other.isStatic) {
                        continue;
                    }

                    if (comp.shape.intersects(other.shape)) {

                        // We have a collision!
                        let exists: boolean = false;
                        for (let d = 0; d < CollisionManager.m_collisionData.length; ++d) {
                            let data = CollisionManager.m_collisionData[d];

                            if ((data.a === comp && data.b === other) || (data.a === other && data.b === comp)) {

                                // We have existing data. Update it.
                                comp.onCollisionUpdate(other);
                                other.onCollisionUpdate(comp);
                                data.time = CollisionManager.m_totalTime;
                                exists = true;
                                break;
                            }
                        }

                        if (!exists) {

                            // Create a new collision.
                            let col = new CollisionData(CollisionManager.m_totalTime, comp, other);
                            comp.onCollisionEntry(other);
                            other.onCollisionEntry(comp);
                            Message.sendPriority("COLLISION_ENTRY", undefined, col);
                            CollisionManager.m_collisionData.push(col);
                        }
                    }
                }
            }


            // Remove stale collision data.
            let removeData: CollisionData[] = [];
            for (let d = 0; d < CollisionManager.m_collisionData.length; ++d) {
                let data = CollisionManager.m_collisionData[d];
                if (data.time !== CollisionManager.m_totalTime) {

                    // Old collision data.
                    removeData.push(data);
                }
            }

            while (removeData.length !== 0) {

                let data = removeData.shift();
                let index = CollisionManager.m_collisionData.indexOf(data);
                CollisionManager.m_collisionData.splice(index, 1);

                data.a.onCollisionExit(data.b);
                data.b.onCollisionExit(data.a);
                Message.sendPriority("COLLISION_EXIT", undefined, data);
            }
        }
    }
}