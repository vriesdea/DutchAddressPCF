import { Canvas } from "./canvas";

export class ReadyButton {

    private canvas: Canvas;
    private input: HTMLInputElement;
    private owner: HTMLElement;

    constructor(owner: Canvas) {
        this.canvas = owner;
        this.input = document.createElement("input");
        this.input.addEventListener("click", this.onClick.bind(this));
        this.input.className = "canvas-ready";
        this.input.setAttribute("type", "submit");
        this.input.value = "OK";
        this.owner = owner.Div;
        this.owner.appendChild(this.input);
    }

    public Clicked: () => void;

    private onClick(event: Event): void {
        console.log("click");
        if (this.Clicked) {
            this.Clicked();
        }
    }

}