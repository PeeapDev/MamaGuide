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
import type { PatientFormData } from "./patient-form"
import { exportPatientToFHIR } from "@/lib/fhir-export"

interface PatientViewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  patient: PatientFormData
  onEdit: () => void
  onViewHistory: () => void
}

export function PatientView({ open, onOpenChange, patient, onEdit, onViewHistory }: PatientViewProps) {
  const handleExportFHIR = () => {
    const fhirData = exportPatientToFHIR(patient)
    const blob = new Blob([JSON.stringify(fhirData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `patient-${patient.id}-fhir.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Patient Details</DialogTitle>
          <DialogDescription>Comprehensive information about the patient.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-[#00866a]">Personal Information</h3>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    patient.riskLevel === "low"
                      ? "bg-green-100 text-green-800"
                      : patient.riskLevel === "medium"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {patient.riskLevel.charAt(0).toUpperCase() + patient.riskLevel.slice(1)} Risk
                </span>
                <span className="text-xs text-gray-500">ID: {patient.id}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Full Name</p>
                <p className="text-sm">{patient.name}</p>
              </div>

              <div>
                <p className="text-sm font-medium">Age</p>
                <p className="text-sm">{patient.age} years</p>
              </div>

              <div>
                <p className="text-sm font-medium">Phone Number</p>
                <p className="text-sm">{patient.phone}</p>
              </div>

              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-sm">{patient.email || "Not provided"}</p>
              </div>

              <div className="md:col-span-2">
                <p className="text-sm font-medium">Address</p>
                <p className="text-sm">{patient.address || "Not provided"}</p>
              </div>
            </div>
          </div>

          {/* Pregnancy Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#00866a]">Pregnancy Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium">Gestation</p>
                <p className="text-sm">{patient.gestationWeeks} weeks</p>
              </div>

              <div>
                <p className="text-sm font-medium">Due Date</p>
                <p className="text-sm">{patient.dueDate ? format(new Date(patient.dueDate), "PPP") : "Not set"}</p>
              </div>

              <div>
                <p className="text-sm font-medium">ANC Visits</p>
                <p className="text-sm">{patient.ancVisits}</p>
              </div>

              <div>
                <p className="text-sm font-medium">Last Visit</p>
                <p className="text-sm">
                  {patient.lastVisit ? format(new Date(patient.lastVisit), "PPP") : "No visits recorded"}
                </p>
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#00866a]">Medical Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Blood Type</p>
                <p className="text-sm">{patient.bloodType || "Unknown"}</p>
              </div>

              <div>
                <p className="text-sm font-medium">Allergies</p>
                <p className="text-sm">{patient.allergies || "None reported"}</p>
              </div>

              <div className="md:col-span-2">
                <p className="text-sm font-medium">Medical History</p>
                <p className="text-sm">{patient.medicalHistory || "None reported"}</p>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#00866a]">Emergency Contact</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Contact Name</p>
                <p className="text-sm">{patient.emergencyContact || "Not provided"}</p>
              </div>

              <div>
                <p className="text-sm font-medium">Contact Phone</p>
                <p className="text-sm">{patient.emergencyPhone || "Not provided"}</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:gap-0">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportFHIR} className="text-xs">
              Export FHIR
            </Button>
            <Button variant="outline" size="sm" onClick={onViewHistory} className="text-xs">
              View History
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button onClick={onEdit} className="bg-[#00866a] hover:bg-[#00866a]/90">
              Edit Patient
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
