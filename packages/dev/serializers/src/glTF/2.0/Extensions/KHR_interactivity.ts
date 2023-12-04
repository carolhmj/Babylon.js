import { _Exporter } from "../glTFExporter";
import type { IGLTFExporterExtensionV2 } from "../glTFExporterExtension";

const NAME = "KHR_interactivity";

export class KHR_interactivity implements IGLTFExporterExtensionV2 {
    public readonly name = NAME;
    public enabled = true;
    public required = false;
    private _exporter: _Exporter;

    constructor(exporter: _Exporter) {
        this._exporter = exporter;
    }

    public dispose() {}

    public get wasUsed() {
        return this._exporter.options.flowGraphOptions !== undefined;
    }
}

_Exporter.RegisterExtension(NAME, (exporter) => new KHR_interactivity(exporter));
