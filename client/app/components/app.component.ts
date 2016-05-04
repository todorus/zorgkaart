import {Component} from "angular2/core";
import {RegionService} from "../services/region.service";
import {HTTP_PROVIDERS} from "angular2/http";
import {MapComponent} from "./map.component";
import {RegionFormComponent} from "./region-form.component";
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from "angular2/router";
import {StartComponent} from "./start.component";
import {RegionShowComponent} from "./region-show.component";

@Component({
  selector: 'my-app',
  template: `
    <map></map>
    <router-outlet></router-outlet>
    <nav>
      <a [routerLink]="['/RegionCreate']">
          <img src="app/img/login_ic.svg" />
      </a>
    </nav>
    
  `,
  directives: [ROUTER_DIRECTIVES, RegionFormComponent, RegionShowComponent, MapComponent],
  providers: [RegionService, HTTP_PROVIDERS, ROUTER_PROVIDERS]
})
@RouteConfig([
  {path: '/regions/:id', component: RegionShowComponent, as:"RegionShow"},
  {path: '/regions', component: RegionFormComponent, as:"RegionCreate"},
  {path: '/',       component: StartComponent,      as:"Start"}
])
export class AppComponent { }
