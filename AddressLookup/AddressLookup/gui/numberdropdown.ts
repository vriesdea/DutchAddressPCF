import { Canvas } from "./canvas";
import { DropDownStatus } from "./dropdown";
import { Postcode, PostcodeArgs, IPostcodeComplete, IPostcodeSuggestion } from "../postcode";
import { SuggestionDropDown } from "./suggestiondropdown";
import { Tools, RangeOptions } from "../tools";

export class NumberDropDown extends SuggestionDropDown {

    private canvas: Canvas;
    private range: boolean | null;

    constructor(owner: Canvas) {
        super(owner.Div);
        this.canvas = owner;
    }

    public addSuggestion(item: IPostcodeSuggestion): HTMLLIElement {
        let obj = this.addItem(item.streetNumberAndPremise + ", " + item.street + ", " + item.settlement, item.streetNumberAndPremise);
        obj.setAttribute("data-postcode", item.postalCode);
        return obj;
    }

    public compare(value: string): boolean {
        let str1 = this.Value.toUpperCase().replace(/[^A-Z0-9]/, "");
        let str2 = value.toUpperCase().replace(/[^A-Z0-9]/, "");
        return str1 === str2;
    }

    public setRange(value: boolean | null, visible: boolean = true) {
        this.range = value;
        if (value === false) {
            this.Input.placeholder = "vanaf nummer";
        } else if (value === true) {
            this.Input.placeholder = "tot en met nummer";
        } else {
            this.Input.placeholder = "nummer";
        }
        this.Visible = visible;
    }

    public validate(compare: boolean): void {
        if (this.canvas.PostcodeMode) {
            let valid = Tools.isValidPostcode(this.canvas.Postcode.Value);
            if (this.Value.length > 0 && valid) {
                let args = PostcodeArgs.buildComplete(this, this.onPostcodeComplete, valid, this.Value);
                args.compare = compare;
                Postcode.run(args);
            }
        } else {
            if (this.Value.length > 0 && this.canvas.City.Status > DropDownStatus.Failure && this.canvas.Street.Status > DropDownStatus.Failure && this.Status < DropDownStatus.Success) {
                let args = PostcodeArgs.buildSuggest(this, this.onPostcodeSuggest, this.canvas.City.Value, this.canvas.Street.Value, this.Value);
                args.compare = compare;
                Postcode.run(args);
            }
        }
    }

    public validateSuggestion(item: IPostcodeSuggestion): boolean {
        return this.validateValue(item.streetNumberAndPremise);
    }

    protected onInput(event: Event) {
        super.onInput(event);
        if (this.range === true) { // this is NumberTo
            this.Status = DropDownStatus.Neutral;
            if (this.Value.length > 0 && this.canvas.Postcode.Status > DropDownStatus.Failure && this.canvas.Number.Status > DropDownStatus.Failure) {
                let args = PostcodeArgs.buildSuggest(this, this.onPostcodeSuggest, this.canvas.City.Value, this.canvas.Street.Value, this.Value);
                args.compare = true;
                Postcode.run(args);
            }
        } else {
            this.canvas.ResetStatus(true);
            if (this.canvas.PostcodeMode) {
                this.validate(false);
            } else {
                this.validate(true);
            }
        }
    }
    protected onPostcodeComplete(item: IPostcodeComplete | null, args: PostcodeArgs) {
        let dropdown = (args.object as NumberDropDown);
        if (item == null) {
            dropdown.Status = DropDownStatus.Failure;
        } else {
            dropdown.Status = DropDownStatus.Success;
            if (!args.compare) {
                dropdown.canvas.ValidateItem(item, false);
            }
        }
    }

    protected onSelectedItem(element: HTMLLIElement) {
        let value = element.getAttribute("data-postcode");
        if (value) {
            let args = PostcodeArgs.buildComplete(this, this.onPostcodeComplete, value, this.Value);
            args.compare = (this.range === true);
            Postcode.run(args);
        }
    }

}