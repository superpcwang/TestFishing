namespace Lib {
    export class CollisionComponentData implements IComponentData {
        public name: string;
        public static: boolean = false;
        public shapeData: any;

        public setFromJson(json: any): void {
            if (json.name !== undefined) {
                this.name = String(json.name);
            }

            if (json.static !== undefined) {
                this.static = Boolean(json.static);
            }

            if (json.shape === undefined) {
                throw new Error("CollisionComponentData requires shape.");
            } else {
                if (json.shape.type === undefined) {
                    throw new Error("CollisionComponentData requires 'shape.type'.");
                }
                this.shapeData = json.shape;
            }
        }
    }

    export class CollisionComponentBuilder implements IComponentBuilder {

        public get type(): string {
            return "collision";
        }

        public buildFromJson(json: any): IComponent {
            let data = new CollisionComponentData();
            data.setFromJson(json);
            return new CollisionComponent(data);
        }
    }

    /**
     * A collision component. Likely to be removed when collision system is replaced.
     */
    export class CollisionComponent extends BaseComponent {

        private m_shape: IShape2D;
        private m_static: boolean;

        public constructor(data: CollisionComponentData) {
            super(data);

            if (data.shapeData.type == "circle") {
                this.m_shape = new Circle2D();
            }
            else if (data.shapeData.type == "rectangle") {
                this.m_shape = new Rectangle2D();
            }
            this.m_shape.setFromJson(data.shapeData);
            this.m_static = data.static;
        }

        public get shape(): IShape2D {
            return this.m_shape;
        }

        public get isStatic(): boolean {
            return this.m_static;
        }

        public load(): void {
            super.load();

            // TODO: need to get world position for nested objects.
            //this.m_shape.position.copyFrom(this.owner.getWorldPosition().toVector2().subtract(this.m_shape.offset));
            this.m_shape.position.copyFrom(this.owner.getWorldPosition().toVector2());

            // Tell the collision manager that we exist.
            CollisionManager.registerCollisionComponent(this);
        }

        public update(time: number): void {

            // TODO: need to get world position for nested objects.
            //this.m_shape.position.copyFrom(this.owner.getWorldPosition().toVector2().subtract(this.m_shape.offset));
            super.update(time);
            this.m_shape.position.copyFrom(this.owner.getWorldPosition().toVector2());
            
        }

        public render(shader: Shader): void {
            //this._sprite.draw( shader, this.owner.worldMatrix );

            super.render(shader);
        }

        public onCollisionEntry(other: CollisionComponent): void {
            console.log("onCollisionEntry:", this, other);
        }

        public onCollisionUpdate(other: CollisionComponent): void {
            //console.log("onCollisionUpdate:", this, other);
        }

        public onCollisionExit(other: CollisionComponent): void {
            console.log("onCollisionExit:", this, other);
        }
    }

    ComponentManager.registerBuilder(new CollisionComponentBuilder());
}