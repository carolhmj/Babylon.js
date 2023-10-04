import { Matrix, Quaternion, TmpVectors, Vector3 } from "../../../../Maths/math.vector";
import { FlowGraphBinaryOperationBlock } from "../flowGraphBinaryOperationBlock";
import { RichTypeAny, RichTypeMatrix, RichTypeNumber, RichTypeQuaternion, RichTypeVector3 } from "../../../flowGraphRichTypes";
import { FlowGraphUnaryOperationBlock } from "../flowGraphUnaryOperationBlock";
import type { IFlowGraphBlockConfiguration } from "../../../flowGraphBlock";
import { FlowGraphBlock } from "../../../flowGraphBlock";
import type { FlowGraphDataConnection } from "../../../flowGraphDataConnection";
import type { FlowGraphContext } from "../../../flowGraphContext";
import type { TransformNode } from "../../../../Meshes/transformNode";
import { RegisterClass } from "../../../../Misc/typeStore";

/**
 * Adds two matrices together.
 * @experimental
 */
export class FlowGraphAddMatrixBlock extends FlowGraphBinaryOperationBlock<Matrix, Matrix, Matrix> {
    constructor(config: IFlowGraphBlockConfiguration = { name: "FlowGraphAddMatrixBlock" }) {
        super(config, RichTypeMatrix, RichTypeMatrix, RichTypeMatrix, (left, right) => left.add(right), "FlowGraphAddMatrixBlock");
    }
}
RegisterClass("FlowGraphAddMatrixBlock", FlowGraphAddMatrixBlock);

/**
 * Adds a matrix and a number together.
 * @experimental
 */
export class FlowGraphAddMatrixAndNumberBlock extends FlowGraphBinaryOperationBlock<Matrix, number, Matrix> {
    private _cachedArray: Float32Array = new Float32Array(16);
    private _cachedMatrix: Matrix = Matrix.Zero();
    constructor(config: IFlowGraphBlockConfiguration = { name: "FlowGraphAddMatrixAndNumberBlock" }) {
        super(
            config,
            RichTypeMatrix,
            RichTypeNumber,
            RichTypeMatrix,
            (left, right) => {
                for (let i = 0; i < left.m.length; i++) {
                    this._cachedArray[i] = left.m[i] + right;
                }
                return Matrix.FromArrayToRef(this._cachedArray, 0, this._cachedMatrix);
            },
            "FlowGraphAddMatrixAndNumberBlock"
        );
    }
}
RegisterClass("FlowGraphAddMatrixAndNumberBlock", FlowGraphAddMatrixAndNumberBlock);
/**
 * Subtracts two matrices.
 * @experimental
 */
export class FlowGraphSubtractMatrixBlock extends FlowGraphBinaryOperationBlock<Matrix, Matrix, Matrix> {
    private _cachedMatrix: Matrix = Matrix.Zero();
    constructor(config: IFlowGraphBlockConfiguration = { name: "FlowGraphSubtractMatrixBlock" }) {
        super(
            config,
            RichTypeMatrix,
            RichTypeMatrix,
            RichTypeMatrix,
            (left, right) => left.addToRef(right.scaleToRef(-1, TmpVectors.Matrix[0]), this._cachedMatrix),
            "FlowGraphSubtractMatrixBlock"
        );
    }
}
RegisterClass("FlowGraphSubtractMatrixBlock", FlowGraphSubtractMatrixBlock);
/**
 * Subtracts a matrix and a number together.
 * @experimental
 */
export class FlowGraphSubtractMatrixAndNumberBlock extends FlowGraphBinaryOperationBlock<Matrix, number, Matrix> {
    private _cachedArray: Float32Array = new Float32Array(16);
    private _cachedMatrix: Matrix = Matrix.Zero();
    constructor(config: IFlowGraphBlockConfiguration = { name: "FlowGraphSubtractMatrixAndNumberBlock" }) {
        super(
            config,
            RichTypeMatrix,
            RichTypeNumber,
            RichTypeMatrix,
            (left, right) => {
                for (let i = 0; i < left.m.length; i++) {
                    this._cachedArray[i] = left.m[i] - right;
                }
                return Matrix.FromArrayToRef(this._cachedArray, 0, this._cachedMatrix);
            },
            "FlowGraphSubtractMatrixAndNumberBlock"
        );
    }
}
RegisterClass("FlowGraphSubtractMatrixAndNumberBlock", FlowGraphSubtractMatrixAndNumberBlock);
/**
 * Multiplies two matrices together.
 * @experimental
 */
export class FlowGraphMultiplyMatrixBlock extends FlowGraphBinaryOperationBlock<Matrix, Matrix, Matrix> {
    private _cachedMatrix: Matrix = Matrix.Zero();
    constructor(config: IFlowGraphBlockConfiguration = { name: "FlowGraphMultiplyMatrixBlock" }) {
        super(config, RichTypeMatrix, RichTypeMatrix, RichTypeMatrix, (left, right) => left.multiplyToRef(right, this._cachedMatrix), "FlowGraphMultiplyMatrixBlock");
    }
}
RegisterClass("FlowGraphMultiplyMatrixBlock", FlowGraphMultiplyMatrixBlock);
/**
 * Divides two matrices.
 * @experimental
 */
export class FlowGraphDivideMatrixBlock extends FlowGraphBinaryOperationBlock<Matrix, Matrix, Matrix> {
    private _cachedResultMatrix: Matrix = Matrix.Zero();
    constructor(config: IFlowGraphBlockConfiguration = { name: "FlowGraphDivideMatrixBlock" }) {
        super(
            config,
            RichTypeMatrix,
            RichTypeMatrix,
            RichTypeMatrix,
            (left, right) => left.multiplyToRef(right.invertToRef(TmpVectors.Matrix[0]), this._cachedResultMatrix),
            "FlowGraphDivideMatrixBlock"
        );
    }
}
RegisterClass("FlowGraphDivideMatrixBlock", FlowGraphDivideMatrixBlock);
/**
 * Divides a matrix and a number together.
 * @experimental
 */
export class FlowGraphDivideMatrixAndNumberBlock extends FlowGraphBinaryOperationBlock<Matrix, number, Matrix> {
    private _cachedArray: Float32Array = new Float32Array(16);
    private _cachedMatrix: Matrix = Matrix.Zero();
    constructor(config: IFlowGraphBlockConfiguration = { name: "FlowGraphDivideMatrixAndNumberBlock" }) {
        super(
            config,
            RichTypeMatrix,
            RichTypeNumber,
            RichTypeMatrix,
            (left, right) => {
                for (let i = 0; i < left.m.length; i++) {
                    this._cachedArray[i] = left.m[i] / right;
                }
                return Matrix.FromArrayToRef(this._cachedArray, 0, this._cachedMatrix);
            },
            "FlowGraphDivideMatrixAndNumberBlock"
        );
    }
}
RegisterClass("FlowGraphDivideMatrixAndNumberBlock", FlowGraphDivideMatrixAndNumberBlock);
/**
 * Scales a matrix by a number.
 * @experimental
 */
export class FlowGraphScaleMatrixBlock extends FlowGraphBinaryOperationBlock<Matrix, number, Matrix> {
    private _cachedMatrix = Matrix.Zero();
    constructor(config: IFlowGraphBlockConfiguration = { name: "FlowGraphScaleMatrixBlock" }) {
        super(config, RichTypeMatrix, RichTypeNumber, RichTypeMatrix, (left, right) => left.scaleToRef(right, this._cachedMatrix), "FlowGraphScaleMatrixBlock");
    }
}
RegisterClass("FlowGraphScaleMatrixBlock", FlowGraphScaleMatrixBlock);
/**
 * Clamps each value in a matrix between a minimum and maximum value.
 * @experimental
 */
export class FlowGraphClampMatrixBlock extends FlowGraphBlock {
    /**
     * Input connection: The matrix to clamp.
     */
    public readonly input: FlowGraphDataConnection<Matrix>;
    /**
     * Output connection: The clamped matrix.
     */
    public readonly output: FlowGraphDataConnection<Matrix>;
    /**
     * Input connection: The minimum value.
     */
    public readonly min: FlowGraphDataConnection<number>;
    /**
     * Input connection: The maximum value.
     */
    public readonly max: FlowGraphDataConnection<number>;
    private _cachedArray: Float32Array = new Float32Array(16);
    private _cachedMatrix: Matrix = Matrix.Identity();
    constructor(config: IFlowGraphBlockConfiguration = { name: "FlowGraphClampMatrixBlock" }) {
        super(config);

        this.input = this._registerDataInput("input", RichTypeMatrix);
        this.min = this._registerDataInput("min", RichTypeNumber);
        this.max = this._registerDataInput("max", RichTypeNumber);
        this.output = this._registerDataOutput("output", RichTypeMatrix);
    }

    public _updateOutputs(_context: FlowGraphContext): void {
        const input = this.input.getValue(_context);
        const min = this.min.getValue(_context);
        const max = this.max.getValue(_context);

        for (let i = 0; i < input.m.length; i++) {
            this._cachedArray[i] = Math.min(Math.max(input.m[i], min), max);
        }

        Matrix.FromArrayToRef(this._cachedArray, 0, this._cachedMatrix);
        this.output.setValue(this._cachedMatrix, _context);
    }

    public getClassName(): string {
        return "FlowGraphClampMatrixBlock";
    }
}
RegisterClass("FlowGraphClampMatrixBlock", FlowGraphClampMatrixBlock);
/**
 * Decomposes a matrix into its translation, rotation and scale components.
 * @experimental
 */
export class FlowGraphDecomposeMatrixBlock extends FlowGraphBlock {
    /**
     * Input connection: The matrix to decompose.
     */
    public readonly input: FlowGraphDataConnection<Matrix>;
    /**
     * Output connection: The translation component of the matrix.
     */
    public readonly translation: FlowGraphDataConnection<Vector3>;
    /**
     * Output connection: The rotation component of the matrix.
     */
    public readonly rotation: FlowGraphDataConnection<Quaternion>;
    /**
     * Output connection: The scale component of the matrix.
     */
    public readonly scale: FlowGraphDataConnection<Vector3>;

    private _cachedTranslation = new Vector3();
    private _cachedRotation = new Quaternion();
    private _cachedScale = new Vector3();

    public constructor(config: IFlowGraphBlockConfiguration = { name: "FlowGraphDecomposeMatrixBlock" }) {
        super(config);

        this.input = this._registerDataInput("input", RichTypeMatrix);
        this.translation = this._registerDataOutput("translation", RichTypeVector3);
        this.rotation = this._registerDataOutput("rotation", RichTypeQuaternion);
        this.scale = this._registerDataOutput("scale", RichTypeVector3);
    }

    public _updateOutputs(_context: FlowGraphContext): void {
        const input = this.input.getValue(_context);

        input.decompose(this._cachedScale, this._cachedRotation, this._cachedTranslation);

        this.translation.setValue(this._cachedTranslation, _context);
        this.rotation.setValue(this._cachedRotation, _context);
        this.scale.setValue(this._cachedScale, _context);
    }

    public getClassName(): string {
        return "FlowGraphDecomposeMatrixBlock";
    }
}
RegisterClass("FlowGraphDecomposeMatrixBlock", FlowGraphDecomposeMatrixBlock);
/**
 * Decomposes a matrix into its translation, rotation and scale components.
 * @experimental
 */
export class FlowGraphComposeMatrixBlock extends FlowGraphBlock {
    /**
     * Output connection: The matrix to compose.
     */
    public readonly output: FlowGraphDataConnection<Matrix>;
    /**
     * Input connection: The translation component of the matrix.
     */
    public readonly translation: FlowGraphDataConnection<Vector3>;
    /**
     * Input connection: The rotation component of the matrix.
     */
    public readonly rotation: FlowGraphDataConnection<Quaternion>;
    /**
     * Input connection: The scale component of the matrix.
     */
    public readonly scale: FlowGraphDataConnection<Vector3>;

    private _cachedMatrix = new Matrix();

    public constructor(config: IFlowGraphBlockConfiguration = { name: "FlowGraphComposeMatrixBlock" }) {
        super(config);

        this.output = this._registerDataOutput("input", RichTypeMatrix);
        this.translation = this._registerDataInput("translation", RichTypeVector3);
        this.rotation = this._registerDataInput("rotation", RichTypeQuaternion);
        this.scale = this._registerDataInput("scale", RichTypeVector3);
    }

    public _updateOutputs(_context: FlowGraphContext): void {
        const translation = this.translation.getValue(_context);
        const rotation = this.rotation.getValue(_context);
        const scale = this.scale.getValue(_context);

        Matrix.ComposeToRef(scale, rotation, translation, this._cachedMatrix);

        this.output.setValue(this._cachedMatrix, _context);
    }

    public getClassName(): string {
        return "FlowGraphComposeMatrixBlock";
    }
}
RegisterClass("FlowGraphComposeMatrixBlock", FlowGraphComposeMatrixBlock);
/**
 * Converts a quaternion to a rotation matrix.
 * @experimental
 */
export class FlowGraphQuaternionToRotationMatrixBlock extends FlowGraphUnaryOperationBlock<Quaternion, Matrix> {
    private _cachedMatrix = new Matrix();
    constructor(config: IFlowGraphBlockConfiguration = { name: "FlowGraphQuaternionToRotationMatrixBlock" }) {
        super(config, RichTypeQuaternion, RichTypeMatrix, (value) => Matrix.FromQuaternionToRef(value, this._cachedMatrix), "FlowGraphQuaternionToRotationMatrixBlock");
    }
}
RegisterClass("FlowGraphQuaternionToRotationMatrixBlock", FlowGraphQuaternionToRotationMatrixBlock);
/**
 * Given the Transform Nodes A and B, gives the matrix required
 * to transform coordinates from A's local space to B's local space.
 */
export class FlowGraphGetTransformationMatrixBlock extends FlowGraphBinaryOperationBlock<TransformNode, TransformNode, Matrix> {
    private _cachedResult: Matrix = Matrix.Zero();
    constructor(config: IFlowGraphBlockConfiguration = { name: "FlowGraphGetTransformationMatrixBlock" }) {
        super(
            config,
            RichTypeAny,
            RichTypeAny,
            RichTypeMatrix,
            (left: TransformNode, right: TransformNode) => {
                const aMatrix = left.getWorldMatrix();
                const bMatrix = right.getWorldMatrix();

                const inverseB = bMatrix.invertToRef(TmpVectors.Matrix[0]);
                const result = inverseB.multiplyToRef(aMatrix, this._cachedResult);
                return result;
            },
            "FlowGraphGetTransformationMatrixBlock"
        );
    }
}
RegisterClass("FlowGraphGetTransformationMatrixBlock", FlowGraphGetTransformationMatrixBlock);
