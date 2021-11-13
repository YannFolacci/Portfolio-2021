import './style.css'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { NumberKeyframeTrack, VectorKeyframeTrack, AnimationMixer, AnimationClip } from 'three'
import {Slider} from './slide'



let canvas = document.querySelector('canvas.webgl');

// Sizes
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }
    // window.addEventListener('resize', () =>
    // {
    //     // Update sizes
    //     sizes.width = document.body.clientWidth
    //     sizes.height = document.body.clientHeight

    //     // Update camera
    //     camera.aspect = sizes.width / sizes.height
    //     camera.updateProjectionMatrix()

    //     // Update renderer
    //     renderer.setSize(sizes.width, sizes.height)
    //     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    // })
    

// Scene
    const scene = new THREE.Scene()
    scene.background=new THREE.Color( 0xfdca58 )

//Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

// Objects
    const gltfLoader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    gltfLoader.setDRACOLoader(dracoLoader)

    const objectsDistance = 4

    //section1
        let mixer1 = null
        let whiteMat = new THREE.MeshBasicMaterial({color: 0xffffff})

        gltfLoader.load(
            '/models/hero.glb',
            (gltf) =>
            {
                gltf.scene.position.y= - objectsDistance * 0
                gltf.scene.scale.set(0.8, 0.8, 0.8)
                if (gltf.scene.children.isMesh ) {

                    gltf.scene.children.material = whiteMat
            
                }
                scene.add(gltf.scene)

                mixer1 = new THREE.AnimationMixer(gltf.scene)
            },
            (progress) =>
            {
                // console.log('progress')
                // console.log(progress)
            },
            (error) =>
            {
                // console.log('error')
                // console.log(error)
            }
        )
    //section2
        const projectGroup = new THREE.Group()
        projectGroup.position.y = - objectsDistance * 1
        scene.add(projectGroup)

        
        let arrayImg = ["/img/canvas.png","/img/connected-lines.png", "/img/opacity.png","/canvas.png","/connected-lines.png", "/opacity.png","/canvas.png","/connected-lines.png", "/opacity.png"]
        let texture, material, mesh
        const basicMaterial = new THREE.MeshBasicMaterial()
        const geometry = new THREE.BoxGeometry(1, 1, 0.1)

        let mixer2= []
        let actions2= []
        const times= [0, 1]

        for (let i = 0; i < arrayImg.length; i++) {
            texture = new THREE.TextureLoader().load( arrayImg[i] )
            material = new THREE.MeshBasicMaterial( { map: texture } )
            mesh = new THREE.Mesh(geometry, [basicMaterial, basicMaterial, basicMaterial, basicMaterial, material, basicMaterial])
            mesh.position.x=2+0.3*i
            mesh.rotation.y=-45*(2*Math.PI/360)

            const rotationValuesRight = [-45*(2*Math.PI/360), 0]
            const positionValuesRight = [
                2+0.3*i, 0, 0,
                0, 0, 3
            ]
            const rotationValuesLeft = [0, 45*(2*Math.PI/360)]
            const positionValuesLeft = [
                0, 0, 3,
                -2-0.3*(arrayImg.length-i-1), 0, 0
            ]

            const rotationRightKF = new NumberKeyframeTrack('.rotation[y]', times, rotationValuesRight)
            const positionRightKF = new VectorKeyframeTrack('.position', times, positionValuesRight)
            const rotationLeftKF = new NumberKeyframeTrack('.rotation[y]', times, rotationValuesLeft)
            const positionLeftKF = new VectorKeyframeTrack('.position', times, positionValuesLeft)
            const clipRight = new AnimationClip('right'+i, 1, [ positionRightKF, rotationRightKF])
            const clipLeft = new AnimationClip('left'+i, 1, [ positionLeftKF, rotationLeftKF])
            let clips = [clipRight,clipLeft]
            let mixer2tmp = new THREE.AnimationMixer( mesh )
            let actionClips = []
            clips.forEach(clip => {
                let clipAction = mixer2tmp.clipAction(clip)
                clipAction.loop = THREE.LoopOnce
                clipAction.clampWhenFinished = true
                actionClips.push(clipAction)
            });
            mixer2.push(mixer2tmp)
            actions2.push(actionClips)
            projectGroup.add(mesh)
        }
        console.log(actions2)
        
        let slider = new Slider(arrayImg, actions2)
        document.querySelector("#projects #arrow-left").onclick = ()=>{slider.previous()}
        document.querySelector("#projects #arrow-right").onclick = ()=>{slider.next()}
        
    //section3
        let mixer3 = null

        gltfLoader.load(
            '/models/contact.glb',
            (gltf) =>
            {
                gltf.scene.position.y= - objectsDistance * 2
                gltf.scene.position.x= -3
                scene.add(gltf.scene)

                // mixer3 = new THREE.AnimationMixer(gltf.scene)
                // gltf.animations.forEach(action => {
                //     action = mixer3.clipAction(action)
                //     // action.loop = THREE.LoopOnce
                //     // action.paused = true
                //     action.play()
                // });
                // console.log(scene)
            },
            (progress) =>
            {
                // console.log('progress')
                // console.log(progress)
            },
            (error) =>
            {
                // console.log('error')
                // console.log(error)
            }
        )

// Camera
    const cameraGroup = new THREE.Group()
    scene.add(cameraGroup)

    const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height)
    camera.position.x = 0
    camera.position.z = 5
    cameraGroup.add(camera)

// Renderer
    const renderer = new THREE.WebGLRenderer({
        canvas: document.querySelector('canvas.webgl'),
        alpha: true
    })
    renderer.setClearAlpha(0)


    renderer.setSize(sizes.width, sizes.height)
    renderer.render(scene, camera)

//Scroll
    let scrollY = window.scrollY
    window.addEventListener('scroll', () =>
    {
        scrollY = window.scrollY
    })

//Mouse move
    const cursor = {}
    cursor.x = 0
    cursor.y = 0
    // window.addEventListener('mousemove', (event) =>
    // {
    //     cursor.x = event.clientX / sizes.width - 0.5
    //     cursor.y = event.clientY / sizes.height - 0.5

    // })
    document.getElementById("hero").addEventListener('mousemove', (event) =>
    {
        cursor.x = event.clientX / sizes.width - 0.5
        cursor.y = event.clientY / sizes.height - 0.5

    })

// Animate
    const clock = new THREE.Clock()
    // let time = Date.now()


    const animate = () =>{
        const elapsedTime = clock.getDelta()

        // Animate camera
        camera.position.y = - scrollY / sizes.height * objectsDistance

        const parallaxX = cursor.x*0.5
        const parallaxY = -cursor.y*0.5
        if(scene.getObjectByName("empty")){

            scene.getObjectByName("empty").rotation.y = (parallaxX)
            scene.getObjectByName("empty").rotation.x = -(parallaxY)
        }
        // cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * elapsedTime
        // cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * elapsedTime

        if(mixer1)
        {
            mixer1.update(elapsedTime)
        }
        if(mixer2)
        {
            mixer2.forEach(mixer => {
                mixer.update(elapsedTime)
            });
        }
        if(mixer3)
        {
            mixer3.update(elapsedTime)
        }

        if(scene.getObjectByName("Empty"))
            scene.getObjectByName("Empty").rotation.y += elapsedTime * 0.2

        renderer.render(scene, camera) 
        window.requestAnimationFrame(animate)
    }
 
    animate()
