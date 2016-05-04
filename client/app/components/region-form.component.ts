import {Component, Input} from 'angular2/core';
import {Region} from '../model/region';
import {NgForm}    from 'angular2/common';
import {RegionService} from "../services/region.service";
import {RegionSelectionComponent} from "./region-selection.component";
import {RegionSearchComponent} from "./region-search.component";
import {Headers, RequestOptions} from "angular2/http";

@Component({
    selector: 'region-form',
    directives: [RegionSearchComponent, RegionSelectionComponent],
    template: `
    <div id="menu_container" class="side">
      <div id="menu" class="side">
        <form class="regionForm">
            <h2>REGIO</h2>
            <p class="error" [ngClass]="{hide: !(_errorMessage)}">{{_errorMessage}}</p>
            <label>Naam*</label>
            <input type="text" placeholder="naam" [(ngModel)]="model.name"/>
            <label>Beschrijving</label>
            <textarea placeholder="beschrijving" [(ngModel)]="model.description"></textarea>
            <label>Gebied*</label>
            <p>
                Vul hier de postcodes, gemeentes of provincies in welke het gebied omvangt.
            </p>
            <region-search></region-search>
            <region-selection></region-selection>
            
            <input type="submit" value="OPSLAAN" (click)="onSubmit()"/>
        </form>
      </div>
    </div>
  `,
    styles: [`
        p, input {
            margin: 0;
        }    
    `]
})
export class RegionFormComponent {

    private _errorMessage:String;
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

        this._regionService.editMode = true;
        this._regionService.clear();
    }

    onSubmit(){
        this._regionService.create(this.model.name, this.model.description, this.model.children).subscribe(
            region => console.log("created response:", region),
            error => {
                console.log("created response:", error);
                this._errorMessage = error.message;
            }
        );;
    }

}

class RegionFormModel {
    name: string;
    description: string;
    children: Number[];
}