import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouteDataService } from '../services/route-data.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-payment-response',
  templateUrl: './payment-response.component.html',
  styleUrls: ['./payment-response.component.scss']
})
export class PaymentResponseComponent implements OnInit {
  private _params : any
  loading : boolean = true
  succes : boolean = false
  errorMessage : String = ""
  status : Number
  tourName: string

  constructor(private route: ActivatedRoute,private _routeService : RouteDataService) { }
  ngOnInit(): void {
    this.route.queryParams.subscribe((params)=>{
      this._params = params
      this.extractStatus(params.STATUS)
    })
  }
  extractStatus(statusString : any){
    switch (statusString) {
      case "0": this.succes = false; this.loading = false; this.errorMessage = this._params.NCERROR;
        break;
      case "1": this.succes = false; this.loading = false; this.errorMessage = "Customer canncelled payment";
        break;
      case "5":  
      case "9": this.sendApiCall()
        break;
       
      default:
        this.succes = false; this.loading = false; this.errorMessage = "Customer canncelled payment";
        break;
    }
  }
  sendApiCall(){
    console.log(this._params.orderID)
    this._routeService.paymentResponse(this._params).subscribe(
      (val : any)=>{
      this.tourName = val.tourName
      this.succes = val.valid
      this.loading = false;
    },
    (err: HttpErrorResponse) => {
      this.succes = false; 
      this.loading = false; 
      this.errorMessage = "Payment failed"             
    });
  }

}


