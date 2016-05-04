import {Component, Input} from 'angular2/core';
import {Region} from '../model/region';
import {RegionService} from "../services/region.service";
import {Router, RouteParams} from "angular2/router";

@Component({
    selector: 'region-show',
    template: `
    <div id="menu_container" class="side">
      <div id="menu" class="side">
            <h2>{{region.name}}</h2>
            <p >{{region.description}}</p>
      </div>
    </div>
  `,
    styles: [`
        p, input {
            margin: 0;
        }    
    `]
})
export class RegionShowComponent {

    private regionService:RegionService;

    private region:Region;
    private id;

    constructor(private regionService:RegionService, private params: RouteParams) {
        this.regionService = regionService;
        this.regionService.editMode = false;

        this.id = params.get('id');

        this.region = new Region();
    }


    ngOnInit(){
        this.regionService.find(this.id)
            .subscribe(
                region => {
                    if(region == null){
                        console.error("no region with id "+this.id);
                        return;
                    }

                    this.region = region;
                    this.regionService.show(region);
                },
                error => console.error(error)
            );
    }

}