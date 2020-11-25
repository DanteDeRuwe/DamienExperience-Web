import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WebSocketService } from '../services/web-socket.service';
//import * as io from 'socket.io-client';
import { io } from 'socket.io-client';
import { AuthenticationService } from '../services/authentication.service';
import { UserDataService } from '../services/user-data.service';
import { User } from '../models/user.model';
import { ChatMessage } from '../models/chatmessage.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  // username = 'Jordy';
  // room = 'JordyRoom';
  // chatForm = document.getElementById('chat-form');
  socket;

  loggedon: boolean = false;
  messages: ChatMessage[] = [];

  constructor(
    private _uds: UserDataService
    ) { }

  ngOnInit(): void {
    this._uds.profile$.subscribe((user: User) => {
      if(user){
        this.loggedon = true
        this.socket = io(environment.liveChatApi, { transports: ['websocket']});
        const room = 'Jordy\'s Room';

        this.socket.emit('join room', {username: user.lastName, room})

        this.socket.on('chat message', message => { 
          this.outputMessage(message);
        });
      }
    })
    
  }

  onSendMessage(event){
    if(event.target.message.value !== ''){
      this.socket.emit('chat message', event.target.message.value)
      event.target.elements.msg.value = '';
      event.target.elements.msg.focus();
    }
  }

  outputMessage(message){
    this.messages.push(message);
  }
}