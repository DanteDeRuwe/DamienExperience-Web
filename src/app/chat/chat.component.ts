import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { io } from 'socket.io-client';
import { UserDataService } from '../services/user-data.service';
import { User } from '../models/user.model';
import { ChatMessage } from '../models/chatmessage.model';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @ViewChild('scrollMe') chat: ElementRef;
  @Input() roomname: string;
  // username = 'Jordy';
  // room = 'JordyRoom';
  // chatForm = document.getElementById('chat-form');
  socket;

  loggedon: boolean = false;
  messages: ChatMessage[] = [];

  scrolltop: number = null;

  constructor(
    private _uds: UserDataService
    ) { }

  ngOnInit(): void {
    this._uds.profile$.subscribe((user: User) => {
      if(user){
        this.loggedon = true
        this.socket = io(environment.liveChatApi, { transports: ['websocket']});
        const room = 'Jordy\'s Room';

        this.socket.emit('join room', {username: user.lastName, email: user.email, room: this.roomname})

        this.socket.on('chat message', (message: ChatMessage) => { 
          this.outputMessage(message);
          this.scrolltop = this.chat.nativeElement.scrollHeight;
        });
      }
    });
  }

  onSendMessage(event){
    if(event.target.message.value !== ''){ 
      this.socket.emit('chat message', event.target.message.value)
      event.target.elements.msg.value = '';
      event.target.elements.msg.focus();
    }
    setTimeout(()=> this.scrolltop = this.chat.nativeElement.scrollHeight, 150);

  }

  outputMessage(message: ChatMessage){
    this.messages.push(message);
  }
}