

export interface WaypointJson {
    id: string,
    longitude: number,
    latitude: number,
    languagesText: {
        title: {
            nl: string,
            fr: string
        },
        description: {
            nl: string,
            fr: string
        }
    }
}

export interface WaypointDTO {
    longitude: number,
    latitude: number,
    languagesText: {
        title: {
            nl: string,
            fr: string
        },
        description: {
            nl: string,
            fr: string
        }
    }
    // title: {
    //     nl: string,
    //     fr: string
    // },
    // description: {
    //     nl: string,
    //     fr: string
    // }
}

export class Waypoint{
    constructor(
        private _id: string,
        private _longitude: number,
        private _latitude: number,
        private _languagesText: {
            title: {
                nl: string,
                fr: string
            },
            description: {
                nl: string,
                fr: string
            }
        }
    ){}

    static fromJsonList(json: WaypointJson[]){
        var res = [];
        json.forEach(element => {
            res.push(this.fromJson(element));
        });
        return res;
    }

    static fromJson(json: WaypointJson){
        const walk = new Waypoint(
            json.id,
            json.longitude,
            json.latitude,
            json.languagesText
        )
        return walk
    }

    static toDTOList(json: Waypoint[]) : WaypointDTO[] {
        var res = [];
        json.forEach(element => {
            res.push(element.toDTO());
        });
        return res;
    }

    toDTO(): WaypointDTO{
        return {
            longitude: this._longitude,
            latitude: this._latitude,
            languagesText: this._languagesText
            //description: this._languagesText.description,
            //title: this._languagesText.title
        }
    }

    static toJsonList(json: Waypoint[]){
        var res = [];
        json.forEach(element => {
            res.push(element.toJson());
        });
        return res;
    }

    toJson(): WaypointJson{
        return {
            id: this._id,
            longitude: this._longitude,
            latitude: this._latitude,
            languagesText: this._languagesText
        }
    }

    get id(){
        return this._id
    }

    get longitude(){
        return this._longitude
    }

    get latitude(){
        return this._latitude
    }

    get languagesText(){
        return this._languagesText
    }
}