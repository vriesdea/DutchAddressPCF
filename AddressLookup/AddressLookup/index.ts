import {IInputs, IOutputs} from "./generated/ManifestTypes";
import { Canvas } from "./gui/canvas";
import { PremiseOptions, RangeOptions, Tools } from "./tools";

export class AddressLookup implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private canvas: Canvas;
	private context: ComponentFramework.Context<IInputs>;
	private notify: () => void;

	constructor() { }

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
		this.context = context;
		this.notify = notifyOutputChanged;
		this.canvas = new Canvas(container);
		this.canvas.Ready.Clicked = notifyOutputChanged;
		this.validate();
	}

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		// Add code to update control view
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs {
		let number = Tools.outputNumber(this.canvas.Number.Value, this.canvas.PremiseOption);
		let numberTo = Tools.outputNumber(this.canvas.NumberTo.Value, this.canvas.PremiseOption);
		return {
			CityProperty: this.canvas.City.Value,
			NumberProperty: number[0],
			NumberToProperty: numberTo[0],
			PostcodeProperty: Tools.outputPostcode(this.canvas.Postcode.Value),
			PremiseProperty: number[1],
			PremiseToProperty: numberTo[1],
			StreetProperty: this.canvas.Street.Value
		};
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void {
		// Add code to cleanup control if necessary
	}

	private parse(raw: string | null): string | null {
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

		this.canvas.SetCity(this.parse(this.context.parameters.CityProperty.raw));
		this.canvas.SetNumber(Tools.formatNumber(this.parse(this.context.parameters.NumberProperty.raw), this.parse(this.context.parameters.PremiseProperty.raw)));
		this.canvas.SetNumberTo(Tools.formatNumber(this.parse(this.context.parameters.NumberToProperty.raw), this.parse(this.context.parameters.PremiseToProperty.raw)));
		this.canvas.SetPostcode(Tools.isValidPostcode(this.parse(this.context.parameters.PostcodeProperty.raw)));
		this.canvas.SetStreet(this.parse(this.context.parameters.StreetProperty.raw));
		this.canvas.Validate();
    }

}