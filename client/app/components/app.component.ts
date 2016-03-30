import {Component} from 'angular2/core';
import {RegionService} from '../services/region.service';
import {RegionSearchComponent} from './region-search.component';
import {HTTP_PROVIDERS} from "angular2/http";
import {MapComponent} from "./map.component";

@Component({
  selector: 'my-app',
  template: `
    <map></map>
    <div id="side_menu_container">
      <div id="side_menu">
          <h2>REGIO</h2>
          <region-search></region-search>
      </div>
    </div>
  `,
  directives: [RegionSearchComponent, MapComponent],
  providers: [RegionService, HTTP_PROVIDERS]
})
export class AppComponent { }
