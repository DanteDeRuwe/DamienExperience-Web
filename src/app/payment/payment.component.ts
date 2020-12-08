/*TODO: 
  Payment component uitbreiden naar volledige pagina
x  Registration aangemaakt -> Navigeren naar payment
  Payment data meegeven met navigatie
  Api-calls
x    -> zoeken naar niet betaalde registratie van ingelogde gebruiker
x    -> flag betaling op true zetten
    -> Registratie overal updaten
  Payment result uitwerken
  ShaSign encryptie (dynamisch en secret)


*/



import { Component, OnInit } from '@angular/core';
import sha1 from 'sha1';
import { RouteDataService } from '../services/route-data.service';
import { Payment } from '../models/payment.model';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  payment : Payment 
  orderdShirt : boolean = false
  amountInEuro : String = "50"
  hash : string

  constructor(private route: ActivatedRoute,private _routeRepo : RouteDataService) { }

  ngOnInit(): void {
    console.log(this.hash)
    this.route.data.subscribe(item => {
      this.payment = item['data']
      console.log(this.payment)
      if(this.payment.amount == "6500"){
        this.amountInEuro = "65"
        this.orderdShirt = true
      }
      var key = "s*aW2dr86U++ZaKU"
      var ihash =
                "AMOUNT=" + this.payment.amount + key +
                "CURRENCY=" + this.payment.currency + key +
                "EMAIL=" + this.payment.email + key +
                "LANGUAGE=" + this.payment.language + key +
                "ORDERID=" + this.payment.orderId + key +
                "PSPID=" + this.payment.pspId + key +
                "USERID=" + this.payment.userId + key;
      this.hash =sha1(ihash)
    })
  }
}
