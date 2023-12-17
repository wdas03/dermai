import { useEffect, useState } from "react";

import {Card, CardHeader, CardContent} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import ClipLoader from "react-spinners/ClipLoader";

import MLDiagnosis from "@/types/MlDiagnosis";
import PatientPhoto from "@/types/PatientPhoto";

export default function UploadedPatientPhotos({ userId }: { userId: string }) {
    const [uploadedPhotos, setUploadedPhotos] = useState<PatientPhoto[] | null>(null);

    const fetchUploadedPhotos = async () => {
        try {
            const response = await fetch('https://b0pl52e7m1.execute-api.us-east-1.amazonaws.com/test/patients/getImages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userId
                })
            });

            const data = await response.json();
            setUploadedPhotos(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchUploadedPhotos();
    }, []);

    if (!uploadedPhotos) {
        return (
            <div className="flex justify-center items-center">
                <ClipLoader size={40} />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {uploadedPhotos && uploadedPhotos.length == 0 && (
                <div className="flex justify-center items-center">
                    <p className="text-xl text-gray-600">No photos uploaded yet</p>
                </div>
              )}

              {uploadedPhotos && uploadedPhotos.map((photo, index) => {
                // Parse the mlDiagnosis JSON string
                let diagnosis : MLDiagnosis;
                try {
                    diagnosis = JSON.parse(photo.mlDiagnosis);
                } catch (error) {
                    console.error('Error parsing mlDiagnosis:', error);
                    // Handle the error or provide default values
                    diagnosis = { condition: 'Unknown', confidence: 0 };
                }

                const isReviewed = photo.isReviewed;
                const reviewedBy = photo.reviewedBy;
                const correctedDiagnosis = photo.correctedDiagnosis;

                return (
                    <Card key={index} className="w-full max-w-md p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                        <CardHeader className="flex justify-center items-center">
                            <img
                                alt="Patient Skin Photo"
                                className="w-40 h-40 rounded-lg shadow-sm"
                                src={photo.presignedUrl}
                            />
                        </CardHeader>
                        <CardContent className="mt-4">
                            <div className="text-center">
                                <Label htmlFor={`ml-diagnosis-${index}`} className="text-xl font-semibold">ML Diagnosis</Label>
                                <p id={`ml-diagnosis-${index}`} className="text-lg font-bold text-gray-800">{diagnosis.condition}</p>
                                <div className="mt-2 bg-yellow-100 rounded-md py-1 px-2 inline-block">
                                    <p className="text-sm text-gray-700">Confidence: {diagnosis.confidence.toFixed(2)}%</p>
                                </div>
                                {isReviewed && (
                                    <div className="mt-4">
                                        <p className="text-sm text-green-500">Reviewed by {reviewedBy}</p>
                                        <p className="text-sm font-semibold mt-5">Corrected Diagnosis: <br /></p>
                                        <p>{correctedDiagnosis || "No correction provided"}</p>
                                    </div>
                                )}
                                {!isReviewed && (
                                    <p className="mt-4 text-sm text-red-500">Not yet reviewed by a doctor</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                );
            })}

          </div>
    )
}
