import React, { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';

import ClipLoader from "react-spinners/ClipLoader";

import ChatUI from '@/components/ChatUI';

interface Appointments {
    appointmentId: string;
    appointmentTime: string;
    patientInfo: {
        first_name: string;
        last_name: string;
    },
    doctorInfo: {
        name: string;
        image_url: string;
    }
}

export default function UpcomingPatientAppointments({ userId }: { userId: string }) {
    const [appointments, setAppointments] = useState<Appointments[] | null>(null); // Array of appointments
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

    const fetchAppointments = async () => {
        try {
            const response = await fetch('https://b0pl52e7m1.execute-api.us-east-1.amazonaws.com/test/patients/getAppointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    patientEmail: userId
                })
            });

            const data = await response.json();
            setAppointments(data);
        } catch (error) {
            console.log(error);
        }
    };
    
    const joinChat = (appointmentId: string) => {
        setSelectedAppointmentId(appointmentId);
    }

    useEffect(() => {
        // Fetch all appointments for the current user
        fetchAppointments();
    }, [userId]);

    if (!appointments) {
        return (
        <div className="flex justify-center items-center">
          <ClipLoader size={40} />
        </div>
      );
    }

    return (
        <>
        {selectedAppointmentId ?
            <div className="mb-20">
                <h1 className="text-lg font-bold">Chat with your Doctor</h1> 
                <p className="mb-10">Start chatting! Click exit to disconnect from the chat when you are done.</p>
                <ChatUI websocketUrl={`wss://o7bfm1l7g6.execute-api.us-east-1.amazonaws.com/dev/?appointmentId=${selectedAppointmentId}`} />
                <Button className="mt-10 w-32" onClick={() => setSelectedAppointmentId(null)}>
                    Exit Chat
                </Button>
            </div>
            : <><h1 className="text-lg font-bold">Upcoming Appointments</h1> 
                <p>Join these chat rooms 10 minutes before your scheduled call.</p>
                {appointments.map((appointment) => (
                    <div key={appointment.appointmentId} className="flex justify-between items-center bg-white border shadow-sm rounded-lg p-8 mb-4">
                    <div>
                        <img src={appointment.doctorInfo.image_url} className="w-20 h-20 mb-5 rounded-full border shadow-lg border-black-400" />
                        <h3 className="text-lg font-medium">{appointment.doctorInfo.name}</h3> 
                        <p className="text-sm">{new Date(appointment.appointmentTime).toLocaleString()}</p>
                    </div>
                    <Button onClick={() => joinChat(appointment.appointmentId)}>
                        Join Chat
                    </Button>
                    </div>
                ))}
                </>
        }
      </>
    );
}