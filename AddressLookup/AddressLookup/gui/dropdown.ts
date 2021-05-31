export enum DropDownStatus {
    Neutral,
    Failure,
    Success
}

export abstract class DropDownBase {

    private list: HTMLUListElement;
    private listVisible: boolean;
    private owner: HTMLElement;

    constructor(owner: HTMLElement) {
        let autocomplete: string = "off";
        let placeholder: string = "";

        this.input = document.createElement("input");
        this.input.addEventListener("change", this.onChanged.bind(this));
        this.input.addEventListener("focusin", this.onFocusIn.bind(this));
        this.input.addEventListener("focusout", this.onFocusOut.bind(this));
        this.input.addEventListener("input", this.onInput.bind(this));
        this.input.addEventListener("keydown", this.onKeyDown.bind(this));
        this.input.autocapitalize = "off";
        this.input.autocomplete = autocomplete;
        this.input.className = "dropdown";
        this.input.placeholder = placeholder;
        this.input.spellcheck = false;
        this.input.setAttribute("autocorrect", "off");
        this.input.setAttribute("type", "text");
        this.owner = owner;
        this.owner.appendChild(this.input);
        this.clearList();
    }

    public compare(value: string): boolean {
        return (this.Value.localeCompare(value, undefined, { sensitivity: 'base' }) === 0);
    }

    private focusIndex: number;
    public get FocusIndex(): number { return this.focusIndex; }
    public set FocusIndex(value: number) {
        if (value > 0 && value <= this.list.children.length && value != this.focusIndex) {
            if (this.focusIndex > 0) {
                (this.list.children[this.focusIndex - 1] as HTMLLIElement).classList.remove("focus");
            }
            (this.list.children[value - 1] as HTMLLIElement).classList.add("focus");
            this.focusIndex = value;
        }
    }

    private input: HTMLInputElement;
    public get Input() { return this.input; }

    private status: DropDownStatus;
    public get Status(): DropDownStatus { return this.status; }
    public set Status(value: DropDownStatus) {
        if (value === this.status) {
            // do nothing
        } else {
            let a: string | null = null;
            let r: string | null = null;
            switch (value) {
                case DropDownStatus.Failure:
                    a = "errors";
                    if (this.status > DropDownStatus.Neutral) {
                        if (this.status > DropDownStatus.Failure) {
                            r = "success";
                        } else {
                            a = null;
                        }
                    }
                    break;
                case DropDownStatus.Success:
                    a = "success";
                    if (this.status > DropDownStatus.Neutral) {
                        if (this.status > DropDownStatus.Failure) {
                            a = null;
                        } else {
                            r = "errors";
                        }
                    }
                    break;
                default:
                    if (this.status > DropDownStatus.Neutral) {
                        r = (this.status > DropDownStatus.Failure ? "success" : "errors");
                    }
            }
            if (r) { this.input.classList.remove(r); }
            if (a) { this.input.classList.add(a); }
            this.status = value;
            this.onStatusChanged(value);
        }
    }

    public get Value(): string { return this.input.value; }
    public set Value(value: string) { this.input.value = value; }

    private visible: boolean = true;
    public get Visible(): boolean { return this.visible; }
    public set Visible(value: boolean) {
        if (this.visible != value) {
            this.input.style.display = (value ? "inline-block" : "none");
            this.visible = value;
        }
    }

    public addItem(item: HTMLLIElement): HTMLLIElement {
        this.list.appendChild(item);
        return item;
    }

    public createItem(value: string, key: string | null): HTMLLIElement {
        let item = document.createElement("li");
        item.addEventListener("click", this.onItemClick.bind(this));
        item.addEventListener("mouseenter", this.onItemMouseEnter.bind(this));
        item.innerHTML = value;
        if (key != null) {
            item.setAttribute("data-key", key);
        }
        return item;
    }

    public clearList(): void {
        this.hideList();
        this.focusIndex = 0;
        this.list = document.createElement("ul");
        this.list.className = "dropdown-list";
    }

    public hideList(): void {
        if (this.listVisible) {
            this.owner.removeChild(this.list);
            this.listVisible = false;
        }
    }

    public selectItem(element: HTMLLIElement): void {
        this.hideList();
        let value = element.getAttribute("data-key");
        if (value == null) {
            this.Value = element.innerText;
        } else {
            this.Value = value;
        }
        this.onSelectedItem(element);
    }

    public setFocus() : void {
        this.input.focus();
    }

    public showList(): void {
        if (!this.listVisible && this.list.childElementCount > 0) {
            this.owner.appendChild(this.list);
            this.listVisible = true;
        }
    }

    public validateValue(value: string, useFailed: boolean = false): boolean {
        if (this.compare(value)) {
            this.Status = DropDownStatus.Success;
            return true;
        } else {
            this.Status = (useFailed ? DropDownStatus.Failure : DropDownStatus.Neutral);
        }
        return false;
    }

    protected onChanged(event: Event): void { }

    protected onFocusIn(event: FocusEvent): void {
        this.input.select();
    }

    protected onFocusOut(event: FocusEvent): void {
        if (this.listVisible) {
            setTimeout(this.hideList, 150);
        }
    }

    protected onInput(event: Event): void { }

    private onItemClick(event: Event): void {
        let element = (event.srcElement as HTMLLIElement);
        this.selectItem(element);
    }

    private onItemMouseEnter(event: Event): void {
        let element = (event.srcElement as HTMLLIElement);
        let parent = element.parentNode;
        if (parent) {
            let value = Array.from(parent.children).indexOf(element);
            this.FocusIndex = value + 1;
        }
    }

    protected onKeyDown(event: KeyboardEvent): void {
        switch (event.key) {
            case "Enter":
                event.preventDefault();
                if (this.focusIndex > 0) {
                    this.selectItem(this.list.childNodes[this.FocusIndex - 1] as HTMLLIElement);
                }
                break;
            case "ArrowDown":
                this.FocusIndex++;
                break;
            case "ArrowUp":
                this.FocusIndex--;
                break;
        }
    }

    protected onSelectedItem(element: HTMLLIElement) { }

    protected onStatusChanged(status: DropDownStatus) { }

}