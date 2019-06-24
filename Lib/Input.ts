namespace Lib {
    export enum Keys {
        LEFT = 37,
        UP = 38,
        RIGHT = 39,
        DOWN = 40
    }

    export class MouseContext {
        public leftDown: boolean;
        public rightDown: boolean;
        public position: Vector2;

        public constructor(leftDown: boolean, rightDown: boolean, position: Vector2) {
            this.leftDown = leftDown;
            this.rightDown = rightDown;
            this.position = position;
        }
    }

    export class InputManager {
        private static m_keys: boolean[] = [];
        private static m_previousMouseY: number;
        private static m_previousMouseX: number;
        private static m_mouseX: number;
        private static m_mouseY: number;
        private static m_leftDown: boolean = false;
        private static m_rightDown: boolean = false;

        public static initialize(): void {
            for (let i = 0; i < 255; i++) {
                InputManager.m_keys[i] = false;
            }
            window.addEventListener("keydown", InputManager.onKeyDown);
            window.addEventListener("keyup", InputManager.onKeyUp);
            window.addEventListener("mousemove", InputManager.onMouseMove);
            window.addEventListener("mousedown", InputManager.onMouseDown);
            window.addEventListener("mouseup", InputManager.onMouseUp);
        }

        public static isKeyDown(key: Keys): boolean {
            return InputManager.m_keys[key];
        }

        private static onKeyDown(event: KeyboardEvent): boolean {
            InputManager.m_keys[event.keyCode] = true;
            return true;

            //Disable all key function
            //event.preventDefault();
            //event.stopPropagation();
            //return false;
        }

        private static onKeyUp(event: KeyboardEvent): boolean {
            InputManager.m_keys[event.keyCode] = false;
            return true;

            //Disable all key function
            //event.preventDefault();
            //event.stopPropagation();
            //return false;
        }

        public static getMousePosition(): Vector2 {
            return new Vector2(this.m_mouseX, this.m_mouseY);
        }

        private static onMouseMove(event: MouseEvent): void {
            InputManager.m_previousMouseX = InputManager.m_mouseX;
            InputManager.m_previousMouseY = InputManager.m_mouseY;
            InputManager.m_mouseX = event.clientX;
            InputManager.m_mouseY = event.clientY;
        }

        private static onMouseDown(event: MouseEvent): void {
            if (event.button === 0) {
                this.m_leftDown = true;
            }
            else if (event.button === 2) {
                this.m_rightDown = true;
            }
            Message.send(
                "MOUSE_DOWN",
                this,
                new MouseContext(
                    InputManager.m_leftDown,
                    InputManager.m_rightDown,
                    InputManager.getMousePosition()
                )
            );
        }

        private static onMouseUp(event: MouseEvent): void {
            if (event.button === 0) {
                this.m_leftDown = false;
            }
            else if (event.button === 2) {
                this.m_rightDown = false;
            }
            Message.send(
                "MOUSE_UP",
                this,
                new MouseContext(
                    InputManager.m_leftDown,
                    InputManager.m_rightDown,
                    InputManager.getMousePosition()
                )
            );
        }
    }
}