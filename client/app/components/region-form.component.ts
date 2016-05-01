import {Component, Input} from 'angular2/core';
import {Region} from '../model/region';
import {NgForm}    from 'angular2/common';
import {RegionService} from "../services/region.service";
import {RegionSelectionComponent} from "./region-selection.component";
import {RegionSearchComponent} from "./region-search.component";

@Component({
    selector: 'region-form',
    directives: [RegionSearchComponent, RegionSelectionComponent],
    template: `
    <form class="regionForm">
        <h2>REGIO</h2>
        <label>Naam*</label>
        <input type="text" placeholder="naam" [(ngModel)]="model.name"/>
        <label>Beschrijving</label>
        <textarea placeholder="beschrijving" [(ngModel)]="model.description"></textarea>
        <label>Gebied*</label>
        <p>
            Vul hier de postcodes, gemeentes of provincies welke het gebied omvangt.
        </p>
        <region-search></region-search>
        <region-selection></region-selection>
        
        <input type="submit" value="OPSLAAN" />
    </form>
  `,
    styles: [`
        p, input {
            margin: 0;
        }    
    `]
})
export class RegionFormComponent {

    model:RegionFormModel = new RegionFormModel();

    constructor(private _regionService:RegionService) {
        this._regionService = _regionService;
        _regionService.selection$.subscribe(selection => {
            var ids:Number[] = [];
            for(var i:Number=0; i < selection.length; i++){
                var region:Region = selection[i];
                ids.push(region.id);
            }
            this.model.children = ids;
        });
    }
}

class RegionFormModel {
    name: string;
    description: string;
    children: Number[];
}