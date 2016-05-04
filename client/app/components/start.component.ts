import {Component, Input} from 'angular2/core';
import {Region} from '../model/region';
import {NgForm}    from 'angular2/common';
import {RegionService} from "../services/region.service";
import {RegionSelectionComponent} from "./region-selection.component";
import {RegionSearchComponent} from "./region-search.component";
import {Headers, RequestOptions} from "angular2/http";

@Component({
    selector: 'start',
    template: `
    <div id="center_menu_container">
      <div id="center_menu">
        <div>
            <h2>WELKOM</h2>
            <p>
                Mauris eget sapien in urna venenatis vestibulum. Praesent vitae ornare erat. Vestibulum nisi justo, cursus in porttitor faucibus, viverra eu augue. Fusce at suscipit metus. Quisque accumsan leo dapibus, laoreet sem ac, feugiat eros. Nam sed ligula ullamcorper, dignissim diam quis, iaculis quam. Mauris sit amet feugiat tortor. Vestibulum sed.
            </p>
            <p>
                Donec id dignissim tellus. Sed blandit metus dolor, ut fermentum nibh tristique at. Donec ac ligula pellentesque, ultricies justo quis, consectetur lorem. Nullam pulvinar eros ac velit rhoncus feugiat. Cras eget venenatis neque, tincidunt imperdiet ipsum. Mauris tempor ullamcorper viverra. Sed bibendum, enim et feugiat sagittis, est nulla volutpat dolor.
            </p>
        </div>
      </div>
    </div>
  `
})
export class StartComponent {



}