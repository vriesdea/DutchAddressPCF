import { DropDownBase, DropDownStatus } from "./dropdown";
import { PostcodeArgs, IPostcodeSuggestion } from "../postcode";

export abstract class SuggestionDropDown extends DropDownBase {

    public abstract createSuggestion(item: IPostcodeSuggestion): HTMLLIElement;

    public filterSuggestions(items: IPostcodeSuggestion[]): IPostcodeSuggestion[] {
        return items; // unfiltered
    }

    public abstract validate(param: number): void;

    public abstract validateSuggestion(item: IPostcodeSuggestion): boolean;

    protected onFocusIn(event: FocusEvent) {
        super.onFocusIn(event);
        this.validate(1);
    }

    private delayedFocusOut: NodeJS.Timeout | null;

    protected clearDelayedFocusOut() {
        if (this.delayedFocusOut != null) {
            clearTimeout(this.delayedFocusOut);
            this.delayedFocusOut = null;
        }
    }

    protected onFocusOut(event: FocusEvent) {
        var that = this;
        super.onFocusOut(event);
        this.delayedFocusOut = setTimeout(function () {
            that.delayedFocusOut = null;
            that.validate(2);
        }, 250);
    }

    protected onPostcodeSuggest(items: IPostcodeSuggestion[] | null, args: PostcodeArgs) {
        let dropdown = (args.object as SuggestionDropDown);
        let found: boolean = false;
        if (items) {
            if (args.param) {
                for (let item of items) {
                    if (dropdown.validateSuggestion(item)) {
                        found = true;
                        if (args.param == 2) {
                            dropdown.selectItem(dropdown.createSuggestion(item));
                        }
                        break;
                    }
                }
            } else {
                let filter = dropdown.filterSuggestions(items);
                let obj: HTMLLIElement | null = null;
                dropdown.clearList();
                for (let item of filter) {
                    obj = dropdown.addItem(dropdown.createSuggestion(item));
                }
                if (obj != null && filter.length == 1 && dropdown.validateSuggestion(filter[0])) {
                    dropdown.selectItem(obj);
                } else {
                    dropdown.showList();
                }
                found = true;
            }
        }
        if (!found) {
            dropdown.Status = DropDownStatus.Failure;
        }
    }

}