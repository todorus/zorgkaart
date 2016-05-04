import {Component} from "angular2/core";
import {RegionService} from "../services/region.service";
import {HTTP_PROVIDERS} from "angular2/http";
import {MapComponent} from "./map.component";
import {RegionFormComponent} from "./region-form.component";
import {RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS} from "angular2/router";
import {StartComponent} from "./start.component";

@Component({
  selector: 'my-app',
  template: `
    <map></map>
    <router-outlet></router-outlet>
    <nav>
      <a [routerLink]="['/Region']">
          <img src="app/img/login_ic.svg" />
      </a>
    </nav>
    
  `,
  directives: [ROUTER_DIRECTIVES, RegionFormComponent, MapComponent],
  providers: [RegionService, HTTP_PROVIDERS, ROUTER_PROVIDERS]
})
@RouteConfig([
  {path: '/region', component: RegionFormComponent, as:"Region"},
  {path: '/',       component: StartComponent,      as:"Start"}
])
export class AppComponent { }
