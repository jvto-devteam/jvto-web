
import React from 'react';

const IjenHealthCertFAQ: React.FC = () => {
  return (
    <div className="mt-12">
      <div className="bg-yellow-50 dark:bg-yellow-900/30 p-6 rounded-sm border border-yellow-200 dark:border-yellow-700 text-ink-neutral-700 dark:text-ink-neutral-200">
        {/* Existing Health Check section */}
        <div className="flex items-start gap-4">
          <span className="material-symbols-outlined text-3xl text-yellow-500 mt-1">medical_information</span>
          <div>
            <h3 className="text-xl font-bold text-ink-primary dark:text-white">Mandatory Health Check for Ijen Crater</h3>
            <p className="mt-2 text-sm">
              To ensure the safety of all visitors, the Indonesian government requires a basic medical health certificate for every person trekking to the Ijen Crater. Here’s how we make this process seamless for you.
            </p>
            
            <div className="mt-4 space-y-4">
                <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400 mt-1">gavel</span>
                    <div>
                        <h4 className="font-semibold text-ink-primary dark:text-white">Why is it required?</h4>
                        <p className="text-sm">This is a non-negotiable government regulation designed to ensure trekkers are physically prepared for the high altitude and strenuous conditions of the hike.</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400 mt-1">health_and_safety</span>
                    <div>
                        <h4 className="font-semibold text-ink-primary dark:text-white">How does it work? (Hassle-Free)</h4>
                        <p className="text-sm">As part of our all-inclusive service, we arrange for a qualified nurse to visit you at your hotel to perform the simple check. <strong>The full cost for this service is included in your tour package. No local cash payment is required.</strong></p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400 mt-1">hotel</span>
                    <div>
                        <h4 className="font-semibold text-ink-primary dark:text-white">Contingency Plan: What if {`I'm`} declared unfit?</h4>
                        <p className="text-sm">If, for safety reasons, the nurse declares a guest unfit to climb, they will unfortunately not be permitted to join the Ijen trek. While a refund for the Ijen portion is not possible as costs are pre-allocated, we will ensure the guest can rest comfortably at the hotel while the rest of the group continues. Your safety is our absolute priority.</p>
                    </div>
                </div>
            </div>
          </div>
        </div>

        <hr className="my-6 border-yellow-300 dark:border-yellow-700/50" />

        {/* New Trek Details section */}
        <div className="flex items-start gap-4">
          <span className="material-symbols-outlined text-3xl text-yellow-500 mt-1">hiking</span>
          <div>
            <h3 className="text-xl font-bold text-ink-primary dark:text-white">Ijen Trek Quick Facts</h3>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
              <div>
                <h4 className="font-semibold text-ink-primary dark:text-white">Difficulty & Altitude</h4>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li><strong>Level:</strong> Moderate</li>
                  <li><strong>Trail:</strong> ~6km round trip, 1.5-2 hours ascent on a steep path.</li>
                  <li><strong>Altitude:</strong> 2,386 m (7,828 ft) at the crater rim.</li>
                  <li><strong>Temperatures:</strong> Can drop to 2°C–10°C (36°F–50°F).</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-ink-primary dark:text-white">Required Gear</h4>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Warm layers (jacket, beanie, gloves).</li>
                  <li>Sturdy, comfortable trekking shoes.</li>
                  <li>Headlamp (provided by JVTO).</li>
                  <li>Gas mask & poles (provided by JVTO).</li>
                </ul>
              </div>
              <div className="sm:col-span-2">
                <h4 className="font-semibold text-ink-primary dark:text-white">Best Time to Visit & Advisories</h4>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li><strong>Best Season:</strong> May to October (dry season) for clearer skies.</li>
                  <li><strong>Blue Fire:</strong> The trek starts around midnight. Visibility of this natural phenomenon is **not guaranteed** and depends on volcanic conditions.</li>
                  <li><strong>Monthly Closure:</strong> The Ijen crater is closed to all visitors on the first Friday of every month for local ceremonies.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default IjenHealthCertFAQ;