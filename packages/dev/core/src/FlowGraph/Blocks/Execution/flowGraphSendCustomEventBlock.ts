import { RichTypeAny } from "core/FlowGraph/flowGraphRichTypes";
import { FlowGraphExecutionBlockWithOutSignal } from "../../flowGraphWithOnDoneExecutionBlock";
import type { FlowGraphContext } from "../../flowGraphContext";
import { RegisterClass } from "../../../Misc/typeStore";
import type { IFlowGraphCustomEvent } from "../../flowGraphCustomEvent";
import { _checkEventDataTypes } from "core/FlowGraph/utils";

/**
 * @experimental
 */
export class FlowGraphSendCustomEventBlock extends FlowGraphExecutionBlockWithOutSignal {
    public constructor(public config: IFlowGraphCustomEvent) {
        super(config);
        for (let i = 0; i < this.config.eventData.length; i++) {
            const eventData = this.config.eventData[i];
            this.registerDataInput(eventData.id, RichTypeAny);
        }
    }

    public _execute(context: FlowGraphContext): void {
        const eventId = this.config.eventId;
        const eventDatas = this.dataInputs.map((port) => port.getValue(context));
        // Check types of eventDatas
        _checkEventDataTypes(eventDatas, this.config);

        context.configuration.coordinator.notifyCustomEvent(eventId, eventDatas);

        this.out._activateSignal(context);
    }

    public getClassName(): string {
        return FlowGraphSendCustomEventBlock.ClassName;
    }

    public serialize(serializationObject?: any): void {
        super.serialize(serializationObject);
        serializationObject.config.eventId = this.config.eventId;
        serializationObject.config.eventData = this.config.eventData;
    }

    public static ClassName = "FGSendCustomEventBlock";
}
RegisterClass("FGSendCustomEventBlock", FlowGraphSendCustomEventBlock);
