import {Component} from 'angular2/core';
import {Region} from '../../model/region';
import {RegionService} from "../../services/region.service";
import {RegionListComponent} from "./region-list.component";
import {RegionQueryComponent} from "./region-query.component";

@Component({
    selector: 'region-overview',
    directives: [RegionQueryComponent, RegionListComponent],
    template: `
    <div id="menu_container" class="side">
      <div id="menu" class="side">
        <region-query [maxResults]="10" (result)="regions=$event.regions"></region-query>
        <region-list [regions]="regions"></region-list>
      </div>
    </div>
  `,
    styles: [`
        p, input {
            margin: 0;
        }    
    `]
})
export class RegionOverviewComponent {

    private regionService;
    regions:Region[];

    constructor(private regionService:RegionService) {
        this.regionService = regionService;

        this.regionService.editMode = false;
        this.regionService.clear();
    }
    
    ngOnInit(){
        console.log("init")
        this.regionService.fetch(null, 10, 0)
            .subscribe(
                regions =>  {
                    console.log("fetched", regions);
                    this.regions = regions
                }
            )
    }


}