import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouteDataService } from '../services/route-data.service';

@Component({
  selector: 'app-payment-response',
  templateUrl: './payment-response.component.html',
  styleUrls: ['./payment-response.component.css']
})
export class PaymentResponseComponent implements OnInit {
  private _params : any
  succes : boolean = false
  errorMessage : String = ""
  constructor(private route: ActivatedRoute,private _routeService : RouteDataService) { }
  /*
  AAVADDRESS: "NO"
  ACCEPTANCE: "TEST"
  BRAND: "KBC Online"
  CARDNO: ""
  CN: ""
  ED: ""
  IP: "178.117.47.151"
  NCERROR: "0"
  PAYID: "3092731841"
  PM: "KBC Online"
  SHASIGN: "EE86434F942B07A27DB63F5068E1F8236DCA6DC5"
  STATUS: "9"
  TRXDATE: "12/10/20"
  amount: "65"
  currency: "EUR"
  orderID: "785a535b-9759-497e-b59c-c4e311a5da96"
  */
  ngOnInit(): void {
    this.route.queryParams.subscribe((params)=>{
      console.log(params)
      this._params = params
      this.extractStatus(params.STATUS)
    })
  }
  extractStatus(statusString : any){
    var status = Number(statusString)
    console.log(status)
    switch (status) {
      case 0: this.succes = false; this.errorMessage = this._params.NCERROR;
        break;
      case 1: this.succes = false; this.errorMessage = "Customer canncelled payment";
        break;
      case 5:  
      case 9: this.sendApiCall()
        break;
       
      default:
        break;
    }
  }
  sendApiCall(){
    console.log(this._params.orderID)
    this._routeService.paymentResponse(this._params).subscribe((val)=>{
      console.log("response :" +val)
    });
  }

}