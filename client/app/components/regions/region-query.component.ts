import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {Region} from '../../model/region';
import {RegionService} from "../../services/region.service";
import {RegionListComponent} from "./region-list.component";

@Component({
    selector: 'region-query',
    template: `
    <input class="regionquery" placeholder="gemeentes, postcodes, zorgregios"
     #query [value]="_inputValue" (keyup)="onKey($event, query.value)"/>
  `,
    styles: [
        `
        input.regionquery {
            width: 100%;
        }
    `
    ]
})
export class RegionQueryComponent {

    private KEYCODE_ENTER:number = 13;
    private KEYCODE_UP:number = 38;
    private KEYCODE_DOWN:number = 40;

    errorMessage;

    private _inputValue:string = '';
    private _focusIndex = -1;

    @Input()
    maxResults = 3;

    @Output()
    result:EventEmitter<{regions: Region[]}> = new EventEmitter();
    resultStore:Region[];


    constructor(private _regionService:RegionService) {
    }

    private onKey(event:KeyboardEvent, query:string):void {
        switch (event.keyCode) {
            case this.KEYCODE_ENTER: //enter
                this.onEnter();
                break;
            case this.KEYCODE_UP: //up
                this._focusIndex--;
                this.updateFocus();
                break;
            case this.KEYCODE_DOWN: //down
                this._focusIndex++;
                this.updateFocus();
                break;
            default:
                this._focusIndex = -1;
                this.search(query);
        }
    }

    private search(query:string) {
        if (query == this._inputValue) {
            return;
        }

        this._inputValue = query;
        if (query == null || query.length < 2) {
            this.resultStore = [];
            return;
        }

        console.log("maxResults", this.maxResults);

        this._regionService.fetch(query, this.maxResults, 0)
            .subscribe(
                regions => {
                    // the inputvalue could have changed in the meantime
                    if (query == this._inputValue) {
                        this.resultStore = regions.data;
                        this.result.next({regions: this.resultStore});
                    }
                },
                error => this.errorMessage = <any>error
            );
    }

    private select(region:Region) {
        this._regionService.select(region);
        this.clear();
    }

    private onEnter() {
        let focusIndex = Math.max(0, this._focusIndex);
        if (this.resultStore.length > focusIndex) {
            this.select(this.resultStore[focusIndex]);
        }
    }

    private updateFocus() {
        if (this._focusIndex < 0) {
            this._focusIndex = -1;
        } else {
            this._focusIndex = Math.min(this._focusIndex, this.resultStore.length - 1);
        }

        for (let i:number = 0; i < this.resultStore.length; i++) {
            this.resultStore[i].focused = i == this._focusIndex;
        }
    }

    private clear():void {
        this.resultStore = [];
        this._inputValue = '';
        this._focusIndex = -1;
    }

}