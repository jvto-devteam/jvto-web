import React from 'react';

const VideoSection: React.FC = () => {
  return (
    <section className="py-12 md:py-24 bg-white dark:bg-background-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-ink-primary dark:text-white mt-1">Experience the Adventure</h2>
          <p className="mt-2 text-ink-neutral-500 dark:text-ink-neutral-200 max-w-2xl mx-auto">
            Watch our short film to get a glimpse of the breathtaking landscapes and unforgettable moments that await you in East Java.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="aspect-[16/9] w-full bg-black rounded-sm overflow-hidden shadow-2xl">
            <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/rcMojEzWFkc"
                title="YouTube video player - JVTO East Java Expedition"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
