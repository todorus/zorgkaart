import {bootstrap} from "angular2/platform/browser";
import {AppComponent} from "./components/app.component";
import {RegionService} from "./services/region.service";

// Add all operators to Observable
import 'rxjs/Rx';

bootstrap(AppComponent, [RegionService]);