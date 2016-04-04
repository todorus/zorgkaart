import {Component, Input} from 'angular2/core';
import {Region} from '../model/region';
import {RegionService} from "../services/region.service";

@Component({
    selector: 'region-selection',
    template: `
    <ul class="regions pill">
      <li *ngFor="#region of _selection" (click)="onDeselect(region)">
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
        ul.regions li {
            cursor: pointer;
        }
        ul.regions li:hover {
            background: #2D755F;
            border: solid 1px #255F4E;
        }
        ul.regions li span {
            font-size: 10px;
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
        this._regionService.deselect(region);
    }

}