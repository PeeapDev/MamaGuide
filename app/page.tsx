"use client"

import { useState } from "react"
import Image from "next/image"
import { Baby, Calendar, ChevronRight, Heart, Lock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import ChatbotWidget from "@/components/chatbot-widget"
import AdminLogin from "@/components/admin-login"

export default function Home() {
  const [activeSection, setActiveSection] = useState("home")
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#abd5d2] to-[#abd5d2]/70 overflow-hidden">
      {/* Wave background */}
      <div className="absolute bottom-0 left-0 right-0 h-80 bg-[url('/wave-bg.svg')] bg-no-repeat bg-bottom bg-cover"></div>

      {/* Admin Login Button */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          onClick={() => setShowLoginDialog(true)}
          className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
          size="sm"
        >
          <Lock className="mr-2 h-4 w-4" />
          Admin Login
        </Button>
      </div>

      {/* Admin Login Dialog */}
      <AdminLogin open={showLoginDialog} onOpenChange={setShowLoginDialog} />

      {/* Marketing text */}
      <div className="absolute top-1/4 left-8 max-w-xs text-white">
        <h2 className="text-xl font-medium leading-relaxed">
          Watch your baby grow, log your symptoms and learn what to expect week by week with MamaGuide!
        </h2>
      </div>

      {/* iPhone 16 Frame */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[380px] h-[780px]">
        {/* iPhone frame */}
        <div className="relative w-full h-full bg-[#1a1a1a] rounded-[55px] shadow-xl overflow-hidden border-8 border-[#1a1a1a]">
          {/* Dynamic Island */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-b-[18px] z-20"></div>

          {/* Side button */}
          <div className="absolute top-[120px] right-[-14px] w-[6px] h-[80px] bg-[#2a2a2a] rounded-l-sm z-20"></div>
          <div className="absolute top-[220px] right-[-14px] w-[6px] h-[80px] bg-[#2a2a2a] rounded-l-sm z-20"></div>

          {/* Volume buttons */}
          <div className="absolute top-[120px] left-[-14px] w-[6px] h-[40px] bg-[#2a2a2a] rounded-r-sm z-20"></div>
          <div className="absolute top-[180px] left-[-14px] w-[6px] h-[80px] bg-[#2a2a2a] rounded-r-sm z-20"></div>

          {/* Screen content */}
          <div className="relative w-full h-full bg-white rounded-[45px] overflow-hidden">
            {/* Phone status bar */}
            <div className="bg-[#00866a] text-white p-3 pt-10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <Baby size={16} />
                </div>
                <h1 className="font-bold text-lg">MamaGuide</h1>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs bg-white/20 px-2 py-1 rounded-full">Premium</div>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="h-[calc(100%-88px)] overflow-y-auto">
              {/* Hero section */}
              <div className="relative h-64 bg-gradient-to-br from-[#00866a] to-[#abd5d2]">
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <h1 className="text-3xl font-bold mb-2">Your Pregnancy Journey</h1>
                  <p className="text-sm mb-4">Track, learn, and connect with your baby</p>
                  <Button className="bg-white text-[#00866a] hover:bg-white/90 w-full">Get Started</Button>
                </div>
                <div className="absolute right-0 bottom-0">
                  <Image
                    src="/placeholder.svg?height=150&width=150"
                    alt="Pregnant woman"
                    width={150}
                    height={150}
                    className="object-contain opacity-70"
                  />
                </div>
              </div>

              {/* Features section */}
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4 text-[#00866a]">Track Your Pregnancy</h2>

                <div className="grid gap-4 mb-8">
                  <div className="flex items-center gap-4 bg-[#abd5d2]/10 p-4 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-[#ff7262] flex items-center justify-center text-white">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium">Weekly Updates</h3>
                      <p className="text-xs text-gray-600">Follow your baby's development week by week</p>
                    </div>
                    <ChevronRight className="ml-auto text-gray-400" size={20} />
                  </div>

                  <div className="flex items-center gap-4 bg-[#abd5d2]/10 p-4 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-[#1abcfe] flex items-center justify-center text-white">
                      <Heart size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium">Health Tracking</h3>
                      <p className="text-xs text-gray-600">Log symptoms, weight, and appointments</p>
                    </div>
                    <ChevronRight className="ml-auto text-gray-400" size={20} />
                  </div>

                  <div className="flex items-center gap-4 bg-[#abd5d2]/10 p-4 rounded-lg">
                    <div className="w-12 h-12 rounded-full bg-[#0acf83] flex items-center justify-center text-white">
                      <Baby size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium">Kick Counter</h3>
                      <p className="text-xs text-gray-600">Monitor your baby's movements</p>
                    </div>
                    <ChevronRight className="ml-auto text-gray-400" size={20} />
                  </div>
                </div>

                {/* Timeline section */}
                <h2 className="text-xl font-bold mb-4 text-[#00866a]">Pregnancy Timeline</h2>

                <div className="relative pl-8 mb-8">
                  <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-[#abd5d2]"></div>

                  <div className="mb-6 relative">
                    <div className="absolute left-[-28px] w-6 h-6 rounded-full bg-[#ff7262] border-2 border-white"></div>
                    <h3 className="font-medium">First Trimester (Weeks 1-12)</h3>
                    <p className="text-xs text-gray-600 mt-1">Your baby's major organs and systems are forming</p>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      <div className="bg-[#ff7262]/10 p-2 rounded text-center">
                        <p className="text-xs font-medium">Week 8</p>
                        <p className="text-[10px] text-gray-600">Heartbeat</p>
                      </div>
                      <div className="bg-[#ff7262]/10 p-2 rounded text-center">
                        <p className="text-xs font-medium">Week 10</p>
                        <p className="text-[10px] text-gray-600">Organs form</p>
                      </div>
                      <div className="bg-[#ff7262]/10 p-2 rounded text-center">
                        <p className="text-xs font-medium">Week 12</p>
                        <p className="text-[10px] text-gray-600">Sex visible</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6 relative">
                    <div className="absolute left-[-28px] w-6 h-6 rounded-full bg-[#1abcfe] border-2 border-white"></div>
                    <h3 className="font-medium">Second Trimester (Weeks 13-27)</h3>
                    <p className="text-xs text-gray-600 mt-1">Your baby is growing rapidly and starting to move</p>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      <div className="bg-[#1abcfe]/10 p-2 rounded text-center">
                        <p className="text-xs font-medium">Week 16</p>
                        <p className="text-[10px] text-gray-600">First kicks</p>
                      </div>
                      <div className="bg-[#1abcfe]/10 p-2 rounded text-center">
                        <p className="text-xs font-medium">Week 20</p>
                        <p className="text-[10px] text-gray-600">Detailed scan</p>
                      </div>
                      <div className="bg-[#1abcfe]/10 p-2 rounded text-center">
                        <p className="text-xs font-medium">Week 24</p>
                        <p className="text-[10px] text-gray-600">Viable</p>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute left-[-28px] w-6 h-6 rounded-full bg-[#0acf83] border-2 border-white"></div>
                    <h3 className="font-medium">Third Trimester (Weeks 28-40)</h3>
                    <p className="text-xs text-gray-600 mt-1">Your baby is preparing for birth and gaining weight</p>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      <div className="bg-[#0acf83]/10 p-2 rounded text-center">
                        <p className="text-xs font-medium">Week 32</p>
                        <p className="text-[10px] text-gray-600">Lung develop</p>
                      </div>
                      <div className="bg-[#0acf83]/10 p-2 rounded text-center">
                        <p className="text-xs font-medium">Week 36</p>
                        <p className="text-[10px] text-gray-600">Head down</p>
                      </div>
                      <div className="bg-[#0acf83]/10 p-2 rounded text-center">
                        <p className="text-xs font-medium">Week 40</p>
                        <p className="text-[10px] text-gray-600">Due date</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Baby size comparison */}
                <h2 className="text-xl font-bold mb-4 text-[#00866a]">Baby Size Comparison</h2>

                <div className="overflow-x-auto mb-8">
                  <div className="flex gap-4 pb-4 min-w-[600px]">
                    <div className="flex-shrink-0 w-20 text-center">
                      <div className="h-20 w-20 rounded-full bg-[#ff7262]/10 flex items-center justify-center mx-auto">
                        <Image
                          src="/placeholder.svg?height=40&width=40"
                          alt="Poppy seed"
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      </div>
                      <p className="text-xs font-medium mt-2">Week 4</p>
                      <p className="text-[10px] text-gray-600">Poppy seed</p>
                    </div>

                    <div className="flex-shrink-0 w-20 text-center">
                      <div className="h-20 w-20 rounded-full bg-[#ff7262]/10 flex items-center justify-center mx-auto">
                        <Image
                          src="/placeholder.svg?height=40&width=40"
                          alt="Blueberry"
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      </div>
                      <p className="text-xs font-medium mt-2">Week 8</p>
                      <p className="text-[10px] text-gray-600">Blueberry</p>
                    </div>

                    <div className="flex-shrink-0 w-20 text-center">
                      <div className="h-20 w-20 rounded-full bg-[#1abcfe]/10 flex items-center justify-center mx-auto">
                        <Image
                          src="/placeholder.svg?height=40&width=40"
                          alt="Lime"
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      </div>
                      <p className="text-xs font-medium mt-2">Week 12</p>
                      <p className="text-[10px] text-gray-600">Lime</p>
                    </div>

                    <div className="flex-shrink-0 w-20 text-center">
                      <div className="h-20 w-20 rounded-full bg-[#1abcfe]/10 flex items-center justify-center mx-auto">
                        <Image
                          src="/placeholder.svg?height=40&width=40"
                          alt="Avocado"
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      </div>
                      <p className="text-xs font-medium mt-2">Week 16</p>
                      <p className="text-[10px] text-gray-600">Avocado</p>
                    </div>

                    <div className="flex-shrink-0 w-20 text-center">
                      <div className="h-20 w-20 rounded-full bg-[#0acf83]/10 flex items-center justify-center mx-auto">
                        <Image
                          src="/placeholder.svg?height=40&width=40"
                          alt="Eggplant"
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      </div>
                      <p className="text-xs font-medium mt-2">Week 28</p>
                      <p className="text-[10px] text-gray-600">Eggplant</p>
                    </div>

                    <div className="flex-shrink-0 w-20 text-center">
                      <div className="h-20 w-20 rounded-full bg-[#0acf83]/10 flex items-center justify-center mx-auto">
                        <Image
                          src="/placeholder.svg?height=40&width=40"
                          alt="Watermelon"
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      </div>
                      <p className="text-xs font-medium mt-2">Week 40</p>
                      <p className="text-[10px] text-gray-600">Watermelon</p>
                    </div>
                  </div>
                </div>

                {/* Community section */}
                <h2 className="text-xl font-bold mb-4 text-[#00866a]">Join Our Community</h2>

                <div className="bg-[#abd5d2]/10 p-4 rounded-lg mb-8">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#a259ff] flex items-center justify-center text-white">
                      <Users size={16} />
                    </div>
                    <div>
                      <h3 className="font-medium">Connect with other moms</h3>
                      <p className="text-xs text-gray-600">Share experiences and get support</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=32&width=32"
                        alt="User"
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=32&width=32"
                        alt="User"
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src="/placeholder.svg?height=32&width=32"
                        alt="User"
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[#a259ff]/20 flex items-center justify-center text-[#a259ff] text-xs">
                      +24k
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg mb-3">
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src="/placeholder.svg?height=32&width=32"
                          alt="User"
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-medium">Sarah J.</p>
                        <p className="text-xs text-gray-600">
                          This app has been a lifesaver during my pregnancy! The weekly updates are so detailed and the
                          kick counter is super helpful.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-3 rounded-lg">
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                        <Image
                          src="/placeholder.svg?height=32&width=32"
                          alt="User"
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-xs font-medium">Emily R.</p>
                        <p className="text-xs text-gray-600">
                          I love the community feature! It's so nice to connect with other moms who are going through
                          the same things.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expert advice */}
                <h2 className="text-xl font-bold mb-4 text-[#00866a]">Expert Advice</h2>

                <div className="grid gap-4 mb-8">
                  <div className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm">
                    <div className="h-32 bg-gray-100 relative">
                      <Image
                        src="/placeholder.svg?height=128&width=300"
                        alt="Nutrition"
                        width={300}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-2 left-2 bg-[#ff7262] text-white text-xs px-2 py-1 rounded">
                        Nutrition
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-sm">Essential Nutrients During Pregnancy</h3>
                      <p className="text-xs text-gray-600 mt-1">
                        Learn about the key vitamins and minerals you need for a healthy pregnancy
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-[10px] text-gray-500">By Dr. Lisa Chen</p>
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-[#00866a]">
                          Read
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm">
                    <div className="h-32 bg-gray-100 relative">
                      <Image
                        src="/placeholder.svg?height=128&width=300"
                        alt="Exercise"
                        width={300}
                        height={128}
                        className="object-cover w-full h-full"
                      />
                      <div className="absolute top-2 left-2 bg-[#1abcfe] text-white text-xs px-2 py-1 rounded">
                        Exercise
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-sm">Safe Workouts for Each Trimester</h3>
                      <p className="text-xs text-gray-600 mt-1">
                        Stay active with these pregnancy-safe exercise routines
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-[10px] text-gray-500">By Emma Wilson, PT</p>
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-[#00866a]">
                          Read
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Call to action */}
                <div className="bg-gradient-to-r from-[#00866a] to-[#1abcfe] p-6 rounded-lg text-white text-center mb-8">
                  <h2 className="text-xl font-bold mb-2">Start Your Pregnancy Journey</h2>
                  <p className="text-sm mb-4">Track, learn, and connect with your baby every step of the way</p>
                  <Button className="bg-white text-[#00866a] hover:bg-white/90 w-full">Download Now</Button>
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-gray-500 pb-8">
                  <p>© 2023 MamaGuide Pregnancy App</p>
                  <p className="mt-1">Privacy Policy • Terms of Service</p>
                </div>
              </div>
            </div>

            {/* Home indicator */}
            <div className="absolute bottom-1 left-0 right-0 flex justify-center">
              <div className="w-32 h-1 bg-black rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification cards */}
      <div className="absolute top-20 right-4 flex flex-col gap-3 w-56">
        <div className="bg-[#00866a] text-white p-3 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-white/20 p-1 rounded">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="font-medium">Contraction Timer</h3>
          </div>
          <p className="text-xs opacity-80">Easily monitor frequency and duration of your contractions</p>
        </div>

        <div className="bg-[#ff7262] text-white p-3 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-1">
            <div className="bg-white/20 p-1 rounded">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M3 3V21H21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 14L11 10L15 14L19 10"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3 className="font-medium">Kick Counter</h3>
          </div>
          <p className="text-xs opacity-80">Track your baby's movements to ensure they're healthy and active</p>
        </div>
      </div>

      {/* Vitamin notification */}
      <div className="absolute bottom-32 right-4 w-64 bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4">
          <h3 className="font-medium mb-2">Take a prenatal vitamin</h3>
          <p className="text-xs text-gray-600 mb-3">
            Folic acid helps your baby's brain and spinal cord develop correctly. This nutrient reduces the risk of
            serious birth defects called spina bifida and anencephaly.
          </p>
          <div className="flex justify-end">
            <button className="text-[#00866a] text-xs font-medium">Learn more</button>
          </div>
        </div>
        <div className="h-24 bg-gray-100">
          <Image
            src="/placeholder.svg?height=96&width=256"
            alt="Vitamins"
            width={256}
            height={96}
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Chatbot Widget */}
      <ChatbotWidget />
    </div>
  )
}
