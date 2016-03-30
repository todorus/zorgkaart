import {Component, Input} from 'angular2/core';
import {Region} from '../model/region';
import {RegionService} from "../services/region.service";

@Component({
  selector: 'region-search',
  template: `
    <input class="regionquery" #query (keyup)="search(query.value)"/>
    <ul class="regions">
      <li *ngFor="#region of regions">
        {{region.name}}
      </li>
    </ul>
  `,
  styles:[
    `
        input.regionquery {
            width: 100%;
        }
        ul.regions {
            width: 100%;
        }
        ul.regions li {
            border-top: none;
        }
    `
  ]
})
export class RegionSearchComponent {

  errorMessage;
  regions: Region[];

  constructor(private _regionService: RegionService) { }

  search(query: string) {
    if(query == null || query.length < 2){
      this.regions = [];
      return;
    }

    this._regionService.fetch(query)
        .subscribe(
          regions => this.regions = regions,
          error =>  this.errorMessage = <any>error
        );
  }

}