import {Component} from 'angular2/core';
import {Region} from '../../model/region';
import {RegionService} from "../../services/region.service";
import {RegionListComponent} from "./region-list.component";
import {RegionQueryComponent} from "./region-query.component";
import {PaginationComponent, PagesPipe} from "../pagination-component";
import {Pagination} from "../../model/Pagination";
import {Router} from "angular2/router";

@Component({
    selector: 'region-overview',
    directives: [RegionQueryComponent, RegionListComponent, PaginationComponent],
    template: `
    <div id="menu_container" class="side">
      <div id="menu" class="side">
        <region-query (query)="onQuery($event)"></region-query>
        <region-list [regions]="regions" (selected)="select($event)"></region-list>
        <pagination [pagination]="pagination | pages" (page)="onPage($event)"></pagination>
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

    private currentQuery:string;
    private currentPage:Number = 1;

    constructor(private regionService:RegionService, private router:Router) {
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
        this.currentQuery = query;
        this.currentPage = 1;
        this.search(this.currentQuery, this.currentPage);
    }

    onPage(page:Number){
        this.currentPage = page;
        this.search(this.currentQuery, this.currentPage);
    }

    search(query:string, page:number){
        this.regionService.fetch(query, 10, page - 1)
            .subscribe(
                result => {
                    // the inputvalue could have changed in the meantime
                    if (query == this.currentQuery && page == this.currentPage) {
                        this.onResult(result);
                    }
                },
                error => console.log(error)
            );
    }

    onResult(result){
        this.pagination = result.pages;
        this.regions = result.data;
    }

    select(region:Region){
        this.router.navigate(['/RegionShow', {id: region.id}]);
    }

}