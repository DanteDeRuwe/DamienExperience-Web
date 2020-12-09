/*TODO: 
x  Payment component uitbreiden naar volledige pagina
x  Registration aangemaakt -> Navigeren naar payment
x  Payment data meegeven met navigatie
  Api-calls
x    -> zoeken naar niet betaalde registratie van ingelogde gebruiker
x    -> flag betaling op true zetten
    -> Registratie overal updaten
  Payment result uitwerken
x  ShaSign encryptie (dynamisch en secret)
*/
import { Component, OnInit } from '@angular/core';
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
  amountInEuro : String = "50,00"

  constructor(private route: ActivatedRoute,private _routeRepo : RouteDataService) { }

  ngOnInit(): void {
    this.route.data.subscribe(item => {
      this.payment = item['data']
      console.log(this.payment)
      if(this.payment.amount == "6500"){
        this.amountInEuro = "65,00"
        this.orderdShirt = true
      }      
    })
  }
}
