import {Component} from "angular2/core";
import {RegionService} from "../services/region.service";
import {HTTP_PROVIDERS} from "angular2/http";
import {MapComponent} from "./map.component";
import {RegionFormComponent} from "./regions/region-form.component";
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from "angular2/router";
import {StartComponent} from "./start.component";
import {RegionShowComponent} from "./regions/region-show.component";
import {RegionOverviewComponent} from "./regions/region-overview.component";

@Component({
  selector: 'my-app',
  template: `
    <map></map>
    <router-outlet></router-outlet>
    <nav>
      <a [routerLink]="['/RegionShow', {id: 8868}]">
          NIJMEGEN
      </a>
      <a [routerLink]="['/RegionCreate']">
          <img src="app/img/login_ic.svg" />
      </a>
    </nav>
    
  `,
  directives: [ROUTER_DIRECTIVES, RegionFormComponent, RegionShowComponent, MapComponent],
  providers: [RegionService, HTTP_PROVIDERS, ROUTER_PROVIDERS]
})
@RouteConfig([
  {path: '/regions/create', component: RegionFormComponent, as:"RegionCreate"},
  {path: '/regions/:id', component: RegionShowComponent, as:"RegionShow"},
  {path: '/regions', component: RegionOverviewComponent, as:"RegionOverview"},
  {path: '/',       component: StartComponent,      as:"Start"}
])
export class AppComponent { }
