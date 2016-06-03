import {Component, Input} from 'angular2/core';
import {Region} from '../../model/region';
import {RegionService} from "../../services/region.service";
import {RegionListComponent} from "./region-list.component";
import {RegionQueryComponent} from "./region-query.component";

@Component({
    selector: 'region-search',
    directives: [RegionListComponent, RegionQueryComponent],
    template: `
    <region-query (result)="onResult(regions=$event.data)"></region-query>
    <region-list [regions]="regions"></region-list>
  `,
    styles: [
        `
        input.regionquery {
            width: 100%;
        }
        ul.regions {
            width: 100%;
        }
        ul.regions li {
            border-top: none;
            cursor: pointer;
        }
        ul.regions li:hover, ul.regions li.focus {
            color: #FFF;
            border: 1px solid #35886F;
            background: #43AA8B;
        }
    `
    ]
})
export class RegionSearchComponent {

    private KEYCODE_ENTER:number = 13;
    private KEYCODE_UP:number = 38;
    private KEYCODE_DOWN:number = 40;

    errorMessage;

    private _inputValue:string = '';
    private _focusIndex = -1;
    regions:Region[] = [];


    constructor(private _regionService:RegionService) {
    }

    onResult(result){
        console.log("result", result);
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
            this.regions = [];
            return;
        }

        this._regionService.fetch(query, 3, 0)
            .subscribe(
                result => {
                    // the inputvalue could have changed in the meantime
                    if (query == this._inputValue) {
                        this.regions = result.data;
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
        if (this.regions.length > focusIndex) {
            this.select(this.regions[focusIndex]);
        }
    }

    private updateFocus() {
        if (this._focusIndex < 0) {
            this._focusIndex = -1;
        } else {
            this._focusIndex = Math.min(this._focusIndex, this.regions.length - 1);
        }

        for (let i:number = 0; i < this.regions.length; i++) {
            this.regions[i].focused = i == this._focusIndex;
        }
    }

    private clear():void {
        this.regions = [];
        this._inputValue = '';
        this._focusIndex = -1;
    }

}