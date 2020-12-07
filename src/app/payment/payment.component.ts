import { Component, OnInit } from '@angular/core';
import sha1 from 'sha1';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  hash = sha1(
    "AMOUNT=500s*aW2dr86U++ZaKU"+
    "CURRENCY=EURs*aW2dr86U++ZaKU"+
    "EMAIL=ruben.naudts@student.hogent.bes*aW2dr86U++ZaKU"+
    "LANGUAGE=nl_NLs*aW2dr86U++ZaKU"+
    "ORDERID=3s*aW2dr86U++ZaKU"+
    "PSPID=damiaanacties*aW2dr86U++ZaKU" )
  //CryptoJS.SHA1("PSPID=damiaanacties*aW2dr86U++ZaKUORDERID=3s*aW2dr86U++ZaKUAMOUNT=5s*aW2dr86U++ZaKUCURRENCY=EURs*aW2dr86U++ZaKULANGUAGE=en_USs*aW2dr86U++ZaKUEMAIL=ruben.naudts@student.hogent.bes*aW2dr86U++ZaKU");

  constructor() { }

  ngOnInit(): void {
  }

}
