import { RichTypeAny, RichTypeString } from "core/FlowGraph/flowGraphRichTypes";
import type { FlowGraphDataConnection } from "../../flowGraphDataConnection";
import { FlowGraphWithOnDoneExecutionBlock } from "../../flowGraphWithOnDoneExecutionBlock";
import type { FlowGraphContext } from "../../flowGraphContext";
import { RegisterClass } from "../../../Misc/typeStore";
import type { IFlowGraphBlockConfiguration } from "../../flowGraphBlock";

export interface IFlowGraphSendCustomEventBlockConfiguration extends IFlowGraphBlockConfiguration {
    id: string;
    values: {
        id: string;
    }[];
}

/**
 * @experimental
 */
export class FlowGraphSendCustomEventBlock extends FlowGraphWithOnDoneExecutionBlock {
    private _eventId: string;
    public eventDatas: FlowGraphDataConnection<any>[];

    public constructor(config: IFlowGraphSendCustomEventBlockConfiguration) {
        super(config);
        this._eventId = config.id;
    }

    public configure() {
        super.configure();
        const config = this.config as IFlowGraphSendCustomEventBlockConfiguration;
        this.eventDatas = [];
        this.eventDatas = config.values.map((value) => {
            return this._registerDataInput(value.id, RichTypeAny);
        });
    }

    public _execute(context: FlowGraphContext): void {
        const eventId = this._eventId;
        const eventDatas = this.eventDatas.map((eventData) => {
            return eventData.getValue(context);
        });

        context.configuration.eventCoordinator.notifyCustomEvent(eventId, eventDatas);

        this.onDone._activateSignal(context);
    }

    public getClassName(): string {
        return "FGSendCustomEventBlock";
    }
}
RegisterClass("FGSendCustomEventBlock", FlowGraphSendCustomEventBlock);
