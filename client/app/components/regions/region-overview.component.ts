import {Component} from 'angular2/core';
import {Region} from '../../model/region';
import {RegionService} from "../../services/region.service";
import {RegionListComponent} from "./region-list.component";
import {RegionQueryComponent} from "./region-query.component";
import {PaginationComponent, PagesPipe} from "../pagination-component";
import {Pagination} from "../../model/Pagination";

@Component({
    selector: 'region-overview',
    directives: [RegionQueryComponent, RegionListComponent, PaginationComponent],
    template: `
    <div id="menu_container" class="side">
      <div id="menu" class="side">
        <region-query (query)="onQuery($event)"></region-query>
        <region-list [regions]="regions"></region-list>
        <pagination [pagination]="pagination | pages"></pagination>
      </div>
    </div>
  `,
    styles: [`
        p, input {
            margin: 0;
        }    
    `],
    pipes: [PagesPipe]
})
export class RegionOverviewComponent {

    private regionService;
    regions:Region[];
    pagination:Pagination;

    private lastQuery:string;

    constructor(private regionService:RegionService) {
        this.regionService = regionService;

        this.regionService.editMode = false;
        this.regionService.clear();
    }
    
    ngOnInit(){
        this.regionService.fetch(null, 10, 0)
            .subscribe(
                result =>  {
                    this.onResult(result);
                }
            )
    }

    onQuery(query){

        this.lastQuery = query;
        this.regionService.fetch(query, 10, 0)
            .subscribe(
                result => {
                    // the inputvalue could have changed in the meantime
                    if (query == this.lastQuery) {
                        this.onResult(result);
                    }
                },
                error => console.log(error)
            );
    }


    onResult(result){
        console.log("onResult", result);
        this.pagination = result.pages;
        this.regions = result.data;
    }

    getPage():void {

    }


}