import { useState } from 'react';

const sizeData = {
  men: [
    { size: 'S', chest: '34-36"', waist: '28-30"', hips: '34-36"' },
    { size: 'M', chest: '38-40"', waist: '32-34"', hips: '38-40"' },
    { size: 'L', chest: '42-44"', waist: '36-38"', hips: '42-44"' },
    { size: 'XL', chest: '46-48"', waist: '40-42"', hips: '46-48"' },
    { size: 'XXL', chest: '50-52"', waist: '44-46"', hips: '50-52"' },
  ],
  women: [
    { size: 'XS', bust: '31-32"', waist: '24-25"', hips: '34-35"' },
    { size: 'S', bust: '33-35"', waist: '26-28"', hips: '36-38"' },
    { size: 'M', bust: '36-38"', waist: '29-31"', hips: '39-41"' },
    { size: 'L', bust: '39-41"', waist: '32-34"', hips: '42-44"' },
    { size: 'XL', bust: '42-44"', waist: '35-37"', hips: '45-47"' },
  ],
  kids: [
    { size: 'XS (4-5)', height: '40-45"', weight: '34-43 lbs', chest: '22-24"' },
    { size: 'S (6-7)', height: '45-51"', weight: '43-60 lbs', chest: '24-26"' },
    { size: 'M (8-9)', height: '51-55"', weight: '60-75 lbs', chest: '26-28"' },
    { size: 'L (10-12)', height: '55-60"', weight: '75-100 lbs', chest: '28-30"' },
    { size: 'XL (14-16)', height: '60-65"', weight: '100-125 lbs', chest: '30-32"' },
  ]
};

const SizeGuide = () => {
  const [activeTab, setActiveTab] = useState('men');

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Size Guide</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Use the charts below to find the perfect fit. Measurements are given in inches unless otherwise specified.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-100 overflow-x-auto no-scrollbar">
            {['men', 'women', 'kids'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-5 px-6 font-bold text-lg whitespace-nowrap transition-colors ${
                  activeTab === tab 
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/30' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}'s Sizes
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
              <h3 className="font-bold text-slate-900 mb-3 text-lg">How to Measure</h3>
              <ul className="text-sm text-slate-600 space-y-2 list-disc pl-5">
                <li><strong className="text-slate-800">Chest/Bust:</strong> Measure around the fullest part of your chest, keeping the tape horizontal.</li>
                <li><strong className="text-slate-800">Waist:</strong> Measure around the narrowest part (typically where your body bends side to side), keeping the tape horizontal.</li>
                <li><strong className="text-slate-800">Hips:</strong> Measure around the fullest part of your hips, keeping the tape horizontal.</li>
              </ul>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    {Object.keys(sizeData[activeTab][0]).map((key) => (
                      <th key={key} className="p-4 font-semibold capitalize first:rounded-tl-lg last:rounded-tr-lg">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sizeData[activeTab].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      {Object.values(row).map((val, i) => (
                        <td key={i} className={`p-4 ${i === 0 ? 'font-bold text-slate-900' : 'text-slate-600'}`}>
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-8 text-center text-slate-500 text-sm">
              If you're on the borderline between two sizes, order the smaller size for a tighter fit or the larger size for a looser fit.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeGuide;
