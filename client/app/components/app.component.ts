import {Component} from "angular2/core";
import {RegionService} from "../services/region.service";
import {HTTP_PROVIDERS} from "angular2/http";
import {MapComponent} from "./map.component";
import {RegionFormComponent} from "./region-form.component";
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from "angular2/router";

@Component({
  selector: 'my-app',
  template: `
    <map></map>
    <router-outlet></router-outlet>
  `,
  directives: [ROUTER_DIRECTIVES, RegionFormComponent, MapComponent],
  providers: [RegionService, HTTP_PROVIDERS, ROUTER_PROVIDERS]
})
@RouteConfig([
  {path: '/region/create',        component: RegionFormComponent, name:"RegionCreate"},
  {path: '/**',      redirectTo: ['RegionCreate']}
])
export class AppComponent { }
