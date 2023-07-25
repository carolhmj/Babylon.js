import type { EventCallback } from "./types";

export interface IEventBlock {
    start(eventCallback: EventCallback): void;
}
