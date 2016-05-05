import {Component, Input} from 'angular2/core';
import {Region} from '../../model/region';
import {RegionService} from "../../services/region.service";

@Component({
    selector: 'region-selection',
    template: `
    <ul class="regions pill">
      <li *ngFor="#region of _selection" [class.focused]="region.focused" (click)="onDeselect(region)" (mouseover)="onMouseOver(region)" (mouseout)="onMouseOut(region)">
        {{region.name}}
        <span [ngSwitch]="region.type">
          <span *ngSwitchWhen="Zip"></span>
          <span *ngSwitchWhen="Place"></span>
          <span *ngSwitchWhen="Municipality">(Gem)</span>
          <span *ngSwitchWhen="Province">(Prov)</span>
        </span>
      </li>
    </ul>
  `,
    styles: [
        `
        ul.regions li {
            cursor: pointer;
        }
        ul.regions li.focused {
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

    private _selection:Region[] = [];
    private _regionService;

    constructor(private _regionService:RegionService) {
        this._regionService = _regionService;
        _regionService.selection$.subscribe(selection => this._selection = selection);
        _regionService.focus$.subscribe(region => this._hover(region))
    }

    onDeselect(region:Region) {
        this._regionService.deselect(region);
    }

    onMouseOver(region:Region){
        this._regionService.focus(region);
    }

    onMouseOut(region:Region){
        this._regionService.focus(null);
    }

    private _hover(region:Region):void {
        for(var i:Number = 0; i < this._selection.length ; i++){
            var candidate:Region = this._selection[i];
            candidate.focused = region != null && candidate.id == region.id;
        }
    }

}