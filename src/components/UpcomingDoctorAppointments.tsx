import React, { useEffect, useState } from "react";
import { Button } from '@/components/ui/button';

import ChatUI from '@/components/ChatUI';

interface Appointments {
    appointmentId: string;
    appointmentTime: string;
    patientInfo: {
        first_name: string;
        last_name: string;
    }
}

export default function UpcomingDoctorAppointments({ userId }: { userId: string }) {
    const [appointments, setAppointments] = useState<Appointments[]>([]); // Array of appointments
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

    const fetchAppointments = async () => {
        try {
            const response = await fetch('https://b0pl52e7m1.execute-api.us-east-1.amazonaws.com/test/doctors/getAppointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    doctorId: userId
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
    });

    return (
        <>
        {selectedAppointmentId ?
            <div className="mb-20">
                <h1 className="text-lg font-bold">Chat with your Patient</h1> 
                <p className="mb-10">Start chatting! Click exit to disconnect from the chat when you are done.</p>
                <ChatUI websocketUrl={`wss://o7bfm1l7g6.execute-api.us-east-1.amazonaws.com/dev/?appointmentId=${selectedAppointmentId}`} />
                <Button className="mt-10 w-32" onClick={() => setSelectedAppointmentId(null)}>
                    Exit Chat
                </Button>
            </div>
            : <><h1 className="text-lg font-bold">Upcoming Appointments</h1> 
                <p>Join these chat rooms 10 minutes before your scheduled call.</p>
                {appointments.map((appointment) => (
                    <div key={appointment.appointmentId} className="flex justify-between items-center bg-white border shadow-sm rounded-lg p-4 mb-4">
                    <div>
                        <h3 className="text-lg font-medium">{appointment.patientInfo.first_name} {appointment.patientInfo.last_name}</h3> 
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