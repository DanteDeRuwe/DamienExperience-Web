export interface WalkJson {
    id: string,
    coordinates: [],
    lineColor: string,
}

export class Walk{
    constructor(
        private _id: string,
        private _coordinates: [],
        private _lineColor: string
    ){}

    static fromJson(json: WalkJson){
        const route = new Walk(
            json.id,
            json.coordinates,
            json.lineColor
        )
        return route
    }

    toJson(): WalkJson{
        return {
            id: this._id,
            coordinates: this._coordinates,
            lineColor: this._lineColor
        }
    }

    get id(){
        return this._id
    }

    get coordinates(){
        return this._coordinates
    }

    get lineColor(){
        return this._lineColor
    }

}