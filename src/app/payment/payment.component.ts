/*TODO: 
  Payment component uitbreiden naar volledige pagina
  Registration aangemaakt -> Navigeren naar payment
  Payment data meegeven met navigatie
  Api-calls
    -> zoeken naar niet betaalde registratie van ingelogde gebruiker
x    -> flag betaling op true zetten
    -> Registratie overal updaten
  Payment result uitwerken
  ShaSign encryptie (dynamisch en secret)


*/



import { Component, OnInit } from '@angular/core';
import sha1 from 'sha1';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  hash = sha1(
    "AMOUNT=500s*aW2dr86U++ZaKU"+
    "CURRENCY=EURs*aW2dr86U++ZaKU"+
    "EMAIL=ruben.naudts@student.hogent.bes*aW2dr86U++ZaKU"+
    "LANGUAGE=nl_NLs*aW2dr86U++ZaKU"+
    "ORDERID=4s*aW2dr86U++ZaKU"+
    "PSPID=damiaanacties*aW2dr86U++ZaKU" )

  constructor() { }

  ngOnInit(): void {
  }

}
