import type { FlowGraphConnectionType } from "./flowGraphConnection";

/**
 * A serialized context.
 */
export interface ISerializedFlowGraphContext {
    /**
     * The unique ID of the context.
     */
    uniqueId: string;
    /**
     * A map of user variables
     */
    _userVariables: { [key: string]: any };
    /**
     * A map of values in connections
     */
    _connectionValues: { [key: string]: any };
}

/**
 * A serialized connection.
 */
export interface ISerializedFlowGraphConnection {
    /**
     * The unique ID of the connection.
     */
    uniqueId: string;
    /**
     * The name of the connection.
     */
    name: string;
    /**
     * The type of the connection.
     */
    _connectionType: FlowGraphConnectionType;
    /**
     * The unique IDs of the points that are connected to this point.
     */
    connectedPointIds: string[];
}

/**
 * A serialized block.
 */
export interface ISerializedFlowGraphBlock {
    /**
     * The class name of the block
     */
    className: string;
    /**
     * The configuration of the block
     */
    config: any;
    /**
     * The unique ID of the block.
     */
    uniqueId: string;
    /**
     * The serialized data input connections
     */
    dataInputs: ISerializedFlowGraphConnection[];
    /**
     * The serialized data output connections
     */
    dataOutputs: ISerializedFlowGraphConnection[];
    /**
     * Metadata of the block
     */
    metadata: any;
    /**
     * The serialized signal input connections
     */
    signalInputs: ISerializedFlowGraphConnection[];
    /**
     * The serialized signal output connections
     */
    signalOutputs: ISerializedFlowGraphConnection[];
}

/**
 * A serialized graph.
 */
export interface ISerializedFlowGraph {
    /**
     * The serialized contexts
     */
    executionContexts: ISerializedFlowGraphContext[];
    /**
     * All of the blocks serialized
     */
    allBlocks: ISerializedFlowGraphBlock[];
}
