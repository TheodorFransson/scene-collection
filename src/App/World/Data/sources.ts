import Resource from "./Resource"

const resources: Resource[] = [
    {
        name: 'environmentMapTexture',
        type: 'cubeTexture',
        path: [
            'textures/environmentMap/px.jpg',
            'textures/environmentMap/nx.jpg',
            'textures/environmentMap/py.jpg',
            'textures/environmentMap/ny.jpg',
            'textures/environmentMap/pz.jpg',
            'textures/environmentMap/nz.jpg',
        ],
    },
    {
        name: 'model',
        type: 'gltfModel',
        path: ['models/model.glb'],
    },
    {
        name: 'backdrop',
        type: 'gltfModel',
        path: ['models/backdrop.glb'],
    },
    {
        name: 'modelFull',
        type: 'texture',
        path: ['textures/baked/modelFull.jpg'],
    },
    {
        name: 'modelBack',
        type: 'texture',
        path: ['textures/baked/modelBack.jpg'],
    },
    {
        name: 'modelSide',
        type: 'texture',
        path: ['textures/baked/modelSide.jpg'],
    },
    {
        name: 'modelThree',
        type: 'texture',
        path: ['textures/baked/modelThree.jpg'],
    },
    {
        name: 'backdropFull',
        type: 'texture',
        path: ['textures/baked/backdropFull.jpg'],
    },
    {
        name: 'backdropBack',
        type: 'texture',
        path: ['textures/baked/backdropBack.jpg'],
    },
    {
        name: 'backdropSide',
        type: 'texture',
        path: ['textures/baked/backdropSide.jpg'],
    },
    {
        name: 'backdropThree',
        type: 'texture',
        path: ['textures/baked/backdropThree.jpg'],
    },
]

export default resources
