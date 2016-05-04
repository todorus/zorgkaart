import {Injectable} from "angular2/core";
import {Region} from "../model/region";
import {Http, Response, URLSearchParams, RequestOptions, Headers} from "angular2/http";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";

@Injectable()
export class RegionService {

    editMode:boolean = false;

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

    create(name:String, description:String, children:Number[]):Observable {

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        var body = {
            name: name,
            description: description,
            children: children
        };

        return this._http.post(this._regionsUrl, JSON.stringify(body), options)
            .map(res => {
                console.log("result", res);
                <Region> res.json();
            })
            .catch(this.handleError)
    }

    find(id:Number):Observable {
        return this._http.get(this._regionsUrl+"/"+id, null)
            .map(res => <Region> res.json())
            .catch(this.handleError);
    }

    private handleError(error:Response) {
        // in a real world app, we may send the error to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().fault || error);
    }

    show(region:Region):void {
        this._selectionStore = [region];
        this._selectionSubject.next(this._selectionStore);
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

    clear():void {
        this._selectionStore = [];
        this._selectionSubject.next(this._selectionStore);
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