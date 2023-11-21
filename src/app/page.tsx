"use client";

import Image from 'next/image'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { SelectValue, SelectTrigger, SelectLabel, SelectItem, SelectGroup, SelectContent, Select } from "@/components/ui/select"
import { useState } from 'react';

import ClipLoader from 'react-spinners/ClipLoader';

const apiEndpoint = 'https://b0pl52e7m1.execute-api.us-east-1.amazonaws.com/Dev';

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');
  const [imagePreview, setImagePreview] = useState('');
  const [diagnosisResult, setDiagnosisResult] = useState({
    condition: null,
    confidence: null,
    error: ''
  });
  const [isLoading, setIsLoading] = useState(false);

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
  
    try {
      const response = await fetch(`${apiEndpoint}/predict/skincondition`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include other necessary headers
        },
        // body: JSON.stringify({ image: imagePreview }),
        mode: 'cors' // This is important for handling CORS
      });
      

      if (response.ok) {
        const data = await response.json();
        console.log("Received response:", data);

        setDiagnosisResult(data);
        // Handle the response data
      } else {
        // Handle errors
        console.error("Couldn't get request.");
        setDiagnosisResult({ condition: null, confidence: null, error: 'Failed to get a diagnosis.' });
      }
    } catch (error) {
      // Handle network errors
      setDiagnosisResult({ condition: null, confidence: null, error: 'Failed to get a diagnosis.' });
    }
  
    setIsLoading(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
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
                    {/* <Input placeholder="Location" />
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="dermatology">Dermatology</SelectItem>
                          <SelectItem value="general">General Practice</SelectItem>
                          <SelectItem value="pediatrics">Pediatrics</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select> */}
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
                    <div className="border rounded-lg p-5">
                      <p className="font-bold">Dr. Jane Doe</p>
                      <p>General Practice</p>
                      <p>Tomorrow at 2:00 PM</p>
                    </div>
                    <div className="border rounded-lg p-5">
                      <p className="font-bold">Dr. John Smith</p>
                      <p>Dermatology</p>
                      <p>Next week at 11:00 AM</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          </div>
          </>
        )
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

          {diagnosisResult.condition != null ? (
            <div className="mt-4 bg-green-50 rounded-lg px-4 py-5 border border-gray-200">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Diagnosis Result</h2>
              <p className="mt-2 max-w-2xl text-sm text-gray-500">
                Condition: {diagnosisResult.condition}<br />
                Confidence: {diagnosisResult.confidence}%
              </p>
            </div>
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
          <div className="flex items-center">
            <Button className="ml-auto" size="sm" onClick={() => setActiveTab('skinDiagnosis')}>
              Upload Skin Image
            </Button>
          </div>
          <div className="border shadow-sm rounded-lg">
            <Card>
              <CardHeader>
                <CardTitle>Book an Appointment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input id="zipCode" placeholder="Enter your ZIP code" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" placeholder="Enter your city" required />
                  </div>
                  <div className="space-y-2 grid-cols-2">
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
                    {/* <img
                      alt="Map"
                      className="mt-2"
                      height="300"
                      src="/placeholder.svg"
                      style={{
                        aspectRatio: "300/300",
                        objectFit: "cover",
                      }}
                      width="300"
                    /> */}
                  </div>
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
              </CardContent>
            </Card>
          </div>
          </>
        );
      case 'chat':
        return (
          <>
           <div className="flex flex-col space-y-4 bg-white border shadow-sm rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-zinc-100/40 mr-3">
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
              </div>
              <div className="bg-zinc-100/40 rounded-lg px-4 py-2">
                <p className="text-sm">Hello, Doctor</p>
              </div>
            </div>
            <div className="flex items-start ml-auto">
              <div className="bg-zinc-800/40 text-zinc-50 rounded-lg px-4 py-2">
                <p className="text-sm">Hello, how can I help you today?</p>
              </div>
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-zinc-800/40 ml-3">
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
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex">
              <Input className="flex-grow mr-2" placeholder="Enter your message..." />
              <Button className="w-auto" variant="outline">
                Send
              </Button>
            </div>
          </div>
          </>
        );
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
                Skin Diagnosis
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
                Appointments
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
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          {renderTabContent()}
        </main>
      </div>
    </div>
  )
}