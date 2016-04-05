import {Component} from "angular2/core";
import {RegionService} from "../services/region.service";
import {Region} from "../model/region";

@Component({
    selector: 'map',
    template: `
        <div id="map-inner"></div>
    `
})
export class MapComponent {

    private BOUNDS_OPTIONS = {paddingTopLeft: [400, 0]};

    layer;
    map;

    constructor(private _regionService:RegionService) {
        _regionService.selection$.subscribe(selection => this._processSelection(selection));
    }

    ngOnInit(){
        this.map = new L.map('map-inner', {zoomControl:false});

        let netherlandsBounds = L.latLngBounds(
                L.latLng(53.667019, 3.273926),
                L.latLng(50.509497, 7.404785)
            );
        this.map.fitBounds(netherlandsBounds, this.BOUNDS_OPTIONS);

        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidG9kb3J1cyIsImEiOiJjaWs4anUwZmswMndqdHhrd2d0bXFtMndjIn0.B-Btjtonfl0WE1sDNcu_9A', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
            id: 'mapbox.light'
        }).addTo(this.map);
    }

    private _processSelection(selection: Region[]):void {
        console.log("map processing", selection);
        if(selection.length > 0){
            this._showRegion(selection[selection.length-1]);
        }
    }

    private _showRegion(region:Region){
        if(this.layer != null){
            this.map.removeLayer(this.layer);
        }

        this.layer = L.geoJson(region.area);
        if(this.layer != null) {
            this.map.addLayer(this.layer);
            this.map.fitBounds(this.layer, this.BOUNDS_OPTIONS);
        }
    }

}
