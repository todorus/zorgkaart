import {Component, Input} from 'angular2/core';
import {Region} from '../model/region';
import {RegionService} from "../services/region.service";
import {RegionSelectionComponent} from "./region-selection.component";
import {RegionSearchComponent} from "./region-search.component";

@Component({
    selector: 'region-form',
    directives: [RegionSearchComponent, RegionSelectionComponent],
    template: `
    <form>
        <h2>REGIO</h2>
        <region-selection></region-selection>
        <region-search></region-search>
        <input type="submit" value="OPSLAAN" />
    </form>
  `,
    styles: [`
        
    `]
})
export class RegionFormComponent {

    constructor(private _regionService:RegionService) {
        this._regionService = _regionService;
    }

}