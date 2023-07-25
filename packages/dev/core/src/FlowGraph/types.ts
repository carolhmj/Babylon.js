import type { FlowGraphConnectionPoint } from "./flowGraphConnectionPoint";

export interface EventCallbackParams {
    activatedConnection: FlowGraphConnectionPoint;
}
export type EventCallback = (params: EventCallbackParams) => void;
