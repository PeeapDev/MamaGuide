"use client"

import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { PatientFormData } from "./patient-form"

interface HistoryEntry {
  id: string
  date: string
  type: string
  notes: string
  provider: string
}

interface MedicationEntry {
  id: string
  date: string
  medication: string
  dosage: string
  administered: boolean
  provider: string
}

interface LabResult {
  id: string
  date: string
  test: string
  result: string
  normalRange: string
  status: "normal" | "abnormal" | "critical"
}

// Mock data for demonstration
const generateMockHistory = (patientId: string) => {
  const visitHistory: HistoryEntry[] = [
    {
      id: "v1",
      date: "2023-06-10",
      type: "Initial ANC Visit",
      notes: "First antenatal care visit. Patient in good health. Blood pressure normal at 110/70.",
      provider: "Dr. Smith",
    },
    {
      id: "v2",
      date: "2023-06-28",
      type: "Follow-up ANC Visit",
      notes: "Routine follow-up. Fetal heartbeat detected. Prescribed prenatal vitamins.",
      provider: "Nurse Johnson",
    },
    {
      id: "v3",
      date: "2023-07-15",
      type: "Ultrasound",
      notes: "Ultrasound performed. Fetal development normal. Estimated gestational age consistent with dates.",
      provider: "Dr. Williams",
    },
  ]

  const medicationHistory: MedicationEntry[] = [
    {
      id: "m1",
      date: "2023-06-10",
      medication: "Folic Acid",
      dosage: "5mg daily",
      administered: true,
      provider: "Dr. Smith",
    },
    {
      id: "m2",
      date: "2023-06-10",
      medication: "Prenatal Vitamins",
      dosage: "1 tablet daily",
      administered: true,
      provider: "Dr. Smith",
    },
    {
      id: "m3",
      date: "2023-06-28",
      medication: "Iron Supplement",
      dosage: "325mg daily",
      administered: true,
      provider: "Nurse Johnson",
    },
  ]

  const labResults: LabResult[] = [
    {
      id: "l1",
      date: "2023-06-10",
      test: "Hemoglobin",
      result: "12.5 g/dL",
      normalRange: "11.5-15.5 g/dL",
      status: "normal",
    },
    {
      id: "l2",
      date: "2023-06-10",
      test: "Blood Glucose",
      result: "95 mg/dL",
      normalRange: "70-100 mg/dL",
      status: "normal",
    },
    {
      id: "l3",
      date: "2023-07-15",
      test: "Blood Pressure",
      result: "140/90 mmHg",
      normalRange: "≤ 120/80 mmHg",
      status: "abnormal",
    },
  ]

  return { visitHistory, medicationHistory, labResults }
}

interface PatientHistoryProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patient: PatientFormData
}

export function PatientHistory({ open, onOpenChange, patient }: PatientHistoryProps) {
  const { visitHistory, medicationHistory, labResults } = generateMockHistory(patient.id || "")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Patient History</DialogTitle>
          <DialogDescription>Medical history and records for {patient.name}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="visits" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="visits">Visit History</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="labs">Lab Results</TabsTrigger>
          </TabsList>

          <TabsContent value="visits" className="mt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-[#00866a]">Visit History</h3>
                <Button variant="outline" size="sm" className="text-xs">
                  Export Visits
                </Button>
              </div>

              {visitHistory.length > 0 ? (
                <div className="space-y-4">
                  {visitHistory.map((visit) => (
                    <div key={visit.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{visit.type}</h4>
                          <p className="text-xs text-gray-500">
                            {format(new Date(visit.date), "PPP")} • Provider: {visit.provider}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm" className="h-6 text-xs">
                          View Details
                        </Button>
                      </div>
                      <p className="text-sm">{visit.notes}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No visit history available</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="medications" className="mt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-[#00866a]">Medication History</h3>
                <Button variant="outline" size="sm" className="text-xs">
                  Export Medications
                </Button>
              </div>

              {medicationHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Medication
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Dosage
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Provider
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {medicationHistory.map((med) => (
                        <tr key={med.id}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{format(new Date(med.date), "PPP")}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{med.medication}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{med.dosage}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                med.administered ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {med.administered ? "Administered" : "Prescribed"}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{med.provider}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No medication history available</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="labs" className="mt-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-[#00866a]">Lab Results</h3>
                <Button variant="outline" size="sm" className="text-xs">
                  Export Lab Results
                </Button>
              </div>

              {labResults.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Test
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Result
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Normal Range
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {labResults.map((lab) => (
                        <tr key={lab.id}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{format(new Date(lab.date), "PPP")}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{lab.test}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{lab.result}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{lab.normalRange}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                lab.status === "normal"
                                  ? "bg-green-100 text-green-800"
                                  : lab.status === "abnormal"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {lab.status.charAt(0).toUpperCase() + lab.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">No lab results available</div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
