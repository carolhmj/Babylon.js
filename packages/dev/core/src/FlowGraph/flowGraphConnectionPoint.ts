import type { Nullable } from "core/types";
import type { FlowGraphBlock } from "./flowGraphBlock";

/**
 * @experimental
 */
export enum FlowGraphConnectionPointDirection {
    Input = "input",
    Output = "output",
}

/**
 * @experimental
 */
export interface IFlowGraphConnectionPointConstructorParameters {
    name: string;
    ownerBlock: FlowGraphBlock;
    direction: FlowGraphConnectionPointDirection;
}
/**
 * @experimental
 */
export class FlowGraphConnectionPoint {
    private _connectedPoint: Nullable<FlowGraphConnectionPoint>;
    private _ownerBlock: FlowGraphBlock;
    private _name: string;
    private _direction: FlowGraphConnectionPointDirection;
    private _defaultValue?: any;

    public constructor(params: IFlowGraphConnectionPointConstructorParameters) {
        this._name = params.name;
        this._ownerBlock = params.ownerBlock;
        this._direction = params.direction;
    }

    public get name(): string {
        return this._name;
    }

    public setDefaultValue(value: any) {
        this._defaultValue = value;
    }

    public getValue(): any {
        if (this._direction === FlowGraphConnectionPointDirection.Input) {
            return this._connectedPoint?.getValue() ?? this._defaultValue;
        } else {
            if ((this._ownerBlock as any).getValue) {
                return (this._ownerBlock as any).getValue();
            }
            throw new Error("Cannot get value from non-data block");
        }
    }

    public connect(other: FlowGraphConnectionPoint) {
        this._connectedPoint = other;
    }

    public get ownerBlock(): FlowGraphBlock {
        return this._ownerBlock;
    }

    public get connectedPoint(): Nullable<FlowGraphConnectionPoint> {
        return this._connectedPoint;
    }
}
