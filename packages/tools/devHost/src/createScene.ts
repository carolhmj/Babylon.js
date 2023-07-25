/* eslint-disable-next-line import/no-internal-modules */
import { engine } from "./index";
import "@dev/loaders";
import "@tools/node-editor";
import { Inspector } from "@dev/inspector";
import {  MeshBuilder, Scene, FlowGraph, LogFlowGraphBlock, StandardMaterial, Color3, ForFlowGraphBlock, StringAppendDataGraphBlock, MeshPickEventCoordinator, MeshPickEventGraphBlock } from "@dev/core";
// import { FlowGraph } from "@dev/core/FlowGraph";
// import { ConstantDataGraphBlock, ForFlowGraphBlock, IntervalEventGraphBlock, LogFlowGraphBlock } from "@dev/core/FlowGraph/blocks";

export const createScene = async function () {
    console.log('create scene');
    const scene = new Scene(engine);

    const box = MeshBuilder.CreateBox("ground", { size: 2 });
    box.material = new StandardMaterial("groundMaterial", scene);
    (box.material as StandardMaterial).diffuseColor = new Color3(0.5, 0.5, 0.5);

    scene.createDefaultCameraOrLight(true, true, true);

    const messageBlock = new StringAppendDataGraphBlock();
    messageBlock.setDefaultValue("stringB", " / ");
    messageBlock.addInput("stringC");

    const logBlock = new LogFlowGraphBlock({});
    messageBlock.connect(logBlock, "result", "message");

    const for2Block = new ForFlowGraphBlock({});
    for2Block.setDefaultValue("startIndex", 0);
    for2Block.setDefaultValue("endIndex", 4);
    for2Block.connect(messageBlock, "index", "stringC");
    for2Block.connect(logBlock, "loopBody", "flowIn");
    
    const forBlock = new ForFlowGraphBlock({});
    forBlock.setDefaultValue("startIndex", 0);
    forBlock.setDefaultValue("endIndex", 3);
    forBlock.connect(for2Block, "loopBody", "flowIn");
    forBlock.connect(messageBlock, "index", "stringA");
    
    const meshPickEventCoordinator = new MeshPickEventCoordinator(scene);
    meshPickEventCoordinator.start();

    const meshPickEvent = new MeshPickEventGraphBlock({mesh: box, eventCoordinator: meshPickEventCoordinator});
    meshPickEvent.connect(forBlock, "flowOut", "flowIn");

    const graph = new FlowGraph();
    graph.addEventBlock(meshPickEvent);
    graph.start();

    Inspector.Show(scene, {});

    return scene;
};
