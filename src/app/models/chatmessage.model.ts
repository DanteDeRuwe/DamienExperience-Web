export interface ChatMessage {
    sender: {
        name: string, 
        email: string
    };
    time: string;
    text: string;
}