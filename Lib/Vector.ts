namespace Lib {
    export class Vector3 {
        private m_x: number;
        private m_y: number;
        private m_z: number;

        /**
         * Creates a new vector 3.
         * @param x The x component.
         * @param y The y component.
         * @param z The z component.
         */
        public constructor(x: number = 0, y: number = 0, z: number = 0) {
            this.m_x = x;
            this.m_y = y;
            this.m_z = z;
        }

        /** The x component. */
        public get x(): number {
            return this.m_x;
        }

        /** The x component. */
        public set x(value: number) {
            this.m_x = value;
        }

        /** The y component. */
        public get y(): number {
            return this.m_y;
        }

        /** The y component. */
        public set y(value: number) {
            this.m_y = value;
        }

        /** The z component. */
        public get z(): number {
            return this.m_z;
        }

        /** The z component. */
        public set z(value: number) {
            this.m_z = value;
        }

        public static get zero(): Vector3 {
            return new Vector3();
        }

        public static get one(): Vector3 {
            return new Vector3(1, 1, 1);
        }

        public static distance(a: Vector3, b: Vector3): number {
            let diff = a.clone().subtract(b);
            return Math.sqrt(diff.x * diff.x + diff.y * diff.y + diff.z * diff.z);
        }

        public static abs(v: Vector3): number {
            return this.distance(v, Vector3.zero);
        }

        public static normalize(target: Vector3, origin: Vector3): Vector3 {
            let d = this.distance(target, origin);
            let v = target.clone();
            return v.subtract(origin).divide(d);
        }

        public static dotProduct(a: Vector3, b: Vector3): number {
            return a.x * b.x + a.y * b.y + a.z * b.z;
        }

        public static getAngle(target: Vector3, origin: Vector3): number {
            let value = Math.acos(this.dotProduct(target, origin) / (this.abs(target) * this.abs(origin)));
            let v = origin.clone().subtract(target);
            if (v.x < 0) {
                value = Math.PI + (Math.PI - value);
            }
            return value;
        }

        public set(x?: number, y?: number, z?: number): void {
            if (x !== undefined) {
                this.m_x = x;
            }

            if (y !== undefined) {
                this.m_y = y;
            }

            if (z !== undefined) {
                this.m_z = z;
            }
        }

        public equals(v: Vector3): boolean {
            return (this.m_x === v.x && this.m_y === v.y && this.m_z === v.z);
        }

        /** Returns the data of this vector as a number array. */
        public toArray(): number[] {
            return [this.m_x, this.m_y, this.m_z];
        }

        /** Returns the data of this vector as a Float32Array. */
        public toFloat32Array(): Float32Array {
            return new Float32Array(this.toArray());
        }

        public copyFrom(vector: Vector3): void {
            this.m_x = vector.m_x;
            this.m_y = vector.m_y;
            this.m_z = vector.m_z;
        }

        public setFromJson(json: any): void {
            if (json.x !== undefined) {
                this.m_x = Number(json.x);
            }
            if (json.y !== undefined) {
                this.m_y = Number(json.y);
            }
            if (json.z !== undefined) {
                this.m_z = Number(json.z);
            }
        }

        public add(v: Vector3): Vector3 {
            this.m_x += v.m_x;
            this.m_y += v.m_y;
            this.m_z += v.m_z;

            return this;
        }

        public subtract(v: Vector3): Vector3 {
            this.m_x -= v.m_x;
            this.m_y -= v.m_y;
            this.m_z -= v.m_z;

            return this;
        }

        public multiply(value: number): Vector3 {
            this.m_x *= value;
            this.m_y *= value;
            this.m_z *= value;

            return this;
        }

        public divide(value: number): Vector3 {
            this.m_x /= value;
            this.m_y /= value;
            this.m_z /= value;

            return this;
        }

        public clone(): Vector3 {
            return new Vector3(this.m_x, this.m_y, this.m_z);
        }

        public toVector2(): Vector2 {
            return new Vector2(this.m_x, this.m_y);
        }
    }

    export class Vector2 {
        private m_x: number;
        private m_y: number;

        /**
         * Creates a new vector 2.
         * @param x The x component.
         * @param y The y component.
         */
        public constructor(x: number = 0, y: number = 0) {
            this.m_x = x;
            this.m_y = y;
        }

        /** The x component. */
        public get x(): number {
            return this.m_x;
        }

        /** The x component. */
        public set x(value: number) {
            this.m_x = value;
        }

        /** The y component. */
        public get y(): number {
            return this.m_y;
        }

        /** The y component. */
        public set y(value: number) {
            this.m_y = value;
        }

        public static get zero(): Vector2 {
            return new Vector2();
        }

        public static distance(a: Vector2, b: Vector2): number {
            let diff = a.clone().subtract(b);
            let value = Math.sqrt(diff.x * diff.x + diff.y * diff.y);
            return value;
        }

        /** Returns the data of this vector as a number array. */
        public toArray(): number[] {
            return [this.m_x, this.m_y];
        }

        /** Returns the data of this vector as a Float32Array. */
        public toFloat32Array(): Float32Array {
            return new Float32Array(this.toArray());
        }

        public toVector3(): Vector3 {
            return new Vector3(this.m_x, this.m_y, 0);
        }

        public copyFrom(vector: Vector2): void {
            this.m_x = vector.m_x;
            this.m_y = vector.m_y;
        }

        public setFromJson(json: any): void {
            if (json.x !== undefined) {
                this.m_x = Number(json.x);
            }
            if (json.y !== undefined) {
                this.m_y = Number(json.y);
            }
        }

        public add(v: Vector2): Vector2 {
            this.m_x += v.m_x;
            this.m_y += v.m_y;

            return this;
        }

        public subtract(v: Vector2): Vector2 {
            this.m_x -= v.m_x;
            this.m_y -= v.m_y;

            return this;
        }

        public multiply(v: Vector2): Vector2 {
            this.m_x *= v.m_x;
            this.m_y *= v.m_y;

            return this;
        }

        public divide(v: Vector2): Vector2 {
            this.m_x /= v.m_x;
            this.m_y /= v.m_y;

            return this;
        }

        public clone(): Vector2 {
            return new Vector2(this.m_x, this.m_y);
        }

    }
}