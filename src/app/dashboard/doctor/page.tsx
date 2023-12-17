"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from 'react';

import DoctorReviewPhoto from "@/components/DoctorReviewPhoto";
import DoctorHomeTab from "@/components/DoctorHomeTab";
import ChatUI from "@/components/ChatUI";

import { useRouter } from 'next/navigation';
import UpcomingDoctorAppointments from "@/components/UpcomingDoctorAppointments";

import Doctor from '@/types/Doctor';

const apiEndpoint = 'https://b0pl52e7m1.execute-api.us-east-1.amazonaws.com/Dev';

export default function DoctorDashboard() {
  const router = useRouter();

  const [doctorData, setDoctorData] = useState<Doctor | any>({});

  const handleLogout = () => {
      // Clear session storage
      sessionStorage.clear();

      // Redirect to the home page
      router.push('/');
  };

  useEffect(() => {
      const storedData = sessionStorage.getItem('doctorData');
      if (storedData) {
          setDoctorData(JSON.parse(storedData));
      } else {
        router.push('/');
      }

      console.log(doctorData);
  }, [doctorData, router]);
  

  const [activeTab, setActiveTab] = useState('home');

  const getTabClass = (tabName: string) => {
    return activeTab === tabName
      ? "flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-900 bg-zinc-100 transition-all hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:text-zinc-50"
      : "flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50";
  };


  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <DoctorHomeTab setActiveTab={setActiveTab} photosToReviewCount={5} doctorId={doctorData.doctorId} />;
      case 'chat':
        return <UpcomingDoctorAppointments userId={doctorData.doctorId} />;
      case 'reviewSkinDiagnoses':
        return <DoctorReviewPhoto doctorId={doctorData.doctorId} />;
      default:
        return null;
    }
  };

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-zinc-100/40 lg:block dark:bg-zinc-800/40">
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
            {doctorData && doctorData.name && (
              <div className="flex flex-col pb-5 pl-5">
                <img 
                width="200" 
                height="200" 
                alt="" 
                src={doctorData.image_url} 
                className="mb-2 mt-2 rounded-lg border border-gray-200 shadow-lg" 
                />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">{doctorData.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Doctor</p>
              </div>
            )}

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
                Upcoming Appointments
              </Link>
              <Button
                size="sm"
                className="w-32 mt-5"
                // className="flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
               
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
            <h1 className="font-semibold text-lg">Doctor Portal</h1>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 pl-20 pr-20 pt-10">
          {renderTabContent()}
        </main>
      </div>
    </div>
  )
}