import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import ClipLoader from "react-spinners/ClipLoader"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

import { useState, useEffect } from "react"

import MLDiagnosis from "@/types/MlDiagnosis"

function ArrowRightIcon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    )
}

function ArrowLeftIcon(props: any) {
  return (
      <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
      >
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
      </svg>
  );
}

interface ReviewPhoto {
    userImageReference: string;
    presignedUrl: string;
    mlDiagnosis: string;
}

export default function DoctorReviewPhoto({doctorId} : {doctorId: string}) {
  const [selectedDiagnosis, setSelectedDiagnosis] = useState('');
  const [photos, setPhotos] = useState<ReviewPhoto[] | null>([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [additionalComments, setAdditionalComments] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchPhotos = async () => {
    try {
        console.log(doctorId);
        const response = await fetch('https://b0pl52e7m1.execute-api.us-east-1.amazonaws.com/test/doctors/getPatientImages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                doctorId
            })
        });

        const data = await response.json();

        if (data.length == 0) {
          setPhotos(null);
        } else {
          setPhotos(data);
        }

        console.log(data);

    } catch (error) {
        console.log(error);
    }
};

// Handle diagnosis confirmation
const confirmDiagnosis = async () => {
    setLoading(true);

    const payload = {
        filename: currentPhoto.userImageReference,
        corrected_diagnosis: selectedDiagnosis,
        doctor_id: doctorId
    };

    console.log(payload);

    try {
      const response = await fetch('https://b0pl52e7m1.execute-api.us-east-1.amazonaws.com/test/doctors/reviewImage', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
      });

      const data = await response.json();
      console.log(data);

      fetchPhotos();
    } catch (error) {
      console.log(error);
    }

    // Navigate to next photo
    if (currentPhotoIndex < photos.length - 1) {
        setCurrentPhotoIndex(currentPhotoIndex + 1);
        setSelectedDiagnosis('');
        setAdditionalComments('');
    }

    setLoading(false);
  };

  useEffect(() => {
      fetchPhotos();
  }, [doctorId, currentPhotoIndex]);

  // Navigation functions
  const goToNextPhoto = () => {
      if (currentPhotoIndex < photos.length - 1) {
          setCurrentPhotoIndex(currentPhotoIndex + 1);
      }
  };
  const goToPreviousPhoto = () => {
      if (currentPhotoIndex > 0) {
          setCurrentPhotoIndex(currentPhotoIndex - 1);
      }
  };

  let currentPhoto : any = null;
  if (photos) {
    currentPhoto = photos[currentPhotoIndex];
  } 
  

  const labels = [
      'Actinic keratoses',
      'Basal cell carcinoma',
      'Benign keratosis-like lesions',
      'Dermatofibroma',
      'Melanocytic nevi',
      'Melanoma', 
      'Vascular lesions'
    ];

    if (!photos) {
      return (
        <div className="flex justify-center items-center">
          No photos to review at this time.
        </div>
      );
    } else if (!currentPhoto) {
      return (
        <div className="flex justify-center items-center">
          <ClipLoader size={40} />
        </div>
      );
    };

    let mlDiagnosis : MLDiagnosis;
    try {
        mlDiagnosis = JSON.parse(currentPhoto.mlDiagnosis);
    } catch (error) {
        console.error('Error parsing mlDiagnosis:', error);
        // Handle the error or provide default values
        mlDiagnosis = { condition: 'Unknown', confidence: 0 };
    }

    return (
        <div className="flex items-center justify-center gap-6 mb-10">
          {/* Left arrow for navigation */}
          <Button onClick={goToPreviousPhoto}>
            <ArrowLeftIcon className="w-6 h-6" />
          </Button>

          <Card className="w-full max-w-2xl p-10 grid gap-6">
            <CardHeader className="items-center space-y-0 gap-4 p-0">
              <div className="grid gap-1 text-center">
                <CardTitle className="text-lg">Patient Photo Review</CardTitle>
                <CardDescription className="text-xs">
                  Review patient-submitted skin photos and validate ML diagnosis
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="p-0 grid gap-4">
              <div className="flex items-center gap-4">
                <img
                  alt="Patient Skin Photo"
                  className="aspect-square object-cover border border-gray-200 w-full rounded-lg overflow-hidden dark:border-gray-800"
                  height="300"
                  src={currentPhoto.presignedUrl}
                  width="300"
                />

                <div className="grid gap-1.5 w-full">
                  <h1 className="text-xl">ML Diagnosis</h1>
                  <div className="flex items-center bg-green-100 rounded-md p-4">
                    <h3 className="text-lg font-bold" id="ml-diagnosis" placeholder="Diagnosis">{mlDiagnosis.condition}</h3>
                  </div>
                  <div className="flex items-center bg-yellow-100 rounded-md py-1 px-2">
                    <p className="ml-2 text-sm text-gray-700 text-lg">Confidence: {mlDiagnosis.confidence}%</p>
                  </div>
                </div>
              </div>
              <div className="grid gap-1.5 w-full">
                <Label htmlFor="doctor-diagnosis">Your Diagnosis</Label>
                <select
                    id="doctor-diagnosis"
                    className="form-select mt-1 block rounded-md border-gray-300"
                    value={selectedDiagnosis}
                    onChange={(e) => setSelectedDiagnosis(e.target.value)}
                >
                    <option value="">Select a diagnosis</option>
                    {Object.entries(labels).map(([key, value]) => (
                        <option key={key} value={value}>{value}</option>
                    ))}
                </select>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Select the correct diagnosis from the dropdown.
                </p>

                <Textarea className="mt-5" id="doctor-diagnosis" placeholder="Enter any additional comments here for the patient to review." />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Write any additional comments for the patient.
                </p>
              </div>
            </CardContent>
            {loading && (
              <div className="flex space-x-4 justify-center">
                <ClipLoader size={40} />
              </div>
            )}
            <CardFooter className="text-xs p-0 justify-center">
              <div className="flex space-x-4 justify-center">
                <Button onClick={confirmDiagnosis} className="bg-green-500 text-white rounded-lg px-4 py-2">Confirm</Button>
              </div> 
            </CardFooter>
            
              
          </Card>

          {/* Right arrow for navigation */}
          <Button onClick={goToNextPhoto}>
            <ArrowRightIcon className="w-6 h-6" />
          </Button>

          {/* <div className="flex justify-center items-center transform transition duration-500 ease-in-out hover:scale-110">
            <ArrowRightIcon className="w-12 h-12" />
          </div> */}
        </div>
      )
}