namespace Lib {
    export class Material {
        private m_name: string;
        private m_diffuseTextureName: string;
        private m_diffuseTexture: Texture;
        private m_tint: Color;
        public constructor(name: string, diffuseTextureName: string, tint: Color) {
            this.m_name = name;
            this.m_diffuseTextureName = diffuseTextureName;
            this.m_tint = tint;
            if (this.m_diffuseTextureName !== undefined) {
                this.m_diffuseTexture = TextureManager.getTexture(this.m_diffuseTextureName);
            }
        }

        public get name(): string {
            return this.m_name
        }

        public get diffuseTextureName(): string {
            return this.m_diffuseTextureName;
        }

        public get diffuseTexture(): Texture {
            return this.m_diffuseTexture;
        }

        public get tint(): Color {
            return this.m_tint;
        }

        public set diffuseTextureName(name: string) {
            if (this.m_diffuseTexture !== undefined) {
                TextureManager.releaseTexture(this.m_diffuseTextureName);
            }
            this.m_diffuseTextureName = name;
            if (this.m_diffuseTextureName !== undefined) {
                this.m_diffuseTexture = TextureManager.getTexture(this.m_diffuseTextureName);
            }
        }

        public destory(): void {
            TextureManager.releaseTexture(this.m_diffuseTextureName);
            this.m_diffuseTexture = undefined;
        }
    }

    class MaterialReferenceNode {
        public material: Material;
        public referenceCount: number = 0;
        public constructor(material: Material) {
            this.material = material;
        }
    }

    export class MaterialManager {
        private static m_materials: { [name: string]: MaterialReferenceNode } = {};
        private constructor() {
        }

        public static registerMaterial(material: Material): void {
            if (MaterialManager.m_materials[material.name] === undefined) {
                MaterialManager.m_materials[material.name] = new MaterialReferenceNode(material);
            }
        }

        public static getMaterial(name: string): Material {
            if (MaterialManager.m_materials[name] === undefined) {
                return undefined;
            }
            else {
                MaterialManager.m_materials[name].referenceCount++;
                return MaterialManager.m_materials[name].material;
            }
        }

        public static releaseMaterial(name: string): void {
            if (MaterialManager.m_materials[name] === undefined) {
                console.warn("Material:" + name + "has not been registerd.");
            }
            else {
                MaterialManager.m_materials[name].referenceCount--
                if (MaterialManager.m_materials[name].referenceCount < 1) {
                    MaterialManager.m_materials[name].material.destory();
                    MaterialManager.m_materials[name].material = undefined;
                    delete MaterialManager.m_materials[name].material;
                }
            }
        }
    }
}