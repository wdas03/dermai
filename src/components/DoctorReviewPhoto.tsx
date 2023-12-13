import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

function ArrowRightIcon(props) {
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

export default function DoctorReviewPhoto() {
    return (
        <div className="flex items-center justify-center gap-6">
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
                  src="/placeholder.svg"
                  width="300"
                />
                <div className="grid gap-1.5 w-full">
                  <Label htmlFor="ml-diagnosis">ML Diagnosis</Label>
                  <div className="flex items-center bg-yellow-100 rounded-md py-1 px-2">
                    <Input id="ml-diagnosis" placeholder="Diagnosis" readOnly type="text" />
                    <p className="ml-2 text-sm text-gray-700">Confidence: 92%</p>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Diagnosis provided by the Machine Learning model.
                  </p>
                </div>
              </div>
              <div className="grid gap-1.5 w-full">
                <Label htmlFor="doctor-diagnosis">Doctor's Diagnosis</Label>
                <Textarea id="doctor-diagnosis" placeholder="Type your diagnosis here." />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Doctor's diagnosis based on the patient's skin photo.
                </p>
              </div>
            </CardContent>
            <CardFooter className="text-xs p-0 justify-center">
              <div className="flex space-x-4 justify-center">
                <Button className="bg-green-500 text-white rounded-lg px-4 py-2">Confirm</Button>
                <Button className="bg-red-500 text-white rounded-lg px-4 py-2">Reject</Button>
              </div>
            </CardFooter>
          </Card>
          <div className="flex justify-center items-center transform transition duration-500 ease-in-out hover:scale-110">
            <ArrowRightIcon className="w-12 h-12" />
          </div>
        </div>
      )
}