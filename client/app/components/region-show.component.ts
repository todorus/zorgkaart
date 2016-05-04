import {Component, Input} from 'angular2/core';
import {Region} from '../model/region';
import {RegionService} from "../services/region.service";

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

    private region:Region;
    private regionService:RegionService;

    constructor(private regionService:RegionService) {
        this.regionService = regionService;
    }

    ngOnInit(){
        console.log("RegionShowComponent init");
    }

}