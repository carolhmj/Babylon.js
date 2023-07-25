/**
 * @experimental
 * The event coordinator should listen to scene events and trigger the event blocks.
 * An event can have multiple listeners.
 */
export abstract class EventCoordinator {
    public abstract start(): void;
}
