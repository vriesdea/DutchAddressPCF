export enum PremiseOptions {
    Combined,
    Separated
}
export enum RangeOptions {
    Simple,
    Range
}

export class Tools {

    public static formatNumber(value: string | number | null, premise: string | null): string {
        return (value ? value + (premise ? " " + premise : "") : "");
    }

    public static isValidPostcode(raw: string | null): string | null {
        if (raw && raw.length > 5 && raw.match(/^(\s*\d){4}(\s*[a-z]){2}\s*$/i)) {
            return raw.replace(/[^0-9a-z]/ig, "").toUpperCase();
        }
        return null;
    }

    public static outputNumber(value: string, option: PremiseOptions = PremiseOptions.Combined): string[] {
        let number = value.trim();
        let index = number.indexOf(" ");
        let premise = "";
        if (option == PremiseOptions.Separated && index > 0) {
            premise = number.substring(index + 1);
            number = number.substring(0, index);
        }
        return [number, premise];
    }

    public static outputPostcode(value: string): string {
        let valid = Tools.isValidPostcode(value);
        return (valid ? valid.substr(0, 4) + " " + valid.substr(4, 2) : "");
    }

}