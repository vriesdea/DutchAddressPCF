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

    protected onFocusOut(event: FocusEvent) {
        super.onFocusOut(event);
        this.validate(2);
    }

    protected onPostcodeSuggest(items: IPostcodeSuggestion[] | null, args: PostcodeArgs) {
        let dropdown = (args.object as SuggestionDropDown);
        if (args.param) {
            let found: boolean = false;
            if (items) {
                for (let item of items) {
                    if (dropdown.validateSuggestion(item)) {
                        if (args.param == 2) {
                            dropdown.selectItem(dropdown.createSuggestion(item));
                        }
                        found = true;
                        break;
                    }
                }
            if (!found)
                dropdown.Status = DropDownStatus.Failure;
            }
        } else {
            if (items == null) {
                dropdown.Status = DropDownStatus.Failure;
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
            }
        }
    }


}