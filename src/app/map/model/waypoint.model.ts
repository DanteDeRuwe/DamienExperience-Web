export interface WaypointJson {
    id: string,
    longitude: number,
    latitude: number,
    languageText: {
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
        private _languageText
    ){}

    static fromJson(json: WaypointJson){
        const walk = new Waypoint(
            json.id,
            json.longitude,
            json.latitude,
            json.languageText
        )
        return walk
    }

    toJson(): WaypointJson{
        return {
            id: this._id,
            longitude: this._longitude,
            latitude: this._latitude,
            languageText: this._languageText
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

    get languageText(){
        return this._languageText
    }
}