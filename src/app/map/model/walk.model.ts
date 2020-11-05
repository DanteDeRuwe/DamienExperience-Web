export interface WalkJson {
    id: string
    starttime: Date;
    endtime: Date,
    lineColor: string,
    coordinates: [number[]],
}

export class Walk{
    constructor(
        private _id: string,
        private _starttime: Date,
        private _endtime: Date,
        private _lineColor: string,
        private _coordinates: [number[]],
    ){}

    static fromJson(json: WalkJson){
        const walk = new Walk(
            json.id,
            json.starttime,
            json.endtime,
            json.lineColor,
            json.coordinates,
        )
        return walk
    }

    toJson(): WalkJson{
        return {
            id: this._id,
            starttime: this._starttime,
            endtime: this._endtime,
            lineColor: this._lineColor,
            coordinates: this._coordinates
        }
    }

    get id(){
        return this._id;
    }

    get starttime(){
        return this._starttime;
    }

    get endtime(){
        return this._endtime;
    }

    get coordinates(){
        return this._coordinates;
    }

    get lineColor(){
        return this._lineColor;
    }

}