export interface WalkJson {
    id: string,
    routeID: string,
    starttime: Date,
    endtime: Date,
    walkedPath: {
        lineColor: string,
        coordinates: [number[]],
    }
}

export class Walk{
    constructor(
        private _id: string,
        private _routeID: string,
        private _starttime: Date,
        private _endtime: Date,
        private _walkedPath: {
            lineColor: string,
            coordinates: [number[]],
        }
        //private _lineColor: string,
        //private _coordinates: [number[]],
    ){}

    static fromJson(json: WalkJson){
        const walk = new Walk(
            json.id,
            json.routeID,
            json.starttime,
            json.endtime,
            json.walkedPath
            //json.lineColor,
            //json.coordinates,
        )
        return walk
    }

    toJson(): WalkJson{
        return {
            id: this._id,
            routeID: this._routeID,
            starttime: this._starttime,
            endtime: this._endtime,
            walkedPath: this._walkedPath
            //lineColor: this._lineColor,
            //coordinates: this._coordinates
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

    get walkedPath(){
        return this._walkedPath
    }

    get routeID(){
        return this._routeID
    }

    // get coordinates(){
    //     return this._coordinates;
    // }

    // get lineColor(){
    //     return this._lineColor;
    // }

}