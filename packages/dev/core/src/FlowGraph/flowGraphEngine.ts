import type { Scene } from "../scene";
import { FlowGraph } from "./flowGraph";
import { FlowGraphEventCoordinator } from "./flowGraphEventCoordinator";

/**
 * @experimental
 * Parameters used to create a flow graph engine.
 */
export class IFlowGraphEngineConfiguration {
    /**
     * The scene that the flow graph engine belongs to.
     */
    scene: Scene;
}
/**
 * The FlowGraphEngine class holds all of the existing flow graphs and is responsible for creating new ones.
 * It also handles communication between them through an Event Coordinator
 */
export class FlowGraphEngine {
    private readonly _eventCoordinator: FlowGraphEventCoordinator;
    private readonly _flowGraphs: FlowGraph[] = [];

    constructor(private _config: IFlowGraphEngineConfiguration) {
        this._eventCoordinator = new FlowGraphEventCoordinator();
    }

    /**
     * Creates a new flow graph and adds it to the list of existing flow graphs
     * @returns a new flow graph
     */
    createGraph(): FlowGraph {
        const graph = new FlowGraph({ scene: this._config.scene, eventCoordinator: this._eventCoordinator });
        this._flowGraphs.push(graph);
        return graph;
    }

    /**
     * Removes a flow graph from the list of existing flow graphs and disposes it
     * @param graph the graph to remove
     */
    removeGraph(graph: FlowGraph) {
        const index = this._flowGraphs.indexOf(graph);
        if (index !== -1) {
            graph.dispose();
            this._flowGraphs.splice(index, 1);
        }
    }

    /**
     * Starts all graphs
     */
    start() {
        this._flowGraphs.forEach((graph) => graph.start());
    }

    /**
     * Disposes all graphs
     */
    dispose() {
        this._flowGraphs.forEach((graph) => graph.dispose());
        this._flowGraphs.length = 0;
    }
}
