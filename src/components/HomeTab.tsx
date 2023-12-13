import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import React from 'react';

interface HomeTabProps {
    setActiveTab: (tab: string) => void;
}

const HomeTab: React.FC<HomeTabProps> = ({ setActiveTab }) => {
    return (
        <>
        <div className="container mx-auto py-4 px-4 space-y-8 ">
          <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow">
            <Card className="pt-4">
              <CardContent>
                <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300">Upload Image</h2>
                <p className="text-gray-500 dark:text-gray-400">Upload a picture of your skin to receive a diagnosis</p>
                <div className="mt-2">
                  <Button size="sm" onClick={() => setActiveTab('skinDiagnosis')}>Upload Image</Button>
                </div>
              </CardContent>
            </Card>
            <Card className="pt-4 mt-4">
              <CardContent>
                <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300">Search Doctors</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  Find available appointments with doctors based on location and specialty
                </p>
                <div className="mt-2 space-y-2">
                  <Button size="sm" onClick={() => setActiveTab('appointments')}>Search</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="flex-grow">
            <Card className="pt-4">
              <CardContent>
                <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300">Scheduled Appointments</h2>
                <p className="text-gray-500 dark:text-gray-400">View your upcoming appointments</p>
                <div className="mt-2 space-y-2">
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
        </>
      );
};

export default HomeTab;