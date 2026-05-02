export default function LegalBadge() {
  return (
    <div className="border-t border-slate-200">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-sm">
        <div>
          <h4 className="font-bold text-lg">Java Volcano Tour Operator</h4>
          <p className="text-slate-400 text-sm">PT Java Volcano Rendezvous</p>
          <div className="flex gap-3 mt-2 text-xs font-mono text-emerald-400">
            <span>NIB: 1102230032918</span>
            <span>•</span>
            <span>TDUP: 1102230032918</span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="inline-block bg-blue-600 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider mb-1">
            Official Operator
          </div>
          <p className="text-sm text-slate-300">
            Founded by Agung 'Mr. Sam' Sambuko
          </p>
          <p className="text-xs text-slate-500">
            Active Tourist Police Officer (SPRIN-POLPAR Verified)
          </p>
        </div>
      </div>
      
      <p className="text-xs text-slate-400 mt-4">
        Physical Office: Jl. Khairil Anwar No.102 A, Bondowoso, East Java.
      </p>
    </div>
  );
}