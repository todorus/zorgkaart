import {Component, Input} from 'angular2/core';
import {Region} from '../model/region';
import {RegionService} from "../services/region.service";

@Component({
  selector: 'region-search',
  template: `
    <h3>region search</h3>
    <ul class="regions">
      <li *ngFor="#region of regions">
        <span class="badge">{{region.id}}</span> {{region.name}}
      </li>
    </ul>
  `
})
export class RegionSearchComponent {

  regions: Region[];

  constructor(private _regionService: RegionService) { }

  ngOnInit() {
    this.search();
  }
  search() {
    this._regionService.fetch("Maas").then(regions => this.regions = regions);
  }

}