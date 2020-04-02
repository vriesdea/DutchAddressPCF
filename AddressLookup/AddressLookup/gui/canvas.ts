import { CityDropDown } from "./citydropdown";
import { NumberDropDown } from "./numberdropdown";
import { StreetDropDown } from "./streetdropdown";
import { PostcodeDropDown } from "./postcodedropdown";
import { DropDownStatus } from "./dropdown";
import { ReadyButton } from "./readybutton";
import { Postcode, PostcodeArgs, IPostcodeComplete } from "../postcode";
import { PremiseOptions, RangeOptions, Tools } from "../tools";

export class Canvas {

    private detail: HTMLDivElement;
    private owner: HTMLElement;

    constructor(owner: HTMLElement) {
        this.detail = document.createElement("div");
        this.detail.className = "canvas-detail";
        this.div = document.createElement("div");
        this.div.className = "canvas";
        this.owner = owner;
        this.owner.appendChild(this.div);
        this.city = new CityDropDown(this);
        this.street = new StreetDropDown(this);
        this.number = new NumberDropDown(this);
        this.numberTo = new NumberDropDown(this);
        this.postcode = new PostcodeDropDown(this);
        this.ready = new ReadyButton(this);
        this.owner.appendChild(this.detail);
    }

    private city: CityDropDown;
    public get City() { return this.city; }

    private div: HTMLDivElement;
    public get Div() { return this.div; }

    private number: NumberDropDown;
    public get Number() { return this.number; }

    private numberTo: NumberDropDown;
    public get NumberTo() { return this.numberTo; }

    private postcode: PostcodeDropDown;
    public get Postcode() { return this.postcode; }

    public PostcodeMode: boolean;

    public PremiseOption: PremiseOptions;

    private rangeOption: RangeOptions;
    public get RangeOption(): RangeOptions {
        return this.rangeOption;
    }
    public set RangeOption(value: RangeOptions) {
        this.rangeOption = value;
        if (value == RangeOptions.Range) {
            this.number.setRange(false);
            this.numberTo.setRange(true);
        } else {
            this.number.setRange(null);
            this.numberTo.setRange(null, false);
        }
    }

    private ready: ReadyButton;
    public get Ready() { return this.ready; }

    private street: StreetDropDown;
    public get Street() { return this.street; }

    public ResetStatus(number: boolean = false, street: boolean = false, city: boolean = false, postcode: boolean = false): void {
        this.SetDetail();
        if (city) {
            this.city.clearList();
            this.city.Status = DropDownStatus.Neutral;
        }
        if (street) {
            this.street.clearList();
            this.street.Status = DropDownStatus.Neutral;
        }
        if (number) {
            this.number.clearList();
            this.number.Status = DropDownStatus.Neutral;
            this.numberTo.clearList();
            this.numberTo.Status = DropDownStatus.Neutral;
        }
        if (postcode) {
            this.postcode.clearList();
            this.postcode.Status = DropDownStatus.Neutral;
        }
    }

    public SetCity(value: string | null = null, status: DropDownStatus = DropDownStatus.Neutral): void {
        this.city.Status = status;
        this.city.Value = (value ? value : "");
    }

    public SetDetail(item: IPostcodeComplete | null = null) {
        if (item) {
            let url = "https://www.google.com/maps/search/?api=1&query=" + item.lat + "," + item.lng;
            this.detail.innerHTML =
             "<p><a href=\"" + url + "\" target=\googlemaps\">Tonen in Google Maps</a></p>" +
             "<p>" + item.street + " " + Tools.formatNumber(item.streetNumber, item.premise) + "<br />" +
                Tools.outputNumber(item.postalCode) + " " + item.settlement + "<br />" +
                item.province + "</p>" +
             "<p>Bouwjaar: " + item.constructionYear + "<br />" +
                "Oppervlakte: " + item.surfaceArea + " &#13217;</p>" +
             "<p>Doel: " + item.purposes.join("; ") + "<br />" +
                "Gemeente: " + item.municipality + "<br />" +
                "District: " + item.district + "<br />" +
                "Omgeving: " + item.neighbourhood + "</p>";
        } else {
            this.detail.innerHTML = "";
        }
    }

    public SetNumber(value: string | null = null, status: DropDownStatus = DropDownStatus.Neutral): void {
        this.number.Status = status;
        this.number.Value = (value ? value : "");
    }

    public SetNumberTo(value: string | null = null, status: DropDownStatus = DropDownStatus.Neutral): void {
        this.numberTo.Status = status;
        this.numberTo.Value = (value ? value : "");
    }

    public SetPostcode(value: string | null = null, status: DropDownStatus = DropDownStatus.Neutral): void {
        this.postcode.Status = status;
        this.postcode.Value = (value ? value : "");
    }

    public SetStreet(value: string | null = null, status: DropDownStatus = DropDownStatus.Neutral): void {
        this.street.Status = status;
        this.street.Value = (value ? value : "");
    }

    public Validate() {
        this.ResetStatus(true, true, true, true);
        let valid = Tools.isValidPostcode(this.postcode.Value);
        if (valid) {
            let args1 = PostcodeArgs.buildComplete(this, this.onValidate, valid, this.number.Value);
            args1.compare = true;
            Postcode.run(args1);

            let args2 = PostcodeArgs.buildComplete(this, this.onValidateTo, valid, this.numberTo.Value);
            args2.compare = true;
            Postcode.runAsync(args2);
        }
    }

    public ValidateItem(item: IPostcodeComplete, compare: boolean = false): void {
        let number = Tools.formatNumber(item.streetNumber, item.premise);
        this.SetDetail(item);
        if (compare) {
            console.log("compare city to: " + item.settlement);
            this.city.validateValue(item.settlement);
            this.number.validateValue(number);
            this.postcode.validateValue(item.postalCode);
            this.street.validateValue(item.street);
            //this.postcode.Status = (Tools.isValidPostcode(this.postcode.Value) == Tools.isValidPostcode(item.postalCode) ? DropDownStatus.Success : DropDownStatus.Neutral);
            //this.PostcodeMode = (this.postcode.Status == DropDownStatus.Success);
        } else {
            console.log("set city to: " + item.settlement);
            this.SetCity(item.settlement, DropDownStatus.Success);
            this.SetNumber(number, DropDownStatus.Success);
            this.SetPostcode(item.postalCode, DropDownStatus.Success);
            this.SetStreet(item.street, DropDownStatus.Success);
        }
    }

    private onValidate(item: IPostcodeComplete | null, args: PostcodeArgs) {
        let canvas = (args.object as Canvas);
        if (item == null) {
            // do nothing
        } else {
            canvas.ValidateItem(item, args.compare);
        }
    }

    private onValidateTo(item: IPostcodeComplete | null, args: PostcodeArgs) {
        let canvas = (args.object as Canvas);
        if (item == null) {
            // do nothing
        } else {
            let number = Tools.formatNumber(item.streetNumber, item.premise);
            canvas.numberTo.validateValue(number);
        }
    }

}