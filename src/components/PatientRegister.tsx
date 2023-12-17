import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

import React from 'react';
import { useState } from 'react';

interface Props {
    setActiveTab: (tab: string) => void;
}

const PatientRegister: React.FC<Props> = ({ setActiveTab }) => {
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const formData = {
            first_name: event.target.first_name.value,
            last_name: event.target.last_name.value,
            email: event.target.email.value,
            password: event.target.password.value
        };

        try {
            const response = await fetch('https://b0pl52e7m1.execute-api.us-east-1.amazonaws.com/test/patients/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();

            if (data.error) {
                setMessage(data.error);
                setIsError(true);
            } else {
                setMessage('Registration successful! Sign in below.');
                setIsError(false);
            }
        } catch (error) {
            setMessage('An error occurred.');
            setIsError(true);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto mt-5">
            <CardHeader>
                <CardTitle className="text-2xl text-center">Patient Register</CardTitle>
                <CardDescription className="text-center">Please enter your information below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <form  onSubmit={handleSubmit}>
                <div className="space-y-2">
                        <Label htmlFor="first_name">First Name</Label>
                        <Input id="first_name" name="first_name" placeholder="Enter your first name" required />
                    </div>
                    <div className="space-y-2 mt-5">
                        <Label htmlFor="last_name">Last Name</Label>
                        <Input id="last_name" name="last_name" placeholder="Enter your last name" required />
                    </div>
                    {/* <div className="space-y-2">
                        <Label htmlFor="email">Age</Label>
                        <Input id="email" name="email" placeholder="Enter your email" required type="email" />
                    </div> */}
                    <div className="space-y-2 mt-5">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" placeholder="Enter your email" required type="email" />
                    </div>
                    <div className="space-y-2 mt-5">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" placeholder="Enter your password" required type="password" />
                    </div>
                    <CardFooter className="mt-10">
                        <Button type="submit" className="w-full">Sign Up</Button>
                    </CardFooter>
                </form>
                {message && (
                    <div className={`mt-4 text-center ${isError ? 'text-red-500' : 'text-green-500'}`}>
                        {message}
                    </div>
                )}
                {/* Sign in link */}
                <div className="mt-4 text-center">
                    <a href="#" onClick={() => setActiveTab('patientSignIn')} className="text-blue-600 hover:underline">Sign in</a>
                </div>
            </CardContent>
        </Card>
    );
};

export default PatientRegister;