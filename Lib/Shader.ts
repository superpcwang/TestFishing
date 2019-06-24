namespace Lib {
    export abstract class Shader {
        private m_name: string;
        private m_program: WebGLProgram;
        private m_attributes: { [name: string]: number } = {};
        private m_uniforms: { [name: string]: WebGLUniformLocation } = {};
        /**
         * Create shader
         * @param name The name of this shader
         * @param vertexSource The source code of vertext shader
         * @param fragmentSource The source code of fragment shader
         */
        public constructor(name: string) {
            this.m_name = name;
        }

        protected load(vertexSource: string, fragmentSource: string): void {
            //Load and compile shader code
            let vertexShader = this.loadShader(vertexSource, gl.VERTEX_SHADER);
            let fragmentShader = this.loadShader(fragmentSource, gl.FRAGMENT_SHADER);

            //Create and link shader program
            this.createProgram(vertexShader, fragmentShader);

            //Make attribute mapping table
            this.detectAttributes();
            this.detectUniforms();
        }

        public get name(): string {
            return this.m_name;
        }

        public use(): void {
            gl.useProgram(this.m_program);
        }

        public getAttributeLocation(name: string): number {
            if (this.m_attributes[name] === undefined) {
                throw new Error("Unable to find attribute name" + name + "in shader" + this.m_name);
            }
            return this.m_attributes[name];
        }

        public getUniformLocation(name: string): WebGLUniformLocation {
            if (this.m_uniforms[name] === undefined) {
                throw new Error("Unable to find uniform name" + name + "in shader" + this.m_name);
            }
            return this.m_uniforms[name];
        }

        /**
         * Load and compile shader
         * @param source
         * @param shaderType
         */
        private loadShader(source: string, shaderType: number): WebGLShader {
            let shader: WebGLShader = gl.createShader(shaderType);

            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            let error = gl.getShaderInfoLog(shader);
            if (error !== "") {
                throw new Error("Error compiling shader: " + error);
            }
            return shader;
        };

        private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): void {
            this.m_program = gl.createProgram();
            gl.attachShader(this.m_program, vertexShader);
            gl.attachShader(this.m_program, fragmentShader);
            gl.linkProgram(this.m_program);

            let error = gl.getProgramInfoLog(this.m_program);
            if (error !== "") {
                throw new Error("Error linking shader: " + error);
            }
        }

        private detectAttributes(): void {
            let count = gl.getProgramParameter(this.m_program, gl.ACTIVE_ATTRIBUTES);
            for (let i = 0; i < count; i++) {
                let info: WebGLActiveInfo = gl.getActiveAttrib(this.m_program, i);
                if (!info) {
                    break;
                }
                this.m_attributes[info.name] = gl.getAttribLocation(this.m_program, info.name);
            }
        }

        private detectUniforms(): void {
            let count = gl.getProgramParameter(this.m_program, gl.ACTIVE_UNIFORMS);
            for (let i = 0; i < count; i++) {
                let info: WebGLActiveInfo = gl.getActiveUniform(this.m_program, i);
                if (!info) {
                    break;
                }
                this.m_uniforms[info.name] = gl.getUniformLocation(this.m_program, info.name);
            }
        }
    }

    export class BasicShader extends Shader {
         //Shader source code
         private vShaderSrc:string = `
attribute vec3 a_position;
attribute vec2 a_texCoord;
uniform mat4 u_projection;
uniform mat4 u_model;
varying vec2 v_texCoord;
void main(){
    gl_Position = u_projection * u_model *vec4(a_position, 1.0);
    v_texCoord = a_texCoord;
}`;
        private fShaderSrc = `
precision mediump float;
uniform vec4 u_tint;
uniform sampler2D u_diffuse;
varying vec2 v_texCoord;
void main(){
    gl_FragColor = u_tint * texture2D(u_diffuse, v_texCoord);
    gl_FragColor.rgb *= gl_FragColor.a;
}`;
        public constructor(name: string) {
            super(name);
            this.load(this.vShaderSrc, this.fShaderSrc);
        }
    }
}