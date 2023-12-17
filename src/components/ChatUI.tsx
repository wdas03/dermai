import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from 'uuid';

interface ChatMessage {
  message: string;
  type: string;
}

export default function ChatUI({ websocketUrl }: { websocketUrl: string }) {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const userId = useRef(uuidv4()); // Unique identifier for the user session

  // const endpoint = "wss://o7bfm1l7g6.execute-api.us-east-1.amazonaws.com/dev/?appointmentId=2";
  
  useEffect(() => {
    const webSocket = new WebSocket(websocketUrl);

    webSocket.onopen = () => {
      console.log('WebSocket Connected');
      setWs(webSocket);
    };

    webSocket.onmessage = (event) => {
      console.log(event);
      const data = JSON.parse(event.data);
      console.log(data['message']);

      // Determine if the message is 'sent' or 'received' based on the userId
      const messageType = data.senderID === userId.current ? 'sent' : 'received';
      setChatHistory(prevHistory => [...prevHistory, { ...data, type: messageType }]);
    };

    webSocket.onclose = () => console.log('WebSocket Disconnected');

    return () => {
      webSocket.close();
      console.log("closed connection.");
    };
  }, []);

  const sendMessage = () => {
    if (ws && message) {
      const payload = { action: "sendMessage", message : message, user_id: userId.current };
      ws.send(JSON.stringify(payload));
      setMessage('');
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-4 bg-white border shadow-sm rounded-lg p-4">
        {chatHistory.length == 0 && 
          <p className="text-sm">Start your conversation here!</p>
        }
        {/* Chat History */}
        {chatHistory.map((chat, index) => (
          <>
          {chat.type == 'received' ? 
           <div className="flex items-start">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-zinc-100/40 mr-3">
              <svg
                className=" h-6 w-6"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="bg-zinc-100/40 rounded-lg px-4 py-2">
              <p className="text-sm">{chat.message}</p>
            </div>
          </div>
          :
          <div className="flex items-start ml-auto">
            <div className="bg-zinc-800/40 text-zinc-50 rounded-lg px-4 py-2">
              <p className="text-sm">{chat.message}</p>
            </div>
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-zinc-800/40 ml-3">
              <svg
                className=" h-6 w-6"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          </div>
          }
          </>
        ))}
      </div>
      {/* Input and Send Button */}
      <div className="mt-4">
          <div className="flex">
            <Input 
              className="flex-grow mr-2" 
              placeholder="Enter your message..." 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button 
              className="w-auto" 
              variant="outline" 
              onClick={sendMessage}
            >
              Send
            </Button>
          </div>
        </div>
    </>
  );
}