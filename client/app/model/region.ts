enum Type {
    Zip = "Zip",
    Place = "Place",
    Municipality = "Municipality",
    Province = "Province"
}

export class Region {

    static Type = Type;

    id: number;
    name: string;
    type: string;
    area: any;

    // Client
    focused: boolean = false;
    hover: boolean = false;
}