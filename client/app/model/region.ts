export class Region {

    public static get TYPE_ZIP():number { return 1; }
    public static get TYPE_PLACE():number { return 100; }
    public static get TYPE_MUNICIPALITY():number { return 200; }
    public static get TYPE_PROVINCE():number { return 300; }

    id: number;
    name: string;
    type: number;

    typeAsString():string {
        var result:string = null;
        switch (this.type){
            case Region.TYPE_ZIP:
                result = "postcode";
                break;
            case Region.TYPE_PLACE:
                result = "plaats";
                break;
            case Region.TYPE_MUNICIPALITY:
                result = "gemeente";
                break;
            case Region.TYPE_PROVINCE:
                result = "provincie";
                break;
        }
        return result;
    }
}