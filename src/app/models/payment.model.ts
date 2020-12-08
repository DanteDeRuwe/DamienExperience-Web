export interface PaymentJSON{
    amount :string,
    currency :string,
    email :string,
    language :string,
    orderId :string,
    pspId :string,
    userId :string,
    shaSign :string,
    routeName :string
}
export class Payment{
    constructor(
        private _amount :string,
    private _currency :string,
    private _email :string,
    private _language :string,
    private _orderId :string,
    private _pspId :string,
    private _userId :string,
    private _shaSign :string,
    private _routeName :string
    ){}

    static fromJson(json: PaymentJSON) {
        const payment = new Payment(
            json.amount,
            json.currency,
            json.email,
            json.language,
            json.orderId,
            json.pspId,
            json.userId,
            json.shaSign,
            json.routeName
        )
        return payment;
    }
    get amount() {
        return this._amount;
    }
    set amount(value) {
        this._amount = value;
    }
    get currency() {
        return this._currency;
    }
    set currency(value) {
        this._currency = value;
    }
    get email() {
        return this._email;
    }
    set email(value) {
        this._email = value;
    }
    get language() {
        return this._language;
    }
    set language(value) {
        this._language = value;
    }
    get orderId() {
        return this._orderId;
    }
    set orderId(value) {
        this._orderId = value;
    }
    get pspId() {
        return this._pspId;
    }
    set pspId(value) {
        this._pspId = value;
    }
    get userId() {
        return this._userId;
    }
    set userId(value) {
        this._userId = value;
    }
    get shaSign() {
        return this._shaSign;
    }
    set shaSign(value) {
        this._shaSign = value;
    }
    get routeName() {
        return this._routeName;
    }
    set routeName(value) {
        this._routeName = value;
    }
}