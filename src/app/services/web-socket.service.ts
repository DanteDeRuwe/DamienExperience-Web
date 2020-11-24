import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {

  socket;
  constructor() {   }

  setupSocketConnection() {
    this.socket = io(environment.chatApi, { transports: ['websocket']});

    const username = 'Jordy';
    const room = 'Jordy\'s Room';

    this.socket.emit('join room', {username, room})
    
    // this.socket.emit('my message', 'Hello there from Angular.');

    // this.socket.on('my broadcast', (data: string) => {
    //   console.log(data);
    // });
  }
}
