import type { EventCoordinator } from "./eventCoordinator";
import type { EventCallback } from "./types";

export interface IEventBlock {
    eventCoordinator?: EventCoordinator;
    start(eventCallback: EventCallback): void;
}
