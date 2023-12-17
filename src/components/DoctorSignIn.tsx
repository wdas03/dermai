import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const DoctorSignIn = () => {
    const [doctorId, setDoctorId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setErrorMessage('');

        try {
            const response = await fetch('https://b0pl52e7m1.execute-api.us-east-1.amazonaws.com/test/doctors/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ doctor_id: doctorId })
            });
            const data = await response.json();

            if (data.error) {
                setErrorMessage(data.error);
            } else {
                // Store the doctor data in session storage
                sessionStorage.setItem('doctorData', JSON.stringify(data));

                console.log(sessionStorage.getItem('doctorData'));

                // Redirect to the dashboard/doctor route
                router.push('/dashboard/doctor');
            }
        } catch (error) {
            setErrorMessage('An error occurred during sign in.');
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto mt-5">
            <CardHeader>
                <CardTitle className="text-2xl text-center">Doctor Login</CardTitle>
                <CardDescription className="text-center">Please enter your Doctor ID to access your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="doctorId">Doctor ID</Label>
                        <Input 
                            id="doctorId" 
                            placeholder="Enter your Doctor ID" 
                            required 
                            type="text" 
                            value={doctorId} 
                            onChange={(e) => setDoctorId(e.target.value)} 
                        />
                    </div>
                    <CardFooter className="mt-10">
                        <Button type="submit" className="w-full">Sign in</Button>
                    </CardFooter>
                </form>
                {errorMessage && (
                    <div className="mt-4 text-red-500 text-center">
                        {errorMessage}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default DoctorSignIn;
