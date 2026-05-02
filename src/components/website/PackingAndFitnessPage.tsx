import Breadcrumbs from './Breadcrumbs';

const PackingAndFitnessPage = () => {
  const breadcrumbCrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Travel Guide', path: '/travel-guide' },
    { name: 'Packing & Fitness', path: '/travel-guide/packing-and-fitness' },
  ];

  return (
    <>
      <div className="bg-background-light dark:bg-background-dark pt-20">
        <header className="py-12 bg-white dark:bg-ink-primary">
          <div className="container mx-auto px-4">
            <Breadcrumbs crumbs={breadcrumbCrumbs} />
            <div className="mt-4 max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-black text-ink-primary dark:text-white">Packing & Fitness Guide</h1>
              <p className="mt-4 text-lg text-ink-neutral-500 dark:text-ink-neutral-200">
                Our recommendations for a safe, comfortable, and well-prepared journey.
              </p>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-3xl mx-auto prose dark:prose-invert prose-headings:text-ink-primary dark:prose-headings:text-white">
            
            <section>
                <h2>What JVTO Provides (Included in Your Tour)</h2>
                <p>To keep you safe and reduce your packing load, we provide the following essential gear for relevant treks:</p>
                <ul>
                    <li><strong>Professional Gas Masks:</strong> For the Ijen Crater trek, to protect against sulfurous gases.</li>
                    <li><strong>Headlamps:</strong> For all night or pre-dawn hikes (Ijen and Bromo).</li>
                    <li><strong>Trekking Poles:</strong> For added stability on uneven volcanic trails.</li>
                    <li><strong>Unlimited Bottled Water:</strong> Available in your private vehicle throughout the tour.</li>
                </ul>
            </section>

            <section className="mt-8">
                <h2>Your Essential Packing List</h2>
                <h3>Clothing</h3>
                <ul>
                    <li><strong>Warm Layers:</strong> This is critical. Temperatures at Bromo and Ijen can drop to near freezing (2-10°C / 36-50°F). Pack a fleece, a thermal base layer, and a windproof/waterproof outer jacket.</li>
                    <li><strong>Beanie, Gloves & Scarf:</strong> Essential for the cold sunrise hours.</li>
                    <li><strong>Comfortable Hiking Trousers:</strong> Avoid jeans for trekking. Lightweight, quick-dry trousers are best.</li>
                    <li><strong>T-shirts/Casual Wear:</strong> For daytime travel and relaxing at hotels.</li>
                </ul>

                <h3>Footwear</h3>
                <ul>
                    <li><strong>Sturdy Hiking Shoes:</strong> With good grip. These are essential for the rocky and sometimes slippery paths on Bromo and Ijen.</li>
                    <li><strong>Water Shoes or Trekking Sandals:</strong> Highly recommended for waterfall treks like Tumpak Sewu and Madakaripura, where you will be walking through water.</li>
                    <li><strong>Comfortable Socks:</strong> Bring a few pairs, including warmer ones for the volcano hikes.</li>
                </ul>

                <h3>Other Essentials</h3>
                <ul>
                    <li><strong>Small Daypack:</strong> To carry water, snacks, your camera, and extra layers during hikes.</li>
                    <li><strong>Sun Protection:</strong> Sunglasses, sunscreen, and a hat. The sun is strong at high altitudes.</li>
                    <li><strong>Personal Medications & Basic First-Aid:</strong> Include items like pain relievers, blister plasters, and any personal prescriptions.</li>
                    <li><strong>Camera & Power Bank:</strong> To capture the amazing scenery and keep your devices charged.</li>
                    <li><strong>Cash (IDR):</strong> For meals not included in the itinerary, souvenirs, and optional tips for your crew.</li>
                </ul>
            </section>
            
            <section className="mt-8">
                <h2>Fitness Level Recommendations</h2>
                <h3>Mount Bromo</h3>
                <p><strong>Fitness Level: Easy to Moderate.</strong> The tour is largely vehicle-assisted with a 4WD jeep. The main physical activity is a walk across the {`'Sea of Sand'`} and climbing ~250 steps to the crater rim. Most people with a basic level of fitness will find this manageable.</p>

                <h3>Ijen Crater</h3>
                <p><strong>Fitness Level: Moderate.</strong> The trek to the crater rim is a sustained 1.5 to 2-hour uphill walk on a wide but steep and uneven path. A reasonable level of cardiovascular fitness is required. The optional descent into the crater to see the blue fire is more challenging and requires good balance.</p>

                 <h3>Tumpak Sewu & Madakaripura Waterfalls</h3>
                <p><strong>Fitness Level: Moderate to Challenging.</strong> These treks involve descending steep, slippery steps and bamboo ladders, as well as walking through rivers. Good mobility and balance are more important here than long-distance stamina.</p>

                <p><strong>Important:</strong> Please be honest about your physical condition. If you have any pre-existing medical conditions (especially respiratory or cardiac issues), consult your doctor before booking and inform us in advance.</p>
            </section>

          </div>
        </main>
      </div>
    </>
  );
};

export default PackingAndFitnessPage;
