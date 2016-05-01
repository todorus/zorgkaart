import {Component} from "angular2/core";
import {RegionService} from "../services/region.service";
import {HTTP_PROVIDERS} from "angular2/http";
import {MapComponent} from "./map.component";
import {RegionFormComponent} from "./region-form.component";

@Component({
  selector: 'my-app',
  template: `
    <map></map>
    <div id="side_menu_container">
      <div id="side_menu">
          <region-form></region-form>
      </div>
    </div>
  `,
  directives: [RegionFormComponent, MapComponent],
  providers: [RegionService, HTTP_PROVIDERS]
})
export class AppComponent { }
