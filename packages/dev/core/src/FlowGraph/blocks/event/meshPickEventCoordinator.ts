import { EventCoordinator } from "../../eventCoordinator";
import type { PointerInfo } from "../../../Events/pointerEvents";
import { PointerEventTypes } from "../../../Events/pointerEvents";
import type { Scene } from "../../../scene";
/**
 * @experimental
 * the mesh pick event coordinator listen to all mesh pick events
 * one mesh can be listened by multiple event blocks
 */
export class MeshPickEventCoordinator extends EventCoordinator {
    private _scene: Scene;
    private _meshUidToCallbackMap: Map<number, (() => void)[]> = new Map();

    constructor(scene: Scene) {
        super();
        this._scene = scene;
    }

    public addCallback(meshUid: number, callback: () => void) {
        if (!this._meshUidToCallbackMap.has(meshUid)) {
            this._meshUidToCallbackMap.set(meshUid, []);
        }
        this._meshUidToCallbackMap.get(meshUid)?.push(callback);
    }

    public removeCallback(meshUid: number, callback: () => void) {
        const callbacks = this._meshUidToCallbackMap.get(meshUid);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index !== -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    public start() {
        this._scene.onPointerObservable.add((pointerInfo: PointerInfo) => {
            if (pointerInfo.type !== PointerEventTypes.POINTERPICK || !pointerInfo.pickInfo?.hit) {
                return;
            }
            const pickInfo = pointerInfo.pickInfo;
            const meshUid = pickInfo.pickedMesh?.uniqueId!;
            const callbacks = this._meshUidToCallbackMap.get(meshUid);
            if (callbacks) {
                for (const callback of callbacks) {
                    callback();
                }
            }
        });
    }
}
