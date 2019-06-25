namespace App {
    export class Game implements Lib.IMessagehandler {
        private m_canvas: HTMLCanvasElement;
        private m_previousTime: number;
        public constructor(canvans: HTMLCanvasElement) {
            this.m_canvas = canvans;
            Lib.Utilities.init(canvans, 0, 0);
        }

        /* Start this game. */
        public start(): void {
            //Subscribe mouse behavior
            Lib.Message.subscribe("MOUSE_UP", this);

            //Load material
            Lib.MaterialManager.registerMaterial(new Lib.Material("bg01", "asset/BG_01.png", new Lib.Color(255, 225, 225, 255)));
            Lib.MaterialManager.registerMaterial(new Lib.Material("fish02", "asset/fish02.png", new Lib.Color(255, 225, 225, 255)));
            Lib.MaterialManager.registerMaterial(new Lib.Material("fish03", "asset/fish03.png", new Lib.Color(255, 225, 225, 255)));
            Lib.MaterialManager.registerMaterial(new Lib.Material("fish04", "asset/fish04.png", new Lib.Color(255, 225, 225, 255)));
            Lib.MaterialManager.registerMaterial(new Lib.Material("cannonBar", "asset/bottom-bar.png", new Lib.Color(255, 225, 225, 255)));
            Lib.MaterialManager.registerMaterial(new Lib.Material("bullet", "asset/bullet.png", new Lib.Color(255, 225, 225, 255)));
            Lib.MaterialManager.registerMaterial(new Lib.Material("net01", "asset/net01f.png", new Lib.Color(255, 225, 225, 255)));
            Lib.MaterialManager.registerMaterial(new Lib.Material("cannon", "asset/cannon.png", new Lib.Color(255, 225, 225, 255)));
            Lib.MaterialManager.registerMaterial(new Lib.Material("black", "asset/black.png", new Lib.Color(255, 225, 225, 255)));

            //Load Sound
            //Lib.AudioManager.loadSoundFile("swoosh", "asset/SWOOSH.mp3", false);

            //Load Zone
            //let zoneID = Lib.ZoneManager.createZone("TestZone", "A test for zone.");
            Lib.ZoneManager.changeZone(0);
            
            this.loop();
        }

        public resize(): void {
            Lib.Utilities.resize();
        }

        /* Object update. */
        private update(time: number): void {
            Lib.Utilities.update(time);
        }

        /* Frame render. */
        private render(): void {
            Lib.Utilities.render();
        }

        /* Game main loop
         * Execute once each frame.
         * */
        private loop(): void {
            let delta = performance.now() - this.m_previousTime;
            this.update(delta);
            this.m_previousTime = performance.now();
            this.render();
            requestAnimationFrame(this.loop.bind(this));
        }

        public onMessage(message: Lib.Message) {
            if (message.code === "MOUSE_UP") {
                let context = message.context as Lib.MouseContext;
                document.title = `Fishing Game (BETA): [${context.position.x}, ${context.position.y}]`;

                //Lib.AudioManager.playSound("swoosh");
            }
        }
    }
}
var g_appCanvas: HTMLCanvasElement;
var g_appGame: App.Game;

/**
 * Program always start here.
 * */
window.onload = function () {
    g_appCanvas = document.getElementById("App") as HTMLCanvasElement;
    g_appCanvas.width = window.innerWidth;
    g_appCanvas.height = window.innerHeight;
    g_appGame = new App.Game(g_appCanvas);
    g_appGame.start();
};

window.onresize = function () {
    g_appCanvas.width = window.innerWidth;
    g_appCanvas.height = window.innerHeight;
    g_appGame.resize();
    console.info("W:" + g_appCanvas.width + ", H:" + g_appCanvas.height);
}