import { DropDownBase, DropDownStatus } from "./dropdown";
import { PostcodeArgs, IPostcodeSuggestion } from "../postcode";

export abstract class SuggestionDropDown extends DropDownBase {

    public abstract addSuggestion(item: IPostcodeSuggestion): HTMLLIElement;

    public filterSuggestions(items: IPostcodeSuggestion[]): IPostcodeSuggestion[] {
        return items; // unfiltered
    }

    public abstract validate(compare: boolean): void;

    public abstract validateSuggestion(item: IPostcodeSuggestion): boolean;

    protected onFocusIn(event: FocusEvent) {
        super.onFocusIn(event);
        this.validate(true);
    }

    protected onFocusOut(event: FocusEvent) {
        super.onFocusOut(event);
        this.validate(true);
    }

    protected onPostcodeSuggest(items: IPostcodeSuggestion[] | null, args: PostcodeArgs) {
        let dropdown = (args.object as SuggestionDropDown);
        if (args.compare) {
            if (items) {
                for (let item of items) {
                    if (dropdown.validateSuggestion(item)) {
                        break;
                    }
                }
            }
        } else {
            if (items == null) {
                dropdown.Status = DropDownStatus.Failure;
            } else {
                let filter = dropdown.filterSuggestions(items);
                let obj: HTMLLIElement | null = null;
                for (let item of filter) {
                    obj = dropdown.addSuggestion(item);
                }
                if (obj != null && filter.length == 1 && dropdown.validateSuggestion(filter[0])) {
                    dropdown.selectItem(obj);
                } else {
                    dropdown.showList();
                }
            }
        }
    }


}