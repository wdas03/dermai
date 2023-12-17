import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import ClipLoader from 'react-spinners/ClipLoader';

interface Props {
    setActiveTab: (tab: string) => void;
}

const PatientSignIn: React.FC<Props> = ({ setActiveTab }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (event: any) => {
        setLoading(true);

        event.preventDefault();
        setErrorMessage('');

        try {
            const response = await fetch('https://b0pl52e7m1.execute-api.us-east-1.amazonaws.com/test/patients/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();

            if (data.error) {
                setLoading(false);
                setErrorMessage(data.error);
            } else {
                // Store the relevant data in session storage
                sessionStorage.setItem('userData', JSON.stringify(data));

                console.log(sessionStorage.getItem('userData'));

                // Redirect to the dashboard/patients route
                router.push('/dashboard/patient');
            }
        } catch (error) {
            setLoading(false);
            setErrorMessage('An error occurred during sign in.');
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto mt-5">
            <CardHeader>
                <CardTitle className="text-2xl text-center">Patient Login</CardTitle>
                <CardDescription className="text-center">Please enter your credentials to access your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" placeholder="Enter your email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2 mt-5">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" placeholder="Enter your password" required type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <CardFooter className="mt-10">
                        <Button type="submit" className="w-full">Sign in</Button>
                    </CardFooter>
                </form>
                {loading && (
                    <div className="mt-4 text-center">
                        <ClipLoader size={40} />
                    </div>
                )}
                {errorMessage && (
                    <div className="mt-4 text-red-500 text-center">
                        {errorMessage}
                    </div>
                )}
                <div className="mt-4 text-center">
                    <a href="#" onClick={() => setActiveTab('patientRegister')} className="text-blue-600 hover:underline">Sign Up</a>
                </div>
            </CardContent>
        </Card>
    );
};

export default PatientSignIn;
