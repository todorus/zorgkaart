import {Injectable} from "angular2/core";
import {Region} from "../model/region";
import {Http, Response, URLSearchParams} from "angular2/http";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";

@Injectable()
export class RegionService {

    private _regionsUrl = 'https://c0x7s177j4.execute-api.eu-west-1.amazonaws.com/development/regions';  // URL to web api
    private _mergeUrl = this._regionsUrl+'/merge';

    private _selectionStore:Region[] = [];
    private _selectionSubject:Subject<Region[]> = new Subject<Region[]>()
    selection$ = this._selectionSubject.asObservable();

    private _focusStore:Region = null;
    private _focusSubject:Subject<Region> = new Subject<Region>()
    focus$ = this._focusSubject.asObservable();

    private _mergedSubject:Subject<Region> = new Subject<Region>();
    merged$ = this._mergedSubject.asObservable();

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
    }

    deselect(region:Region):void {
        for (let i:Number = 0; i < this._selectionStore.length; i++) {
            console.log(i, this._selectionStore[i].id, this._selectionStore[i].id == region.id)
            if (this._selectionStore[i].id == region.id) {
                this._selectionStore.splice(i, 1);
                this._selectionSubject.next(this._selectionStore);
                this.updateMerged();
                return;
            }
        }
    }

    focus(region:Region):void {
        for(var i:Number = 0; i < this._selectionStore.length; i++){
            var candidate:Region = this._selectionStore[i];
            candidate.hover = region != null && region.id == candidate.id;
        }
        this._focusSubject.next(region);
    }

    private updateMerged(){
        if(this._selectionStore.length == 0){
            this._mergedSubject.next(null);
            return;
        }

        this.merge(this._selectionStore)
            .subscribe(
                region => this._mergedSubject.next(region),
                error => console.log(<any>error)
            );;
    }

    private merge(regions: Region[]){
        //TODO call the merge function on the API and save the result to an observable
        let ids = [];
        for(let i:Number = 0; i < regions.length; i++){
            ids.push(regions[i].id);
        }

        let params:URLSearchParams = new URLSearchParams();
        params.set('regions', '['+ids.toString()+']');

        return this._http.get(this._mergeUrl, {search: params})
            .map(res => <Region[]> res.json())
            .catch(this.handleError);
    }

    private isInSelection(region:Region):boolean {
        return this._selectionStore.find(candidate => candidate.id == region.id) != null;
    }
}