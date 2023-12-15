"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CardTitle, CardHeader, CardContent, Card, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { SelectValue, SelectTrigger, SelectLabel, SelectItem, SelectGroup, SelectContent, Select } from "@/components/ui/select"
import { useState } from 'react';

import ClipLoader from 'react-spinners/ClipLoader';

import HomeTab from "@/components/HomeTab";
import DoctorSignIn from '@/components/DoctorSignIn';
import PatientSignIn from '@/components/PatientSignIn';
import PatientRegister from '@/components/PatientRegister';
import ChatUI from "@/components/ChatUI";

const apiEndpoint = 'https://b0pl52e7m1.execute-api.us-east-1.amazonaws.com/test';

export default function PatientDashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [imagePreview, setImagePreview] = useState('');
  const [diagnosisReady, setDiagnosisReady] = useState(false); 
  const [diagnosisResult, setDiagnosisResult] = useState({
    condition: null,
    confidence: null,
    predictions: null,
    error: ''
  });
  const [recommendedDoctors, setRecommendedDoctors] = useState([]); // Array of doctor objects [{ name: '', specialty: '', location: '' }
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedDoctorsLoading, setRecommendedDoctorsLoading] = useState(false);

  const [recommendedDoctorsSearch, setRecommendedDoctorsSearch] = useState([]);
  // Add state variables for search parameters
  const [searchZipCode, setSearchZipCode] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searchSpecialty, setSearchSpecialty] = useState('');

  // Handle input changes
  const handleZipCodeChange = (e: any) => setSearchZipCode(e.target.value);
  const handleCityChange = (e: any) => setSearchCity(e.target.value);
  const handleSpecialtyChange = (e: any) => setSearchSpecialty(e.target.value);

  // Function to handle form submission
  const handleSearch = (e: any) => {
    e.preventDefault(); // Prevent default form submission behavior
    // Filter recommendedDoctors based on search parameters
    const filteredDoctors = recommendedDoctors.filter(doctor => {
      return (
        (searchZipCode ? doctor.zip === searchZipCode : true) &&
        (searchCity ? doctor.city.toLowerCase() === searchCity.toLowerCase() : true) // &&
        // (searchSpecialty ? doctor.specialties.toLowerCase().includes(searchSpecialty.toLowerCase()) : true)
      );
    });
    setRecommendedDoctorsSearch(filteredDoctors);
  };

  const getTabClass = (tabName: string) => {
    return activeTab === tabName
      ? "flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-900 bg-zinc-100 transition-all hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:text-zinc-50"
      : "flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50";
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

    console.log(JSON.stringify({ image: "yo!" }));
  
    try {
      console.log(imagePreview);
      const response = await fetch(`${apiEndpoint}/predict/skincondition`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: JSON.stringify({ image: imagePreview }),
        mode: 'cors' // This is important for handling CORS
      });
      

      if (response.ok) {
        const data = await response.json();
        console.log("Received response:", data);

        setDiagnosisResult(data);
        setDiagnosisReady(true);
        // Handle the response data
      } else {
        // Handle errors
        console.error("Couldn't get request.");

        setDiagnosisResult({ condition: null, confidence: null, error: 'Failed to get a diagnosis.' });
        setDiagnosisReady(true);
      }
    } catch (error) {
      // Handle network errors
      setDiagnosisResult({ condition: null, confidence: null, error: 'Failed to get a diagnosis.' });
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
            'Content-Type': 'application/json',
            // Include other necessary headers
          },
          mode: 'cors' // Important for handling CORS
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("Received response:", data);

          // Sort the doctors based on their earliest availability
          const sortedDoctors = data.sort((a, b) => {
            const earliestA = getEarliestAvailability(a.availabilities).getTime();
            const earliestB = getEarliestAvailability(b.availabilities).getTime();
            return earliestA - earliestB;
          });

          setRecommendedDoctors(sortedDoctors);
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
        return <HomeTab setActiveTab={setActiveTab} />;
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
            <div className="mt-4 bg-green-50 rounded-lg px-4 py-5 border border-gray-200">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Diagnosis Result</h2>
              <p className="mt-2 max-w-2xl text-sm text-gray-500">
                Condition: {diagnosisResult.condition}<br />
                Confidence: {diagnosisResult.confidence}%<br />
                Predictions: {diagnosisResult.predictions}
              </p>

              <div className="flex items-center mt-5">
                <Button size="sm" onClick={() => setActiveTab('appointments')}>
                  Find Recommended Doctors
                </Button>
              </div>
            </div>
           </>
          ) : 
            <div className="mt-12">
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
            <h1 className="text-2xl leading-6 font-medium text-gray-900 mt-10">Diagnosis</h1>
            <hr />
            <div className="bg-green-50 rounded-lg px-4 py-5 border border-gray-200">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Diagnosis Result</h2>
              <p className="mt-2 max-w-2xl text-sm text-gray-500">
                Condition: {diagnosisResult.condition}<br />
                Confidence: {diagnosisResult.confidence}%
              </p>
            </div>

            <div className="flex items-center">
            <Button size="sm" onClick={getRecommendedDoctors}>
              Find Recommended Doctors
            </Button>
            </div>
            </>
          )}

          {recommendedDoctorsLoading && (
            <div className="flex justify-center items-center">
              <ClipLoader size={40} />
            </div>
          )}

          <h1 className="text-2xl leading-6 font-medium text-gray-900 mt-10">Recommended Doctors</h1>
          <hr />
          {/* Display doctor information */}
          {recommendedDoctors.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {recommendedDoctors.map((doctor, index) => (
                <div key={index} className="p-8 border border-gray-200 rounded-lg shadow-lg">
                  <h3 className="text-lg font-medium text-gray-900"><strong>{doctor.name}</strong></h3>
                  <p className="text-sm text-gray-500">
                    <strong>{doctor.specialties}</strong><br />
                    {doctor.address1}, {doctor.address2}<br />
                    {doctor.city}, {doctor.state}, {doctor.zip}<br />
                    Phone: {doctor.phone}<br />
                  </p>

                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-gray-900"><strong>Focus Areas</strong></h4>
                    <p className="text-sm text-gray-500">
                      {doctor.focus.map(focusArea => {
                        const formattedFocusArea = focusArea.split(' ').map(word => {
                          const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                          if (capitalizedWord.toLowerCase() === diagnosisResult.condition.toLowerCase()) {
                            return `<strong>${capitalizedWord}</strong>`;
                          } else {
                            return capitalizedWord;
                          }
                        }).join(' ');

                        return <span dangerouslySetInnerHTML={{ __html: formattedFocusArea }} />;
                      }).reduce((prev, curr) => [prev, ', ', curr])}
                    </p>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900"><strong>Available Appointments</strong></h4>
                    <select className="form-select mt-1 block w-full rounded-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      {doctor.availabilities.map((time, timeIndex) => (
                        <option key={timeIndex} value={time}>
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
                </div>
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center mb-10">
              <p className="text-center text-sm text-gray-700">
                No recommended doctors found.
              </p>
            </div>
          
          )}


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
                    {/* <div className="space-y-2 grid-cols-2">
                      <Label htmlFor="location">Location</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Locations</SelectLabel>
                            <SelectItem value="location1">Location 1</SelectItem>
                            <SelectItem value="location2">Location 2</SelectItem>
                            <SelectItem value="location3">Location 3</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div> */}
                    <div className="space-y-2">
                      <Label htmlFor="specialty">Specialty</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Specialties</SelectLabel>
                            <SelectItem value="dermatology">Dermatology</SelectItem>
                            <SelectItem value="general">General Practice</SelectItem>
                            <SelectItem value="pediatrics">Pediatrics</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button className="w-full mt-4" type="submit">
                    Find Doctors
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {recommendedDoctorsSearch.length > 0 && (
            <div className="grid grid-cols-2 gap-4">
              {recommendedDoctorsSearch.map((doctor, index) => (
                <div key={index} className="p-20 border border-gray-200 rounded-lg shadow-lg">
                  <h3 className="text-lg font-medium text-gray-900"><strong>{doctor.name}</strong></h3>
                  <p className="text-sm text-gray-500">
                    <strong>{doctor.specialties}</strong><br />
                    {doctor.address1}, {doctor.address2}<br />
                    {doctor.city}, {doctor.state}, {doctor.zip}<br />
                    Phone: {doctor.phone}<br />
                  </p>

                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-gray-900"><strong>Focus Areas</strong></h4>
                    <p className="text-sm text-gray-500">
                      {doctor.focus.map(focusArea => {
                        const formattedFocusArea = focusArea.split(' ').map(word => {
                          const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                          if (capitalizedWord.toLowerCase() === diagnosisResult.condition.toLowerCase()) {
                            return `<strong>${capitalizedWord}</strong>`;
                          } else {
                            return capitalizedWord;
                          }
                        }).join(' ');

                        return <span dangerouslySetInnerHTML={{ __html: formattedFocusArea }} />;
                      }).reduce((prev, curr) => [prev, ', ', curr])}
                    </p>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900"><strong>Available Appointments</strong></h4>
                    <select className="form-select mt-1 block w-full rounded-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                      {doctor.availabilities.map((time, timeIndex) => (
                        <option key={timeIndex} value={time}>
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
                </div>
              ))}
            </div>
          )}

          </>
        );
      case 'chat':
        return <ChatUI />;
      case 'patientRegister':
        return <PatientRegister setActiveTab={setActiveTab} />;
      case 'patientSignIn':
        return <PatientSignIn setActiveTab={setActiveTab} />;
      case 'doctorSignIn':
        return <DoctorSignIn setActiveTab={setActiveTab} />;
      default:
        return null;
    }
  };

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-zinc-100/40 lg:block dark:bg-zinc-800/40">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link href="" className={getTabClass(activeTab)} onClick={() => setActiveTab('home')}>
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
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
                <span className="">DermAssist+</span>
              </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-4 text-sm font-medium">
            <Link
                className={getTabClass('home')}
                // className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
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
                // className="flex items-center gap-3 rounded-lg bg-zinc-100 px-3 py-2 text-zinc-900  transition-all hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:text-zinc-50"
                href=""
                onClick={() => setActiveTab('skinDiagnosis')}
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
                  <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                  <circle cx="12" cy="13" r="3" />
                </svg>
                Get Skin Diagnosis
              </Link>
              <Link
                className={getTabClass('appointments')}
                // className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                href=""
                onClick={() => setActiveTab('appointments')}
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
                Find Recommended Doctors
              </Link>
              <Link
                className={getTabClass('chat')}
                // className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
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
                Chat with Doctors
              </Link>
              <Link
                className={getTabClass('doctorLogOut')}
                // className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                href=""
              >
                {/* <svg
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
                </svg> */}
                Uploaded Photos + Diagnoses
              </Link>
              <Link
                className={getTabClass('doctorLogOut')}
                // className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                href=""
              >
                {/* <svg
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
                </svg> */}
                Log Out
              </Link>
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