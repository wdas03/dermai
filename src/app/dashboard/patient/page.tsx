"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CardTitle, CardHeader, CardContent, Card, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from 'react';

import ClipLoader from 'react-spinners/ClipLoader';

import HomeTab from "@/components/HomeTab";
import DoctorSignIn from '@/components/DoctorSignIn';
import PatientSignIn from '@/components/PatientSignIn';
import PatientRegister from '@/components/PatientRegister';

import { useRouter } from 'next/navigation';
import UpcomingPatientAppointments from "@/components/UpcomingPatientAppointments";
import UploadedPatientPhotos from "@/components/UploadedPatientPhotos";

import Doctor from "@/types/Doctor";

import React from 'react';

const apiEndpoint = 'https://b0pl52e7m1.execute-api.us-east-1.amazonaws.com/test';

export default function PatientDashboard() {
  const router = useRouter();

  const labels_keywords : {[key: string]: string[]} = {
    'actinic keratoses': [
        'actinic keratoses', "actinic keratosis", "keratosis", "sun", "aging", "skin cancer"
    ],
    'basal cell carcinoma': [
         'basal cell carcinoma', "basal cell cancer", "skin cancer", "mole", "malignant tumor"
    ],
    'benign keratosis-like lesions': [
        "seborrheic keratosis", "skin growth", "epithelial cyst", "tumor", 
        "lesion", "dermal growth"
    ],
    'dermatofibroma': [
        "dermatofibroma", "fibrous histiocytoma", "lesion", "fibroma", "skin fibroma", 
        "cutaneous fibrous tumor", "benign fibroma", "nodule", "dermal tumor"
    ],
    'melanocytic nevi': [
        "melanocytic nevus", "mole", "nevus", "pigmented nevus", "skin mole", 
        "benign nevus", "dysplastic nevus", "mole check", "melanoma screening"
    ],
    'melanoma': [
        "melanoma", "skin cancer", "malignant melanoma", "hyperpigmentation", "malignant tumor", 
        "cutaneous melanoma", "malignant skin lesion", "advanced melanoma", "metastatic melanoma"
    ],
    'vascular lesions': [
        "vascular lesion", "hemangioma", "angiomas", "lesion", "vascular tumor", 
        "blood vessel lesion", "vascular anomaly", "vascular birthmark", "capillary hemangioma", "vasculitis"
    ]
  };

  const [activeTab, setActiveTab] = useState('home');
  const [imagePreview, setImagePreview] = useState('');
  const [diagnosisReady, setDiagnosisReady] = useState(false); 
  const [diagnosisResult, setDiagnosisResult] = useState({
    condition: '',
    confidence: 0,   // Assuming confidence is a number, initializing it to 0
    predictions: '',
    error: ''
  });

  const conditionKey = diagnosisResult.condition.toLowerCase();
  const diagnosisRelevantKeywords = conditionKey in labels_keywords 
      ? labels_keywords[conditionKey] 
      : null;

  const [recommendedDoctors, setRecommendedDoctors] = useState<Doctor[]>([]); // Array of doctor objects [{ name: '', specialty: '', location: '' }]
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedDoctorsLoading, setRecommendedDoctorsLoading] = useState(false);

  const [bookingAppointment, setBookingAppointment] = useState(false);

  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);

  const [recommendedDoctorsSearch, setRecommendedDoctorsSearch] = useState<Doctor[]>([]);

  // Add state variables for search parameters
  const [searchZipCode, setSearchZipCode] = useState('');
  const [searchCity, setSearchCity] = useState('');

  // Handle input changes
  const handleZipCodeChange = (e: any) => setSearchZipCode(e.target.value);
  const handleCityChange = (e: any) => setSearchCity(e.target.value);

  const [bookingMessage, setBookingMessage] = useState('');
  const [isBookingSuccessful, setIsBookingSuccessful] = useState(false);

  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: ''
  });

  const [currentDiagnoses, setCurrentDiagnoses] = useState<string[]>([]);

  const getDiagnoses = async () => {
      try {
          const response = await fetch('https://b0pl52e7m1.execute-api.us-east-1.amazonaws.com/test/patients/getDiagnoses', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  userId: userData.email
              })
          });

          const data = await response.json();
          setCurrentDiagnoses(data);
      } catch (error) {
          console.log(error);
      }
  };

  const handleLogout = () => {
      // Clear session storage
      sessionStorage.clear();

      // Redirect to the home page
      router.push('/');
  };

  useEffect(() => {
      const storedData = sessionStorage.getItem('userData');
      if (storedData) {
          setUserData(JSON.parse(storedData));
      } else {
        router.push('/');
      }
  }, [router]);

  useEffect(() => {
    getDiagnoses();
  }, [activeTab]);

  const handleBooking = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setBookingAppointment(true);
    // Prevent default form submission behavior
    e.preventDefault();

    // Find the closest parent div of the button and extract the relevant information
    const bookingDiv = (e.target as HTMLElement).closest('.booking-div');
    const doctorId = bookingDiv?.getAttribute('data-doctor-id');
    const selectedTime = bookingDiv?.querySelector('select')?.value;
    const patientEmail = userData['email'];

    let selectedTimeDateFormat = null;
    if (selectedTime) {
      console.log(selectedTime);
       // Replace ' at ' with a space and remove comma
      const formattedTime = selectedTime.replace(' at ', ' ').replace(',', '');
      const dateObject = new Date(formattedTime);

      // Convert to ISO format
      selectedTimeDateFormat = dateObject.toISOString();
    }

    console.log(doctorId);

    const requestData = {
      patientEmail,
      doctorId,
      appointmentTime: selectedTimeDateFormat
    };

    console.log(requestData);

    if (doctorId) {
      setSelectedDoctorId(doctorId);
    }
    
    // Send the POST request
    try {
      const response = await fetch('https://b0pl52e7m1.execute-api.us-east-1.amazonaws.com/test/doctors/book', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
          'mode': 'cors'
      });

      
      const responseData = await response.json();
      console.log(JSON.stringify(responseData));

      if (!responseData.message) {
        console.log('Booking successful:', responseData);


        setBookingAppointment(false);
        setBookingMessage('Booking successful!');
        setIsBookingSuccessful(true);
      } else {
        console.log('Booking failed:', responseData);

        setBookingAppointment(false);
        setBookingMessage('Booking failed: ' + responseData.message);
        setIsBookingSuccessful(false);
      }
       
    } catch (error) {
        setBookingAppointment(false);
        
        console.error('Error sending booking request:', error);
        setBookingMessage('Error sending booking request: ' + (error as any).message);
        setIsBookingSuccessful(false);
    }

    setBookingAppointment(false);
  };

  // Function to handle form submission
  const handleSearch = (e: any) => {
    e.preventDefault(); // Prevent default form submission behavior
    // Filter recommendedDoctors based on search parameters
    const filteredDoctors = recommendedDoctors.filter(doctor => {
      return (
        (searchZipCode ? doctor.zip === searchZipCode : true) &&
        (searchCity ? doctor.city.toLowerCase() === searchCity.toLowerCase() : true)
      );
    });
    setRecommendedDoctorsSearch(filteredDoctors);
  };

  const getTabClass = (tabName: string) => {
    return activeTab === tabName
      ? "flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-900 font-normal bg-zinc-100 transition-all hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:text-zinc-50"
      : "flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 font-normal transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50";
  };

  // Handle image file change
  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!imagePreview) return;
  
    setIsLoading(true);
  
    try {
      console.log(JSON.stringify({ image: imagePreview }));
      const response = await fetch(`${apiEndpoint}/predict/skincondition`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include other necessary headers
        },
        body: JSON.stringify({ 
                                image: imagePreview,
                                user_id: userData.email
                             }),
        mode: 'cors' // This is important for handling CORS
      });
      

      if (response.ok) {
        const data = await response.json();
        console.log("Received response:", data);

        setDiagnosisResult({ condition: data['condition'], 
                             confidence: data['confidence'], 
                             predictions: JSON.stringify(data['predictions']), 
                             error: ''});
        setDiagnosisReady(true);
        // Handle the response data
      } else {
        // Handle errors
        console.error("Couldn't get request.");

        setDiagnosisResult({ condition: '', confidence: 0, predictions: '', error: 'Failed to get a diagnosis.' });
        setDiagnosisReady(true);
      }
    } catch (error) {
      // Handle network errors
      setDiagnosisResult({ condition: '', confidence: 0, predictions: '', error: 'Failed to get a diagnosis.' });
      setDiagnosisReady(true);
    }
  
    setIsLoading(false);
  };

  const getEarliestAvailability = (availabilities: Date[]) => {
    return availabilities.reduce((earliest, current) => {
      const currentDate = new Date(current);
      return earliest < currentDate ? earliest : currentDate;
    }, new Date(availabilities[0]));
  };
  
  const getRecommendedDoctors = async () => { 
    if (diagnosisReady) {
      const diagnosis = diagnosisResult.condition;

      setRecommendedDoctorsLoading(true);
  
      try {
        const response = await fetch(`${apiEndpoint}/doctors/recommend?diagnosis=${diagnosis}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          mode: 'cors' // Important for handling CORS
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("Received response:", data);

          console.log(data);

          // setRecommendedDoctors(data);
          // Sort the doctors based on their earliest availability
          const sortedDoctors = data.sort((a : Doctor, b : Doctor) => {
            if (a.availabilities && b.availabilities) {
              const earliestA = getEarliestAvailability(a.availabilities).getTime();
              const earliestB = getEarliestAvailability(b.availabilities).getTime();
              return earliestA - earliestB;
            }

            return -1;
          });

          setRecommendedDoctors(sortedDoctors);

          console.log("Recommended doctors:", sortedDoctors);
        } else {
          
          // Handle HTTP errors
          console.error("Error fetching recommended doctors.");
          setRecommendedDoctors([]);
        }
      } catch (error) {
        // Handle network errors
        console.error("Network error:", error);
        setRecommendedDoctors([]);
      }
    } else {
      console.error("Diagnosis is not ready yet.");
    }

    setRecommendedDoctorsLoading(false);
  }
  

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <>
              <HomeTab setActiveTab={setActiveTab} />
              <div className="container mx-auto">
                <Card className="pt-4 w-full mt-5 mb-20"> {/* Adjust width as needed */}
                    <CardContent>
                        <div className="mt-2 space-y-2">
                            <UpcomingPatientAppointments userId={userData.email}/>
                        </div>
                    </CardContent>
                </Card>
             </div>
          </>
        );
      case 'skinDiagnosis':
        return (
          <>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-center p-12 border-2 border-dashed rounded-lg text-gray-500">
                <div className="space-y-2 text-center">
                  <svg
                    className=" h-8 w-8 text-gray-500 mx-auto"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" x2="12" y1="3" y2="15" />
                  </svg>
                  <div className="flex text-sm justify-center">
                    <Label
                      className="relative rounded-md font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
                      htmlFor="skin-picture"
                    >
                      Upload a skin picture
                      <Input className="sr-only" id="skin-picture" required type="file" accept="image/jpeg, image/png" onChange={handleImageChange} />
                    </Label>
                    
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-4">
                  <h3 className="text-center text-lg font-semibold mb-2">Image Preview</h3> {/* Header */}
                  <div className="flex justify-center">
                    <div className="border-2 border-gray-300 shadow-lg rounded-lg overflow-hidden max-w-sm"> {/* Frame-like style */}
                      <img src={imagePreview} alt="Preview" className="object-cover" style={{ width: '300px', height: '300px' }} />
                    </div>
                  </div>
                </div>
              )}

            </div>

            <div className="flex justify-center mt-4">
              <Button className="w-auto" type="submit" onClick={analyzeImage}>Analyze Picture</Button> {/* Centered button */}
            </div>
          </div>
          
          {isLoading && (
            <div className="flex justify-center items-center">
              <ClipLoader size={40} />
            </div>
          )}

          {diagnosisReady ? (
            <>
            <div className="mt-4 bg-green-50 rounded-lg px-4 py-5 border border-gray-200 mb-10">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Diagnosis Result</h2>
              <p className="mt-2 max-w-2xl text-sm text-gray-500">
                Condition: {diagnosisResult.condition}<br />
                {diagnosisResult.confidence !== 0 && (
                  <>Confidence: {diagnosisResult.confidence}%</>
                )}
              </p>

              <div className="flex items-center mt-5">
                <Button size="sm" onClick={() => setActiveTab('appointments')}>
                  Find Recommended Doctors
                </Button>
              </div>
            </div>
           </>
          ) : 
            <div className="mt-12 mb-12">
              <div className="bg-gray-50 rounded-lg px-4 py-5 border border-gray-200">
                <h2 className="text-lg leading-6 font-medium text-gray-900">Diagnosis</h2>
                <p className="mt-2 max-w-2xl text-sm text-gray-500">
                  Your diagnosis will appear here after the image analysis.
                </p>
              </div>
            </div>
          }
          </>
        )
      case 'appointments':
        return (
          <>
          {!diagnosisReady && (
            <>
            <div className="bg-red-100 border-b border-red-200 py-2 rounded-lg">
              <p className="text-center text-sm text-gray-700">
                Please upload a skin image to get a diagnosis.
              </p>
            </div>
            <div className="flex items-center">
              <Button size="sm" onClick={() => setActiveTab('skinDiagnosis')}>
                Upload Skin Image
              </Button>
            </div>
            </>
          )} 
         
          {diagnosisReady && (
            <>
            <h1 className="text-2xl leading-6 font-medium text-gray-900 mt-5">Diagnosis</h1>
            <hr />
            <div className="bg-green-50 rounded-lg px-4 py-5 border border-gray-200">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Diagnosis Result</h2>
              <p className="mt-2 max-w-2xl text-sm text-gray-500">
                Condition: {diagnosisResult.condition}<br />
                {diagnosisResult.confidence !== 0 && (
                  <>Confidence: {diagnosisResult.confidence}%</>
                )}
              </p>
            </div>
            </>
          )}

          <p className="mt-5">Or select from an existing diagnosis: </p>
            <select 
                onChange={(e) => {
                    console.log(e.target.value);
                    setDiagnosisResult({condition: e.target.value, confidence: 0, predictions: '', error: ''});
                    setDiagnosisReady(true);
                }}
            >
                <option key={0}>Choose a diagnosis</option>
                {currentDiagnoses.map((diagnosis, index) => (
                    <option key={index+1}>{diagnosis}</option>
                ))}
            </select>  

          <h1 className="text-2xl leading-6 font-medium text-gray-900 mt-10">Recommended Doctors</h1>
          <hr />
          <div className="flex items-center">
            <Button size="sm" onClick={getRecommendedDoctors}>
                Find Recommended Doctors
            </Button>
          </div>

          {recommendedDoctorsLoading && (
            <div className="flex justify-center items-center">
              <ClipLoader size={40} />
            </div>
          )}

          {/* {bookingMessage && (
            <div style={{ color: isBookingSuccessful ? 'green' : 'red' }}>
                {bookingMessage}
            </div>
          )} */}

          {/* Display doctor information */}
          {recommendedDoctors.length > 0 ? (
            <>
            <div className="flex items-center">
              <Button size="sm" onClick={() => setActiveTab('searchDoctors')}>
                  Search Recommended Doctors
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-10">
              
              {recommendedDoctors.map((doctor : Doctor, index) => (
                <div key={index} className="p-8 border border-gray-200 rounded-lg shadow-lg booking-div" data-doctor-id={doctor.doctorId}>
                  
                  {doctor.image_url !== "https://nyulangone.org" && (<img 
                      width="200" 
                      height="200" 
                      alt="" 
                      src={doctor.image_url} 
                      className="mb-5 rounded-lg border border-gray-200 shadow-lg" 
                  />
                  )}

                  <h3 className="text-lg font-medium text-gray-900"><strong>{doctor.name}</strong></h3>
                  <p className="text-sm text-gray-500">
                  <strong>
                      {Array.isArray(doctor.specialties) 
                          ? doctor.specialties.join(', ') 
                          : doctor.specialties}
                  </strong><br />
                    {doctor.address1}, {doctor.address2}<br />
                    {doctor.city}, {doctor.state}, {doctor.zip}<br />
                    Phone: {doctor.phone}<br />
                  </p>

                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-gray-900"><strong>Focus Areas</strong></h4>
                    <p className="text-sm text-gray-500">
                        {doctor.focus.map((focusArea, index) => {
                            const formattedFocusArea = focusArea.split(' ').map((word, wordIndex) => {
                                const lowerCaseWord = word.toLowerCase();
                                const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

                                // Check if the word (in lowercase) is in the diagnosisRelevantKeywords list
                                if (diagnosisRelevantKeywords && diagnosisRelevantKeywords.includes(lowerCaseWord)) {
                                    return <strong key={wordIndex}>{capitalizedWord}</strong>;
                                } else {
                                    return <span key={wordIndex}>{capitalizedWord}</span>;
                                }
                            });

                            // Convert array of JSX elements to a single JSX element
                            return <span key={index}>{formattedFocusArea.reduce((acc, elem, arrIndex) => (
                                <React.Fragment key={arrIndex}>{acc} {elem}</React.Fragment>
                            ))}</span>;
                        }).reduce((prev, curr, arrIndex) => (
                            <React.Fragment key={arrIndex}>{prev}, {curr}</React.Fragment>
                        ))}
                    </p>
                  </div>

                  
                  {doctor.availabilities ? (
                  <>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900"><strong>Available Appointments</strong></h4>
                    <select className="form-select mt-1 block w-full rounded-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      {doctor.availabilities.map((time, timeIndex) => (
                        <option key={timeIndex}>
                          {new Date(time).toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'long', 
                              day: 'numeric', 
                              hour: 'numeric', 
                              minute: 'numeric', 
                              hour12: true 
                          })}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Conditionally Render Booking Message for this Doctor */}
                  {selectedDoctorId === doctor.doctorId && bookingMessage && (
                    <div className="mt-2" style={{ color: isBookingSuccessful ? 'text-green-200' : 'text-red-200' }}>
                      {bookingMessage}
                    </div>
                  )}

                  {bookingAppointment && selectedDoctorId === doctor.doctorId && (
                    <div className="flex justify-center items-center mt-2">
                      <ClipLoader size={40} />
                    </div>
                  
                  )}

                  <Button className="mt-5" onClick={handleBooking}>
                  Book Appointment
                  </Button>
                  </>
                  ) : (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900"><strong>Available Appointments</strong></h4>
                      <p className="text-sm text-gray-500">No appointments available.</p>
                    </div>
                  )}

                </div>
              ))}
            </div>
            </>
          ) : (
            <div className="flex justify-center items-center mb-10">
              <p className="text-center text-sm text-gray-700">
                
              </p>
            </div>
          
          )}
          </>
        );
      case 'searchDoctors':
        return (
          <>
          <div className="border shadow-sm rounded-lg">
            <Card>
              <CardHeader>
                <CardTitle>Book Appointment</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input id="zipCode" placeholder="Enter your ZIP code" value={searchZipCode} onChange={handleZipCodeChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="Enter your city" value={searchCity} onChange={handleCityChange} required />
                    </div>
                  </div>
                  <Button className="w-full mt-4" type="submit">
                    Find Doctors
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {recommendedDoctorsSearch.length > 0 ? (
            <>
            <div className="grid grid-cols-2 gap-4 mb-10">
              
              {recommendedDoctorsSearch.map((doctor : Doctor, index) => (
                <div key={index} className="p-8 border border-gray-200 rounded-lg shadow-lg booking-div" data-doctor-id={doctor.doctorId}>
                  <img 
                      width="200" 
                      height="200" 
                      alt="" 
                      src={doctor.image_url} 
                      className="mb-5 rounded-lg border border-gray-200 shadow-lg" 
                  />

                  <h3 className="text-lg font-medium text-gray-900"><strong>{doctor.name}</strong></h3>
                  <p className="text-sm text-gray-500">
                  <strong>
                      {Array.isArray(doctor.specialties) 
                          ? doctor.specialties.join(', ') 
                          : doctor.specialties}
                  </strong><br />
                    {doctor.address1}, {doctor.address2}<br />
                    {doctor.city}, {doctor.state}, {doctor.zip}<br />
                    Phone: {doctor.phone}<br />
                  </p>

                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-gray-900"><strong>Focus Areas</strong></h4>
                    <p className="text-sm text-gray-500">
                        {doctor.focus.map((focusArea, index) => {
                            const formattedFocusArea = focusArea.split(' ').map((word, wordIndex) => {
                                const lowerCaseWord = word.toLowerCase();
                                const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

                                // Check if the word (in lowercase) is in the diagnosisRelevantKeywords list
                                if (diagnosisRelevantKeywords && diagnosisRelevantKeywords.includes(lowerCaseWord)) {
                                    return <strong key={wordIndex}>{capitalizedWord}</strong>;
                                } else {
                                    return <span key={wordIndex}>{capitalizedWord}</span>;
                                }
                            });

                            // Convert array of JSX elements to a single JSX element
                            return <span key={index}>{formattedFocusArea.reduce((acc, elem, arrIndex) => (
                                <React.Fragment key={arrIndex}>{acc} {elem}</React.Fragment>
                            ))}</span>;
                        }).reduce((prev, curr, arrIndex) => (
                            <React.Fragment key={arrIndex}>{prev}, {curr}</React.Fragment>
                        ))}
                    </p>
                  </div>

                  
                  {doctor.availabilities ? (
                  <>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900"><strong>Available Appointments</strong></h4>
                    <select className="form-select mt-1 block w-full rounded-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      {doctor.availabilities.map((time, timeIndex) => (
                        <option key={timeIndex}>
                          {new Date(time).toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'long', 
                              day: 'numeric', 
                              hour: 'numeric', 
                              minute: 'numeric', 
                              hour12: true 
                          })}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedDoctorId === doctor.doctorId && bookingMessage && (
                    <div className="mt-2" style={{ color: isBookingSuccessful ? 'text-green-200' : 'text-red-200' }}>
                      {bookingMessage}
                    </div>
                  )}

                  {bookingAppointment && selectedDoctorId === doctor.doctorId && (
                    <div className="flex justify-center items-center mt-2">
                      <ClipLoader size={40} />
                    </div>
                  
                  )}

                  <Button className="mt-5" onClick={handleBooking}>
                  Book Appointment
                  </Button>
                  </>
                  ) : (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900"><strong>Available Appointments</strong></h4>
                      <p className="text-sm text-gray-500">No appointments available.</p>
                    </div>
                  )}

                </div>
              ))}
            </div>
            </>
          ) : (
            <div className="flex justify-center items-center mb-10">
              <p className="text-center text-sm text-gray-700">
                
              </p>
            </div>
          
          )}
          </>
        );
      case 'chat':
        return <UpcomingPatientAppointments userId={userData.email} />;
      case 'uploadedPhotos':
        return <UploadedPatientPhotos userId={userData.email} />;
      case 'patientRegister':
        return <PatientRegister setActiveTab={setActiveTab} />;
      case 'patientSignIn':
        return <PatientSignIn setActiveTab={setActiveTab} />;
      case 'doctorSignIn':
        return <DoctorSignIn />;
      default:
        return null;
    }
  };

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      {/* <div className="hidden border-r bg-zinc-100/40 lg:block dark:bg-zinc-800/40"> */}
      <div className="hidden border-r lg:block shadow-xxl">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link href="" className={`${getTabClass(activeTab)}`} onClick={() => setActiveTab('home')}>
                <svg
                  className=" h-6 w-6"
                  fill="pink"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  color="pink"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                <span className="">DermAI+</span>
              </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
            {userData && userData.first_name && userData.last_name && (
              <div className="flex flex-col pb-5 pl-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">{userData.first_name} {userData.last_name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-light">Patient</p>
              </div>
            )}
            <hr className="mb-5"></hr>
            <Link
                className={getTabClass('home')}
                href=""
                onClick={() => setActiveTab('home')}
              >
                <svg
                  className=" h-4 w-4"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                Home
              </Link>
              <Link
                className={getTabClass('skinDiagnosis')}
                href=""
                onClick={() => setActiveTab('skinDiagnosis')}
              >
                <svg
                  className=" h-4 w-4"
                  fill="none"
                  // color="white"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
                Get Skin Diagnosis
              </Link>
              <Link
                className={getTabClass('appointments')}
                href=""
                onClick={() => setActiveTab('appointments')}
              >
                <svg
                  className=" h-4 w-4"
                  fill="none"
                  // color="blue"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17 6.1H3" />
                  <path d="M21 12.1H3" />
                  <path d="M15.1 18H3" />
                </svg>
                Find Recommended Doctors
              </Link>
              <Link
                className={getTabClass('searchDoctors')}
                href=""
                onClick={() => setActiveTab("searchDoctors")}
              >
                 <svg
                  className=" h-4 w-4"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect height="18" rx="2" ry="2" width="18" x="3" y="4" />
                  <line x1="16" x2="16" y1="2" y2="6" />
                  <line x1="8" x2="8" y1="2" y2="6" />
                  <line x1="3" x2="21" y1="10" y2="10" />
                </svg>
                Search Recommended Doctors
              </Link>
              <Link
                className={getTabClass('chat')}
                href=""
                onClick={() => setActiveTab("chat")}
              >
                <svg
                  className=" h-4 w-4"
                  fill="none"
                  height="24"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17 6.1H3" />
                  <path d="M21 12.1H3" />
                  <path d="M15.1 18H3" />
                </svg>
                Upcoming Appointments
              </Link>
              
              <Link
                className={`${getTabClass('uploadedPhotos')}`}
                href=""
                onClick={() => setActiveTab('uploadedPhotos')}
              >
                Uploaded Photos + Diagnoses
              </Link>

              <Button
                size="sm"
                className="w-32 mt-5"
                onClick={handleLogout}
              >
                Log Out
              </Button>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 lg:h-[60px] items-center gap-4 border-b bg-zinc-100/40 px-6 dark:bg-zinc-800/40">
          <Link className="lg:hidden" href="#">
            <svg
              className=" h-6 w-6"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="sr-only">Home</span>
          </Link>
          <div className="w-full flex-1">
            <h1 className="font-semibold text-lg">Patient Portal</h1>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 pl-20 pr-20 pt-10">
          {renderTabContent()}
        </main>
      </div>
    </div>
  )
}