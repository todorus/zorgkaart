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
    area: any;

    // Client
    focused: boolean = false;
}