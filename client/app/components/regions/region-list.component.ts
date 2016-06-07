import {Component, Input, Output, EventEmitter} from 'angular2/core';
import {Region} from '../../model/region';
import {RegionService} from "../../services/region.service";

@Component({
    selector: 'region-list',
    template: `
    <ul class="regions">
      <li *ngFor="#region of regions" (click)="select(region)"
        [ngClass]="{focus: region.hover}">
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
export class RegionListComponent {

    errorMessage;

    private _inputValue:string = '';
    private _focusIndex = -1;

    @Input("regions")
    regions:Region[] = [];
    
    @Output("selected")
    selected:EventEmitter<Region> = new EventEmitter();


    constructor() {
    }

    private select(region:Region) {
        this.selected.next(region);
    }

}