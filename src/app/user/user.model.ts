export interface UserJson {
    id: string;
    lastName: string;
    firstName: string;
    email: string;
    phoneNumber: number;
}

export class User{
    constructor(
        private _id: string,
        private _firstName: string,
        private _lastName: string,
        private _email: string,
        private _phoneNumber: number
    ) {}

    static fromJson(json: UserJson){
        const user = new User(
            json.id,
            json.lastName,
            json.firstName,
            json.email,
            json.phoneNumber
        );
        return user;
    }

    toJson(): UserJson{
        return{
            id: this._id,
            lastName: this._lastName,
            firstName: this._firstName,
            email: this._email,
            phoneNumber: this._phoneNumber
        }
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
}