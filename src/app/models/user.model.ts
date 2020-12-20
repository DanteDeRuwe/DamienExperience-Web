import { Registration } from './registration.model';

export interface UserJson {
    id: string;
    lastName: string;
    firstName: string;
    email: string;
    phoneNumber: number;
    dateOfBirth : string;
    registrations: Registration[];
    friends : string[];
    privacy : number;
}

export class User{
    constructor(
        private _id: string,
        private _firstName: string,
        private _lastName: string,
        private _email: string,
        private _phoneNumber: number,
        private _dateOfBirth : string,
        private _registrations: Registration[],
        private _friends : string[],
        private _privacy : number
    ) {}

    static fromJson(json: UserJson){
        var date = User.translateDate(json.dateOfBirth)
        const user = new User(
            json.id,
            json.firstName,
            json.lastName,
            json.email,
            json.phoneNumber,
            date,
            json.registrations,
            json.friends,
            json.privacy
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
            dateOfBirth : this._dateOfBirth,
            registrations: this._registrations,
            friends : this._friends,
            privacy : this._privacy
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
    get friends() {
        return this._friends;
    }
    get privacy() {
        return this._privacy;
    }
    get dateOfBirth() {
        return this._dateOfBirth;
    }
    static translateDate(date: string) :string {
        var year = date.substring(6)
        var month = date.substring(3,5)
        var day = date.substring(0,2)
        return `${year}-${month}-${day}`
    }
    
    
}