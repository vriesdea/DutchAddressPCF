import { postcodeKey } from "./secret";
/* secret.ts contains:
 * export const postcodeKey = "your-pro6pp-api-key";
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
    officialSettlement: string,
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
        console.log(args);
        console.log(args.getUrl());
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
                    console.error("response" + (response ? " status " + response.status : "null"));
                    console.log(response);
                    args.callback(null, args);
                    Postcode.busy = false;
                }
            })
            .then((data: any) => {
                console.log('json:');
                console.log(data);
                args.callback(data, args);
                Postcode.busy = false;
            })
            .catch((error: any) => {
                if (error.name == "AbortError") {
                    console.log("fetch aborted:");
                    console.log(args);
                } else {
                    console.error("catched error");
                    console.log(error);
                    args.callback(args.object, null);
                }
                Postcode.busy = false;
            });
    }

    static runAsync(args: PostcodeArgs): void {
        console.log(args);
        console.log(args.getUrl());
        fetch(args.getUrl())
            .then((response) => {
                if (response.status == 200) {
                    return response.json();
                } else {
                    console.error(response);
                    args.callback(null, args);
                }
            })
            .then((data: any) => {
                console.log('json:');
                console.log(data);
                args.callback(data, args);
            })
            .catch((error: any) => {
                console.error("error: " + error);
                args.callback(null, args);
            });
    }

}

export class PostcodeArgs {

    public readonly callback: any;
    public city: string | null = null;
    public readonly mode: number = 0;
    public number: string | null = null;
    public readonly object: any;
    public param: number = 0;
    public postcode: string | null = null;
    public street: string | null = null;

    // mode
    // 1 = autocomplete api
    // 2 = suggest api, suggests cities, streets and numbers
    // 3 = suggest api, suggests numbers by postcode

    private constructor(object: any, callback: any, mode: number) {
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
            query = "&perPage=20&settlement=" + this.city?.replace("*", "%25");
            if (this.street) {
                query += "&street=" + this.street?.replace("*", "%25");
                path = "/suggest/nl/street";
                if (this.number) {
                    path = "/suggest/nl/streetNumberAndPremise";
                    query += "&streetNumberAndPremise=" + encodeURIComponent(this.number);
                }
            }
        } else if (this.mode == 3) {
            path = "/suggest/nl/number";
            query = "&perPage=20&postalCode=" + this.postcode;
            if (this.number) {
                query += "&streetNumberAndPremise=" + this.number;
            }

        }
        return postcodeUrl + path + "/?authKey=" + postcodeKey + query;
    }

    public static buildComplete(object: any, callback: (item: IPostcodeComplete | null, args: PostcodeArgs) => void, postcode: string, number: string): PostcodeArgs {
        let args = new PostcodeArgs(object, callback, 1);
        args.number = number;
        args.postcode = postcode;
        return args;
    }

    public static buildSuggest(object: any, callback: (item: IPostcodeSuggestion[] | null, args: PostcodeArgs) => void, city: string, street: string | null = null, number: string | null = null): PostcodeArgs {
        let args = new PostcodeArgs(object, callback, 2);
        args.city = city;
        args.number = number;
        args.street = street;
        return args;
    }

    public static buildSuggestPostal(object: any, callback: (item: IPostcodeSuggestion[] | null, args: PostcodeArgs) => void, postcode: string, number: string | null = null): PostcodeArgs {
        let args = new PostcodeArgs(object, callback, 3);
        args.number = number;
        args.postcode = postcode;
        return args;
    }

}