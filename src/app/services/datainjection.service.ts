import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatainjectionService {
  obserervableMapData$: Observable<any>;
  private observableMapDataSubject = new Subject<any>();

  constructor() {
    this.obserervableMapData$ = this.observableMapDataSubject.asObservable();
   }

  observableMapData(data){
    this.observableMapDataSubject.next(data);
  }
}
