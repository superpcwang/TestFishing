namespace Lib {
    export class Color {
        private m_r: number;
        private m_g: number;
        private m_b: number;
        private m_a: number;
        public constructor(r: number = 255, g: number = 255, b: number = 255, a: number = 255) {
            this.m_r = r;
            this.m_g = g;
            this.m_b = b;
            this.m_a = a;
        }

        public get r(): number {
            return this.m_r;
        }

        public get rFloat(): number {
            return this.m_r / 255.0;
        }

        public set r(value: number){
            this.m_r = value;
        }

        public get g(): number {
            return this.m_r;
        }

        public get gFloat(): number {
            return this.m_r / 255.0;
        }

        public set g(value: number) {
            this.m_r = value;
        }

        public get b(): number {
            return this.m_r;
        }

        public get bFloat(): number {
            return this.m_r / 255.0;
        }

        public set b(value: number) {
            this.m_r = value;
        }

        public get a(): number {
            return this.m_r;
        }

        public get aFloat(): number {
            return this.m_r / 255.0;
        }

        public set a(value: number) {
            this.m_r = value;
        }

        public toArray(): number[] {
            return [this.m_r, this.m_g, this.m_b, this.m_a];
        }

        public toFloatrray(): number[] {
            return [this.m_r / 255.0, this.m_g / 255.0, this.m_b / 255.0, this.m_a / 255.0];
        }

        public toFloat32Array(): Float32Array {
            return new Float32Array(this.toFloatrray());
        }

        public static white(): Color {
            return new Color(255, 255, 255, 255);
        }

        public static black(): Color {
            return new Color(0, 0, 0, 255);
        }

        public static red(): Color {
            return new Color(255, 0, 0, 255);
        }

        public static green(): Color {
            return new Color(0, 255, 0, 255);
        }

        public static blue(): Color {
            return new Color(0, 0, 255, 255);
        }
    }
}