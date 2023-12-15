import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ChatUI() 
{
    return (
    <>
     <div className="flex flex-col space-y-4 bg-white border shadow-sm rounded-lg p-4">
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
          <p className="text-sm">Hello, Doctor</p>
        </div>
      </div>
      <div className="flex items-start ml-auto">
        <div className="bg-zinc-800/40 text-zinc-50 rounded-lg px-4 py-2">
          <p className="text-sm">Hello, how can I help you today?</p>
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
    </div>
    <div className="mt-4">
      <div className="flex">
        <Input className="flex-grow mr-2" placeholder="Enter your message..." />
        <Button className="w-auto" variant="outline">
          Send
        </Button>
      </div>
    </div>
    </>
  );
};