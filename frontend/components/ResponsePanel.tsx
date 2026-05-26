"use client";

// ResponsePanel.tsx
// Shows the AI recommendation from AI
// Formats it nicely for the doctor

type Props = {
  patient: any;
  recommendation: string;
};

export default function ResponsePanel({ patient, recommendation }: Props) {
  // Format the recommendation text
  // Replace line breaks with proper spacing
  const lines = recommendation.split("\n").filter((line) => line.trim() !== "");

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
        <div>
          <h2 className="font-semibold">India-Specific Recommendation</h2>
          <p className="text-blue-200 text-xs mt-0.5">
            Based on RSSDI/CSI guidelines with Indian drug prices
          </p>
        </div>
        <span className="text-xs bg-blue-500 px-2 py-1 rounded">
          Arogya AI
        </span>
      </div>

      {/* Patient summary bar */}
      <div className="bg-gray-50 px-4 py-2 border-b flex gap-4 text-xs text-gray-600">
        <span>Patient: <strong>{patient?.name}</strong></span>
        <span>Age: <strong>{patient?.age}</strong></span>
        <span>Condition: <strong className="capitalize">{patient?.condition}</strong></span>
      </div>

      {/* Recommendation content */}
      <div className="px-4 py-4">
        <div className="prose prose-sm max-w-none">
          {lines.map((line, index) => {
            // Style different sections differently
            if (line.startsWith("RECOMMENDED DRUGS") ||
                line.startsWith("WHAT TO MONITOR") ||
                line.startsWith("PATIENT ADVICE") ||
                line.startsWith("COST ESTIMATE")) {
              return (
                <h3 key={index} className="font-bold text-gray-800 mt-4 mb-2 text-sm uppercase tracking-wide border-b pb-1">
                  {line.replace(":", "")}
                </h3>
              );
            }

            // Numbered items (drug recommendations)
            if (/^\d+\./.test(line)) {
              return (
                <div key={index} className="bg-blue-50 border border-blue-100 rounded p-3 mb-2">
                  <p className="text-sm text-gray-800 font-medium">{line}</p>
                </div>
              );
            }

            // Lines starting with "Reason:"
            if (line.startsWith("Reason:") || line.startsWith("   Reason:")) {
              return (
                <p key={index} className="text-xs text-gray-600 ml-4 mb-2 italic">
                  {line}
                </p>
              );
            }

            // Bullet points
            if (line.startsWith("-") || line.startsWith("•")) {
              return (
                <p key={index} className="text-sm text-gray-700 ml-3 mb-1">
                  {line}
                </p>
              );
            }

            // Monthly cost line
            if (line.toLowerCase().includes("monthly cost") || line.includes("₹")) {
              return (
                <p key={index} className="text-sm font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded mt-2 mb-1">
                  {line}
                </p>
              );
            }

            // Regular text
            return (
              <p key={index} className="text-sm text-gray-700 mb-1">
                {line}
              </p>
            );
          })}
        </div>
      </div>

      {/* Footer note */}
      <div className="bg-yellow-50 border-t border-yellow-100 px-4 py-2">
        <p className="text-xs text-yellow-700">
          ⚠️ This is an AI suggestion only. Final prescription decision must be made by the doctor.
          Verify drug prices on 1mg.com before prescribing.
        </p>
      </div>
    </div>
  );
}
