import type { Observer } from "../../../Misc/observable";
import type { FlowGraphContext } from "../../flowGraphContext";
import { FlowGraphEventBlock } from "../../flowGraphEventBlock";
import type { Nullable } from "../../../types";
import { Tools } from "../../../Misc/tools";
import { RichTypeAny } from "../../flowGraphRichTypes";
import { RegisterClass } from "../../../Misc/typeStore";
import type { IFlowGraphCustomEvent } from "../../flowGraphCustomEvent";
import { _checkEventDataTypes } from "core/FlowGraph/utils";

/**
 * @experimental
 * A block that receives a custom event. It saves the data sent in the eventData output.
 */
export class FlowGraphReceiveCustomEventBlock extends FlowGraphEventBlock {
    constructor(public config: IFlowGraphCustomEvent) {
        super(config);
        for (let i = 0; i < this.config.eventData.length; i++) {
            const eventData = this.config.eventData[i];
            this.registerDataOutput(eventData.id, RichTypeAny);
        }
    }

    public _preparePendingTasks(context: FlowGraphContext): void {
        const observable = context.configuration.coordinator.getCustomEventObservable(this.config.eventId);
        if (!context._getExecutionVariable(this, "eventObserver")) {
            const eventObserver = observable.add((eventDatas: any[]) => {
                // Check types of data
                _checkEventDataTypes(eventDatas, this.config);
                for (let i = 0; i < eventDatas.length; i++) {
                    this.dataOutputs[i].setValue(eventDatas[i], context);
                }
                this._execute(context);
            });
            context._setExecutionVariable(this, "eventObserver", eventObserver);
        }
    }
    public _cancelPendingTasks(context: FlowGraphContext): void {
        const observable = context.configuration.coordinator.getCustomEventObservable(this.config.eventId);
        const observer = context._getExecutionVariable(this, "eventObserver") as Nullable<Observer<any[]>>;
        if (observable) {
            observable.remove(observer);
        } else {
            Tools.Warn(`FlowGraphReceiveCustomEventBlock: Missing observable for event ${this.config.eventId}`);
        }
    }

    public getClassName(): string {
        return FlowGraphReceiveCustomEventBlock.ClassName;
    }

    public static ClassName = "FGReceiveCustomEventBlock";

    public serialize(serializationObject?: any): void {
        super.serialize(serializationObject);
        serializationObject.eventId = this.config.eventId;
        serializationObject.eventData = this.config.eventData;
    }
}
RegisterClass(FlowGraphReceiveCustomEventBlock.ClassName, FlowGraphReceiveCustomEventBlock);
