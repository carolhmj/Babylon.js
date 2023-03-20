/* eslint-disable-next-line import/no-internal-modules */
import { canvas, engine } from "./index";
import "@dev/loaders";
import "@tools/node-editor";
import { Inspector } from "@dev/inspector";
import { DynamicTexture, FreeCamera, HemisphericLight, MeshBuilder, StandardMaterial, Vector3, Scene } from "@dev/core";

export const createScene = async function () {
    // This creates a basic Babylon Scene object (non-mesh)
    const scene = new Scene(engine);

    // This creates and positions a free camera (non-mesh)
    const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'sphere' shape. Params: name, options, scene
    const sphere = MeshBuilder.CreateSphere("sphere", { diameter: 2, segments: 32 }, scene);

    // Move the sphere upward 1/2 its height
    sphere.position.y = 1;

    // Our built-in 'ground' shape. Params: name, options, scene
    const ground = MeshBuilder.CreateGround("ground", { width: 6, height: 6 }, scene);

    const textureGround = new DynamicTexture("dynamic texture", 512, scene, true);
    const textureOffscreen = (textureGround._canvas as HTMLCanvasElement).transferControlToOffscreen();
    // const textureContext = textureGround.getContext();
    // const img = new Image();
    // img.src = 'amiga.jpg';
    // img.onload = function() {
    //     //Add image to dynamic texture
    //     textureContext.drawImage(this, 0, 0);
    //     textureGround.update();

    //     textureContext.drawImage(this, 10, 490, 10, 12, 156, 136, 200, 220)
    //     textureGround.update();	
    // }
    const textureWorker = new Worker("worker.js");
    const img = new Image();
    img.src = 'test-sprite-2k.png';
    img.onload = async function() {
        //Add image to dynamic texture
        // context.drawImage(this, 0, 0);
        const bitmap = await createImageBitmap(img);
        textureWorker.postMessage({ canvas: textureOffscreen, bitmap }, [textureOffscreen, bitmap]);
    };

    textureWorker.onmessage = (e) => {
        console.log("Message received from worker", e);
        setTimeout(() => {
            textureGround.update();
        }, 2000);
    }

    const materialGround = new StandardMaterial("Mat", scene);
    materialGround.diffuseTexture = textureGround;
    ground.material = materialGround;

    Inspector.Show(scene, {});
    return scene;

    return scene;
};
