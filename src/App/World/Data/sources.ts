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
        path: ['models/studio/model.glb'],
    },
    {
        name: 'backdrop',
        type: 'gltfModel',
        path: ['models/studio/backdrop.glb'],
    },
    {
        name: 'modelFull',
        type: 'texture',
        path: ['textures/baked/studio/modelFull.jpg'],
    },
    {
        name: 'modelBack',
        type: 'texture',
        path: ['textures/baked/studio/modelBack.jpg'],
    },
    {
        name: 'modelSide',
        type: 'texture',
        path: ['textures/baked/studio/modelSide.jpg'],
    },
    {
        name: 'modelThree',
        type: 'texture',
        path: ['textures/baked/studio/modelThree.jpg'],
    },
    {
        name: 'backdropFull',
        type: 'texture',
        path: ['textures/baked/studio/backdropFull.jpg'],
    },
    {
        name: 'backdropBack',
        type: 'texture',
        path: ['textures/baked/studio/backdropBack.jpg'],
    },
    {
        name: 'backdropSide',
        type: 'texture',
        path: ['textures/baked/studio/backdropSide.jpg'],
    },
    {
        name: 'backdropThree',
        type: 'texture',
        path: ['textures/baked/studio/backdropThree.jpg'],
    },
    {
        name: 'equipment',
        type: 'gltfModel',
        path: ['models/weights/equipment.glb']
    }, 
    {
        name: 'ground',
        type: 'gltfModel',
        path: ['models/weights/ground.glb']
    }, 
    {
        name: 'bakedEquipment',
        type: 'texture',
        path: ['textures/baked/weights/Equipment.jpg']
    },
    {
        name: 'bakedGround',
        type: 'texture',
        path: ['textures/baked/weights/Ground.jpg']
    },
    {
        name: 'cityPart00',
        type: 'gltfModel',
        path: ['models/city/Part00.glb']
    },
    {
        name: 'cityPart01',
        type: 'gltfModel',
        path: ['models/city/Part01.glb']
    },
    {
        name: 'cityPart02',
        type: 'gltfModel',
        path: ['models/city/Part02.glb']
    },
    {
        name: 'cityPart03',
        type: 'gltfModel',
        path: ['models/city/Part03.glb']
    },
    {
        name: 'cityPart04',
        type: 'gltfModel',
        path: ['models/city/Part04.glb']
    },
    {
        name: 'cityPart05',
        type: 'gltfModel',
        path: ['models/city/Part05.glb']
    },
    {
        name: 'cityPart06',
        type: 'gltfModel',
        path: ['models/city/Part06.glb']
    },
    {
        name: 'scaffolding',
        type: 'gltfModel',
        path: ['models/city/Scaffolding.glb']
    },
    {
        name: 'backsides',
        type: 'gltfModel',
        path: ['models/city/Backsides.glb']
    },
    {
        name: 'screens',
        type: 'gltfModel',
        path: ['models/city/Screens.glb']
    },
    {
        name: 'cityPartNight00',
        type: 'gltfModel',
        path: ['models/city/night/PartNight00.glb']
    },
    {
        name: 'cityPartNight01',
        type: 'gltfModel',
        path: ['models/city/night/PartNight01.glb']
    },
    {
        name: 'cityPartNight02',
        type: 'gltfModel',
        path: ['models/city/night/PartNight02.glb']
    },
    {
        name: 'cityPartNight03',
        type: 'gltfModel',
        path: ['models/city/night/PartNight03.glb']
    },
    {
        name: 'cityPartNight04',
        type: 'gltfModel',
        path: ['models/city/night/PartNight04.glb']
    },
    {
        name: 'cityPartNight05',
        type: 'gltfModel',
        path: ['models/city/night/PartNight05.glb']
    },
    {
        name: 'cityBaked00',
        type: 'texture',
        path: ['textures/baked/city/Baked00.jpg']
    },
    {
        name: 'cityBaked01',
        type: 'texture',
        path: ['textures/baked/city/Baked01.jpg']
    },
    {
        name: 'cityBaked02',
        type: 'texture',
        path: ['textures/baked/city/Baked02.jpg']
    },
    {
        name: 'cityBaked03',
        type: 'texture',
        path: ['textures/baked/city/Baked03.jpg']
    },
    {
        name: 'cityBaked04',
        type: 'texture',
        path: ['textures/baked/city/Baked04.jpg']
    },
    {
        name: 'cityBaked05',
        type: 'texture',
        path: ['textures/baked/city/Baked05.jpg']
    },
    {
        name: 'cityBaked06',
        type: 'texture',
        path: ['textures/baked/city/Baked06.jpg']
    },
    {
        name: 'cityBakedNight00',
        type: 'texture',
        path: ['textures/baked/city/BakedNight00.jpg']
    },
    {
        name: 'cityBakedNight01',
        type: 'texture',
        path: ['textures/baked/city/BakedNight01.jpg']
    },
    {
        name: 'cityBakedNight02',
        type: 'texture',
        path: ['textures/baked/city/BakedNight02.jpg']
    },
    {
        name: 'cityBakedNight03',
        type: 'texture',
        path: ['textures/baked/city/BakedNight03.jpg']
    },
    {
        name: 'cityBakedNight04',
        type: 'texture',
        path: ['textures/baked/city/BakedNight04.jpg']
    },
    {
        name: 'cityBakedNight05',
        type: 'texture',
        path: ['textures/baked/city/BakedNight05.jpg']
    },
    {
        name: 'cityBakedNight06',
        type: 'texture',
        path: ['textures/baked/city/BakedNight06.jpg']
    }
]

export default resources
