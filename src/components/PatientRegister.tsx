import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

import React from 'react';

interface Props {
    setActiveTab: (tab: string) => void;
}

const PatientRegister: React.FC<Props> = ({ setActiveTab }) => {
    return (
        <Card className="w-full max-w-md mx-auto mt-20">
            <CardHeader>
                <CardTitle className="text-2xl text-center">Patient Register</CardTitle>
                <CardDescription className="text-center">Please enter your information below.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <form>
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
                        <Button type="submit" className="w-full">Sign in</Button>
                    </CardFooter>
                </form>
            </CardContent>
        </Card>
    );
};

export default PatientRegister;