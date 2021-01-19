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
    private detailLat: number | null = null;
    private detailLng: number | null = null;
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

    public get Latitude(): number { return this.detailLat ?? 0; }

    public get Longitude(): number { return this.detailLng ?? 0; }

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
                "Oppervlakte: " + item.surfaceArea + " &#13217;<br />" +
                (item.purposes ? "<i>" + item.purposes.join("; ") + "</i>" : "") + "</p>" +
             "<p>Gemeente: " + item.municipality + "<br />" +
                "District: " + item.district + "<br />" +
                "Omgeving: " + item.neighbourhood + "</p>";
            this.detailLat = item.lat;
            this.detailLng = item.lng;
        } else {
            this.detail.innerHTML = "";
            this.detailLat = null;
            this.detailLng = null;
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
        let number = Tools.isValidNumber(this.number.Value);
        let postcode = Tools.isValidPostcode(this.postcode.Value);
        if (number && postcode) {
            let args = PostcodeArgs.buildComplete(this, this.onValidate, postcode, number);
            args.param = 1;
            Postcode.run(args);
        } else {
            this.city.validateAsync();
            this.street.validateAsync();
            this.number.validateAsync();
        }
        this.numberTo.validateAsync();
    }

    public ValidateItem(item: IPostcodeComplete, compare: boolean = false): void {
        this.SetDetail(item);
        let number = Tools.formatNumber(item.streetNumber, item.premise);
        if (compare) {
            this.city.validateValue(item.settlement);
            this.number.validateValue(number);
            this.postcode.validateValue(item.postalCode);
            this.street.validateValue(item.street);
            //this.postcode.Status = (Tools.isValidPostcode(this.postcode.Value) == Tools.isValidPostcode(item.postalCode) ? DropDownStatus.Success : DropDownStatus.Neutral);
            //this.PostcodeMode = (this.postcode.Status == DropDownStatus.Success);
        } else {
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
            canvas.ValidateItem(item, (args.param ? true : false));
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