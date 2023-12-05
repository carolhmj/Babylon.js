import type { Node } from "../node";
import type { IFlowGraphCustomEvent } from "./flowGraphCustomEvent";

/**
 * @internal
 * Returns if mesh1 is a descendant of mesh2
 * @param mesh1
 * @param mesh2
 * @returns
 */
export function _isADescendantOf(mesh1: Node, mesh2: Node): boolean {
    return !!(mesh1.parent && (mesh1.parent === mesh2 || _isADescendantOf(mesh1.parent, mesh2)));
}

/**
 * @internal
 * Checks if the existing event data matches the expected types
 * @param dataList
 * @param event
 */
export function _checkEventDataTypes(dataList: any[], event: IFlowGraphCustomEvent) {
    for (let i = 0; i < dataList.length; i++) {
        const eventData = dataList[i];
        const expectedType = event.eventData[i].type;
        const type = eventData.getClassName ? eventData.getClassName() : typeof eventData;
        if (type !== expectedType) {
            throw new Error(`Event data type mismatch. Expected ${expectedType}, got ${typeof eventData} for event ${event.eventId}`);
        }
    }
}
