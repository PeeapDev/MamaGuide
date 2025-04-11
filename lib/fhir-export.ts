import type { PatientFormData } from "@/components/patients/patient-form"

// FHIR Patient Resource
interface FHIRPatient {
  resourceType: string
  id: string
  meta: {
    profile: string[]
  }
  identifier: {
    system: string
    value: string
  }[]
  active: boolean
  name: {
    use: string
    family: string
    given: string[]
  }[]
  telecom: {
    system: string
    value: string
    use: string
  }[]
  gender: string
  birthDate?: string
  address: {
    use: string
    type: string
    text: string
  }[]
  contact: {
    relationship: {
      coding: {
        system: string
        code: string
        display: string
      }[]
    }[]
    name?: {
      use: string
      text: string
    }
    telecom: {
      system: string
      value: string
    }[]
  }[]
  extension: {
    url: string
    valueString?: string
    valueInteger?: number
    valueDateTime?: string
    valueCodeableConcept?: {
      coding: {
        system: string
        code: string
        display: string
      }[]
    }
  }[]
}

// Function to convert a patient to FHIR format
export function exportPatientToFHIR(patient: PatientFormData): FHIRPatient {
  // Calculate approximate birth year from age
  const currentYear = new Date().getFullYear()
  const birthYear = currentYear - patient.age

  // Split name into parts (assuming format is "First Middle Last")
  const nameParts = patient.name.split(" ")
  const firstName = nameParts[0] || ""
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ""
  const middleNames = nameParts.length > 2 ? nameParts.slice(1, -1) : []

  // Create FHIR Patient resource
  const fhirPatient: FHIRPatient = {
    resourceType: "Patient",
    id: patient.id || `temp-${Date.now()}`,
    meta: {
      profile: ["http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient"],
    },
    identifier: [
      {
        system: "http://example.org/fhir/NamingSystem/MRN",
        value: patient.id || `MRN-${Date.now()}`,
      },
    ],
    active: true,
    name: [
      {
        use: "official",
        family: lastName,
        given: [firstName, ...middleNames],
      },
    ],
    telecom: [
      {
        system: "phone",
        value: patient.phone,
        use: "mobile",
      },
    ],
    gender: "female", // Assuming female for pregnancy app
    address: [
      {
        use: "home",
        type: "physical",
        text: patient.address,
      },
    ],
    contact: [],
    extension: [
      {
        url: "http://hl7.org/fhir/StructureDefinition/patient-gestationWeeks",
        valueInteger: patient.gestationWeeks,
      },
      {
        url: "http://hl7.org/fhir/StructureDefinition/patient-dueDate",
        valueDateTime: patient.dueDate,
      },
      {
        url: "http://hl7.org/fhir/StructureDefinition/patient-riskLevel",
        valueCodeableConcept: {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/v3-ObservationValue",
              code: patient.riskLevel,
              display: patient.riskLevel.charAt(0).toUpperCase() + patient.riskLevel.slice(1),
            },
          ],
        },
      },
    ],
  }

  // Add email if available
  if (patient.email) {
    fhirPatient.telecom.push({
      system: "email",
      value: patient.email,
      use: "home",
    })
  }

  // Add emergency contact if available
  if (patient.emergencyContact && patient.emergencyPhone) {
    fhirPatient.contact.push({
      relationship: [
        {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/v2-0131",
              code: "C",
              display: "Emergency Contact",
            },
          ],
        },
      ],
      name: {
        use: "official",
        text: patient.emergencyContact,
      },
      telecom: [
        {
          system: "phone",
          value: patient.emergencyPhone,
        },
      ],
    })
  }

  // Add blood type if available
  if (patient.bloodType) {
    fhirPatient.extension.push({
      url: "http://hl7.org/fhir/StructureDefinition/patient-bloodType",
      valueString: patient.bloodType,
    })
  }

  return fhirPatient
}

// Function to export all patients to FHIR Bundle
export function exportAllPatientsToFHIR(patients: PatientFormData[]): any {
  const bundle = {
    resourceType: "Bundle",
    type: "collection",
    entry: patients.map((patient) => ({
      resource: exportPatientToFHIR(patient),
    })),
  }

  return bundle
}

// Function to download FHIR data as JSON file
export function downloadFHIRData(data: any, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
