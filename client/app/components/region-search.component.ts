import {Component, Input} from 'angular2/core';
import {Region} from '../model/region';
import {RegionService} from "../services/region.service";

@Component({
    selector: 'region-search',
    template: `
    <input class="regionquery" #query [value]="_inputValue" (keyup)="onKey($event, query.value)"/>
    <ul class="regions">
      <li *ngFor="#region of regions" (click)="select(region)">
        {{region.name}}
        <span [ngSwitch]="region.type">
          <span *ngSwitchWhen="1">(Postcode)</span>
          <span *ngSwitchWhen="100">(Plaats)</span>
          <span *ngSwitchWhen="200">(Gemeente)</span>
          <span *ngSwitchWhen="300">(Provincie)</span>
        </span>
      </li>
    </ul>
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
        ul.regions li:hover {
            color: #FFF;
            border: 1px solid #35886F;
            background: #43AA8B;
        }
    `
    ]
})
export class RegionSearchComponent {

    errorMessage;

    private _inputValue:string = '';
    regions:Region[] = [];

    constructor(private _regionService:RegionService) {
    }

    private onKey(event:KeyboardEvent, query:string):void {
        switch (event.keyCode){
            case 13:
                this.onEnter();
                break;
            default:
                this.search(query);
        }
    }

    private search(query:string) {
        if(query == this._inputValue){
            return;
        }

        this._inputValue = query;
        if (query == null || query.length < 2) {
            this.regions = [];
            return;
        }

        this._regionService.fetch(query)
            .subscribe(
                regions => this.regions = regions,
                error => this.errorMessage = <any>error
            );
    }

    private select(region:Region){
        this._regionService.select(region);
        this.clear();
    }

    private onEnter(){
       if(this.regions.length > 0){
           this.select(this.regions[0]);
       }
    }

    private clear():void {
        this.regions = [];
        this._inputValue = '';
    }

}