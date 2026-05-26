"use client";
import { useState } from "react";

type Props = { patientName: string; drugName?: string };

const HOSPITAL = {
  doctorName: "Dr. Deepak Reddy",
  qualification: "MBBS, MD (Medicine)",
  specialization: "Diabetologist & Cardiologist",
  hospitalName: "Brahmo Hospital",
  area: "Banjara Hills, Hyderabad",
  pincode: "500034",
  mapUrl: "https://maps.google.com/?q=Brahmo+Hospital+Banjara+Hills+Hyderabad",
};

const TIME_OPTIONS = [
  "Before breakfast","After breakfast","Before lunch",
  "After lunch","Before dinner","After dinner","Before sleep",
];

export default function ReminderForm({ patientName, drugName = "" }: Props) {
  const [name, setName]           = useState(patientName || "");
  const [mobile, setMobile]       = useState("");
  const [medicines, setMedicines] = useState([{ name: drugName, time: "After breakfast" }]);
  const [qrUrl, setQrUrl]         = useState("");
  const [selfUrl, setSelfUrl]     = useState("");
  const [waMessage, setWaMessage] = useState("");
  const [sent, setSent]           = useState(false);
  const [copied, setCopied]       = useState(false);
  const [loading, setLoading]     = useState(false);

  const addMedicine = () => {
    if (medicines.length >= 8) return;
    setMedicines([...medicines, { name: "", time: "After breakfast" }]);
  };
  const removeMedicine = (i: number) => {
    if (medicines.length === 1) return;
    setMedicines(medicines.filter((_, j) => j !== i));
  };
  const updateMedicine = (i: number, f: string, v: string) =>
    setMedicines(medicines.map((m, j) => j === i ? { ...m, [f]: v } : m));

  function copyLink() {
    navigator.clipboard.writeText(selfUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function generate() {
    if (!mobile || mobile.length < 10) { alert("Enter valid 10-digit mobile number"); return; }
    const filled = medicines.filter(m => m.name.trim());
    if (!filled.length) { alert("Enter at least one medicine name"); return; }

    const pname = name.trim() || "Patient";
    let msg = "🌏 *Arogya AI* 🇮🇳\n";
    msg += "🏥 *" + HOSPITAL.hospitalName + "*\n";
    msg += "👨‍⚕️ " + HOSPITAL.doctorName + " | " + HOSPITAL.qualification + "\n";
    msg += "🩺 " + HOSPITAL.specialization + "\n";
    msg += "📍 " + HOSPITAL.area + " - " + HOSPITAL.pincode + "\n\n";
    msg += "━━━━━━━━━━━━━━━━\n\n";
    msg += "🙏 Hello *" + pname + "*!\n";
    msg += "🏥 Welcome to Brahmo Hospital.\n\n";
    msg += "👨‍⚕️ " + HOSPITAL.doctorName + " has prescribed:\n\n";
    msg += "━━━━━━━━━━━━━━━━\n\n";
    filled.forEach((m, i) => {
      msg += (i + 1) + ". 💊 *" + m.name + "*\n";
      msg += "   ⏰ " + m.time + "\n\n";
    });
    msg += "━━━━━━━━━━━━━━━━\n\n";
    msg += "✅ Please take all medicines on time.\n";
    msg += "❓ Any questions? Visit Brahmo Hospital.\n\n";
    msg += "_Arogya AI | Brahmo Hospital_";

    const encodedMsg = encodeURIComponent(msg);
    setSelfUrl("https://wa.me/91" + mobile + "?text=" + encodedMsg);
    setWaMessage(msg);

    // Step 1: hide QR and show loading spinner
    setQrUrl("");
    setSent(false);
    setLoading(true);
    setCopied(false);

    // Step 2: after 300ms set brand new QR URL
    // This gap forces browser to fully release old image from memory
    setTimeout(() => {
      const uniqueToken = Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
      // Unique token makes QR data different every single time
      // So camera always sees a NEW QR — never the cached one
      const deepLink =
        "whatsapp://send?phone=91" + mobile +
        "&text=" + encodedMsg +
        "&t=" + uniqueToken; // WhatsApp ignores this param but QR becomes unique

      const newQrUrl =
        "https://api.qrserver.com/v1/create-qr-code/?size=220x220" +
        "&data=" + encodeURIComponent(deepLink) +
        "&nocache=" + uniqueToken;

      setQrUrl(newQrUrl);
      setLoading(false);
      setSent(true);
    }, 300);
  }

  return (
    <div className="max-w-lg mx-auto space-y-3">

      {/* Header */}
      <div className="text-center p-5 rounded-t-xl" style={{ background: "#0F6E56" }}>
        <div className="text-3xl font-bold text-white">🩺 Arogya AI</div>
        <div className="text-xs mt-1 tracking-widest" style={{ color: "#9FE1CB" }}>
          SMART MEDICINE REMINDER
        </div>
      </div>

      {/* Doctor Card */}
      <div className="p-4 rounded-b-xl" style={{ background: "#085041" }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl">👨‍⚕️</div>
          <div>
            <div className="font-bold text-white text-base">{HOSPITAL.doctorName}</div>
            <div className="text-xs" style={{ color: "#9FE1CB" }}>{HOSPITAL.qualification}</div>
            <div className="text-xs" style={{ color: "#9FE1CB" }}>{HOSPITAL.specialization}</div>
          </div>
        </div>
        <div className="rounded-lg p-3 mb-3 space-y-1" style={{ background: "rgba(0,0,0,0.2)" }}>
          <div className="text-sm" style={{ color: "#E1F5EE" }}>🏥 {HOSPITAL.hospitalName}</div>
          <div className="text-sm" style={{ color: "#E1F5EE" }}>📍 {HOSPITAL.area}</div>
          <div className="text-sm" style={{ color: "#E1F5EE" }}>📮 PIN - {HOSPITAL.pincode}</div>
        </div>
        <a href={HOSPITAL.mapUrl} target="_blank" rel="noreferrer"
          className="block text-center text-white text-sm py-2 rounded-lg font-medium"
          style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)" }}>
          🗺️ View Brahmo Hospital on Google Maps
        </a>
      </div>

      {/* Info */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <p className="text-green-800 text-sm font-medium">👋 Welcome to Arogya AI!</p>
        <p className="text-green-700 text-xs mt-1">
          Fill the form below to send a WhatsApp medicine reminder. Completely free.
        </p>
      </div>

      {/* Patient Details */}
      <div className="bg-white border rounded-xl p-4">
        <div className="font-medium text-sm mb-3 text-gray-700">👤 Patient details</div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Patient name</label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
              value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Ramu Kumar"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Mobile number</label>
            <input
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
              value={mobile} type="tel"
              onChange={e => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="10 digit number"
            />
          </div>
        </div>
      </div>

      {/* Medicines */}
      <div className="bg-white border rounded-xl p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="font-medium text-sm text-gray-700">💊 Medicines and timings</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
            {medicines.length} medicine{medicines.length > 1 ? "s" : ""}
          </span>
        </div>
        {medicines.map((med, i) => (
          <div key={i} className="grid gap-2 mb-3" style={{ gridTemplateColumns: "1fr 1fr auto" }}>
            <input
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
              value={med.name} onChange={e => updateMedicine(i, "name", e.target.value)}
              placeholder="Medicine name"
            />
            <select
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
              value={med.time} onChange={e => updateMedicine(i, "time", e.target.value)}
            >
              {TIME_OPTIONS.map(t => <option key={t}>{t}</option>)}
            </select>
            <button onClick={() => removeMedicine(i)}
              className="w-8 h-10 border rounded-lg text-gray-400 hover:text-red-500 text-lg">✕</button>
          </div>
        ))}
        {medicines.length < 8 && (
          <button onClick={addMedicine}
            className="w-full py-2 border border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:bg-gray-50">
            + Add another medicine
          </button>
        )}
      </div>

      {/* Generate Button */}
      <button onClick={generate}
        className="w-full py-3 rounded-xl text-white font-medium text-sm"
        style={{ background: "#0F6E56" }}>
        📲 Generate WhatsApp Reminder
      </button>

      {/* Loading spinner while QR refreshes */}
      {loading && (
        <div className="bg-white border rounded-xl p-8 text-center">
          <div className="flex items-center justify-center gap-2" style={{ color: "#0F6E56" }}>
            <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            <span className="text-sm font-medium">Generating fresh QR...</span>
          </div>
        </div>
      )}

      {/* Result */}
      {sent && qrUrl && !loading && (
        <div className="bg-white border rounded-xl p-4 space-y-4">

          {/* QR Code */}
          <div className="text-center space-y-2">
            <div className="font-semibold text-gray-800 text-sm">📷 Patient scans this QR with Camera app</div>
            <p className="text-xs text-gray-500">
              Fresh QR every time ✅ Works unlimited times ✅
            </p>
            {/* 
              src has unique token every time so browser fetches fresh image.
              No key prop needed — the URL itself is always different.
            */}
            <img
              src={qrUrl}
              alt="WhatsApp QR"
              width={220}
              height={220}
              className="mx-auto"
              style={{ border: "3px solid #1D9E75", borderRadius: 10, padding: 6, background: "#fff" }}
            />
            <p className="text-xs font-medium" style={{ color: "#0F6E56" }}>
              ⚠️ Use Camera app — not Google Lens
            </p>
          </div>

          <hr />

          {/* Open WhatsApp directly */}
          <div className="space-y-2">
            <div className="font-semibold text-gray-800 text-sm">📱 Open WhatsApp directly</div>
            <a href={selfUrl} target="_blank" rel="noreferrer"
              className="block text-center py-3 rounded-xl text-white text-sm font-semibold"
              style={{ background: "#25D366" }}>
              📲 Open WhatsApp Now
            </a>
          </div>

          <hr />

          {/* Copy / Share */}
          <div className="space-y-2">
            <div className="font-semibold text-gray-800 text-sm">🔗 Share link to patient</div>
            <p className="text-xs text-gray-500">
              Patient opens on their own phone → reminder saves to their own WhatsApp ✅
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={copyLink}
                className="py-2 rounded-lg text-sm font-medium border-2 transition-all"
                style={{
                  background: copied ? "#f0fdf4" : "#fff",
                  borderColor: copied ? "#25D366" : "#d1d5db",
                  color: copied ? "#16a34a" : "#374151",
                }}>
                {copied ? "✅ Copied!" : "🔗 Copy Link"}
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: "Arogya AI Medicine Reminder", url: selfUrl });
                  } else {
                    copyLink();
                  }
                }}
                className="py-2 rounded-lg text-white text-sm font-medium"
                style={{ background: "#0F6E56" }}>
                📤 Share to Patient
              </button>
            </div>
          </div>

          {/* Message Preview */}
          <div
            className="text-left text-xs p-3 rounded-lg whitespace-pre-wrap leading-relaxed"
            style={{ background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" }}>
            {waMessage}
          </div>

        </div>
      )}
    </div>
  );
}
