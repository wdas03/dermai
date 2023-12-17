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
import ChatUI from '@/components/ChatUI';

const apiEndpoint = 'https://b0pl52e7m1.execute-api.us-east-1.amazonaws.com/test';

export default function Home() {
  const [activeTab, setActiveTab] = useState('home');

  const getTabClass = (tabName: string) => {
    return activeTab === tabName
      ? "flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-900 bg-zinc-100 transition-all hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:text-zinc-50"
      : "flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-all hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50";
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeTab setActiveTab={setActiveTab} />;
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
      <div className="block border-r bg-zinc-100/40 lg:block dark:bg-zinc-800/40">
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
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-24 items-center gap-4 border-b bg-zinc-100/40 px-6 dark:bg-zinc-800/40">
          <Link className="" href="#">
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
            <h1 className="font-semibold text-lg">Portal</h1>
          </div>
          <Button
                className="w-32"
                onClick={() => setActiveTab('patientRegister')}
              >
                Patient Sign Up
              </Button>
              <Button
                className="w-32"
                onClick={() => setActiveTab('patientSignIn')}
              >
                Patient Sign In
              </Button>
              <Button
                className="w-32"
                onClick={() => setActiveTab("doctorSignIn")}
              >
                Doctor Sign In
              </Button>
        </header>
        <main className="flex flex-1 flex-col gap-4 pl-20 pr-20 pt-10">
          {renderTabContent()}
        </main>
      </div>
    </div>
  )
}