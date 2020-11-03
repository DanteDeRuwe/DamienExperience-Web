export interface RouteJson {
    tourId: string,
    tourName: string,
    date: Date,
    distanceInMeters: number,
    lineColor: string,
    coordinates: [number[]]
}

export class Route {
    constructor(
        private _tourId: string,
        private _tourName: string,
        private _date: Date,
        private _distanceInMeters: number,
        private _lineColor: string,
        private _coordinates: [number[]]
    ) { }

    static fromJson(json: RouteJson) {
        const route = new Route(
            json.tourId,
            json.tourName,
            json.date,
            json.distanceInMeters,
            json.lineColor,
            json.coordinates,
        )
        return route;
    }

    toJson(): RouteJson {
        return {
            tourId: this._tourId,
            tourName: this._tourName,
            date: this._date,
            distanceInMeters: this._distanceInMeters,
            lineColor: this._lineColor,
            coordinates: this._coordinates,
        };
    }

    get tourId() {
        return this._tourId;
    }

    get tourName() {
        return this._tourName;
    }

    get date() {
        return this._date;
    }

    get distanceInMeters() {
        return this._distanceInMeters;
    }

    get coordinates() {
        return this._coordinates;
    }

    get lineColor() {
        return this._lineColor;
    }

}