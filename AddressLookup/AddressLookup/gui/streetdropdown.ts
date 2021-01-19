import { Canvas } from "./canvas";
import { DropDownStatus } from "./dropdown";
import { Postcode, PostcodeArgs, IPostcodeSuggestion } from "../postcode";
import { SuggestionDropDown } from "./suggestiondropdown";

export class StreetDropDown extends SuggestionDropDown {

    private canvas: Canvas;

    constructor(owner: Canvas) {
        super(owner.Div);
        this.canvas = owner;
        this.Input.placeholder = "straatnaam";
    }

    public createSuggestion(item: IPostcodeSuggestion): HTMLLIElement {
        let settlement = item.settlement + (item.settlement == item.municipality ? "" : " (" + item.municipality + ")");
        let obj = super.createItem(item.street + ", " + settlement + ", " + item.province, item.street);
        return obj;
    }

    public filterSuggestions(items: IPostcodeSuggestion[]): IPostcodeSuggestion[] {
        return items.filter((item, index, self) => self.findIndex(found => (found.settlement === item.settlement && found.street === item.street)) === index);
    }

    public validate(param: number): void {
        if (this.Value.length > 0 && this.Status < DropDownStatus.Success && this.canvas.City.Status > DropDownStatus.Failure) {
            let args = PostcodeArgs.buildSuggest(this, this.onPostcodeSuggest, this.canvas.City.Value, this.Value, null);
            args.param = param;
            Postcode.run(args);
        }
    }

    public validateAsync(): void {
        if (this.Value.length > 0 && this.Status < DropDownStatus.Success) {
            let args = PostcodeArgs.buildSuggest(this, this.onPostcodeSuggest, this.canvas.City.Value, this.Value, null);
            args.param = 2;
            Postcode.runAsync(args);
        }
    }

    public validateSuggestion(item: IPostcodeSuggestion): boolean {
        return this.validateValue(item.street);
    }

    protected onInput(event: Event) {
        super.onInput(event);
        this.canvas.PostcodeMode = false;
        this.canvas.ResetStatus(true, true, false, true);
        this.validate(0);
    }

    protected onSelectedItem(element: HTMLLIElement) {
        this.Status = DropDownStatus.Success;
        this.canvas.Number.setFocus();
    }

}