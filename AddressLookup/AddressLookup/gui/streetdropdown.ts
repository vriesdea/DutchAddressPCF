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
        let obj = super.createItem(item.street + ", " + item.settlement, item.street);
        return obj;
    }

    public filterSuggestions(items: IPostcodeSuggestion[]): IPostcodeSuggestion[] {
        return items.filter((item, index, self) => self.findIndex(found => (found.settlement === item.settlement && found.street === item.street)) === index);
    }

    public validate(param: number): void {
        if (this.Value.length > 0 && this.canvas.City.Status > DropDownStatus.Failure && this.Status < DropDownStatus.Success) {
            let args = PostcodeArgs.buildSuggest(this, this.onPostcodeSuggest, this.canvas.City.Value, this.Value, null);
            args.param = param;
            Postcode.run(args);
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