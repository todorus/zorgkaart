enum Type {
    Zip = 1,
    Place = 100,
    Municipality = 200,
    Province = 300
}

export class Region {

    static Type = Type;

    id: number;
    name: string;
    type: number;

    typeAsString():string {
        var result:string = null;
        switch (this.type){
            case Type.Zip:
                result = "postcode";
                break;
            case Type.Place:
                result = "plaats";
                break;
            case Type.Municipality:
                result = "gemeente";
                break;
            case Type.Province:
                result = "provincie";
                break;
        }
        return result;
    }
}