namespace Lib {
    export class Vertex {
        public position: Vector3 = Vector3.zero;
        public texCoords: Vector2 = Vector2.zero;

        public constructor(x: number = 0, y: number = 0, z: number = 0, tu: number = 0, tv: number = 0) {
            this.position.x = x;
            this.position.y = y;
            this.position.z = z;

            this.texCoords.x = tu;
            this.texCoords.y = tv;
        }

        /** Returns the data of this vertex as an array of numbers. */
        public toArray(): number[] {
            let array: number[] = [];

            array = array.concat(this.position.toArray());
            array = array.concat(this.texCoords.toArray());

            return array;
        }

        /** Returns the data of this vertex as a Float32Array. */
        public toFloat32Array(): Float32Array {
            return new Float32Array(this.toArray());
        }
    }

    export class Sprite {
        protected m_name: string;
        protected m_width: number;
        protected m_height: number;
        protected m_origin: Vector3 = Vector3.zero;

        protected m_buffer: GLBuffer;
        protected m_materialName: string;
        protected m_material: Material;
        protected m_vertices: Vertex[] = [];

        public constructor(name: string, materialName: string, width: number, height: number, origin: Vector3) {
            this.m_name = name;
            this.m_width = width;
            this.m_height = height;
            this.m_origin = origin;
            this.m_materialName = materialName;
            this.m_material = MaterialManager.getMaterial(this.m_materialName);
        }

        public get name(): string {
            return this.m_name;
        }

        public get origin(): Vector3 {
            return this.m_origin;
        }

        public set origin(value: Vector3){
            this.m_origin = value;
            this.recalculateVertices();
        }

        public destory(): void {
            this.m_buffer.destory();
            MaterialManager.releaseMaterial(this.m_materialName);
            this.m_materialName = undefined;
            this.m_material = undefined;
        }

        /**Load sprite default data*/
        public load(): void {
            this.m_buffer = new GLBuffer();

            let positionAttribute = new AttributeInfo();
            positionAttribute.location = 0;
            positionAttribute.size = 3;
            this.m_buffer.addAttributeLocation(positionAttribute);

            let texCoordAttribute = new AttributeInfo();
            texCoordAttribute.location = 1;
            texCoordAttribute.size = 2;
            this.m_buffer.addAttributeLocation(texCoordAttribute);

            this.calculateVertices();
        }

        public update(time: number): void {

        }

        /**Draw sprite */
        public draw(shader: Shader, model: Matrix4x4): void {
            //set model location
            let modelLocation = shader.getUniformLocation("u_model");
            gl.uniformMatrix4fv(modelLocation, false, model.toFloat32Array());

            //set uniform color
            let colorLocation = shader.getUniformLocation("u_tint");
            gl.uniform4fv(colorLocation, this.m_material.tint.toFloat32Array());

            //set texture color
            if (this.m_material.diffuseTexture !== undefined) {
                this.m_material.diffuseTexture.activateAndBind(0);
                let diffuseLocation = shader.getUniformLocation("u_diffuse");
                gl.uniform1i(diffuseLocation, 0);
            }

            this.m_buffer.bind();
            this.m_buffer.draw();
        }

        protected calculateVertices(): void {
            let minX = -(this.m_width * this.m_origin.x);
            let maxX = this.m_width * (1.0 - this.m_origin.x);

            let minY = -(this.m_height * this.m_origin.y);
            let maxY = this.m_height * (1.0 - this.m_origin.y);

            this.m_vertices = [
                //x, y, z  ,u , v
                new Vertex(minX, minY, 0, 0, 0),
                new Vertex(minX, maxY, 0, 0, 1.0),
                new Vertex(maxX, maxY, 0, 1.0, 1.0),
                new Vertex(maxX, maxY, 0, 1.0, 1.0),
                new Vertex(maxX, minY, 0, 1.0, 0),
                new Vertex(minX, minY, 0, 0, 0)
            ];

            for (let v of this.m_vertices) {
                this.m_buffer.pushBackData(v.toArray());
            }

            this.m_buffer.upload();
            this.m_buffer.unbind();
        }

        protected recalculateVertices(): void {
            let minX = -(this.m_width * this.m_origin.x);
            let maxX = this.m_width * (1.0 - this.m_origin.x);

            let minY = -(this.m_height * this.m_origin.y);
            let maxY = this.m_height * (1.0 - this.m_origin.y);

            this.m_vertices[0].position.set(minX, minY);
            this.m_vertices[1].position.set(minX, maxY);
            this.m_vertices[2].position.set(maxX, maxY);
            this.m_vertices[3].position.set(maxX, maxY);
            this.m_vertices[4].position.set(maxX, minY);
            this.m_vertices[5].position.set(minX, minY);

            this.m_buffer.clearData();
            for (let v of this.m_vertices) {
                this.m_buffer.pushBackData(v.toArray());
            }

            this.m_buffer.upload();
            this.m_buffer.unbind();
        }
    }

    export class UVInfo { 
        public min: Vector2;
        public max: Vector2;
        constructor(min: Vector2, max: Vector2) {
            this.min = min;
            this.max = max;
        }
    }

    export class AnimatedSprite extends Sprite{
        private m_frameWidth: number;
        private m_frameHeight: number;
        private m_frameCount: number;
        private m_frameSequence: number[] = [];

        //each frame time
        private m_frameTime: number = 100;
        private m_frameUVs: UVInfo[] = [];

        private m_currentFrame: number = 0;
        private m_currentTime: number = 0;

        private m_assetWidth: number = 2;
        private m_assetHeight: number = 2;

        private m_playMode: string = "loop";

        private m_assetLoaded: boolean = false;

        public constructor(
            name: string,
            materialName: string,
            width: number = 100,
            height: number = 100,
            origin: Vector3 = Vector3.zero,
            assetWidt: number = 100,
            assetHeight: number = 100,
            frameWidth: number = 10,
            frameHeight: number = 10,
            frameCount: number = 1,
            frameSequence: number[] = [],
            frameRate: number = 100,
            playMode: string = "loop"
        ) {
            super(name, materialName, width, height, origin);
            this.m_assetWidth = assetWidt;
            this.m_assetHeight = assetHeight;
            this.m_frameWidth = frameWidth;
            this.m_frameHeight = frameHeight;
            this.m_frameCount = frameCount;
            this.m_frameSequence = frameSequence;
            this.m_frameTime = frameRate;
            this.m_playMode = playMode;
        }

        public destory(): void {
            super.destory();
        }

        /**Load sprite default data*/
        public load(): void {
            super.load();
            this.calculateTotalUVs();
        }

        public update(time: number): void {
            //if (this.m_assetLoaded === false) {
            //    return;
            //}

            this.m_currentTime += time;
            if (this.m_currentTime > this.m_frameTime) {
                //next frame
                this.m_currentFrame++;
                this.m_currentTime = 0;

                if (this.m_currentFrame >= this.m_frameSequence.length) {

                    if (this.m_playMode === "once") {
                        this.m_currentFrame = this.m_frameSequence.length - 1;
                    }
                    else if (this.m_playMode === "loop") {
                        this.m_currentFrame = 0;
                    }
                    else {
                        throw new Error("Unsopport playMode: " + this.m_playMode);
                    }
                    
                }

                //change texture
                let idx = this.m_frameSequence[this.m_currentFrame];
                this.m_vertices[0].texCoords.copyFrom(this.m_frameUVs[idx].min);
                this.m_vertices[1].texCoords = new Vector2(this.m_frameUVs[idx].min.x, this.m_frameUVs[idx].max.y);
                this.m_vertices[2].texCoords.copyFrom(this.m_frameUVs[idx].max);
                this.m_vertices[3].texCoords.copyFrom(this.m_frameUVs[idx].max);
                this.m_vertices[4].texCoords = new Vector2(this.m_frameUVs[idx].max.x, this.m_frameUVs[idx].min.y);
                this.m_vertices[5].texCoords.copyFrom(this.m_frameUVs[idx].min);

                this.m_buffer.clearData();
                for (let v of this.m_vertices) {
                    this.m_buffer.pushBackData(v.toArray());
                }

                this.m_buffer.upload();
                this.m_buffer.unbind();
            }
            super.update(time);
        }

        public isDone(): boolean {
            return (this.m_currentFrame === (this.m_frameSequence.length - 1));
        }

        public reset(): void {
            this.m_currentFrame = 0;
            this.m_currentTime = 0;
        }

        private calculateTotalUVs(): void{
            for (let i = 0; i < this.m_frameCount; ++i) {
                let u = 0;
                let v = (i * this.m_frameHeight) / this.m_assetHeight;
                let min: Vector2 = new Vector2(u, v);

                let uMax = this.m_frameWidth / this.m_assetWidth;
                let vMax = ((i * this.m_frameHeight) + this.m_frameHeight) / this.m_assetHeight;
                let max: Vector2 = new Vector2(uMax, vMax);
                this.m_frameUVs.push(new UVInfo(min, max));
            }
        }

        private calculateUVs(): void {
            /*
            let totalWidth: number = 0;
            let yValue: number = 0;
            for (let i = 0; i < this.m_frameCount; i++) {
                totalWidth += i * this.m_frameWidth;
                if (totalWidth > this.m_width) {
                    yValue++;
                    totalWidth = 0;
                }

                let texWight = this.m_material.diffuseTexture.width;
                let texHeight = this.m_material.diffuseTexture.height;

                let uMin = (i * this.m_frameWidth) / texWight;
                let vMin = (yValue * this.m_frameHeight) / texHeight;
                let min: Vector2 = new Vector2(uMin, vMin);

                let uMax = (i * this.m_frameWidth + this.m_width) / texWight;
                let vMax = (yValue * this.m_frameHeight + this.m_height) / texHeight;
                let max: Vector2 = new Vector2(uMax, vMax);

                this.m_frameUV.push(new UVInfo(min, max));
            }
            */
            let totalWidth: number = 0;
            let yValue: number = 0;
            for (let i = 0; i < this.m_frameCount; ++i) {

                totalWidth += i * this.m_frameWidth;
                if (totalWidth > this.m_assetWidth) {
                    yValue++;
                    totalWidth = 0;
                }

                console.log("w/h", this.m_assetWidth, this.m_assetHeight);

                let u = (i * this.m_frameWidth) / this.m_assetWidth;
                let v = (yValue * this.m_frameHeight) / this.m_assetHeight;
                let min: Vector2 = new Vector2(u, v);

                let uMax = ((i * this.m_frameWidth) + this.m_frameWidth) / this.m_assetWidth;
                let vMax = ((yValue * this.m_frameHeight) + this.m_frameHeight) / this.m_assetHeight;
                let max: Vector2 = new Vector2(uMax, vMax);

                this.m_frameUVs.push(new UVInfo(min, max));
            }
        }
    }
}