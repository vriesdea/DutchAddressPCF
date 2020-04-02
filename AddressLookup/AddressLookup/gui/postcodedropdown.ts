import { Canvas } from "./canvas";
import { DropDownBase, DropDownStatus } from "./dropdown";
import { Tools } from "../tools";

export class PostcodeDropDown extends DropDownBase {

    private canvas: Canvas;

    constructor(owner: Canvas) {
        super(owner.Div);
        this.canvas = owner;
        this.Input.placeholder = "postcode";
    }

    protected onInput(event: Event) {
        super.onInput(event);
        this.canvas.PostcodeMode = true;
        this.canvas.ResetStatus(true, true, true, true);
        if (Tools.isValidPostcode(this.Value)) {
            this.canvas.Number.setFocus();
        }
    }

}