import { serialize } from "core/Misc/decorators";
import { RandomGUID } from "../Misc/guid";
import type { Scene } from "../scene";
import type { FlowGraphAsyncExecutionBlock } from "./flowGraphAsyncExecutionBlock";
import type { FlowGraphBlock } from "./flowGraphBlock";
import type { FlowGraphDataConnection } from "./flowGraphDataConnection";
import type { FlowGraphEventCoordinator } from "./flowGraphEventCoordinator";
import type { FlowGraph } from "./flowGraph";

/**
 * Construction parameters for the context.
 * @experimental
 */
export interface IFlowGraphContextConfiguration {
    /**
     * The scene that the flow graph context belongs to.
     */
    readonly scene: Scene;
    /**
     * The event coordinator used by the flow graph context.
     */
    readonly eventCoordinator: FlowGraphEventCoordinator;
}
/**
 * @experimental
 * The context represents the current state and execution of the flow graph.
 * It contains both user-defined variables, which are derived from
 * a more general variable definition, and execution variables that
 * are set by the blocks.
 */
export class FlowGraphContext {
    /**
     * A randomly generated GUID for each context.
     */
    @serialize()
    public uniqueId = RandomGUID();
    /**
     * These are the variables defined by a user.
     */
    private _userVariables: Map<string, any> = new Map();
    /**
     * These are the variables set by the blocks.
     */
    private _executionVariables: Map<string, any> = new Map();
    /**
     * These are the values for the data connection points
     */
    private _connectionValues: Map<string, any> = new Map();
    /**
     * These are the variables set by the graph.
     */
    private readonly _configuration: IFlowGraphContextConfiguration;
    /**
     * These are blocks that have currently pending tasks/listeners that need to be cleaned up.
     */
    private _pendingBlocks: FlowGraphAsyncExecutionBlock[] = [];

    constructor(params: IFlowGraphContextConfiguration) {
        this._configuration = params;
    }

    /**
     * Check if a user-defined variable is defined.
     * @param name
     * @returns
     */
    public hasVariable(name: string) {
        return this._userVariables.has(name);
    }

    /**
     * Set a user-defined variable.
     * @param name
     * @param value
     */
    public setVariable(name: string, value: any) {
        this._userVariables.set(name, value);
    }

    /**
     * Get a user-defined variable.
     * @param name
     * @returns
     */
    public getVariable(name: string): any {
        return this._userVariables.get(name);
    }

    private _getUniqueIdPrefixedName(obj: FlowGraphBlock, name: string): string {
        return `${obj.uniqueId}_${name}`;
    }

    /**
     * Set an internal execution variable
     * @internal
     * @param name
     * @param value
     */
    public _setExecutionVariable(block: FlowGraphBlock, name: string, value: any) {
        this._executionVariables.set(this._getUniqueIdPrefixedName(block, name), value);
    }

    /**
     * Get an internal execution variable
     * @internal
     * @param name
     * @returns
     */
    public _getExecutionVariable(block: FlowGraphBlock, name: string, defaultValue?: any): any {
        if (this._hasExecutionVariable(block, name)) {
            return this._executionVariables.get(this._getUniqueIdPrefixedName(block, name));
        } else {
            return defaultValue;
        }
    }

    /**
     * Delete an internal execution variable
     * @internal
     * @param block
     * @param name
     */
    public _deleteExecutionVariable(block: FlowGraphBlock, name: string) {
        this._executionVariables.delete(this._getUniqueIdPrefixedName(block, name));
    }

    /**
     * Check if an internal execution variable is defined
     * @internal
     * @param block
     * @param name
     * @returns
     */
    public _hasExecutionVariable(block: FlowGraphBlock, name: string) {
        return this._executionVariables.has(this._getUniqueIdPrefixedName(block, name));
    }

    /**
     * Check if a connection value is defined
     * @internal
     * @param connectionPoint
     * @returns
     */
    public _hasConnectionValue(connectionPoint: FlowGraphDataConnection<any>) {
        return this._connectionValues.has(connectionPoint.uniqueId);
    }

    /**
     * Set a connection value
     * @internal
     * @param connectionPoint
     * @param value
     */
    public _setConnectionValue<T>(connectionPoint: FlowGraphDataConnection<T>, value: T) {
        this._connectionValues.set(connectionPoint.uniqueId, value);
    }

    /**
     * Get a connection value
     * @internal
     * @param connectionPoint
     * @returns
     */
    public _getConnectionValue<T>(connectionPoint: FlowGraphDataConnection<T>): T {
        return this._connectionValues.get(connectionPoint.uniqueId);
    }

    /**
     * Get the configuration
     * @internal
     * @param name
     * @param value
     */
    public get configuration() {
        return this._configuration;
    }

    /**
     * Add a block to the list of blocks that have pending tasks.
     * @internal
     * @param block
     */
    public _addPendingBlock(block: FlowGraphAsyncExecutionBlock) {
        this._pendingBlocks.push(block);
    }

    /**
     * Remove a block from the list of blocks that have pending tasks.
     * @internal
     * @param block
     */
    public _removePendingBlock(block: FlowGraphAsyncExecutionBlock) {
        const index = this._pendingBlocks.indexOf(block);
        if (index !== -1) {
            this._pendingBlocks.splice(index, 1);
        }
    }

    /**
     * Clear all pending blocks.
     * @internal
     */
    public _clearPendingBlocks() {
        for (const block of this._pendingBlocks) {
            block._cancelPendingTasks(this);
        }
        this._pendingBlocks.length = 0;
    }

    public serialize(serializationObject: any = {}) {
        serializationObject.uniqueId = this.uniqueId;
        serializationObject._userVariables = {};
        this._userVariables.forEach((value, key) => {
            serializationObject._userVariables[key] = value;
        });
        serializationObject._connectionValues = {};
        this._connectionValues.forEach((value, key) => {
            serializationObject._connectionValues[key] = value;
        });
    }

    public getClassName() {
        return "FlowGraphContext";
    }

    public parse(serializationObject: any) {
        this.uniqueId = serializationObject.uniqueId;
        for (const key in serializationObject._userVariables) {
            this._userVariables.set(key, serializationObject._userVariables[key]);
        }
        for (const key in serializationObject._connectionValues) {
            this._connectionValues.set(key, serializationObject._connectionValues[key]);
        }
    }

    public static Parse(serializationObject: any = {}, graph: FlowGraph): FlowGraphContext {
        const result = graph.createContext();
        result.parse(serializationObject);

        return result;
    }
}
