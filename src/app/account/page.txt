// src/app/account/page.tsx
"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('profile');
  
  // Mock user data - in a real app, you'd fetch this from your API
  const user = {
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "Student",
    avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80",
    joined: "January 2023",
    coursesEnrolled: 4,
    coursesCompleted: 2,
    certificatesEarned: 1
  };

  // Mock recent activity data
  const recentActivity = [
    { id: 1, type: "completion", course: "Introduction to AI", date: "2 days ago" },
    { id: 2, type: "enrollment", course: "Advanced JavaScript", date: "1 week ago" },
    { id: 3, type: "certificate", course: "Web Development Basics", date: "3 weeks ago" },
    { id: 4, type: "progress", course: "Data Science Fundamentals", progress: 65, date: "Yesterday" }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Account Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Your Account</h1>
          <p className="mt-2 text-gray-600">Manage your profile, track progress, and view your learning journey</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-24 relative">
                <div className="absolute -bottom-12 left-6">
                  <div className="relative h-24 w-24 rounded-full border-4 border-white overflow-hidden shadow-md">
                    <Image 
                      src={user.avatar}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-16 pb-6 px-6">
                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-600 text-sm">{user.email}</p>
                <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {user.role}
                </div>
                
                <div className="mt-6 space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Member since</span>
                    <span className="font-medium text-sm">{user.joined}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Courses enrolled</span>
                    <span className="font-medium text-sm">{user.coursesEnrolled}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Courses completed</span>
                    <span className="font-medium text-sm">{user.coursesCompleted}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 text-sm">Certificates earned</span>
                    <span className="font-medium text-sm">{user.certificatesEarned}</span>
                  </div>
                </div>
                
                <div className="mt-8">
                  <button className="w-full py-2.5 px-4 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm">
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <nav className="px-4 py-4">
                <ul className="space-y-1">
                  {[
                    { id: 'profile', name: 'Profile', icon: UserIcon },
                    { id: 'courses', name: 'My Courses', icon: BookOpenIcon },
                    { id: 'certificates', name: 'Certificates', icon: AcademicCapIcon },
                    { id: 'settings', name: 'Settings', icon: CogIcon },
                    { id: 'help', name: 'Help & Support', icon: QuestionMarkCircleIcon }
                  ].map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                          activeTab === item.id
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <item.icon className={`h-5 w-5 ${activeTab === item.id ? 'text-blue-600' : 'text-gray-500'}`} />
                        <span>{item.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatsCard 
                title="Learning Hours" 
                stat="24.5" 
                trend="+2.5 this week" 
                trendUp={true}
                icon={ClockIcon}
                iconColor="bg-blue-100 text-blue-600" 
              />
              <StatsCard 
                title="Course Progress" 
                stat="65%" 
                trend="+5% this week" 
                trendUp={true}
                icon={ChartBarIcon}
                iconColor="bg-purple-100 text-purple-600" 
              />
              <StatsCard 
                title="Completion Rate" 
                stat="73%" 
                trend="+12% vs avg" 
                trendUp={true}
                icon={CheckCircleIcon}
                iconColor="bg-green-100 text-green-600" 
              />
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="px-6 py-4">
                    <div className="flex items-start">
                      <div className={`mt-1 rounded-full p-2 flex-shrink-0 ${getActivityIconBackground(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {getActivityText(activity)}
                          </p>
                          <span className="text-xs text-gray-500">{activity.date}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {activity.course}
                        </p>
                        {activity.type === 'progress' && (
                          <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                            <div 
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${activity.progress}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-3 bg-gray-50 text-center">
                <Link 
                  href="/account/activity"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-150"
                >
                  View all activity
                </Link>
              </div>
            </div>
            
            {/* Recommended Courses */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recommended For You</h3>
              </div>
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 1, title: "Machine Learning Basics", instructor: "Dr. Sarah Chen", progress: 0, image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=225&q=80" },
                    { id: 2, title: "UX/UI Design Principles", instructor: "Michael Torres", progress: 0, image: "https://images.unsplash.com/photo-1626908013351-800ddd734b8a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=225&q=80" }
                  ].map(course => (
                    <div key={course.id} className="rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                      <div className="relative h-32 w-full">
                        <Image 
                          src={course.image}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-gray-900">{course.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{course.instructor}</p>
                        <button className="mt-3 w-full py-1.5 px-3 rounded-lg text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors duration-150">
                          Enroll Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-6 py-3 bg-gray-50 text-center">
                <Link 
                  href="/courses"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-150"
                >
                  Browse all courses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Stats Card Component
function StatsCard({ title, stat, trend, trendUp, icon: Icon, iconColor }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden p-6">
      <div className="flex items-center">
        <div className={`rounded-full p-3 ${iconColor}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{stat}</p>
            <p className={`ml-2 text-xs font-medium ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
              {trend}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions for activity feed
function getActivityIconBackground(type) {
  switch (type) {
    case 'completion':
      return 'bg-green-100';
    case 'enrollment':
      return 'bg-blue-100';
    case 'certificate':
      return 'bg-purple-100';
    case 'progress':
      return 'bg-yellow-100';
    default:
      return 'bg-gray-100';
  }
}

function getActivityIcon(type) {
  switch (type) {
    case 'completion':
      return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
    case 'enrollment':
      return <PlusCircleIcon className="h-5 w-5 text-blue-600" />;
    case 'certificate':
      return <AcademicCapIcon className="h-5 w-5 text-purple-600" />;
    case 'progress':
      return <ArrowUpIcon className="h-5 w-5 text-yellow-600" />;
    default:
      return <DotsHorizontalIcon className="h-5 w-5 text-gray-600" />;
  }
}

function getActivityText(activity) {
  switch (activity.type) {
    case 'completion':
      return 'Completed a course';
    case 'enrollment':
      return 'Enrolled in a new course';
    case 'certificate':
      return 'Earned a certificate';
    case 'progress':
      return `Made progress (${activity.progress}%)`;
    default:
      return 'Activity update';
  }
}

// Icon Components
function UserIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function BookOpenIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function AcademicCapIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path d="M12 14l9-5-9-5-9 5 9 5z" />
      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
    </svg>
  );
}

function CogIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function QuestionMarkCircleIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ClockIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ChartBarIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function CheckCircleIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function PlusCircleIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ArrowUpIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
  );
}

function DotsHorizontalIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
    </svg>
  );
}
