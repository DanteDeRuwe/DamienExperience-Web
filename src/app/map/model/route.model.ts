export interface RouteJson {
    tourname: string,
    distanceInMeters: number,
    lineColor: string,
    coordinates: [number[]]
}

export class Route{
    constructor(
        private _tourname: string,
        private _distanceInMeters: number,
        private _lineColor: string,
        private _coordinates: [number[]]
    ){}

    static fromJson(json: RouteJson){
        const route = new Route(
            json.tourname,
            json.distanceInMeters,
            json.lineColor,
            json.coordinates,
        )
        return route;
    }

    toJson(): RouteJson{
        return {
            tourname: this._tourname,
            distanceInMeters: this._distanceInMeters,
            lineColor: this._lineColor,
            coordinates: this._coordinates,
        };
    }

    get tourname(){
        return this._tourname;
    }

    get distanceInMeters(){
        return this._distanceInMeters;
    }

    get coordinates(){
        return this._coordinates;
    }

    get lineColor(){
        return this._lineColor;
    }

}