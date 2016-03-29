import {Component} from 'angular2/core';
import {RegionService} from '../services/region.service';
import {RegionSearchComponent} from './region-search.component';
import {HTTP_PROVIDERS} from "angular2/http";

@Component({
  selector: 'my-app',
  template: `
    <h1>Waar Regel ik Zorg.nl</h1>
    <region-search></region-search>
  `,
  directives: [RegionSearchComponent],
  providers: [RegionService, HTTP_PROVIDERS]
})
export class AppComponent { }
