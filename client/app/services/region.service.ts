import {Injectable} from "angular2/core";
import {Region} from "../model/region";
import {Http, Response, URLSearchParams} from "angular2/http";
import {Observable} from "rxjs/Observable";


var mock: Region[] = [
    {"id": 11, "name": "Nijmegen", "type": 200},
    {"id": 12, "name": "Maastricht", "type": 200},
    {"id": 13, "name": "Leerdam", "type": 200},
]

@Injectable()
export class RegionService {

    constructor (private _http: Http) {}

    private _regionsUrl = 'https://c0x7s177j4.execute-api.eu-west-1.amazonaws.com/development/regions';  // URL to web api

    fetch(query: string) {
        let params: URLSearchParams = new URLSearchParams();
        params.set('query', query);
        params.set('limit', '10');

        return this._http.get(this._regionsUrl, {search: params})
            .map(res => <Region[]> res.json())
            .catch(this.handleError);
    }

    private handleError (error: Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}