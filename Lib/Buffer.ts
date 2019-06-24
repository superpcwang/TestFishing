namespace Lib {
    export class AttributeInfo {
        public location: number;
        public size: number;
        public offset: number = 0;
    }

    export class GLBuffer {
        private m_hasAttributeLocation: boolean = false;
        private m_elementsize: number;
        private m_stride: number;
        private m_buffer: WebGLBuffer;

        private m_targetBufferType: number;
        private m_dataType: number;
        private m_mode: number;
        private m_typeSize: number;

        private m_data: number[] = [];
        private m_attributes: AttributeInfo[] = [];
        private m_totalOffset: number = 0;

        /**
         * Create a new GL buffer
         * @param elementmSize The size of element in this buffer
         * @param dataType The type of this buffer
         * @param targetBufferType The buffer target type
         * @param mode The drawing mode of this buffer
         */
        public constructor(
            //elementSize: number,
            dataType: number = gl.FLOAT,
            targetBufferType: number = gl.ARRAY_BUFFER,
            mode: number = gl.TRIANGLES
        ){
            //this.m_elementsize = elementSize;
            this.m_elementsize = 0;
            this.m_dataType = dataType;
            this.m_targetBufferType = targetBufferType;
            this.m_mode = mode;

            //Determine byte size
            switch (this.m_dataType) {
                case gl.FLOAT:
                case gl.INT:
                case gl.UNSIGNED_INT:
                    this.m_typeSize = 4
                    break;
                case gl.SHORT:
                case gl.UNSIGNED_SHORT:
                    this.m_typeSize = 2;
                    break;
                case gl.BYTE:
                case gl.UNSIGNED_BYTE:
                    this.m_typeSize = 1;
                    break;
                default:
                    throw new Error("Unrecognize dtat type" + dataType.toString());
            }
            
            this.m_buffer = gl.createBuffer();
        }

        public destory(): void {
            gl.deleteBuffer(this.m_buffer);
        }
        /**
         * Bind GPU to this buffer
         * @param normalized
         */
        public bind(normalized: boolean = false): void {
            gl.bindBuffer(this.m_targetBufferType, this.m_buffer);
            if (this.m_hasAttributeLocation) {
                for (let it of this.m_attributes) {
                    gl.vertexAttribPointer(
                        it.location,
                        it.size,
                        this.m_dataType,
                        normalized,
                        this.m_stride,
                        it.offset * this.m_typeSize
                    );
                    gl.enableVertexAttribArray(it.location);
                }
            }
        }

        public unbind(): void {
            for (let it of this.m_attributes) {
                gl.disableVertexAttribArray(it.location);
            }
            gl.bindBuffer(this.m_targetBufferType, undefined);
        }

        /**
         * Add an attribute
         * @param info
         */
        public addAttributeLocation(info: AttributeInfo): void {
            this.m_hasAttributeLocation = true;
            info.offset = this.m_elementsize;
            this.m_attributes.push(info);
            this.m_elementsize += info.size;
            this.m_stride = this.m_elementsize * this.m_typeSize;
        }

        /**
         * Replace data in this buffer
         * @param data
         */
        public setData(data: number[]): void {
            this.clearData();
            this.pushBackData(data);
        }

        /**
         * Add data to this buffer
         * @param data
         */
        public pushBackData(data: number[]): void {
            for (let d of data) {
                this.m_data.push(d);
            }
        }

        /**
         * Clear all data
         * */
        public clearData(): void {
            this.m_data.length = 0;
        }

        /**
         * Upload this buffer's data to GPU
         * */
        public upload(): void {
            gl.bindBuffer(this.m_targetBufferType, this.m_buffer);
            let bufferData: ArrayBuffer;
            switch (this.m_dataType) {
                case gl.FLOAT:
                    bufferData = new Float32Array(this.m_data);
                    break;
                case gl.INT:
                    bufferData = new Int32Array(this.m_data);
                    break;
                case gl.UNSIGNED_INT:
                    bufferData = new Uint32Array(this.m_data);
                    break;
                case gl.SHORT:
                    bufferData = new Int16Array(this.m_data);
                    break;
                case gl.UNSIGNED_SHORT:
                    bufferData = new Uint16Array(this.m_data);
                    break;
                case gl.BYTE:
                    bufferData = new Int8Array(this.m_data);
                    break;
                case gl.UNSIGNED_BYTE:
                    bufferData = new Uint8Array(this.m_data);
                    break;
            }
            gl.bufferData(this.m_targetBufferType, bufferData, gl.STATIC_DRAW);
        }
        /**GPU draw data in this buffer */
        public draw(): void {
            if (this.m_targetBufferType === gl.ARRAY_BUFFER) {
                gl.drawArrays(this.m_mode, 0, this.m_data.length / this.m_elementsize);
            }
            else if (this.m_targetBufferType === gl.ELEMENT_ARRAY_BUFFER) {
                gl.drawElements(this.m_mode, this.m_data.length, this.m_dataType, 0);
            }
        }
    }
}