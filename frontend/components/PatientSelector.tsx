"use client";

// PatientSelector.tsx
// Shows the 6 test patients in a list
// Doctor clicks a patient to get recommendation

type Patient = {
  id: number;
  name: string;
  age: number;
  condition: string;
  hba1c: number | null;
  egfr: number | null;
  has_heart_failure: boolean;
  current_drugs: string[];
  budget: string;
  description: string;
};

type Props = {
  patients: Patient[];
  selectedPatient: Patient | null;
  onSelect: (patient: Patient) => void;
};

// Color for condition badge
function conditionBadge(condition: string) {
  if (condition === "diabetes") return "bg-yellow-100 text-yellow-800";
  if (condition === "cardiac") return "bg-red-100 text-red-800";
  return "bg-purple-100 text-purple-800";
}

export default function PatientSelector({ patients, selectedPatient, onSelect }: Props) {
  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <div className="bg-gray-100 px-4 py-3 border-b">
        <h2 className="font-semibold text-gray-700">Select Patient</h2>
        <p className="text-xs text-gray-500 mt-0.5">6 test scenarios</p>
      </div>

      <div className="divide-y">
        {patients.map((patient) => {
          const isSelected = selectedPatient?.id === patient.id;

          return (
            <button
              key={patient.id}
              onClick={() => onSelect(patient)}
              className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors
                ${isSelected ? "bg-blue-50 border-l-4 border-l-blue-600" : ""}
              `}
            >
              {/* Patient name and condition */}
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-gray-800 text-sm">{patient.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${conditionBadge(patient.condition)}`}>
                  {patient.condition}
                </span>
              </div>

              {/* Patient details */}
              <p className="text-xs text-gray-500 mb-1">{patient.description}</p>

              {/* Key numbers */}
              <div className="flex gap-3 text-xs text-gray-400">
                <span>Age: {patient.age}</span>
                {patient.hba1c && <span>HbA1c: {patient.hba1c}%</span>}
                {patient.egfr && <span>eGFR: {patient.egfr}</span>}
                <span className="capitalize">Budget: {patient.budget}</span>
              </div>

              {/* Warning flags */}
              <div className="flex gap-1 mt-1.5 flex-wrap">
                {patient.has_heart_failure && (
                  <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                    Heart Failure
                  </span>
                )}
                {patient.egfr && patient.egfr < 45 && (
                  <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">
                    Kidney Disease
                  </span>
                )}
                {patient.hba1c && patient.hba1c > 10 && (
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded">
                    High HbA1c
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
