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

    public createSuggestion(item: IPostcodeSuggestion): HTMLLIElement {
        let obj = super.createItem(item.streetNumberAndPremise + ", " + item.street + ", " + item.settlement + ", " + item.province, item.streetNumberAndPremise);
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

    public validate(param: number): void {
        let number = Tools.isValidNumber(this.Value);
        if (this.canvas.PostcodeMode) {
            let postcode = Tools.isValidPostcode(this.canvas.Postcode.Value);
            if (number && postcode) {
                let args = PostcodeArgs.buildComplete(this, this.onPostcodeComplete, postcode, number);
                args.param = param;
                Postcode.run(args);
            }
        } else {
            if (number && this.Status < DropDownStatus.Success && this.canvas.City.Status > DropDownStatus.Failure && this.canvas.Street.Status > DropDownStatus.Failure) {
                let args = PostcodeArgs.buildSuggest(this, this.onPostcodeSuggest, this.canvas.City.Value, this.canvas.Street.Value, number);
                args.param = param;
                Postcode.run(args);
            }
        }
    }

    public validateAsync(): void {
        let number = Tools.isValidNumber(this.Value);
        if (number && this.Status < DropDownStatus.Success) {
            let args = PostcodeArgs.buildSuggest(this, this.onPostcodeSuggest, this.canvas.City.Value, this.canvas.Street.Value, number);
            args.param = 2;
            Postcode.runAsync(args);
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
                Postcode.run(args);
            }
        } else {
            this.canvas.ResetStatus(true);
            this.validate(0);
        }
    }

    protected onPostcodeComplete(item: IPostcodeComplete | null, args: PostcodeArgs) {
        let dropdown = (args.object as NumberDropDown);
        if (item == null) {
            dropdown.Status = DropDownStatus.Failure;
        } else {
            dropdown.Status = DropDownStatus.Success;
            if (!args.param) {
                dropdown.canvas.ValidateItem(item, false);
            }
        }
    }

    protected onSelectedItem(element: HTMLLIElement) {
        this.clearDelayedFocusOut();
        let value = element.getAttribute("data-postcode");
        if (value && !this.range) {
            let args = PostcodeArgs.buildComplete(this, this.onPostcodeComplete, value, this.Value);
            Postcode.run(args);
        }
    }

}