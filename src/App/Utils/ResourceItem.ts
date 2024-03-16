import * as THREE from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

export default interface ResourceItem {
    [key: string]: THREE.Texture | GLTF
}

export function isGLTF(resource: THREE.Texture | GLTF): resource is GLTF {
    return (resource as GLTF).scene !== undefined
}