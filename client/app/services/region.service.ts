import {Injectable} from 'angular2/core';
import {Region} from "../model/region";


var mock: Region[] = [
    {"id": 11, "name": "Nijmegen", "type": 200},
    {"id": 12, "name": "Maastricht", "type": 200},
    {"id": 13, "name": "Leerdam", "type": 200},
]

@Injectable()
export class RegionService {
    fetch(query: string): Promise<Region[]>{
        return Promise.resolve(mock);
    }
}