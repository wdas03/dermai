import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React from 'react';

interface DoctorHomeTabProps {
    setActiveTab: (tab: string) => void;
    // Add other relevant props, like count of photos to review
    photosToReviewCount: number;
}

const DoctorHomeTab: React.FC<DoctorHomeTabProps> = ({ setActiveTab, photosToReviewCount }) => {
    return (
        <>
        <div className="container mx-auto py-4 px-4 space-y-8 ">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Section for reviewing skin photos */}
            <div className="flex-grow">
              <Card className="pt-4">
                <CardContent>
                  <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300">Review Skin Photos</h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    {photosToReviewCount > 0
                      ? `You have ${photosToReviewCount} skin photo(s) to review.`
                      : "No new skin photos to review."}
                  </p>
                  <div className="mt-2">
                    <Button size="sm" onClick={() => setActiveTab('reviewSkinDiagnoses')}>Review Photos</Button>
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
                    {/* Add any other relevant content for scheduled appointments */}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        </>
    );
};

export default DoctorHomeTab;
