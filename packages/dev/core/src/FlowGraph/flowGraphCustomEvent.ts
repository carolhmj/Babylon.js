/**
 * @experimental
 * Defines the type of data sent in a custom event
 */
export interface IFlowGraphCustomEventData {
    /**
     * The id of the data
     */
    id: string;
    /**
     * The type of the data
     */
    type: string;
    /**
     * The description of the data
     */
    description: string;
}

/**
 * @experimental
 * Defines a custom event sent by the flow graph
 */
export interface IFlowGraphCustomEvent {
    /**
     * The id of the event
     */
    eventId: string;
    /**
     * The data sent in the event
     */
    eventData: IFlowGraphCustomEventData[];
}
