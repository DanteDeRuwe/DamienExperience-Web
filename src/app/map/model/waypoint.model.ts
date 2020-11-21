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

export class Waypoint{
    constructor(
        private _id: string,
        private _longitude: number,
        private _latitude: number,
        private _languagesText
    ){}

    static fromJson(json: WaypointJson){
        const walk = new Waypoint(
            json.id,
            json.longitude,
            json.latitude,
            json.languagesText
        )
        return walk
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