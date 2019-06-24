namespace Lib {
    export interface IShape2D {
        position: Vector2;
        offset: Vector2;
        setFromJson(json: any): void;
        intersects(other: IShape2D): boolean;
        pointInShape(point: Vector2): boolean;
    }

    export class Rectangle2D implements IShape2D {
        public position: Vector2 = Vector2.zero;
        public width: number;
        public height: number;

        public get offset(): Vector2 {
            return Vector2.zero;
        }

        public setFromJson(json: any): void {
            if (json.position !== undefined) {
                this.position.setFromJson( json.position );
            }

            if (json.width === undefined) {
                throw new Error("Rectangle2D requires width.");
            }
            this.width = Number(json.width);

            if (json.height === undefined) {
                throw new Error("Rectangle2D requires height.");
            }
            this.height = Number(json.height);
        }

        public intersects(other: IShape2D): boolean {
            if (other instanceof Rectangle2D) {
                let a: Vector2 = other.position;
                let b: Vector2 = new Vector2(other.position.x + other.width, other.position.y);
                let c: Vector2 = new Vector2(other.position.x + other.width, other.position.y + other.height);
                let d: Vector2 = new Vector2(other.position.x, other.position.y + other.height);
                if (this.pointInShape(a) || this.pointInShape(b) || this.pointInShape(c) || this.pointInShape(d)) {
                    return true
                }
            }

            if (other instanceof Circle2D) {
                let deltaX = other.position.x - Math.max(this.position.x, Math.min(other.position.x, this.position.x + this.width));
                let deltaY = other.position.y - Math.max(this.position.y, Math.min(other.position.y, this.position.y + this.height));
                if ((deltaX * deltaX + deltaY * deltaY) < (other.radius * other.radius)) {
                    return true;
                }
            }

            return false;
        }

        public pointInShape(point: Vector2): boolean {
            if (point.x >= this.position.x && point.x <= point.x + this.width) {
                if (point.y >= this.position.y && point.y <= this.position.y + this.height) {
                    return true;
                }
            }
            return false;
        }
    }

    export class Circle2D implements IShape2D {
        public position: Vector2 = Vector2.zero;
        public origin: Vector2 = Vector2.zero;
        public radius: number;

        public get offset(): Vector2 {
            return new Vector2(this.radius + (this.radius * this.origin.x), this.radius + (this.radius * this.origin.y));
        }

        public setFromJson(json: any): void {
            if (json.position !== undefined) {
                this.position.setFromJson(json.position);
            }

            if (json.origin !== undefined) {
                this.origin.setFromJson(json.origin);
            }

            if (json.radius === undefined) {
                throw new Error("Circle2D requires radius.");
            }
            this.radius = Number(json.radius);
        }

        public intersects(other: IShape2D): boolean {
            if (other instanceof Circle2D) {
                let d = Vector2.distance(other.position, this.position);
                let l = other.radius + this.radius;
                if (d <= l) {
                    return true;
                }
            }

            return false;
        }

        public pointInShape(point: Vector2): boolean {
            let d = Vector2.distance(this.position, point);
            if (d <= this.radius) {
                return true;
            }
            return false;
        }
    }
}