import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/1.png')
const matcapDonutTexture = textureLoader.load('/textures/matcaps/8.png')

// Fonts
const fontLoader = new FontLoader()
const bevelSize = 0.02;
const bevelThickness = 0.03
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new TextGeometry(
            'Unlimited Donuts!!! (1000 to be more precise)',
            {
                font,
                size: 0.5,
                height: 0.2,
                curveSegments: 5,
            }
        )
        const textMaterial = new THREE.MeshMatcapMaterial({
            matcap: matcapTexture
        });
        // textMaterial.wireframe = true
        const text = new THREE.Mesh(textGeometry, textMaterial)
        scene.add(text)
        // textGeometry.computeBoundingBox()
        // textGeometry.translate(
        //     -(textGeometry.boundingBox.max.x - bevelSize) * 0.5,
        //     -(textGeometry.boundingBox.max.y - bevelSize) * 0.5,
        //     -(textGeometry.boundingBox.max.z - bevelThickness) * 0.5
        // )
        textGeometry.center()
        console.log(textGeometry.boundingBox)
        console.time('donuts')
        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
        const donutMaterial = new THREE.MeshMatcapMaterial({
            matcap: matcapDonutTexture,
            transparent: true,
            opacity: 0.7,
        })
        for(let i=0; i<1000; i++) {
            const donut = new THREE.Mesh(donutGeometry, donutMaterial)
            donut.position.x = (Math.random() - 0.5) * 50
            donut.position.y = (Math.random() - 0.5) * 50
            donut.position.z = (Math.random() - 0.5) * 50
            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI
            const scale = Math.random()
            donut.scale.set(scale, scale, scale)
            scene.add(donut)
        }
        console.timeEnd('donuts')
    }
)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 12
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()