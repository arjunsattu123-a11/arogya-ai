"use client";
// page.tsx - Main page for Arogya AI
// Made by Arjun

import { useState } from "react";
import PatientSelector from "@/components/PatientSelector";
import ResponsePanel from "@/components/ResponsePanel";
import SafetyAlerts from "@/components/SafetyAlerts";
import ReminderForm from "@/components/ReminderForm";
import CostComparison from "@/components/CostComparison";

export const TEST_PATIENTS = [
  { id:1, name:"Ramu (Auto Driver)", age:52, condition:"diabetes", hba1c:8.5, egfr:75, has_heart_failure:false, current_drugs:["Metformin"], budget:"low", description:"Low income, HbA1c not controlled" },
  { id:2, name:"Savitri (Housewife)", age:65, condition:"diabetes", hba1c:7.8, egfr:40, has_heart_failure:false, current_drugs:["Metformin","Glimepiride"], budget:"medium", description:"Elderly, kidney disease eGFR 40" },
  { id:3, name:"Suresh (IT Engineer)", age:45, condition:"both", hba1c:9.2, egfr:80, has_heart_failure:true, current_drugs:["Metformin","Pioglitazone","Ramipril"], budget:"high", description:"Diabetes + heart failure, on Pioglitazone" },
  { id:4, name:"Lakshmi (Farmer)", age:58, condition:"cardiac", hba1c:null, egfr:65, has_heart_failure:false, current_drugs:["Aspirin","Metoprolol"], budget:"low", description:"Post-STEMI, very low budget" },
  { id:5, name:"Venkat (Retired)", age:72, condition:"diabetes", hba1c:10.5, egfr:55, has_heart_failure:false, current_drugs:["Glimepiride"], budget:"low", description:"Very high HbA1c, may need insulin" },
  { id:6, name:"Priya (Teacher)", age:40, condition:"cardiac", hba1c:null, egfr:90, has_heart_failure:false, current_drugs:["Aspirin","Ticagrelor","Atorvastatin"], budget:"medium", description:"Post-ACS, dual antiplatelet therapy" },
];

export default function HomePage() {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [safetyAlerts, setSafetyAlerts] = useState<any[]>([]);
  const [drugsShown, setDrugsShown] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"recommendation"|"cost"|"reminder">("recommendation");

  async function getRecommendation(patient: any) {
    setLoading(true);
    setError(null);
    setRecommendation(null);
    setSafetyAlerts([]);
    setDrugsShown([]);
    setActiveTab("recommendation");

    try {
      const res = await fetch("http://localhost:8000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patient),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setRecommendation(data.recommendation);
      setSafetyAlerts(data.safety_alerts || []);
      setDrugsShown(data.drugs_shown || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handlePatientSelect(patient: any) {
    setSelectedPatient(patient);
    getRecommendation(patient);
  }

  const tabs = [
    { key: "recommendation", label: "Recommendation" },
    { key: "cost", label: "Cost comparison" },
    { key: "reminder", label: "WhatsApp reminder" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-green-800 text-white px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-medium">Arogya AI</h1>
            <p className="text-green-200 text-sm mt-0.5">AI-powered medicine for Indian doctors</p>
          </div>
          <div className="text-right text-xs text-green-300">
            <p>Made by Arjun</p>
            <p>RSSDI 2022 · CSI 2019 · NLEM</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-1">
            <PatientSelector patients={TEST_PATIENTS} selectedPatient={selectedPatient} onSelect={handlePatientSelect} />
          </div>

          <div className="lg:col-span-2 space-y-4">
            {safetyAlerts.length > 0 && <SafetyAlerts alerts={safetyAlerts} />}

            {loading && (
              <div className="bg-white border rounded-lg p-10 text-center">
                <div className="inline-block w-7 h-7 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-gray-500 text-sm">Getting India-specific recommendation...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700 font-medium text-sm">Connection error</p>
                <p className="text-red-600 text-xs mt-1">{error}</p>
                <p className="text-red-400 text-xs mt-2">Make sure backend is running: <code>uvicorn main:app --reload</code></p>
              </div>
            )}

            {recommendation && !loading && (
              <>
                <div className="flex gap-0 border-b border-gray-200">
                  {tabs.map(t => (
                    <button key={t.key} onClick={() => setActiveTab(t.key as any)}
                      className={`px-4 py-2.5 text-sm border-b-2 transition-colors ${
                        activeTab === t.key
                          ? "border-green-700 text-green-800 font-medium"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}>
                      {t.label}
                    </button>
                  ))}
                </div>

                {activeTab === "recommendation" && (
                  <ResponsePanel patient={selectedPatient} recommendation={recommendation} />
                )}
                {activeTab === "cost" && (
                  <CostComparison drugs={drugsShown} condition={selectedPatient?.condition || ""} />
                )}
                {activeTab === "reminder" && (
                  <ReminderForm patientName={selectedPatient?.name || ""} drugName="" />
                )}
              </>
            )}

            {!loading && !recommendation && !error && (
              <div className="bg-white border rounded-lg p-12 text-center">
                <div style={{fontSize:"40px",marginBottom:"12px"}}>👨‍⚕️</div>
                <p className="text-gray-500">Select a patient to get started</p>
                <p className="text-gray-400 text-sm mt-1">AI recommendation with Indian prices will appear here</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
