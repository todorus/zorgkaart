import {Component} from 'angular2/core';
import {RegionService} from '../services/region.service';
import {RegionSearchComponent} from './region-search.component';

@Component({
  selector: 'my-app',
  template: `
    <h1>Waar Regel ik Zorg.nl</h1>
    <region-search></region-search>
  `,
  directives: [RegionSearchComponent],
  providers: [RegionService]
})
export class AppComponent { }
