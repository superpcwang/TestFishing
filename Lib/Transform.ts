namespace Lib {
    export class Transform {
        public position: Vector3 = Vector3.zero;
        public rotation: Vector3 = Vector3.zero;
        public scale: Vector3 = Vector3.one;
        public copyFrom(transform: Transform): void {
            this.position.copyFrom(transform.position);
            this.rotation.copyFrom(transform.rotation);
            this.scale.copyFrom(transform.scale);
        }

        /** Creates and returns a matrix based on this transform. */
        public getTransformationMatrix(): Matrix4x4 {
            let translation = Matrix4x4.translation(this.position);

            let rotation = Matrix4x4.rotationZ(this.rotation.z);
            let scale = Matrix4x4.scale(this.scale);

            return Matrix4x4.multiply(Matrix4x4.multiply(translation, rotation), scale);
        }

        public setFromJson(json: any): void {
            if (json.position !== undefined) {
                this.position.setFromJson(json.position);
                console.log("set position...");
            }
            if (json.rotation !== undefined) {
                this.rotation.setFromJson(json.rotation);
                console.log("set rotation...");
            }
            if (json.scale !== undefined) {
                this.scale.setFromJson(json.scale);
                console.log("set scale...");
            }
        }
    }
}