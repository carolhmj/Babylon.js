/* eslint-disable no-var */
/* eslint-disable-next-line import/no-internal-modules */
import { canvas, engine } from "./index";
import "@dev/loaders";
import "@tools/node-editor";
import type { Mesh} from "@dev/core";
import { SceneInstrumentation , Layer, DynamicTexture, HemisphericLight, MeshBuilder, StandardMaterial, Vector3, Scene, ArcRotateCamera, Color3, TransformNode } from "@dev/core";

import { AdvancedDynamicTexture, Container, Control, StackPanel, TextBlock, Image } from "@dev/gui";

export const createScene = async function () {
    // This creates a basic Babylon Scene object (non-mesh)
    const scene = new Scene(engine);

    const radius = 20;
    // This creates and positions a free camera (non-mesh)
    const camera = new ArcRotateCamera("cam", -Math.PI / 3, Math.PI / 3, radius * 2, new Vector3(0, 0, 0), scene);

    // This targets the camera to scene origin
    camera.setTarget(Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    // Our built-in 'ground' shape. Params: name, options, scene
    MeshBuilder.CreateGround("ground", { width: radius, height: radius }, scene);

    // const plane = MeshBuilder.CreatePlane("plane", { width: radius, height: radius }, scene);
    const width = canvas!.clientWidth;
    const height = canvas!.clientHeight;

    const objs: Mesh[] = [];
    for (let i = 0; i < 10; i++) {
        const position = new Vector3(i - radius / 2, 0, Math.random() * radius - radius / 2);

        const transformNode = new TransformNode("sphere" + i, scene);
        transformNode.position = position;

        const obj = MeshBuilder.CreateSphere("obj" + i, { diameter: 2 });
        obj.parent = transformNode;
        obj.position.y = 1;

        const material = new StandardMaterial("mat");
        material.diffuseColor = Color3.Random();
        obj.material = material;

        objs.push(obj);
    }

    const advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");
    const useWorker = true;

    if (useWorker) {
        const textureGround = new DynamicTexture("dynamic texture", { width, height }, scene, true);
        const textureOffscreen = (textureGround._canvas as HTMLCanvasElement).transferControlToOffscreen();

        const layer = new Layer("layer", null, scene, false);
        layer.texture = textureGround;
        const textureWorker = new Worker("worker.js");
        const img = document.createElement("img");
        img.src = "test-sprite-2k.png";
        img.onload = async function () {
            //Add image to dynamic texture
            // context.drawImage(this, 0, 0);
            const bitmap = await createImageBitmap(img);
            textureWorker.postMessage({ type: "start", canvas: textureOffscreen, bitmap, width, height }, [textureOffscreen, bitmap]);

            scene.onBeforeRenderObservable.add(() => {
                // For each object, get its position on the camera plane
                const positionsList: [number, number][] = [];
                for (let i = 0; i < objs.length; i++) {
                    const obj = objs[i];
                    const transformNode = obj.parent as TransformNode;
                    const position = transformNode.position;
                    const cameraPlanePosition = Vector3.Project(
                        position,
                        camera.getViewMatrix(),
                        camera.getProjectionMatrix(),
                        camera.viewport.toGlobal(engine.getRenderWidth(), engine.getRenderHeight())
                    );
                    const x = cameraPlanePosition.x;
                    const y = cameraPlanePosition.y;
                    // console.log('position', x, y);
                    positionsList.push([x, y]);
                }
                textureWorker.postMessage({ type: "draw", positionsList });
            });
        };

        textureWorker.onmessage = (e) => {
            textureGround.update();
        };
    } else {
        for (let i = 0; i < objs.length; i++) {
            buildLabel(advancedTexture, objs[i].parent as TransformNode);
        }
    }

    const instrumentation = new SceneInstrumentation(scene);
    instrumentation.captureFrameTime = true;
    instrumentation.captureRenderTime = true;

    const fpsCounter = new TextBlock("fps", "");
    fpsCounter.fontSize = "24px";
    fpsCounter.color = "black";
    fpsCounter.outlineColor = "white";
    fpsCounter.outlineWidth = 2;
    fpsCounter.top = "300px";
    advancedTexture.addControl(fpsCounter);
    scene.onAfterRenderObservable.add(() => {
        fpsCounter.text = `absolute fps: ${(1000 / instrumentation.frameTimeCounter.lastSecAverage).toFixed(2)}\n`;
    });

    // Inspector.Show(scene, {});
    return scene;
};

var buildLabel = (advancedTexture: AdvancedDynamicTexture, transformNode: TransformNode) => {
    const stemHeight = 100;

    // Root container is just 1x1 placement for the top-left corner of the flag UI.
    var container = new Container();
    container.widthInPixels = 1;
    container.heightInPixels = 1;
    container.background = "#00000000";
    container.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    container.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    container.clipChildren = false;
    container.clipContent = false;
    container.setPadding(0, 0, 0, 0);
    advancedTexture.addControl(container);
    container.linkWithMesh(transformNode);

    // This contentPanel contains all the content (icon/label) of the flag.
    const contentPanel = new StackPanel();
    contentPanel.adaptWidthToChildren = true;
    contentPanel.adaptHeightToChildren = true;
    contentPanel.isPointerBlocker = false;
    contentPanel.isVertical = false;
    contentPanel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    contentPanel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    contentPanel.clipChildren = false;
    contentPanel.clipContent = false;
    contentPanel.background = "#00000000";
    //contentPanel.background = "#00FF0066";
    contentPanel.setPadding(0, 0, 0, 0);
    container.addControl(contentPanel);

    // const icon = new Image("icon", "textures/grass.png");
    const icon = new Image("icon", "https://raw.githubusercontent.com/carolhmj/quick-demos/main/assets/textures/sprites/test-sprite-2k.png");
    icon.widthInPixels = 50;
    icon.heightInPixels = icon.widthInPixels;
    icon.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
    icon.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    icon.isPointerBlocker = true;
    icon.isHitTestVisible = true;
    icon.shadowBlur = 4.0;
    icon.shadowOffsetY = 2.0;
    const padding = 2.0;
    icon.setPaddingInPixels(padding, padding, padding, padding);
    contentPanel.addControl(icon);

    // var primaryLabel = new TextBlock();
    // primaryLabel.isVisible = true;
    // primaryLabel.isHitTestVisible = false;
    // primaryLabel.color = "#FFFFFFFF";
    // primaryLabel.text = text;
    // primaryLabel.fontSizeInPixels = 40;
    // primaryLabel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    // primaryLabel.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
    // primaryLabel.resizeToFit = true;
    // primaryLabel.isPointerBlocker = true;
    // primaryLabel.fontFamily = "Segoe UI";
    // contentPanel.addControl(primaryLabel); 

    container.linkOffsetYInPixels = -stemHeight;
    container.linkOffsetXInPixels = -0.5 * icon.widthInPixels;
}