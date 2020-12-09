import { Registration } from './registration.model';

export interface UserJson {
    id: string;
    lastName: string;
    firstName: string;
    email: string;
    phoneNumber: number;
    registrations: Registration[];
}

export class User{
    constructor(
        private _id: string,
        private _firstName: string,
        private _lastName: string,
        private _email: string,
        private _phoneNumber: number,
        private _registrations: Registration[]
    ) {}

    static fromJson(json: UserJson){
        const user = new User(
            json.id,
            json.lastName,
            json.firstName,
            json.email,
            json.phoneNumber,
            json.registrations
        );
        return user;
    }

    toJson(): UserJson{
        return{
            id: this._id,
            lastName: this._lastName,
            firstName: this._firstName,
            email: this._email,
            phoneNumber: this._phoneNumber,
            registrations: this._registrations
        };
    }


    get id(){
        return this._id;
    }

    get lastName(){
        return this._lastName;
    }

    get firstName(){
        return this._firstName;
    }

    get email(){
        return this._email;
    }

    get phoneNumber(){
        return this._phoneNumber;
    }

    get registrations(){
        return this._registrations;
    }
}