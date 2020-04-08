import {IInputs, IOutputs} from "./generated/ManifestTypes";
import { Canvas } from "./gui/canvas";
import { PremiseOptions, RangeOptions, Tools } from "./tools";

export class AddressLookup implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private canvas: Canvas;
	private context: ComponentFramework.Context<IInputs>;
	private notify: () => void;

	constructor() { }

	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
		this.context = context;
		this.notify = notifyOutputChanged;
		this.canvas = new Canvas(container);
		this.canvas.Ready.Clicked = notifyOutputChanged;
		this.validate();
	}

	public updateView(context: ComponentFramework.Context<IInputs>): void {
		this.context = context;
	}

	public getOutputs(): IOutputs {
		let number = Tools.outputNumber(this.canvas.Number.Value, this.canvas.PremiseOption);
		let numberTo = Tools.outputNumber(this.canvas.NumberTo.Value, this.canvas.PremiseOption);
		return {
			CityProperty: this.canvas.City.Value,
			LatitudeProperty: this.canvas.Latitude,
			LongitudeProperty: this.canvas.Longitude,
			NumberProperty: number[0],
			NumberToProperty: numberTo[0],
			PostcodeProperty: Tools.outputPostcode(this.canvas.Postcode.Value),
			PremiseProperty: number[1],
			PremiseToProperty: numberTo[1],
			StreetProperty: this.canvas.Street.Value
		};
	}

	public destroy(): void { }

	private parseProperty(raw: string | null): string | null {
		if (raw && raw != "val") {
			return raw;
		} else {
			return "";
        }
    }

	private validate(): void {
		switch (this.context.parameters.PremiseOption.raw) {
			case "Combined": this.canvas.PremiseOption = PremiseOptions.Combined; break;
			default: this.canvas.PremiseOption = PremiseOptions.Separated; break;
		};
		switch (this.context.parameters.RangeOption.raw) {
			case "Range": this.canvas.RangeOption = RangeOptions.Range; break;
			default: this.canvas.RangeOption = RangeOptions.Simple; break;
		};
		this.canvas.NumberTo.Visible = (this.canvas.RangeOption == RangeOptions.Range);

		this.canvas.SetCity(this.parseProperty(this.context.parameters.CityProperty.raw));
		this.canvas.SetNumber(Tools.formatNumber(this.parseProperty(this.context.parameters.NumberProperty.raw), this.parseProperty(this.context.parameters.PremiseProperty.raw)));
		this.canvas.SetNumberTo(Tools.formatNumber(this.parseProperty(this.context.parameters.NumberToProperty.raw), this.parseProperty(this.context.parameters.PremiseToProperty.raw)));
		this.canvas.SetPostcode(Tools.isValidPostcode(this.parseProperty(this.context.parameters.PostcodeProperty.raw)));
		this.canvas.SetStreet(this.parseProperty(this.context.parameters.StreetProperty.raw));
		this.canvas.Validate();
    }

}