export default interface Resource {
    name: string
    type: 'cubeTexture' | 'gltfModel' | 'texture'
    path: string[]
}