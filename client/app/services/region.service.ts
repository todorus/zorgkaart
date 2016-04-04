import {Injectable} from "angular2/core";
import {Region} from "../model/region";
import {Http, Response, URLSearchParams} from "angular2/http";
import {Observable} from "rxjs/Observable";

@Injectable()
export class RegionService {

    private _regionsUrl = 'https://c0x7s177j4.execute-api.eu-west-1.amazonaws.com/development/regions';  // URL to web api

    selection:Region[] = [];

    constructor(private _http:Http) {
    }

    fetch(query:string):Observable {
        let params:URLSearchParams = new URLSearchParams();
        params.set('query', query);
        params.set('limit', '10');

        return this._http.get(this._regionsUrl, {search: params})
            .map(res => <Region[]> res.json())
            .catch(this.handleError);
    }

    private handleError(error:Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

    select(region:Region):void {
        if (this.isInSelection(region)) {
            return;
        }

        this.selection.push(region);
        console.log("regions selected", this.selection);
    }

    private isInSelection(region:Region):boolean {
        return this.selection.find(candidate => candidate.id == region.id) != null;
    }
}