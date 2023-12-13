import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

import React from 'react';

interface Props {
    setActiveTab: (tab: string) => void;
}

const DoctorSignIn: React.FC<Props> = ({ setActiveTab }) => {
    return (
        <Card className="w-full max-w-md mx-auto mt-20">
        <CardHeader>
            <CardTitle className="text-2xl text-center">Doctor Login</CardTitle>
            <CardDescription className="text-center">Please enter your Doctor ID to access your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="space-y-2">
            <Label htmlFor="doctorId">Doctor ID</Label>
            <Input id="doctorId" placeholder="Enter your Doctor ID" required type="text" />
            </div>
        </CardContent>
        <CardFooter>
            <Button className="w-full">Sign in</Button>
        </CardFooter>
        </Card>
    );
};

export default DoctorSignIn;