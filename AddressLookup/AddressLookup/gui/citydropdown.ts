import { Canvas } from "./canvas";
import { DropDownStatus } from "./dropdown";
import { Postcode, PostcodeArgs, IPostcodeSuggestion } from "../postcode";
import { SuggestionDropDown } from "./suggestiondropdown";

export class CityDropDown extends SuggestionDropDown {

    //static duplicates1: RegExp = /^(baarlo|beek|hoogeveen|naaldwijk|oudega|scharwoude|serooskerke|valkenisse)($| \()/i
    //static duplicates2: RegExp = /^(aalst|achttienhoven|alphen|bergen|beuningen|buren|elst|emmen|geesteren|hengelo|heusden|katwijk|kessel|laren|loenen|middelburg|nieuwland|noordwolde|oosterhout|oosterland|oosterwolde|oostrum|rijswijk|scherpenzeel|sloten|stein|tienhoven|valkenburg|vledderveen|velp|winsum|zevenhuizen|zuidbroek|zuidwolde|zwolle)($| \()/i;

    private canvas: Canvas;

    public constructor(owner: Canvas) {
        super(owner.Div);
        this.canvas = owner;
        this.Input.placeholder = "plaatsnaam";
    }

    public createSuggestion(item: IPostcodeSuggestion): HTMLLIElement {
        let settlement = item.officialSettlement + (item.officialSettlement == item.municipality ? "" : " (" + item.municipality + ")");
        return super.createItem(settlement + ", " + item.province, item.officialSettlement);
    }

    public validate(param: number): void {
        if (this.Value.length > 1 && this.Status < DropDownStatus.Success) {
            let args = PostcodeArgs.buildSuggest(this, this.onPostcodeSuggest, this.Value);
            args.param = param;
            Postcode.run(args);
        }
    }
    public validateAsync(): void {
        if (this.Value.length > 1 && this.Status < DropDownStatus.Success) {
            let args = PostcodeArgs.buildSuggest(this, this.onPostcodeSuggest, this.Value);
            args.param = 2;
            Postcode.runAsync(args);
        }
    }

    public validateSuggestion(item: IPostcodeSuggestion): boolean {
        return this.validateValue(item.settlement);
    }

    protected onInput(event: Event) {
        super.onInput(event);
        this.canvas.PostcodeMode = false;
        this.canvas.ResetStatus(true, true, true, true);
        //if (this.Value.length > 7) {
            //if (this.Value.match(/den haag/i)) {
                //this.Value = "'s-Gravenhage";
            //} else if (this.Value.match(/den bosch/i)) {
                //this.Value = "'s-Hertogenbosch";
            //}
        //}
        this.validate(0);
    }

    protected onSelectedItem(element: HTMLLIElement): void {
        this.Status = DropDownStatus.Success;
        this.canvas.Street.setFocus();
    }

}