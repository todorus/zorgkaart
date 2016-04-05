import {Injectable} from "angular2/core";
import {Region} from "../model/region";
import {Http, Response, URLSearchParams} from "angular2/http";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";

@Injectable()
export class RegionService {

    private _regionsUrl = 'https://c0x7s177j4.execute-api.eu-west-1.amazonaws.com/development/regions';  // URL to web api

    private _selectionStore:Region[] = [];
    private _selectionSubject:Subject<Region[]> = new Subject<Region[]>()
    selection$ = this._selectionSubject.asObservable();

    constructor(private _http:Http) {
    }

    fetch(query:string):Observable {
        let params:URLSearchParams = new URLSearchParams();
        params.set('query', query);
        params.set('limit', '3');

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

        this._selectionStore.push(region);
        this._selectionSubject.next(this._selectionStore);
        this.atomize(this._selectionStore);
    }

    deselect(region:Region):void {
        for (let i:Number = 0; i < this._selectionStore.length; i++) {
            console.log(i, this._selectionStore[i].id, this._selectionStore[i].id == region.id)
            if (this._selectionStore[i].id == region.id) {
                this._selectionStore.splice(i, 1);
                this._selectionSubject.next(this._selectionStore);
                this.atomize(this._selectionStore);
                return;
            }
        }
    }

    private atomize(regions: Region[]){
        //TODO call the atomize function on the API and save the result to an observable
    }

    private isInSelection(region:Region):boolean {
        return this._selectionStore.find(candidate => candidate.id == region.id) != null;
    }
}