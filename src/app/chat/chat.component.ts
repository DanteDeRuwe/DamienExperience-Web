import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WebSocketService } from '../services/web-socket.service';
//import * as io from 'socket.io-client';
import { io } from 'socket.io-client';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  // username = 'Jordy';
  // room = 'JordyRoom';
  // chatForm = document.getElementById('chat-form');
  socket;

  loggedon: boolean = false;

  constructor(
    private _auths: AuthenticationService
    ) { }

  ngOnInit(): void {
    this._auths.user$.subscribe(user => {
      if(user){
        this.loggedon = true
        this.socket = io(environment.chatApi, { transports: ['websocket']});

        const username = 'Jordy';
        const room = 'Jordy\'s Room';

        this.socket.emit('join room', {username, room})

        this.socket.on('chat message', message => {
          this.outputMessage(message);
        });
      }
    })
    
  }

  onSendMessage(event){
    this.socket.emit('chat message', event.target.message.value)
  }

  outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">${message.text}</p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

}
