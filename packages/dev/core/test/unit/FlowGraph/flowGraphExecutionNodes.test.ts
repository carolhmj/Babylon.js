import { ArcRotateCamera } from "core/Cameras";
import type { Engine } from "core/Engines";
import { NullEngine } from "core/Engines";
import type { FlowGraphContext, FlowGraph } from "core/FlowGraph";
import {
    FlowGraphCoordinator,
    FlowGraphDoNBlock,
    FlowGraphFlipFlopBlock,
    FlowGraphForLoopBlock,
    FlowGraphLogBlock,
    FlowGraphMultiGateBlock,
    FlowGraphPath,
    FlowGraphSceneReadyEventBlock,
    FlowGraphSceneTickEventBlock,
    FlowGraphSetPropertyBlock,
    FlowGraphSwitchBlock,
    FlowGraphThrottleBlock,
    FlowGraphTimerBlock,
} from "core/FlowGraph";
import { FlowGraphBranchBlock } from "core/FlowGraph/Blocks/Execution/ControlFlow/flowGraphBranchBlock";
import { Vector3 } from "core/Maths/math.vector";
import { Mesh } from "core/Meshes";
import { Scene } from "core/scene";

describe("Flow Graph Execution Nodes", () => {
    let engine: Engine;
    let scene: Scene;
    let flowGraphCoordinator: FlowGraphCoordinator;
    let flowGraph: FlowGraph;
    let flowGraphContext: FlowGraphContext;

    beforeEach(() => {
        console.log = jest.fn();
        engine = new NullEngine({
            renderHeight: 256,
            renderWidth: 256,
            textureSize: 256,
            deterministicLockstep: false,
            lockstepMaxSteps: 1,
        });

        scene = new Scene(engine);
        flowGraphCoordinator = new FlowGraphCoordinator({ scene });
        flowGraph = flowGraphCoordinator.createGraph();
        flowGraphContext = flowGraph.createContext();
        const cam = new ArcRotateCamera("cam", 0, 0, 0, new Vector3(0, 0, 0), scene);
    });

    it("Branch Block", () => {
        const sceneReady = new FlowGraphSceneReadyEventBlock({ name: "SceneReady" });
        flowGraph.addEventBlock(sceneReady);

        const branch = new FlowGraphBranchBlock();
        sceneReady.done.connectTo(branch.in);
        branch.condition.setValue(true, flowGraphContext); // will execute onTrue

        const onTrue = new FlowGraphLogBlock();
        onTrue.message.setValue("onTrue", flowGraphContext);
        branch.onTrue.connectTo(onTrue.in);
        const onFalse = new FlowGraphLogBlock();
        onFalse.message.setValue("onFalse", flowGraphContext);
        branch.onFalse.connectTo(onFalse.in);

        flowGraph.start();
        scene.onReadyObservable.notifyObservers(scene);

        expect(console.log).toHaveBeenCalledTimes(1);
        expect(console.log).toHaveBeenCalledWith("onTrue");
    });

    it("DoN Block", () => {
        const sceneReady = new FlowGraphSceneReadyEventBlock();
        flowGraph.addEventBlock(sceneReady);

        const doN = new FlowGraphDoNBlock();
        sceneReady.done.connectTo(doN.in);

        const nIsDone = new FlowGraphLogBlock();
        doN.out.connectTo(nIsDone.in);
        doN.value.connectTo(nIsDone.message);

        flowGraph.start();

        const numCalls = 5;
        doN.n.setValue(numCalls, flowGraphContext);

        const extraCalls = 2;

        for (let i = 0; i < numCalls + extraCalls; i++) {
            scene.onReadyObservable.notifyObservers(scene);
        }

        expect(console.log).toHaveBeenCalledTimes(numCalls);
    });

    it("ForLoop Block", () => {
        const sceneReady = new FlowGraphSceneReadyEventBlock();
        flowGraph.addEventBlock(sceneReady);

        const forLoop = new FlowGraphForLoopBlock();
        sceneReady.done.connectTo(forLoop.in);
        forLoop.startIndex.setValue(1, flowGraphContext);
        forLoop.endIndex.setValue(7, flowGraphContext);
        forLoop.step.setValue(2, flowGraphContext);

        const loop = new FlowGraphLogBlock();
        forLoop.onLoop.connectTo(loop.in);
        forLoop.index.connectTo(loop.message);

        const done = new FlowGraphLogBlock();
        forLoop.out.connectTo(done.in);
        done.message.setValue("done", flowGraphContext);

        flowGraph.start();
        scene.onReadyObservable.notifyObservers(scene);

        expect(console.log).toHaveBeenCalledTimes(4);
        expect(console.log).toHaveBeenNthCalledWith(1, 1);
        expect(console.log).toHaveBeenNthCalledWith(2, 3);
        expect(console.log).toHaveBeenNthCalledWith(3, 5);
        expect(console.log).toHaveBeenNthCalledWith(4, "done");
    });

    it("MultiGate Block", () => {
        const sceneReady = new FlowGraphSceneReadyEventBlock();
        flowGraph.addEventBlock(sceneReady);

        const multiGate = new FlowGraphMultiGateBlock({ numberOutputFlows: 3, loop: true });
        sceneReady.done.connectTo(multiGate.in);

        const customFunction1 = new FlowGraphLogBlock();
        customFunction1.message.setValue("custom1", flowGraphContext);
        multiGate.outFlows[0].connectTo(customFunction1.in);
        const customFunction2 = new FlowGraphLogBlock();
        customFunction2.message.setValue("custom2", flowGraphContext);
        multiGate.outFlows[1].connectTo(customFunction2.in);
        const customFunction3 = new FlowGraphLogBlock();
        customFunction3.message.setValue("custom3", flowGraphContext);
        multiGate.outFlows[2].connectTo(customFunction3.in);

        flowGraph.start();

        // notify twice so two of the multi gate blocks will be activated
        scene.onReadyObservable.notifyObservers(scene);
        scene.onReadyObservable.notifyObservers(scene);
        expect(console.log).toHaveBeenNthCalledWith(1, "custom1");
        expect(console.log).toHaveBeenNthCalledWith(2, "custom2");

        // activate the third gate
        scene.onReadyObservable.notifyObservers(scene);
        expect(console.log).toHaveBeenNthCalledWith(3, "custom3");

        // activate the first gate again
        scene.onReadyObservable.notifyObservers(scene);
        expect(console.log).toHaveBeenNthCalledWith(4, "custom1");
    });

    it("Switch Block", () => {
        const sceneReady = new FlowGraphSceneReadyEventBlock();
        flowGraph.addEventBlock(sceneReady);

        const switchBlock = new FlowGraphSwitchBlock({ cases: [1, 2, 3] });
        sceneReady.done.connectTo(switchBlock.in);
        switchBlock.selection.setValue(2, flowGraphContext);

        const customFunctionBlock1 = new FlowGraphLogBlock();
        customFunctionBlock1.message.setValue("custom1", flowGraphContext);
        switchBlock.outputFlows[0].connectTo(customFunctionBlock1.in);
        const customFunctionBlock2 = new FlowGraphLogBlock();
        customFunctionBlock2.message.setValue("custom2", flowGraphContext);
        switchBlock.outputFlows[1].connectTo(customFunctionBlock2.in);
        const customFunctionBlock3 = new FlowGraphLogBlock();
        customFunctionBlock3.message.setValue("custom3", flowGraphContext);
        switchBlock.outputFlows[2].connectTo(customFunctionBlock3.in);

        flowGraph.start();
        scene.onReadyObservable.notifyObservers(scene);

        expect(console.log).toHaveBeenNthCalledWith(1, "custom2");

        switchBlock.selection.setValue(3, flowGraphContext);
        scene.onReadyObservable.notifyObservers(scene);
        expect(console.log).toHaveBeenNthCalledWith(2, "custom3");
    });

    it("Timer Block", () => {
        const sceneReady = new FlowGraphSceneReadyEventBlock();
        flowGraph.addEventBlock(sceneReady);

        const timer = new FlowGraphTimerBlock();
        sceneReady.done.connectTo(timer.in);
        timer.timeout.setValue(0, flowGraphContext);

        const customFunctionBlock = new FlowGraphLogBlock();
        customFunctionBlock.message.setValue("custom", flowGraphContext);
        timer.done.connectTo(customFunctionBlock.in);

        const customFunctionBlock2 = new FlowGraphLogBlock();
        customFunctionBlock2.message.setValue("custom2", flowGraphContext);
        timer.done.connectTo(customFunctionBlock2.in);

        flowGraph.start();
        // this will run the onReadyObservable and the onBeforeRenderObservable
        scene.render();

        expect(console.log).toHaveBeenNthCalledWith(1, "custom");
        expect(console.log).toHaveBeenNthCalledWith(2, "custom2");
    });

    it("Flip Flop Block", () => {
        const sceneTick = new FlowGraphSceneTickEventBlock();
        flowGraph.addEventBlock(sceneTick);

        const flipFlop = new FlowGraphFlipFlopBlock();
        sceneTick.done.connectTo(flipFlop.in);

        const onTrue = new FlowGraphLogBlock();
        onTrue.message.setValue("onTrue", flowGraphContext);
        flipFlop.onOn.connectTo(onTrue.in);
        const onFalse = new FlowGraphLogBlock();
        onFalse.message.setValue("onFalse", flowGraphContext);
        flipFlop.onOff.connectTo(onFalse.in);

        flowGraph.start();
        scene.render();

        expect(console.log).toHaveBeenNthCalledWith(1, "onTrue");

        scene.render();
        expect(console.log).toHaveBeenNthCalledWith(2, "onFalse");
    });

    it("Throttle Block", () => {
        const sceneTick = new FlowGraphSceneTickEventBlock();
        flowGraph.addEventBlock(sceneTick);

        const throttle = new FlowGraphThrottleBlock();
        throttle.duration.setValue(1000, flowGraphContext);
        sceneTick.done.connectTo(throttle.in);

        const customFunction = new FlowGraphLogBlock();
        throttle.out.connectTo(customFunction.in);

        flowGraph.start();
        scene.render();

        expect(console.log).toHaveBeenCalledTimes(1);

        // Check if the execution is throttled
        scene.render();
        expect(console.log).toHaveBeenCalledTimes(1);
    });

    it("SetPropertyBlock", () => {
        const mesh0 = new Mesh("myMesh0", scene);
        const mesh1 = new Mesh("myMesh1", scene);

        const sceneReady = new FlowGraphSceneReadyEventBlock();
        flowGraph.addEventBlock(sceneReady);

        flowGraphContext._userVariables = {
            0: mesh0,
            1: mesh1,
        };
        const path = new FlowGraphPath("/{nodeIndex}/position");

        const setProperty = new FlowGraphSetPropertyBlock<Vector3>({
            path,
        });
        sceneReady.done.connectTo(setProperty.in);

        const nodeIndexInput = setProperty.getDataInput("nodeIndex");
        expect(nodeIndexInput).toBeDefined();

        nodeIndexInput!.setValue(1, flowGraphContext);
        setProperty.a.setValue(new Vector3(1, 2, 3), flowGraphContext);

        flowGraph.start();

        scene.onReadyObservable.notifyObservers(scene);
        expect(mesh0.position.asArray()).toEqual([0, 0, 0]);
        expect(mesh1.position.asArray()).toEqual([1, 2, 3]);
    });

    afterEach(() => {
        scene.dispose();
        engine.dispose();
    });
});
