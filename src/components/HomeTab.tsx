import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import React from 'react';

interface HomeTabProps {
    setActiveTab: (tab: string) => void;
}

const HomeTab: React.FC<HomeTabProps> = ({ setActiveTab }) => {
    return (
        <>
        <div className="container mx-auto">
          <div className="flex flex-row gap-4 justify-center">

            {/* Step 1: Upload Image */}
            <Card className="flex-1 pt-4">
              <CardContent>
                <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300">Step 1: Upload Image</h2>
                <p className="text-gray-500 dark:text-gray-400">Upload a clear picture of your skin for an automated diagnosis.</p>
                {/* Placeholder for Image */}
                {/* <img src="path-to-upload-image-visual.jpg" alt="Upload Image" className="mt-2" /> */}
                <div className="mt-4">
                  <Button size="sm" onClick={() => setActiveTab('skinDiagnosis')}>Upload Image</Button>
                </div>
              </CardContent>
            </Card>

            {/* Step 2: Get Diagnosis */}
            <Card className="flex-1 pt-4">
              <CardContent>
                <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300">Step 2: Diagnosis</h2>
                <p className="text-gray-500 dark:text-gray-400">Receive an AI-powered diagnosis in less than 30 seconds.</p>
                {/* Placeholder for Diagnosis Visual */}
                {/* <img src="path-to-diagnosis-visual.jpg" alt="Diagnosis" className="mt-2" /> */}
              </CardContent>
            </Card>

            {/* Step 3: Find Doctors */}
            <Card className="flex-1 pt-4">
              <CardContent>
                <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300">Step 3: Find Doctors</h2>
                <p className="text-gray-500 dark:text-gray-400">Find tailored recommendations and search for dermatologists based on your diagnosis.</p>
                {/* Placeholder for Doctors Visual */}
                {/* <img src="path-to-doctors-visual.jpg" alt="Doctors" className="mt-2" /> */}
                <div className="mt-4">
                  <Button size="sm" onClick={() => setActiveTab('appointments')}>Find Doctors</Button>
                </div>
              </CardContent>
            </Card>

            {/* Step 4: Share Results & Schedule Appointment */}
            <Card className="flex-1 pt-4">
              <CardContent>
                <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300">Step 4: Share & Schedule</h2>
                <p className="text-gray-500 dark:text-gray-400">Share your diagnosis with your doctor and schedule a meeting to discuss further steps.</p>
                {/* Placeholder for Schedule Visual */}
                {/* <img src="path-to-schedule-visual.jpg" alt="Schedule" className="mt-2" /> */}
                <div className="mt-4">
                  <Button size="sm">Schedule Appointment</Button>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
        </>
    );
};

export default HomeTab;
