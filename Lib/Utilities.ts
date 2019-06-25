namespace Lib {
    /**
     * Handle WebGL operation.
     * */
    export var gl: WebGLRenderingContext;
    export class Utilities {
        private static m_Basicshader: BasicShader;
        private static m_projection: Matrix4x4;
        private static m_cavan: HTMLCanvasElement;
        private static m_fullScreen: boolean = false;
        private static m_gameWidth: number;
        private static m_gameHeight: number;
        private static m_escapetime: number;

        /**
         * Setting up a WebGL context.
         * @param canvas Canvas element in document.
         * @param width game resolution width (0: normal).
         * @param height game resolution height (0: normal).
         */
        public static init(canvas: HTMLCanvasElement, width, height): void {
            //Create WebGL on canvas
            if (canvas === undefined) {
                throw new Error("Cannot find a canvas element named App.")
            }
            this.m_cavan = canvas;

            //Game resolution
            this.m_gameWidth = width;
            this.m_gameHeight = height;

            //PNG edge problem: https://stackoverflow.com/questions/39341564/webgl-how-to-correctly-blend-alpha-channel-png
            gl = this.m_cavan.getContext("webgl", { premultipliedAlpha: false });
            if (gl === undefined) {
                throw new Error("Unable to initialize WebGL");
            }

            //Set game resolution
            this.resize();

            AssetManager.initialize();
            InputManager.initialize();
            ZoneManager.initialize();
            CollisionManager.initialize();

            //Set clear color
            gl.clearColor(0, 0, 0, 1);
            gl.enable(gl.BLEND);

            //PNG edge problem: https://stackoverflow.com/questions/39341564/webgl-how-to-correctly-blend-alpha-channel-png
            //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);


            //Load shader
            this.m_Basicshader = new BasicShader("basic");
            this.m_Basicshader.use();

            //Load material
            //MaterialManager.registerMaterial(new Material("head", "head.png", new Color(255, 128, 0, 255)));

            //Load Zone
            //let zoneID = ZoneManager.createZone("TestZone", "A test for zone.");
            //ZoneManager.changeZone(zoneID);
        }

        public static resize(): void {
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            if (this.m_gameWidth === 0 && this.m_gameHeight === 0) {
                //Set game resolution (normal)
                this.m_projection = Matrix4x4.orthographic(0, gl.canvas.width, gl.canvas.height, 0, -100, 100);
            }
            else {
                //Set game resolution (full screen)
                this.m_projection = Matrix4x4.orthographic(0, this.m_gameWidth, this.m_gameHeight, 0, -100, 100);
            }
        }

        public static update(time: number): void {
            this.m_escapetime = time;
            MessageBus.update(time);
            ZoneManager.update(time);
            CollisionManager.update(time);
        }

        public static render(): void {
            //clear
            gl.clear(gl.COLOR_BUFFER_BIT);

            //Zone
            ZoneManager.render(this.m_Basicshader);

            //set view matrix
            let projectionPosition = this.m_Basicshader.getUniformLocation("u_projection");
            gl.uniformMatrix4fv(projectionPosition, false, new Float32Array(this.m_projection.data));
        }
    }
}