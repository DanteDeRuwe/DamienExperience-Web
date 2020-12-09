import { Waypoint } from './waypoint.model';

export interface RouteJson {
    id: string,
    tourName: string,
    date: Date,
    distanceInMeters: number,
    path: {
        lineColor: string,
        coordinates: [number[]]
    },
    info: {
        nl: string,
        fr: string
    }
    waypoints: Waypoint[]
}

export class Route {
    constructor(
        private _id: string,
        private _tourName: string,
        private _date: Date,
        private _distanceInMeters: number,
        private _path : {
            lineColor: string;
            coordinates: [number[]];
        } ,
        private _info,
        private _waypoints: Waypoint[]
    ) { }

    static fromJson(json: RouteJson) {

        const route = new Route(
            json.id,
            json.tourName,
            json.date,
            json.distanceInMeters,
            json.path,
            json.info,
            Waypoint.fromJsonList(json.waypoints)
        )
        return route;
    }

    toJson(): RouteJson {
        return {
            id: this._id,
            tourName: this._tourName,
            date: this._date,
            distanceInMeters: this._distanceInMeters,
            path: this._path,
            info: this._info,
            waypoints: Waypoint.toJsonList(this._waypoints)
        };
    }

    get tourId() {
        return this._id;
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

    get path(){
        return this._path
    }

    get info() {
        return this._info
    }

    get waypoints(){
        return this._waypoints
    }

    set waypoints(waypoints: Waypoint[]){
        this._waypoints = waypoints
    }
}