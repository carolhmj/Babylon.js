import type { AbstractMesh } from "core/Meshes";
import type { IEventBlock } from "../../iEventBlock";
import { FlowGraphBlock } from "../../flowGraphBlock";
import { FlowGraphConnectionPoint, FlowGraphConnectionPointDirection } from "../../flowGraphConnectionPoint";
import type { EventCallback } from "core/FlowGraph/types";
import type { MeshPickEventCoordinator } from "./meshPickEventCoordinator";

export interface IMeshPickEventBlockParameters {
    mesh: AbstractMesh;
    eventCoordinator: MeshPickEventCoordinator;
}

export class MeshPickEventGraphBlock extends FlowGraphBlock implements IEventBlock {
    private _mesh: AbstractMesh;
    private _eventCoordinator: MeshPickEventCoordinator;
    constructor(params: IMeshPickEventBlockParameters) {
        super({ name: "MeshPickEvent" });
        this._mesh = params.mesh;
        this._eventCoordinator = params.eventCoordinator;
        this._outputs = [new FlowGraphConnectionPoint({ name: "flowOut", ownerBlock: this, direction: FlowGraphConnectionPointDirection.Output })];
    }

    start(eventCallback: EventCallback): void {
        this._eventCoordinator.addCallback(this._mesh.uniqueId, () => {
            const flowOutput = this._findOutputByName("flowOut")!;
            eventCallback({ activatedConnection: flowOutput });
        });
    }
}
