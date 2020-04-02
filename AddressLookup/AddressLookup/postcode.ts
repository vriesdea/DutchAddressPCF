import { postcodeKey } from "./secret";
/* secret.ts contains:
 * export const postcodeKey = "your-pro6pp-api-key";
 * export const kvkKey = "your-kvk-api-key";
 */

const postcodeUrl = "https://api.pro6pp.nl/v2";

export interface IPostcodeComplete {
    constructionYear: number,
    country: string,
    countryCode: string,
    district: string,
    lat: number,
    lng: number,
    municipality: string,
    neighbourhood: string,
    postalCode: string,
    premise: string,
    province: string,
    purposes: string[],
    settlement: string,
    street: string,
    streetNumber: number,
    surfaceArea: number
}

export interface IPostcodeSuggestion {
    lat: number,
    lng: number,
    municipality: string,
    postalCode: string,
    province: string,
    settlement: string,
    street: string,
    streetNumber: string,
    streetNumberAndPremise: string
}

export class Postcode {

    private static controller: AbortController;
    private static busy: boolean = false;

    static run(args: PostcodeArgs): void {
        if (Postcode.busy) {
            console.log("aborting postcode fetch");
            Postcode.controller.abort();
        }
        Postcode.busy = true;
        Postcode.controller = new AbortController();
        let signal = Postcode.controller.signal;

        fetch(args.getUrl(), { signal })
            .then((response) => {
                if (response.status == 200) {
                    return response.json();
                } else {
                    console.error(response);
                    args.callback(args.object, null);
                    Postcode.busy = false;
                }
            })
            .then((data: any) => {
                args.callback(data, args);
                Postcode.busy = false;
            })
            .catch((error: any) => {
                if (error.name == "AbortError") {
                    console.error("fetch aborted");
                } else {
                    console.error("error: " + error);
                    args.callback(args.object, null);
                }
                Postcode.busy = false;
            });
    }

    static runAsync(args: PostcodeArgs): void {
        fetch(args.getUrl())
            .then((response) => {
                if (response.status == 200) {
                    return response.json();
                } else {
                    console.error(response);
                    args.callback(args.object, null);
                }
            })
            .then((data: any) => { args.callback(data, args); })
            .catch((error: any) => {
                console.error("error: " + error);
                args.callback(args.object, null);
            });
    }

}

export class PostcodeArgs {

    public readonly callback: any;
    public city: string | null = null;
    public compare: boolean = false;
    public readonly mode: number = 0;
    public number: string | null = null;
    public readonly object: any;
    public postcode: string | null = null;
    public street: string | null = null;

    private constructor(callback: any, mode: number, object: any) {
        this.callback = callback;
        this.mode = mode;
        this.object = object;
    }

    public getUrl( ): string {
        let path = "";
        let query = "";
        if (this.mode == 1) {
            path = "/autocomplete/nl";
            query = "&postalCode=" + this.postcode + "&streetNumberAndPremise=" + this.number;
        } else if (this.mode == 2) {
            path = "/suggest/nl/settlement";
            query = "&settlement=" + this.city;
            if (this.street) {
                query += "&street=" + this.street;
                path = "/suggest/nl/street";
                if (this.number) {
                    path = "/suggest/nl/streetNumberAndPremise";
                    query += "&streetNumberAndPremise=" + this.number;
                }
            }
        }
        return postcodeUrl + path + "/?authKey=" + postcodeKey + query;
    }

    public static buildComplete(object: any, callback: (item: IPostcodeComplete | null, args: PostcodeArgs) => void, postcode: string, number: string): PostcodeArgs {
        let args = new PostcodeArgs(callback, 1, object);
        args.number = number;
        args.postcode = postcode;
        return args;
    }

    public static buildSuggest(object: any, callback: (item: IPostcodeSuggestion[] | null, args: PostcodeArgs) => void, city: string, street: string | null = null, number: string | null = null): PostcodeArgs {
        let args = new PostcodeArgs(callback, 2, object);
        args.city = city;
        args.number = number;
        args.street = street;
        return args;
    }

}