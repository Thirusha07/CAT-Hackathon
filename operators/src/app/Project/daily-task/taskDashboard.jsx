"use client"; // This component uses client-side hooks and interactivity 

import React, { useState } from 'react';
import { ChevronsRight, Shovel, Shield, Fuel, Bell, Settings, Calendar, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

// Mock Data - In a real application, this would come from an API
const operator = {
  name: 'Dave',
};

const dailyTasks = [
  {
    id: 1,
    title: 'Site Prep - Zone A',
    description: 'Excavate and level the northern section for foundation pouring.',
    status: 'In Progress',
    time: '08:00 - 12:00',
  },
  {
    id: 2,
    title: 'Trenching for Utilities',
    description: 'Dig a 5-foot trench along the marked utility line.',
    status: 'Pending',
    time: '13:00 - 15:00',
  },
  {
    id: 3,
    title: 'Load Haul Trucks',
    description: 'Load excavated material onto haul trucks 5 and 6.',
    status: 'Pending',
    time: '15:00 - 16:30',
  },
    {
    id: 4,
    title: 'Pre-Operation Checklist',
    description: 'Complete the mandatory daily safety inspection.',
    status: 'Completed',
    time: '07:45 - 08:00',
  },
];

const machineHealthData = {
  fuelLevel: 82,
  engineHours: 4521.5,
  defLevel: 75,
  hydraulicTemp: 68, // in Celsius
  engineTemp: 85, // in Celsius
  nextService: 'In 48 hours',
  faults: [
    { code: 'E361', description: 'High Engine Temperature', severity: 'warning' },
    { code: 'F782', description: 'Low DEF Level', severity: 'info' },
  ],
};

const safetyChecklistItems = [
  { id: 'fluids', text: 'Check fluid levels (oil, coolant, hydraulic)', checked: true },
  { id: 'tracks', text: 'Inspect tracks/tires for wear and damage', checked: true },
  { id: 'leaks', text: 'Check for any visible fluid leaks', checked: true },
  { id: 'cab', text: 'Ensure cab is clean and free of debris', checked: true },
  { id: 'controls', text: 'Verify all controls and gauges are functional', checked: false },
  { id: 'horn', text: 'Test horn and backup alarm', checked: false },
  { id: 'attachments', text: 'Inspect bucket/attachments for security', checked: false },
];


// Main Application Component
export default function App() {
  const [activeView, setActiveView] = useState('dashboard');

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard setActiveView={setActiveView} />;
      case 'health':
        return <MachineHealth />;
      case 'safety':
        return <SafetyChecklist />;
      default:
        return <Dashboard setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="bg-gray-800 text-white font-sans flex w-full h-screen">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-gray-100">
        {renderView()}
      </main>
    </div>
  );
}

// 1. Sidebar Navigation Component
const Sidebar = ({ activeView, setActiveView }) => {
  const navItems = [
    { id: 'dashboard', icon: Shovel, label: 'Dashboard' },
    { id: 'health', icon: Fuel, label: 'Machine Health' },
    { id: 'safety', icon: Shield, label: 'Safety Checklist' },
    { id: 'alerts', icon: Bell, label: 'Alerts' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="bg-black p-4 flex flex-col justify-between shadow-lg w-24">
      <div>
        {/* CAT Logo Placeholder */}
        <div className="bg-yellow-400 w-16 h-16 flex items-center justify-center rounded-lg mb-10">
          <p className="text-black font-bold text-4xl">CAT</p>
        </div>
        
        {/* Navigation Items */}
        <ul className="space-y-6">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveView(item.id)}
                className={`flex flex-col items-center justify-center w-full p-2 rounded-lg transition-colors duration-200 ${
                  activeView === item.id
                    ? 'bg-yellow-400 text-black'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
                title={item.label}
              >
                <item.icon size={28} />
                <span className="text-xs mt-1">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      {/* User/Logout section */}
      <div className="flex flex-col items-center">
         <img 
            src={`https://placehold.co/100x100/222/FFF?text=${operator.name.charAt(0)}`}
            alt="Operator"
            className="w-12 h-12 rounded-full border-2 border-gray-600"
          />
          <span className="text-sm mt-2 text-gray-300">{operator.name}</span>
      </div>
    </nav>
  );
};

// 2. Dashboard View Component
const Dashboard = ({ setActiveView }) => {
  const getStatusChip = (status) => {
    switch (status) {
      case 'Completed':
        return <span className="flex items-center text-xs font-semibold bg-green-500/20 text-green-400 px-2 py-1 rounded-full"><CheckCircle size={14} className="mr-1"/>{status}</span>;
      case 'In Progress':
        return <span className="flex items-center text-xs font-semibold bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full"><ChevronsRight size={14} className="mr-1"/>{status}</span>;
      case 'Pending':
        return <span className="flex items-center text-xs font-semibold bg-gray-500/20 text-gray-400 px-2 py-1 rounded-full"><Calendar size={14} className="mr-1"/>{status}</span>;
      default:
        return null;
    }
  };

  return (
    <div className="text-gray-800">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-black">Good Morning, {operator.name}</h1>
        <p className="text-gray-500">
          {new Date().toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard title="Fuel Level" value={`${machineHealthData.fuelLevel}%`} icon={Fuel} color="green" />
        <StatCard title="Engine Hours" value={machineHealthData.engineHours.toString()} icon={Settings} color="blue" />
        <StatCard title="Active Faults" value={machineHealthData.faults.length.toString()} icon={AlertTriangle} color="red" action={() => setActiveView('health')} />
      </div>

      {/* Daily Tasks List */}
      <div>
        <h2 className="text-2xl font-bold text-black mb-4">Today's Tasks</h2>
        <div className="space-y-4">
          {dailyTasks.map((task) => (
            <div key={task.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-black">{task.title}</h3>
                  <p className="text-gray-500 text-sm">{task.description}</p>
                  <p className="text-yellow-600 font-semibold text-sm mt-1">⏰ {task.time}</p>
                </div>
                {getStatusChip(task.status)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Reusable Stat Card Component
const StatCard = ({ title, value, icon: Icon, color, action }) => {
    const colorClasses = {
        green: 'from-green-500 to-green-600',
        blue: 'from-blue-500 to-blue-600',
        red: 'from-red-500 to-red-600'
    };
    const buttonClass = action ? 'cursor-pointer' : '';

    return (
        <div className={`bg-gradient-to-br ${colorClasses[color]} text-white p-6 rounded-xl shadow-lg ${buttonClass}`} onClick={action}>
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm uppercase opacity-80">{title}</p>
                    <p className="text-3xl font-bold">{value}</p>
                </div>
                <Icon size={40} className="opacity-50" />
            </div>
        </div>
    );
};


// 3. Machine Health View Component
const MachineHealth = () => {
  const getFaultChip = (severity) => {
    switch (severity) {
      case 'critical':
        return <span className="flex items-center text-xs font-semibold bg-red-500/20 text-red-400 px-2 py-1 rounded-full"><XCircle size={14} className="mr-1"/>Critical</span>;
      case 'warning':
        return <span className="flex items-center text-xs font-semibold bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full"><AlertTriangle size={14} className="mr-1"/>Warning</span>;
      case 'info':
        return <span className="flex items-center text-xs font-semibold bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full"><CheckCircle size={14} className="mr-1"/>Info</span>;
      default:
        return null;
    }
  };

  return (
    <div className="text-gray-800">
      <h1 className="text-4xl font-bold text-black mb-6">Machine Health</h1>
      
      {/* Gauges and Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Gauge title="Fuel Level" value={machineHealthData.fuelLevel} unit="%" />
        <Gauge title="DEF Level" value={machineHealthData.defLevel} unit="%" />
        <Gauge title="Engine Temp" value={machineHealthData.engineTemp} unit="°C" />
        <Gauge title="Hydraulic Temp" value={machineHealthData.hydraulicTemp} unit="°C" />
      </div>

      {/* Key Data Points */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <DataPoint label="Engine Hours" value={machineHealthData.engineHours} />
          <DataPoint label="Next Service Due" value={machineHealthData.nextService} />
      </div>

      {/* Faults Section */}
      <div>
        <h2 className="text-2xl font-bold text-black mb-4">Active Fault Codes</h2>
        <div className="bg-white rounded-lg shadow-md">
          <ul className="divide-y divide-gray-200">
            {machineHealthData.faults.length > 0 ? machineHealthData.faults.map((fault) => (
              <li key={fault.code} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800">{fault.code}</p>
                  <p className="text-gray-600">{fault.description}</p>
                </div>
                {getFaultChip(fault.severity)}
              </li>
            )) : <li className="p-4 text-gray-500">No active faults. System nominal.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Reusable Gauge Component
const Gauge = ({ title, value, unit }) => {
  const percentage = Math.min(Math.max(value, 0), 100);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle className="text-gray-200" strokeWidth="10" stroke="currentColor" fill="transparent" r="45" cx="50" cy="50" />
          <circle
            className="text-yellow-400"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.5s ease-in-out' }}
          />
        </svg>
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-black">{value}</span>
          <span className="text-sm text-gray-500">{unit}</span>
        </div>
      </div>
      <p className="mt-2 font-semibold text-gray-700">{title}</p>
    </div>
  );
};

// Reusable Data Point Component
const DataPoint = ({ label, value }) => (
    <div className="bg-white p-4 rounded-lg shadow-md">
        <p className="text-sm text-gray-500 uppercase">{label}</p>
        <p className="text-2xl font-bold text-black">{value}</p>
    </div>
);


// 4. Safety Checklist View Component
const SafetyChecklist = () => {
  const [checklist, setChecklist] = useState(safetyChecklistItems);

  const handleCheck = (id) => {
    setChecklist(
      checklist.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };
  
  const allChecked = checklist.every(item => item.checked);

  return (
    <div className="text-gray-800">
      <h1 className="text-4xl font-bold text-black mb-6">Pre-Operation Safety Checklist</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600 mb-6">Complete this checklist before starting any operations for the day. Your safety is the first priority.</p>
        
        <div className="space-y-4">
          {checklist.map((item) => (
            <label key={item.id} htmlFor={item.id} className="flex items-center p-3 rounded-md hover:bg-gray-50 cursor-pointer transition-colors">
              <input
                id={item.id}
                type="checkbox"
                checked={item.checked}
                onChange={() => handleCheck(item.id)}
                className="h-6 w-6 rounded border-gray-300 text-yellow-400 focus:ring-yellow-500"
              />
              <span className={`ml-4 text-lg ${item.checked ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                {item.text}
              </span>
            </label>
          ))}
        </div>

        <div className="mt-8 border-t pt-6 flex justify-end">
          <button 
            disabled={!allChecked} 
            className={`px-8 py-3 rounded-lg font-bold text-white transition-all duration-300 ${
              allChecked 
                ? 'bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            {allChecked ? 'Submit & Start Work' : 'Complete All Items to Proceed'}
          </button>
        </div>
      </div>
    </div>
  );
};
