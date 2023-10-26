export interface ISerializedFlowGraphContext {
    uniqueId: string;
    _userVariables: { [key: string]: any };
    _connectionValues: { [key: string]: any };
}

export interface ISerializedFlowGraphConnection {
    uniqueId: string;
    name: string;
    _connectionType: FlowGraphConnectionType;
    connectedPointIds: string[];
}

export interface ISerializedFlowGraphBlock {
    className: string;
    config: any;
    uniqueId: string;
    dataInputs: ISerializedFlowGraphConnection[];
    dataOutputs: ISerializedFlowGraphConnection[];
}

export interface ISerializedFlowGraphExecutionBlock extends ISerializedFlowGraphBlock {
    signalInputs: ISerializedFlowGraphConnection[];
    signalOutputs: ISerializedFlowGraphConnection[];
}
