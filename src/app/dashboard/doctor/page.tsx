"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CardTitle, CardHeader, CardContent, Card, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { SelectValue, SelectTrigger, SelectLabel, SelectItem, SelectGroup, SelectContent, Select } from "@/components/ui/select"
import { useState } from 'react';

import ClipLoader from 'react-spinners/ClipLoader';

import DoctorSignIn from '@/components/DoctorSignIn';
import PatientSignIn from '@/components/PatientSignIn';
import PatientRegister from '@/components/PatientRegister';
import DoctorReviewPhoto from "@/components/DoctorReviewPhoto";
import DoctorHomeTab from "@/components/DoctorHomeTab";

const apiEndpoint = 'https://b0pl52e7m1.execute-api.us-east-1.amazonaws.com/Dev';

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [imagePreview, setImagePreview] = useState('');
  const [diagnosisReady, setDiagnosisReady] = useState(false); 
  const [diagnosisResult, setDiagnosisResult] = useState({
    condition: null,
    confidence: null,
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
        return <DoctorHomeTab setActiveTab={setActiveTab} photosToReviewCount={5} />;
      case 'reviewSkinDiagnoses':
        return <DoctorReviewPhoto />;
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
                className={getTabClass('reviewSkinDiagnoses')}
                // className="flex items-center gap-3 rounded-lg bg-zinc-100 px-3 py-2 text-zinc-900  transition-all hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:text-zinc-50"
                href=""
                onClick={() => setActiveTab('reviewSkinDiagnoses')}
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
                Review Skin Diagnoses
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