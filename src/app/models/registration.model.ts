import { ShirtSize } from "../enums.model";

export interface RegistrationJson {
    registrationId: string,
    timeStamp: Date,
    routeId: string,
    orderedShirt: boolean,
    sizeShirt: string,
    paid: boolean
}

export class Registration {
    constructor(
        private _registrationId: string,
        private _timeStamp: Date,
        private _routeId: string,
        private _orderedShirt: boolean,
        private _sizeShirt: string,
        private _paid: boolean
    ) { }

    static fromJson(json: RegistrationJson) {
        var enumValue = (<any>ShirtSize)[json.sizeShirt];
        const registration = new Registration(
            json.registrationId,
            json.timeStamp,
            json.routeId,
            json.orderedShirt,
            enumValue,
            json.paid
        )
        return registration;
    }

    toJson(): RegistrationJson {
        return {
            registrationId: this._registrationId,
            timeStamp: this._timeStamp,
            routeId: this._routeId,
            orderedShirt: this._orderedShirt,
            sizeShirt: this._sizeShirt,
            paid: this._paid
        };
    }

    get paid(){
        return this._paid;
    }

    get registrationId() {
        return this._registrationId;
    }

    get timeStamp() {
        return this._timeStamp;
    }

    get routeId() {
        return this._routeId;
    }

    get orderedShirt() {
        return this._orderedShirt;
    }

    get sizeShirt() {
        return this._sizeShirt;
    }


}