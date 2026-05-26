"use client";
// CostComparison.tsx - cheap vs costly medicine comparison
// Made by Arjun

type Drug = {
  generic_name: string;
  brand_name: string;
  price_inr: number;
  pack_size: string;
  on_nlem: boolean;
};

type Props = {
  drugs: Drug[];
  condition: string;
};

function monthlyCost(price: number, packSize: string): number {
  const match = packSize.match(/(\d+)/);
  const count = match ? parseInt(match[1]) : 10;
  return Math.round((price / count) * 30);
}

export default function CostComparison({ drugs, condition }: Props) {
  if (!drugs || drugs.length === 0) return (
    <div className="bg-white border rounded-lg p-8 text-center text-gray-400">
      <p>Select a patient first to see cost comparison</p>
    </div>
  );

  const cheapDrugs = drugs.filter(d => d.on_nlem).slice(0, 4);
  const costlyDrugs = drugs.filter(d => !d.on_nlem).slice(0, 4);
  const cheapTotal = cheapDrugs.reduce((sum, d) => sum + monthlyCost(d.price_inr, d.pack_size), 0);
  const costlyTotal = costlyDrugs.reduce((sum, d) => sum + monthlyCost(d.price_inr, d.pack_size), 0);
  const savings = costlyTotal - cheapTotal;

  return (
    <div className="bg-white border rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b">
        <h3 className="font-medium text-gray-800">Cheap vs costly medicine</h3>
        <p className="text-xs text-gray-400 mt-0.5 capitalize">{condition} — monthly cost comparison</p>
      </div>

      <div className="p-4 space-y-4">
        {savings > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-green-800 font-medium text-sm">Patient saves ₹{savings} per month</p>
              <p className="text-green-600 text-xs mt-0.5">by choosing essential medicines (NLEM)</p>
            </div>
            <div className="text-green-700 text-2xl font-medium">₹{savings}</div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          {/* Cheap column */}
          <div>
            <span className="inline-block bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full mb-3">
              Essential medicines (NLEM)
            </span>
            <div className="space-y-2">
              {cheapDrugs.map((drug, i) => (
                <div key={i} className="bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                  <p className="text-xs font-medium text-gray-800">{drug.brand_name}</p>
                  <p className="text-xs text-gray-500">{drug.generic_name}</p>
                  <p className="text-green-700 font-medium text-sm mt-1">₹{drug.price_inr} per pack</p>
                  <p className="text-xs text-green-600">~₹{monthlyCost(drug.price_inr, drug.pack_size)}/month</p>
                </div>
              ))}
              {cheapDrugs.length > 0 && (
                <div className="border-t pt-2 flex justify-between">
                  <span className="text-xs text-gray-500">Monthly total</span>
                  <span className="text-green-700 font-medium text-sm">₹{cheapTotal}</span>
                </div>
              )}
            </div>
          </div>

          {/* Costly column */}
          <div>
            <span className="inline-block bg-orange-100 text-orange-800 text-xs font-medium px-3 py-1 rounded-full mb-3">
              Branded medicines
            </span>
            <div className="space-y-2">
              {costlyDrugs.map((drug, i) => (
                <div key={i} className="bg-orange-50 border border-orange-100 rounded-lg px-3 py-2">
                  <p className="text-xs font-medium text-gray-800">{drug.brand_name}</p>
                  <p className="text-xs text-gray-500">{drug.generic_name}</p>
                  <p className="text-orange-700 font-medium text-sm mt-1">₹{drug.price_inr} per pack</p>
                  <p className="text-xs text-orange-600">~₹{monthlyCost(drug.price_inr, drug.pack_size)}/month</p>
                </div>
              ))}
              {costlyDrugs.length > 0 && (
                <div className="border-t pt-2 flex justify-between">
                  <span className="text-xs text-gray-500">Monthly total</span>
                  <span className="text-orange-700 font-medium text-sm">₹{costlyTotal}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg px-3 py-2">
          <p className="text-xs text-blue-700">
            NLEM medicines are government approved. Same medical effect. Much lower price.
            Always prefer these for low and medium budget patients.
          </p>
        </div>
      </div>
    </div>
  );
}
