"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Users,
  UserPlus,
  BarChart,
  Settings,
  LogOut,
  Shield,
  User,
  Bell,
  Calendar,
  AlertTriangle,
  Clipboard,
  Pill,
  Baby,
  Ambulance,
  WifiOff,
  LineChart,
  Building,
  Package,
  Activity,
  Download,
  FileBarChart,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"

// Types for our application
interface AppUser {
  username: string
  role: "superadmin" | "admin" | "doctor" | "nurse" | "midwife"
}

interface AdminUser {
  id: string
  username: string
  role: "admin" | "superadmin" | "doctor" | "nurse" | "midwife"
  email: string
  createdAt: string
}

interface Patient {
  id: string
  name: string
  age: number
  phone: string
  gestationWeeks: number
  dueDate: string
  riskLevel: "low" | "medium" | "high"
  ancVisits: number
  lastVisit: string
}

interface Appointment {
  id: string
  patientId: string
  patientName: string
  time: string
  purpose: string
  status: "scheduled" | "completed" | "missed"
}

interface Alert {
  id: string
  patientId: string
  patientName: string
  type: "danger" | "overdue" | "high-bp"
  message: string
  date: string
  isRead: boolean
}

interface MedicineLog {
  id: string
  patientId: string
  patientName: string
  medicine: string
  date: string
  administered: boolean
}

interface Referral {
  id: string
  patientId: string
  patientName: string
  reason: string
  facility: string
  date: string
  status: "pending" | "completed" | "cancelled"
}

interface OfflineRecord {
  id: string
  patientId: string
  patientName: string
  type: string
  date: string
  synced: boolean
}

interface StockItem {
  id: string
  name: string
  category: string
  quantity: number
  threshold: number
  lastRestocked: string
}

interface StaffActivity {
  id: string
  staffName: string
  role: string
  action: string
  timestamp: string
}

// Initial admin users for demo
const initialAdminUsers: AdminUser[] = [
  {
    id: "1",
    username: "superadmin",
    role: "superadmin",
    email: "superadmin@mamaguide.com",
    createdAt: "2023-01-15",
  },
  {
    id: "2",
    username: "admin",
    role: "admin",
    email: "admin@mamaguide.com",
    createdAt: "2023-02-20",
  },
  {
    id: "3",
    username: "dr.smith",
    role: "doctor",
    email: "smith@mamaguide.com",
    createdAt: "2023-03-10",
  },
  {
    id: "4",
    username: "nurse.johnson",
    role: "nurse",
    email: "johnson@mamaguide.com",
    createdAt: "2023-03-15",
  },
  {
    id: "5",
    username: "midwife.brown",
    role: "midwife",
    email: "brown@mamaguide.com",
    createdAt: "2023-04-05",
  },
]

// Sample patients data
const samplePatients: Patient[] = [
  {
    id: "P001",
    name: "Sarah Johnson",
    age: 28,
    phone: "+1234567890",
    gestationWeeks: 24,
    dueDate: "2023-12-15",
    riskLevel: "low",
    ancVisits: 3,
    lastVisit: "2023-06-10",
  },
  {
    id: "P002",
    name: "Emily Davis",
    age: 32,
    phone: "+1234567891",
    gestationWeeks: 36,
    dueDate: "2023-08-20",
    riskLevel: "medium",
    ancVisits: 5,
    lastVisit: "2023-07-05",
  },
  {
    id: "P003",
    name: "Maria Garcia",
    age: 25,
    phone: "+1234567892",
    gestationWeeks: 16,
    dueDate: "2024-01-30",
    riskLevel: "low",
    ancVisits: 2,
    lastVisit: "2023-06-28",
  },
  {
    id: "P004",
    name: "Jessica Wilson",
    age: 30,
    phone: "+1234567893",
    gestationWeeks: 32,
    dueDate: "2023-09-10",
    riskLevel: "high",
    ancVisits: 4,
    lastVisit: "2023-07-02",
  },
  {
    id: "P005",
    name: "Aisha Mohammed",
    age: 27,
    phone: "+1234567894",
    gestationWeeks: 12,
    dueDate: "2024-02-25",
    riskLevel: "low",
    ancVisits: 1,
    lastVisit: "2023-07-01",
  },
]

// Sample appointments
const sampleAppointments: Appointment[] = [
  {
    id: "A001",
    patientId: "P001",
    patientName: "Sarah Johnson",
    time: "09:00 AM",
    purpose: "Regular ANC Visit",
    status: "scheduled",
  },
  {
    id: "A002",
    patientId: "P002",
    patientName: "Emily Davis",
    time: "10:30 AM",
    purpose: "Ultrasound",
    status: "scheduled",
  },
  {
    id: "A003",
    patientId: "P003",
    patientName: "Maria Garcia",
    time: "11:45 AM",
    purpose: "Blood Test",
    status: "scheduled",
  },
  {
    id: "A004",
    patientId: "P004",
    patientName: "Jessica Wilson",
    time: "02:15 PM",
    purpose: "High-Risk Assessment",
    status: "scheduled",
  },
  {
    id: "A005",
    patientId: "P005",
    patientName: "Aisha Mohammed",
    time: "03:30 PM",
    purpose: "First ANC Visit",
    status: "scheduled",
  },
]

// Sample alerts
const sampleAlerts: Alert[] = [
  {
    id: "AL001",
    patientId: "P004",
    patientName: "Jessica Wilson",
    type: "high-bp",
    message: "Blood pressure reading 140/95 - above normal range",
    date: "2023-07-05",
    isRead: false,
  },
  {
    id: "AL002",
    patientId: "P002",
    patientName: "Emily Davis",
    type: "danger",
    message: "Reported severe headache and blurred vision",
    date: "2023-07-04",
    isRead: false,
  },
  {
    id: "AL003",
    patientId: "P003",
    patientName: "Maria Garcia",
    type: "overdue",
    message: "Missed scheduled ANC visit on July 1",
    date: "2023-07-02",
    isRead: true,
  },
]

// Sample medicine logs
const sampleMedicineLogs: MedicineLog[] = [
  {
    id: "M001",
    patientId: "P001",
    patientName: "Sarah Johnson",
    medicine: "Fansidar (IPTp)",
    date: "2023-06-10",
    administered: true,
  },
  {
    id: "M002",
    patientId: "P002",
    patientName: "Emily Davis",
    medicine: "Tetanus Toxoid",
    date: "2023-07-05",
    administered: true,
  },
  {
    id: "M003",
    patientId: "P003",
    patientName: "Maria Garcia",
    medicine: "Iron Supplements",
    date: "2023-06-28",
    administered: true,
  },
  {
    id: "M004",
    patientId: "P004",
    patientName: "Jessica Wilson",
    medicine: "Folic Acid",
    date: "2023-07-02",
    administered: true,
  },
]

// Sample referrals
const sampleReferrals: Referral[] = [
  {
    id: "R001",
    patientId: "P004",
    patientName: "Jessica Wilson",
    reason: "High-risk pregnancy requiring specialist care",
    facility: "Central Maternity Hospital",
    date: "2023-07-02",
    status: "pending",
  },
  {
    id: "R002",
    patientId: "P002",
    patientName: "Emily Davis",
    reason: "Ultrasound anomaly - further investigation needed",
    facility: "Women's Health Specialist Center",
    date: "2023-06-25",
    status: "completed",
  },
]

// Sample offline records
const sampleOfflineRecords: OfflineRecord[] = [
  {
    id: "O001",
    patientId: "P001",
    patientName: "Sarah Johnson",
    type: "ANC Visit",
    date: "2023-07-03",
    synced: false,
  },
  {
    id: "O002",
    patientId: "P003",
    patientName: "Maria Garcia",
    type: "Blood Pressure Check",
    date: "2023-07-04",
    synced: false,
  },
]

// Sample stock items
const sampleStockItems: StockItem[] = [
  {
    id: "S001",
    name: "Fansidar (IPTp)",
    category: "Medication",
    quantity: 120,
    threshold: 50,
    lastRestocked: "2023-06-15",
  },
  {
    id: "S002",
    name: "Iron Tablets",
    category: "Supplement",
    quantity: 200,
    threshold: 100,
    lastRestocked: "2023-06-20",
  },
  {
    id: "S003",
    name: "Folic Acid",
    category: "Supplement",
    quantity: 180,
    threshold: 100,
    lastRestocked: "2023-06-20",
  },
  {
    id: "S004",
    name: "Tetanus Vaccine",
    category: "Vaccine",
    quantity: 45,
    threshold: 30,
    lastRestocked: "2023-06-10",
  },
  {
    id: "S005",
    name: "Examination Gloves",
    category: "Equipment",
    quantity: 300,
    threshold: 200,
    lastRestocked: "2023-06-25",
  },
]

// Sample staff activity
const sampleStaffActivity: StaffActivity[] = [
  {
    id: "SA001",
    staffName: "Dr. Smith",
    role: "doctor",
    action: "Logged in",
    timestamp: "2023-07-05 08:45 AM",
  },
  {
    id: "SA002",
    staffName: "Nurse Johnson",
    role: "nurse",
    action: "Registered new patient",
    timestamp: "2023-07-05 09:15 AM",
  },
  {
    id: "SA003",
    staffName: "Midwife Brown",
    role: "midwife",
    action: "Completed ANC visit",
    timestamp: "2023-07-05 10:30 AM",
  },
  {
    id: "SA004",
    staffName: "Dr. Smith",
    role: "doctor",
    action: "Created referral",
    timestamp: "2023-07-05 11:20 AM",
  },
]

export default function AdminDashboard() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(initialAdminUsers)
  const [showNewAdminDialog, setShowNewAdminDialog] = useState(false)
  const [newAdmin, setNewAdmin] = useState({
    username: "",
    email: "",
    password: "",
    role: "admin",
  })
  const [patients, setPatients] = useState<Patient[]>(samplePatients)
  const [appointments, setAppointments] = useState<Appointment[]>(sampleAppointments)
  const [alerts, setAlerts] = useState<Alert[]>(sampleAlerts)
  const [medicineLogs, setMedicineLogs] = useState<MedicineLog[]>(sampleMedicineLogs)
  const [referrals, setReferrals] = useState<Referral[]>(sampleReferrals)
  const [offlineRecords, setOfflineRecords] = useState<OfflineRecord[]>(sampleOfflineRecords)
  const [stockItems, setStockItems] = useState<StockItem[]>(sampleStockItems)
  const [staffActivity, setStaffActivity] = useState<StaffActivity[]>(sampleStaffActivity)
  const [searchQuery, setSearchQuery] = useState("")

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    } else {
      router.push("/")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const handleCreateAdmin = () => {
    const newAdminUser: AdminUser = {
      id: (adminUsers.length + 1).toString(),
      username: newAdmin.username,
      role: newAdmin.role as "admin" | "superadmin" | "doctor" | "nurse" | "midwife",
      email: newAdmin.email,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setAdminUsers([...adminUsers, newAdminUser])
    setShowNewAdminDialog(false)
    setNewAdmin({
      username: "",
      email: "",
      password: "",
      role: "admin",
    })
  }

  const isHealthWorker = () => {
    return currentUser?.role === "doctor" || currentUser?.role === "nurse" || currentUser?.role === "midwife"
  }

  const isAdmin = () => {
    return currentUser?.role === "admin" || currentUser?.role === "superadmin"
  }

  if (!currentUser) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar>
          <SidebarHeader>
            <div className="p-4 bg-[#00866a] text-white">
              <h1 className="text-xl font-bold">MamaGuide</h1>
              <div className="flex items-center mt-4 text-sm">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-2">
                  {currentUser.role === "superadmin" ? (
                    <Shield size={16} />
                  ) : currentUser.role === "admin" ? (
                    <User size={16} />
                  ) : currentUser.role === "doctor" ? (
                    <User size={16} />
                  ) : currentUser.role === "nurse" ? (
                    <User size={16} />
                  ) : (
                    <User size={16} />
                  )}
                </div>
                <div>
                  <p className="font-medium">{currentUser.username}</p>
                  <p className="text-xs opacity-80 capitalize">{currentUser.role}</p>
                </div>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setActiveTab("dashboard")} isActive={activeTab === "dashboard"}>
                    <BarChart size={18} className="mr-2" />
                    Dashboard
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setActiveTab("patients")} isActive={activeTab === "patients"}>
                    <Users size={18} className="mr-2" />
                    Patients
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>

            {isHealthWorker() && (
              <SidebarGroup>
                <SidebarGroupLabel>Health Worker</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveTab("appointments")}
                      isActive={activeTab === "appointments"}
                    >
                      <Calendar size={18} className="mr-2" />
                      Appointments
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => setActiveTab("alerts")} isActive={activeTab === "alerts"}>
                      <AlertTriangle size={18} className="mr-2" />
                      Patient Alerts
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveTab("anc-tracker")}
                      isActive={activeTab === "anc-tracker"}
                    >
                      <Clipboard size={18} className="mr-2" />
                      ANC Visit Tracker
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveTab("medicine-log")}
                      isActive={activeTab === "medicine-log"}
                    >
                      <Pill size={18} className="mr-2" />
                      Medicine/Vaccine Log
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveTab("upcoming-deliveries")}
                      isActive={activeTab === "upcoming-deliveries"}
                    >
                      <Baby size={18} className="mr-2" />
                      Upcoming Deliveries
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => setActiveTab("referrals")} isActive={activeTab === "referrals"}>
                      <Ambulance size={18} className="mr-2" />
                      Referral Tracker
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveTab("offline-records")}
                      isActive={activeTab === "offline-records"}
                    >
                      <WifiOff size={18} className="mr-2" />
                      Offline Records
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroup>
            )}

            {isAdmin() && (
              <SidebarGroup>
                <SidebarGroupLabel>Administration</SidebarGroupLabel>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => setActiveTab("analytics")} isActive={activeTab === "analytics"}>
                      <LineChart size={18} className="mr-2" />
                      Analytics
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveTab("clinic-comparison")}
                      isActive={activeTab === "clinic-comparison"}
                    >
                      <Building size={18} className="mr-2" />
                      Clinic Comparison
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveTab("stock-monitoring")}
                      isActive={activeTab === "stock-monitoring"}
                    >
                      <Package size={18} className="mr-2" />
                      Stock Monitoring
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveTab("staff-activity")}
                      isActive={activeTab === "staff-activity"}
                    >
                      <Activity size={18} className="mr-2" />
                      Staff Activity
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveTab("data-exports")}
                      isActive={activeTab === "data-exports"}
                    >
                      <Download size={18} className="mr-2" />
                      Data Exports
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={() => setActiveTab("custom-reports")}
                      isActive={activeTab === "custom-reports"}
                    >
                      <FileBarChart size={18} className="mr-2" />
                      Custom Reports
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {currentUser.role === "superadmin" && (
                    <SidebarMenuItem>
                      <SidebarMenuButton onClick={() => setActiveTab("admins")} isActive={activeTab === "admins"}>
                        <UserPlus size={18} className="mr-2" />
                        Admin Users
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarGroup>
            )}

            <SidebarGroup>
              <SidebarGroupLabel>Settings</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setActiveTab("settings")} isActive={activeTab === "settings"}>
                    <Settings size={18} className="mr-2" />
                    Settings
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <div className="p-4">
              <Button
                onClick={handleLogout}
                className="w-full flex items-center justify-center text-red-500 hover:bg-red-50 hover:text-red-600 border border-red-200"
                variant="outline"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <header className="bg-white shadow-sm p-4 flex justify-between items-center">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold capitalize">{activeTab.replace(/-/g, " ")}</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  placeholder="Search patients..."
                  className="pl-9 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button className="relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {alerts.filter((a) => !a.isRead).length}
                </span>
              </button>
              <div className="w-8 h-8 rounded-full bg-[#00866a]/20 text-[#00866a] flex items-center justify-center">
                {currentUser.username.charAt(0).toUpperCase()}
              </div>
            </div>
          </header>

          {/* Dashboard content */}
          <main className="p-6">
            {/* Health Worker Dashboard */}
            {isHealthWorker() && activeTab === "dashboard" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium mb-4">Today's Appointments</h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-3xl font-bold text-[#00866a]">{appointments.length}</p>
                      <p className="text-sm text-gray-500">Scheduled for today</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#00866a]/10 flex items-center justify-center text-[#00866a]">
                      <Calendar size={24} />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Next appointment</span>
                      <span className="font-medium">{appointments[0]?.time}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium mb-4">Patient Alerts</h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-3xl font-bold text-[#ff7262]">{alerts.filter((a) => !a.isRead).length}</p>
                      <p className="text-sm text-gray-500">Unread alerts</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#ff7262]/10 flex items-center justify-center text-[#ff7262]">
                      <AlertTriangle size={24} />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">High priority</span>
                      <span className="font-medium">
                        {alerts.filter((a) => a.type === "danger" && !a.isRead).length}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium mb-4">Upcoming Deliveries</h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-3xl font-bold text-[#1abcfe]">
                        {
                          patients.filter((p) => {
                            const dueDate = new Date(p.dueDate)
                            const today = new Date()
                            const diffTime = dueDate.getTime() - today.getTime()
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                            return diffDays <= 30 && diffDays > 0
                          }).length
                        }
                      </p>
                      <p className="text-sm text-gray-500">Due in next 30 days</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#1abcfe]/10 flex items-center justify-center text-[#1abcfe]">
                      <Baby size={24} />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">High-risk cases</span>

                      <span className="font-medium">
                        {
                          patients.filter((p) => {
                            const dueDate = new Date(p.dueDate)
                            const today = new Date()
                            const diffTime = dueDate.getTime() - today.getTime()
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                            return diffDays <= 30 && diffDays > 0 && p.riskLevel === "high"
                          }).length
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm md:col-span-2">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Today's Appointments</h3>
                    <Button variant="outline" size="sm" className="text-xs">
                      View All
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Time
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Patient
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Purpose
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {appointments.map((appointment) => (
                          <tr key={appointment.id}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{appointment.time}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">{appointment.patientName}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">{appointment.purpose}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  appointment.status === "scheduled"
                                    ? "bg-blue-100 text-blue-800"
                                    : appointment.status === "completed"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {appointment.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Patient Alerts</h3>
                    <Button variant="outline" size="sm" className="text-xs">
                      View All
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {alerts
                      .filter((a) => !a.isRead)
                      .slice(0, 3)
                      .map((alert) => (
                        <div
                          key={alert.id}
                          className={`p-3 rounded-lg ${
                            alert.type === "danger"
                              ? "bg-red-50 border-l-4 border-red-500"
                              : alert.type === "high-bp"
                                ? "bg-orange-50 border-l-4 border-orange-500"
                                : "bg-blue-50 border-l-4 border-blue-500"
                          }`}
                        >
                          <div className="flex justify-between">
                            <p className="text-sm font-medium">{alert.patientName}</p>
                            <span
                              className={`text-xs ${
                                alert.type === "danger"
                                  ? "text-red-600"
                                  : alert.type === "high-bp"
                                    ? "text-orange-600"
                                    : "text-blue-600"
                              }`}
                            >
                              {alert.type === "danger" ? "Danger" : alert.type === "high-bp" ? "High BP" : "Overdue"}
                            </span>
                          </div>
                          <p className="text-xs mt-1">{alert.message}</p>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm md:col-span-3">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">ANC Visit Tracker</h3>
                    <Button variant="outline" size="sm" className="text-xs">
                      View All
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Patient ID
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Gestation
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ANC Visits
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Visit
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Risk Level
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {patients.map((patient) => (
                          <tr key={patient.id}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{patient.id}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.name}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.gestationWeeks} weeks</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <div className="flex items-center">
                                <span className="mr-2">{patient.ancVisits}</span>
                                <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                  <div
                                    className="bg-[#00866a] h-2.5 rounded-full"
                                    style={{ width: `${Math.min(100, (patient.ancVisits / 8) * 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.lastVisit}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  patient.riskLevel === "low"
                                    ? "bg-green-100 text-green-800"
                                    : patient.riskLevel === "medium"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {patient.riskLevel}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Admin Dashboard */}
            {isAdmin() && activeTab === "dashboard" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium mb-4">Patient Overview</h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-3xl font-bold text-[#00866a]">{patients.length}</p>
                      <p className="text-sm text-gray-500">Total Patients</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#00866a]/10 flex items-center justify-center text-[#00866a]">
                      <Users size={24} />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">High-risk cases</span>
                      <span className="font-medium">{patients.filter((p) => p.riskLevel === "high").length}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium mb-4">ANC Visits</h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-3xl font-bold text-[#1abcfe]">
                        {patients.reduce((total, patient) => total + patient.ancVisits, 0)}
                      </p>
                      <p className="text-sm text-gray-500">Total ANC Visits</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#1abcfe]/10 flex items-center justify-center text-[#1abcfe]">
                      <Clipboard size={24} />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Avg. visits per patient</span>
                      <span className="font-medium">
                        {(patients.reduce((total, patient) => total + patient.ancVisits, 0) / patients.length).toFixed(
                          1,
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium mb-4">Stock Status</h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-3xl font-bold text-[#ff7262]">
                        {stockItems.filter((item) => item.quantity < item.threshold).length}
                      </p>
                      <p className="text-sm text-gray-500">Items below threshold</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#ff7262]/10 flex items-center justify-center text-[#ff7262]">
                      <Package size={24} />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total items</span>
                      <span className="font-medium">{stockItems.length}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm md:col-span-2">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">ANC Stages Distribution</h3>
                    <div className="flex gap-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-[#00866a] mr-1"></div>
                        <span className="text-xs">1st Trimester</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-[#1abcfe] mr-1"></div>
                        <span className="text-xs">2nd Trimester</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-[#ff7262] mr-1"></div>
                        <span className="text-xs">3rd Trimester</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-64 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full border-8 border-[#00866a] relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full border-8 border-[#1abcfe] flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-[#ff7262]"></div>
                        </div>
                      </div>
                      <div className="absolute top-1/4 -right-16 text-sm font-medium">
                        <div className="text-[#00866a]">
                          1st: {patients.filter((p) => p.gestationWeeks <= 12).length}
                        </div>
                      </div>
                      <div className="absolute top-1/2 -right-16 text-sm font-medium">
                        <div className="text-[#1abcfe]">
                          2nd: {patients.filter((p) => p.gestationWeeks > 12 && p.gestationWeeks <= 28).length}
                        </div>
                      </div>
                      <div className="absolute bottom-1/4 -right-16 text-sm font-medium">
                        <div className="text-[#ff7262]">
                          3rd: {patients.filter((p) => p.gestationWeeks > 28).length}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Staff Activity</h3>
                    <Button variant="outline" size="sm" className="text-xs">
                      View All
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {staffActivity.slice(0, 4).map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 pb-3 border-b">
                        <div
                          className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                            activity.role === "doctor"
                              ? "bg-[#00866a]/10 text-[#00866a]"
                              : activity.role === "nurse"
                                ? "bg-[#1abcfe]/10 text-[#1abcfe]"
                                : "bg-[#ff7262]/10 text-[#ff7262]"
                          }`}
                        >
                          <User size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {activity.staffName} {activity.action}
                          </p>
                          <p className="text-xs text-gray-500">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm md:col-span-3">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Stock Monitoring</h3>
                    <Button variant="outline" size="sm" className="text-xs">
                      View All
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Item
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Restocked
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {stockItems.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{item.name}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">{item.category}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <div className="flex items-center">
                                <span className="mr-2">{item.quantity}</span>
                                <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                  <div
                                    className={`h-2.5 rounded-full ${
                                      item.quantity < item.threshold ? "bg-red-500" : "bg-green-500"
                                    }`}
                                    style={{ width: `${Math.min(100, (item.quantity / (item.threshold * 2)) * 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  item.quantity < item.threshold
                                    ? "bg-red-100 text-red-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {item.quantity < item.threshold ? "Low Stock" : "In Stock"}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">{item.lastRestocked}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Appointments Tab */}
            {activeTab === "appointments" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium">Today's Appointments</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>Calendar View</span>
                    </Button>
                    <Button className="bg-[#00866a] hover:bg-[#00866a]/90" size="sm">
                      <span>+ New Appointment</span>
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Time
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Patient ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Patient Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Purpose
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {appointments.map((appointment) => (
                        <tr key={appointment.id}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{appointment.time}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{appointment.patientId}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{appointment.patientName}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{appointment.purpose}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                appointment.status === "scheduled"
                                  ? "bg-blue-100 text-blue-800"
                                  : appointment.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {appointment.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                                Check In
                              </Button>
                              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                                Reschedule
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Patient Alerts Tab */}
            {activeTab === "alerts" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium">Patient Alerts</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Mark All as Read
                    </Button>
                    <Button className="bg-[#00866a] hover:bg-[#00866a]/90" size="sm">
                      <span>Create Alert</span>
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-lg ${
                        alert.type === "danger"
                          ? "bg-red-50 border-l-4 border-red-500"
                          : alert.type === "high-bp"
                            ? "bg-orange-50 border-l-4 border-orange-500"
                            : "bg-blue-50 border-l-4 border-blue-500"
                      } ${alert.isRead ? "opacity-60" : ""}`}
                    >
                      <div className="flex justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                                alert.type === "danger"
                                  ? "bg-red-100 text-red-800"
                                  : alert.type === "high-bp"
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {alert.type === "danger" ? "Danger" : alert.type === "high-bp" ? "High BP" : "Overdue"}
                            </span>
                            <p className="text-sm font-medium">
                              {alert.patientName} (ID: {alert.patientId})
                            </p>
                          </div>
                          <p className="text-sm mt-2">{alert.message}</p>
                          <p className="text-xs text-gray-500 mt-1">Reported on: {alert.date}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                            View Patient
                          </Button>
                          {!alert.isRead && (
                            <Button variant="outline" size="sm" className="h-8 px-2 text-xs">
                              Mark as Read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ANC Visit Tracker Tab */}
            {activeTab === "anc-tracker" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium">ANC Visit Tracker</h3>
                  <div className="flex gap-2">
                    <Button className="bg-[#00866a] hover:bg-[#00866a]/90" size="sm">
                      <span>Record New Visit</span>
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Patient ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Age
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Gestation
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ANC Visits
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Visit
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Due Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Risk Level
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {patients.map((patient) => (
                        <tr key={patient.id}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{patient.id}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.name}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.age}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.gestationWeeks} weeks</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <div className="flex items-center">
                              <span className="mr-2">{patient.ancVisits}</span>
                              <div className="w-24 bg-gray-200 rounded-full h-2.5">
                                <div
                                  className="bg-[#00866a] h-2.5 rounded-full"
                                  style={{ width: `${Math.min(100, (patient.ancVisits / 8) * 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.lastVisit}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.dueDate}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                patient.riskLevel === "low"
                                  ? "bg-green-100 text-green-800"
                                  : patient.riskLevel === "medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {patient.riskLevel}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                                Record Visit
                              </Button>
                              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                                View History
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Medicine/Vaccine Log Tab */}
            {activeTab === "medicine-log" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium">Medicine/Vaccine Log</h3>
                  <div className="flex gap-2">
                    <Button className="bg-[#00866a] hover:bg-[#00866a]/90" size="sm">
                      <span>Record New Administration</span>
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Patient ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Patient Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Medicine/Vaccine
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {medicineLogs.map((log) => (
                        <tr key={log.id}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{log.patientId}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{log.patientName}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{log.medicine}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{log.date}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                log.administered ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {log.administered ? "Administered" : "Pending"}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                                View Details
                              </Button>
                              {!log.administered && (
                                <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                                  Mark as Administered
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Upcoming Deliveries Tab */}
            {activeTab === "upcoming-deliveries" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium">Upcoming Deliveries (Next 30 Days)</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>Calendar View</span>
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Patient ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Age
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Due Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Days Until Due
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Risk Level
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ANC Visits
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {patients
                        .filter((p) => {
                          const dueDate = new Date(p.dueDate)
                          const today = new Date()
                          const diffTime = dueDate.getTime() - today.getTime()
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                          return diffDays <= 30 && diffDays > 0
                        })
                        .map((patient) => {
                          const dueDate = new Date(patient.dueDate)
                          const today = new Date()
                          const diffTime = dueDate.getTime() - today.getTime()
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

                          return (
                            <tr key={patient.id}>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{patient.id}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.name}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.age}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.dueDate}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    diffDays <= 7
                                      ? "bg-red-100 text-red-800"
                                      : diffDays <= 14
                                        ? "bg-orange-100 text-orange-800"
                                        : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {diffDays} days
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    patient.riskLevel === "low"
                                      ? "bg-green-100 text-green-800"
                                      : patient.riskLevel === "medium"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {patient.riskLevel}
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.ancVisits}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                                    View Details
                                  </Button>
                                  <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                                    Birth Plan
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Referral Tracker Tab */}
            {activeTab === "referrals" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium">Referral Tracker</h3>
                  <div className="flex gap-2">
                    <Button className="bg-[#00866a] hover:bg-[#00866a]/90" size="sm">
                      <span>Create New Referral</span>
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Patient ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Patient Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reason
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Facility
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {referrals.map((referral) => (
                        <tr key={referral.id}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{referral.patientId}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{referral.patientName}</td>
                          <td className="px-4 py-3 text-sm">{referral.reason}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{referral.facility}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{referral.date}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                referral.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : referral.status === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {referral.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                                View Details
                              </Button>
                              {referral.status === "pending" && (
                                <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                                  Update Status
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Offline Records Tab */}
            {activeTab === "offline-records" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium">Offline Records</h3>
                  <div className="flex gap-2">
                    <Button className="bg-[#00866a] hover:bg-[#00866a]/90" size="sm">
                      <span>Sync All Records</span>
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Patient ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Patient Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Record Type
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sync Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {offlineRecords.map((record) => (
                        <tr key={record.id}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{record.patientId}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{record.patientName}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{record.type}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{record.date}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                record.synced ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {record.synced ? "Synced" : "Pending Sync"}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                                View Details
                              </Button>
                              {!record.synced && (
                                <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                                  Sync Now
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium mb-4">Patient Overview</h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-3xl font-bold text-[#00866a]">{patients.length}</p>
                      <p className="text-sm text-gray-500">Total Patients</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#00866a]/10 flex items-center justify-center text-[#00866a]">
                      <Users size={24} />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">New this week</span>
                      <span className="font-medium">+3</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium mb-4">ANC Visits</h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-3xl font-bold text-[#1abcfe]">
                        {patients.reduce((total, patient) => total + patient.ancVisits, 0)}
                      </p>
                      <p className="text-sm text-gray-500">Total ANC Visits</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#1abcfe]/10 flex items-center justify-center text-[#1abcfe]">
                      <Clipboard size={24} />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">This month</span>
                      <span className="font-medium">24</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-lg font-medium mb-4">High-Risk Cases</h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-3xl font-bold text-[#ff7262]">
                        {patients.filter((p) => p.riskLevel === "high").length}
                      </p>
                      <p className="text-sm text-gray-500">High-risk pregnancies</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#ff7262]/10 flex items-center justify-center text-[#ff7262]">
                      <AlertTriangle size={24} />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Percentage</span>
                      <span className="font-medium">
                        {Math.round((patients.filter((p) => p.riskLevel === "high").length / patients.length) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm md:col-span-2">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">ANC Stages Distribution</h3>
                    <div className="flex gap-2">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-[#00866a] mr-1"></div>
                        <span className="text-xs">1st Trimester</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-[#1abcfe] mr-1"></div>
                        <span className="text-xs">2nd Trimester</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-[#ff7262] mr-1"></div>
                        <span className="text-xs">3rd Trimester</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-64 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full border-8 border-[#00866a] relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full border-8 border-[#1abcfe] flex items-center justify-center">
                          <div className="w-16 h-16 rounded-full bg-[#ff7262]"></div>
                        </div>
                      </div>
                      <div className="absolute top-1/4 -right-16 text-sm font-medium">
                        <div className="text-[#00866a]">
                          1st: {patients.filter((p) => p.gestationWeeks <= 12).length}
                        </div>
                      </div>
                      <div className="absolute top-1/2 -right-16 text-sm font-medium">
                        <div className="text-[#1abcfe]">
                          2nd: {patients.filter((p) => p.gestationWeeks > 12 && p.gestationWeeks <= 28).length}
                        </div>
                      </div>
                      <div className="absolute bottom-1/4 -right-16 text-sm font-medium">
                        <div className="text-[#ff7262]">
                          3rd: {patients.filter((p) => p.gestationWeeks > 28).length}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Risk Distribution</h3>
                    <Button variant="outline" size="sm" className="text-xs">
                      Export
                    </Button>
                  </div>
                  <div className="h-64 flex items-center justify-center">
                    <div className="w-full flex items-end justify-around h-48">
                      <div className="flex flex-col items-center">
                        <div
                          className="w-16 bg-green-500 rounded-t-md"
                          style={{
                            height: `${(patients.filter((p) => p.riskLevel === "low").length / patients.length) * 200}px`,
                          }}
                        ></div>
                        <p className="text-xs mt-2">Low Risk</p>
                        <p className="text-xs font-bold">{patients.filter((p) => p.riskLevel === "low").length}</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div
                          className="w-16 bg-yellow-500 rounded-t-md"
                          style={{
                            height: `${(patients.filter((p) => p.riskLevel === "medium").length / patients.length) * 200}px`,
                          }}
                        ></div>
                        <p className="text-xs mt-2">Medium Risk</p>
                        <p className="text-xs font-bold">{patients.filter((p) => p.riskLevel === "medium").length}</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <div
                          className="w-16 bg-red-500 rounded-t-md"
                          style={{
                            height: `${(patients.filter((p) => p.riskLevel === "high").length / patients.length) * 200}px`,
                          }}
                        ></div>
                        <p className="text-xs mt-2">High Risk</p>
                        <p className="text-xs font-bold">{patients.filter((p) => p.riskLevel === "high").length}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm md:col-span-3">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Monthly ANC Visits</h3>
                    <Button variant="outline" size="sm" className="text-xs">
                      Export Data
                    </Button>
                  </div>
                  <div className="h-64 flex items-center justify-center">
                    <div className="w-full flex items-end justify-around h-48 gap-2">
                      {Array.from({ length: 6 }).map((_, index) => {
                        const month = new Date()
                        month.setMonth(month.getMonth() - 5 + index)
                        const monthName = month.toLocaleString("default", { month: "short" })
                        const height = Math.floor(Math.random() * 150) + 50

                        return (
                          <div key={index} className="flex flex-col items-center flex-1">
                            <div className="w-full bg-[#00866a] rounded-t-md" style={{ height: `${height}px` }}></div>
                            <p className="text-xs mt-2">{monthName}</p>
                            <p className="text-xs font-bold">{Math.floor(height / 5)}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Stock Monitoring Tab */}
            {activeTab === "stock-monitoring" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium">Stock Monitoring</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Export
                    </Button>
                    <Button className="bg-[#00866a] hover:bg-[#00866a]/90" size="sm">
                      <span>Add Stock</span>
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Item
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Threshold
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Restocked
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stockItems.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{item.name}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{item.category}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{item.quantity}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{item.threshold}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                item.quantity < item.threshold
                                  ? "bg-red-100 text-red-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {item.quantity < item.threshold ? "Low Stock" : "In Stock"}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{item.lastRestocked}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                                Update Stock
                              </Button>
                              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                                History
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Staff Activity Tab */}
            {activeTab === "staff-activity" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium">Staff Activity Log</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Export
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Staff Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Timestamp
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {staffActivity.map((activity) => (
                        <tr key={activity.id}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <div className="flex items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mr-3 ${
                                  activity.role === "doctor"
                                    ? "bg-[#00866a]/10 text-[#00866a]"
                                    : activity.role === "nurse"
                                      ? "bg-[#1abcfe]/10 text-[#1abcfe]"
                                      : "bg-[#ff7262]/10 text-[#ff7262]"
                                }`}
                              >
                                <User size={16} />
                              </div>
                              <div className="font-medium">{activity.staffName}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm capitalize">{activity.role}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{activity.action}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{activity.timestamp}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Data Exports Tab */}
            {activeTab === "data-exports" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium">Data Exports</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-[#00866a]/10 flex items-center justify-center text-[#00866a]">
                        <Users size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium">Patient Data</h4>
                        <p className="text-xs text-gray-500">Export all patient records</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        CSV
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        Excel
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        PDF
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-[#1abcfe]/10 flex items-center justify-center text-[#1abcfe]">
                        <Clipboard size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium">ANC Visits</h4>
                        <p className="text-xs text-gray-500">Export all ANC visit records</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        CSV
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        Excel
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        PDF
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-[#ff7262]/10 flex items-center justify-center text-[#ff7262]">
                        <AlertTriangle size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium">High-Risk Cases</h4>
                        <p className="text-xs text-gray-500">Export high-risk pregnancy data</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        CSV
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        Excel
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        PDF
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-[#a259ff]/10 flex items-center justify-center text-[#a259ff]">
                        <Pill size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium">Medicine/Vaccine Log</h4>
                        <p className="text-xs text-gray-500">Export medication administration data</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        CSV
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        Excel
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        PDF
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-[#0acf83]/10 flex items-center justify-center text-[#0acf83]">
                        <Package size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium">Stock Data</h4>
                        <p className="text-xs text-gray-500">Export inventory and stock data</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        CSV
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        Excel
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        PDF
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-[#f24e1e]/10 flex items-center justify-center text-[#f24e1e]">
                        <Activity size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium">Staff Activity</h4>
                        <p className="text-xs text-gray-500">Export staff activity logs</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        CSV
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        Excel
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        PDF
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t pt-6">
                  <h4 className="font-medium mb-4">Custom Export</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Data Type</label>
                      <select className="w-full rounded-md border border-gray-300 p-2 text-sm">
                        <option>Patient Data</option>
                        <option>ANC Visits</option>
                        <option>High-Risk Cases</option>
                        <option>Medicine/Vaccine Log</option>
                        <option>Stock Data</option>
                        <option>Staff Activity</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Date Range</label>
                      <select className="w-full rounded-md border border-gray-300 p-2 text-sm">
                        <option>Last 7 days</option>
                        <option>Last 30 days</option>
                        <option>Last 90 days</option>
                        <option>This year</option>
                        <option>Custom range</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button className="bg-[#00866a] hover:bg-[#00866a]/90">Generate Custom Export</Button>
                  </div>
                </div>
              </div>
            )}

            {/* Custom Reports Tab */}
            {activeTab === "custom-reports" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium">Custom Reports</h3>
                  <div className="flex gap-2">
                    <Button className="bg-[#00866a] hover:bg-[#00866a]/90" size="sm">
                      <span>Create New Report</span>
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-[#00866a]/10 flex items-center justify-center text-[#00866a]">
                        <FileBarChart size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium">ANC Coverage Report</h4>
                        <p className="text-xs text-gray-500">Last generated: July 1, 2023</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        Regenerate
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-[#1abcfe]/10 flex items-center justify-center text-[#1abcfe]">
                        <FileBarChart size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium">Delivery Outcomes</h4>
                        <p className="text-xs text-gray-500">Last generated: June 15, 2023</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        Regenerate
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-[#ff7262]/10 flex items-center justify-center text-[#ff7262]">
                        <FileBarChart size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium">Postnatal Attendance</h4>
                        <p className="text-xs text-gray-500">Last generated: June 30, 2023</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        Regenerate
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-[#a259ff]/10 flex items-center justify-center text-[#a259ff]">
                        <FileBarChart size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium">Medication Compliance</h4>
                        <p className="text-xs text-gray-500">Last generated: July 3, 2023</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        Download
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs">
                        Regenerate
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 border-t pt-6">
                  <h4 className="font-medium mb-4">Report Templates</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Report Type</label>
                      <select className="w-full rounded-md border border-gray-300 p-2 text-sm">
                        <option>ANC Coverage</option>
                        <option>Delivery Outcomes</option>
                        <option>Postnatal Attendance</option>
                        <option>Medication Compliance</option>
                        <option>Risk Assessment</option>
                        <option>Custom Report</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Time Period</label>
                      <select className="w-full rounded-md border border-gray-300 p-2 text-sm">
                        <option>Last Month</option>
                        <option>Last Quarter</option>
                        <option>Last Year</option>
                        <option>Custom Period</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button className="bg-[#00866a] hover:bg-[#00866a]/90">Generate Report</Button>
                  </div>
                </div>
              </div>
            )}

            {/* Clinic Comparison Tab */}
            {activeTab === "clinic-comparison" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium">Clinic Comparison</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Export
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Clinic
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total Patients
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ANC Visits
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          High-Risk Cases
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Avg. Visits/Patient
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[
                        {
                          name: "Main Clinic",
                          patients: 248,
                          visits: 745,
                          highRisk: 32,
                          avgVisits: 3.0,
                          stockStatus: "Good",
                        },
                        {
                          name: "North Branch",
                          patients: 186,
                          visits: 523,
                          highRisk: 24,
                          avgVisits: 2.8,
                          stockStatus: "Low",
                        },
                        {
                          name: "South Branch",
                          patients: 210,
                          visits: 612,
                          highRisk: 28,
                          avgVisits: 2.9,
                          stockStatus: "Good",
                        },
                        {
                          name: "East Branch",
                          patients: 165,
                          visits: 498,
                          highRisk: 22,
                          avgVisits: 3.0,
                          stockStatus: "Good",
                        },
                        {
                          name: "West Branch",
                          patients: 192,
                          visits: 576,
                          highRisk: 26,
                          avgVisits: 3.0,
                          stockStatus: "Critical",
                        },
                      ].map((clinic, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{clinic.name}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{clinic.patients}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{clinic.visits}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{clinic.highRisk}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">{clinic.avgVisits}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                clinic.stockStatus === "Good"
                                  ? "bg-green-100 text-green-800"
                                  : clinic.stockStatus === "Low"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {clinic.stockStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-4">Patient Distribution</h4>
                    <div className="h-64 flex items-center justify-center">
                      <div className="w-48 h-48 rounded-full border-8 border-[#00866a] relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-32 h-32 rounded-full border-8 border-[#1abcfe] flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full border-8 border-[#ff7262]"></div>
                          </div>
                        </div>
                        <div className="absolute top-1/4 -right-24 text-sm font-medium">
                          <div className="text-[#00866a]">Main Clinic: 248</div>
                        </div>
                        <div className="absolute top-1/2 -right-24 text-sm font-medium">
                          <div className="text-[#1abcfe]">North & South: 396</div>
                        </div>
                        <div className="absolute bottom-1/4 -right-24 text-sm font-medium">
                          <div className="text-[#ff7262]">East & West: 357</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium mb-4">ANC Visits Comparison</h4>
                    <div className="h-64 flex items-center justify-center">
                      <div className="w-full flex items-end justify-around h-48 gap-2">
                        {[
                          { name: "Main", visits: 745 },
                          { name: "North", visits: 523 },
                          { name: "South", visits: 612 },
                          { name: "East", visits: 498 },
                          { name: "West", visits: 576 },
                        ].map((clinic, index) => {
                          const maxVisits = 745
                          const height = (clinic.visits / maxVisits) * 100

                          return (
                            <div key={index} className="flex flex-col items-center flex-1">
                              <div
                                className={`w-full rounded-t-md ${
                                  index === 0
                                    ? "bg-[#00866a]"
                                    : index === 1
                                      ? "bg-[#1abcfe]"
                                      : index === 2
                                        ? "bg-[#ff7262]"
                                        : index === 3
                                          ? "bg-[#a259ff]"
                                          : "bg-[#f24e1e]"
                                }`}
                                style={{ height: `${height}%` }}
                              ></div>
                              <p className="text-xs mt-2">{clinic.name}</p>
                              <p className="text-xs font-bold">{clinic.visits}</p>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Admin Users Tab */}
            {activeTab === "admins" && currentUser.role === "superadmin" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium">Admin User Management</h3>
                  <Button onClick={() => setShowNewAdminDialog(true)} className="bg-[#00866a] hover:bg-[#00866a]/90">
                    <UserPlus size={16} className="mr-2" />
                    Add New Admin
                  </Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Username
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {adminUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                  user.role === "superadmin"
                                    ? "bg-purple-100 text-purple-800"
                                    : user.role === "admin"
                                      ? "bg-[#00866a]/10 text-[#00866a]"
                                      : user.role === "doctor"
                                        ? "bg-blue-100 text-blue-800"
                                        : user.role === "nurse"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-orange-100 text-orange-800"
                                }`}
                              >
                                {user.role === "superadmin" ? <Shield size={16} /> : <User size={16} />}
                              </div>
                              <div className="text-sm font-medium text-gray-900">{user.username}</div>
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.role === "superadmin"
                                  ? "bg-purple-100 text-purple-800"
                                  : user.role === "admin"
                                    ? "bg-[#00866a]/10 text-[#00866a]"
                                    : user.role === "doctor"
                                      ? "bg-blue-100 text-blue-800"
                                      : user.role === "nurse"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-orange-100 text-orange-800"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{user.createdAt}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                                Edit
                              </Button>
                              {user.role !== "superadmin" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 px-2 text-xs text-red-500 hover:text-red-700"
                                >
                                  Delete
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium">Settings</h3>
                  <Button className="bg-[#00866a] hover:bg-[#00866a]/90">Save Changes</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <div className="space-y-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-4">Profile</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="text-[#00866a] font-medium">Account Information</li>
                          <li className="text-gray-600">Password & Security</li>
                          <li className="text-gray-600">Notifications</li>
                        </ul>
                      </div>

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium mb-4">System</h4>
                        <ul className="space-y-2 text-sm">
                          <li className="text-gray-600">General Settings</li>
                          <li className="text-gray-600">Data Management</li>
                          <li className="text-gray-600">Backup & Restore</li>
                        </ul>
                      </div>

                      {isAdmin() && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-4">Administration</h4>
                          <ul className="space-y-2 text-sm">
                            <li className="text-gray-600">User Management</li>
                            <li className="text-gray-600">Roles & Permissions</li>
                            <li className="text-gray-600">Clinic Settings</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-4">Account Information</h4>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-1">Username</label>
                              <Input defaultValue={currentUser.username} />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-1">Email</label>
                              <Input
                                defaultValue={adminUsers.find((u) => u.username === currentUser.username)?.email || ""}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">Full Name</label>
                            <Input
                              defaultValue={currentUser.username
                                .split(".")
                                .map((n) => n.charAt(0).toUpperCase() + n.slice(1))
                                .join(" ")}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">Role</label>
                            <Input defaultValue={currentUser.role} disabled />
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <h4 className="font-medium mb-4">Interface Settings</h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">Dark Mode</p>
                              <p className="text-xs text-gray-500">Switch between light and dark themes</p>
                            </div>
                            <div className="w-12 h-6 bg-gray-200 rounded-full relative">
                              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">Compact View</p>
                              <p className="text-xs text-gray-500">Reduce spacing in tables and lists</p>
                            </div>
                            <div className="w-12 h-6 bg-[#00866a] rounded-full relative">
                              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">Show Offline Records</p>
                              <p className="text-xs text-gray-500">Display records that need to be synced</p>
                            </div>
                            <div className="w-12 h-6 bg-[#00866a] rounded-full relative">
                              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="border-t pt-6">
                        <h4 className="font-medium mb-4">Notification Settings</h4>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">Email Notifications</p>
                              <p className="text-xs text-gray-500">Receive alerts via email</p>
                            </div>
                            <div className="w-12 h-6 bg-[#00866a] rounded-full relative">
                              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">SMS Notifications</p>
                              <p className="text-xs text-gray-500">Receive alerts via SMS</p>
                            </div>
                            <div className="w-12 h-6 bg-gray-200 rounded-full relative">
                              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">High-Risk Alerts</p>
                              <p className="text-xs text-gray-500">Get notified about high-risk patients</p>
                            </div>
                            <div className="w-12 h-6 bg-[#00866a] rounded-full relative">
                              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Patients Tab */}
            {activeTab === "patients" && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-medium">Patient Management</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Download size={14} />
                      <span>Export</span>
                    </Button>
                    <Button className="bg-[#00866a] hover:bg-[#00866a]/90" size="sm">
                      <span>+ New Patient</span>
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Patient ID
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Age
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phone
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Gestation
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Due Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Risk Level
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {patients
                        .filter(
                          (patient) =>
                            searchQuery === "" ||
                            patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            patient.id.toLowerCase().includes(searchQuery.toLowerCase()),
                        )
                        .map((patient) => (
                          <tr key={patient.id}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{patient.id}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.name}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.age}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.phone}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.gestationWeeks} weeks</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">{patient.dueDate}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  patient.riskLevel === "low"
                                    ? "bg-green-100 text-green-800"
                                    : patient.riskLevel === "medium"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }`}
                              >
                                {patient.riskLevel}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                                  View
                                </Button>
                                <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                                  Edit
                                </Button>
                                <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                                  History
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing <span className="font-medium">1</span> to{" "}
                    <span className="font-medium">{patients.length}</span> of{" "}
                    <span className="font-medium">{patients.length}</span> patients
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* New Admin Dialog */}
      <Dialog open={showNewAdminDialog} onOpenChange={setShowNewAdminDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Admin User</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <Input
                id="username"
                value={newAdmin.username}
                onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                placeholder="Enter username"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                placeholder="Enter email address"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={newAdmin.password}
                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                placeholder="Enter password"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Role
              </label>
              <select
                id="role"
                value={newAdmin.role}
                onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="midwife">Midwife</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewAdminDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateAdmin}
              className="bg-[#00866a] hover:bg-[#00866a]/90"
              disabled={!newAdmin.username || !newAdmin.email || !newAdmin.password}
            >
              Create User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
