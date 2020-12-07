import { Component, OnInit } from '@angular/core';
import sha1 from 'sha1';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  hash = sha1("PSPID=damiaanacties*aW2dr86U++ZaKUORDERID=3s*aW2dr86U++ZaKUAMOUNT=5s*aW2dr86U++ZaKUCURRENCY=EURs*aW2dr86U++ZaKULANGUAGE=en_USs*aW2dr86U++ZaKUEMAIL=ruben.naudts@student.hogent.bes*aW2dr86U++ZaKU")
  //CryptoJS.SHA1("PSPID=damiaanacties*aW2dr86U++ZaKUORDERID=3s*aW2dr86U++ZaKUAMOUNT=5s*aW2dr86U++ZaKUCURRENCY=EURs*aW2dr86U++ZaKULANGUAGE=en_USs*aW2dr86U++ZaKUEMAIL=ruben.naudts@student.hogent.bes*aW2dr86U++ZaKU");

  constructor() { }

  ngOnInit(): void {
  }

}
