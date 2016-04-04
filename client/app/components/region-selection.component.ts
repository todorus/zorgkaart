import {Component, Input} from 'angular2/core';
import {Region} from '../model/region';
import {RegionService} from "../services/region.service";

@Component({
    selector: 'region-selection',
    template: `
    <ul class="regions pill">
      <li *ngFor="#region of _selection" (click)="onDeselect(region)">
        {{region.name}}
      </li>
    </ul>
  `,
    styles: [
        `
        ul.regions li {
            cursor: pointer;
        }
    `
    ]
})
export class RegionSelectionComponent {

    private _selection:Region[];

    constructor(private _regionService:RegionService) {
        _regionService.selection$.subscribe(selection => this._selection = selection);
    }

    onDeselect(region:Region) {
        console.log("deselect");
        this._regionService.deselect(region);
    }

}