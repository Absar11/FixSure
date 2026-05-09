import React from 'react';

const AnnouncementBanner = () => {
  return (
    <div className="fixed top-0 left-0 w-full bg-brand-orange text-white py-2 px-4 z-[60] overflow-hidden h-10 md:h-8 flex items-center">
      <div className="flex whitespace-nowrap animate-marquee items-center justify-center">
        <span className="text-xs md:text-sm font-black uppercase tracking-[0.2em] flex items-center">
          <span className="mr-4">🚀 EXCITING NEWS: FIXSURE IS NOW LIVE IN <span className="underline decoration-2 underline-offset-4">FATEHPUR</span>!</span>
          <span className="mr-4">•</span>
          <span className="mr-4">EXPERT HOME APPLIANCE REPAIR NOW AT YOUR DOORSTEP IN FATEHPUR</span>
          <span className="mr-4">•</span>
          <span className="mr-4">BOOK YOUR SERVICE TODAY AND GET SPECIAL LAUNCH OFFERS!</span>
          <span className="mr-4">•</span>
        </span>
        {/* Duplicate for seamless loop */}
        <span className="text-xs md:text-sm font-black uppercase tracking-[0.2em] flex items-center">
          <span className="mr-4">🚀 EXCITING NEWS: FIXSURE IS NOW LIVE IN <span className="underline decoration-2 underline-offset-4">FATEHPUR</span>!</span>
          <span className="mr-4">•</span>
          <span className="mr-4">EXPERT HOME APPLIANCE REPAIR NOW AT YOUR DOORSTEP IN FATEHPUR</span>
          <span className="mr-4">•</span>
          <span className="mr-4">BOOK YOUR SERVICE TODAY AND GET SPECIAL LAUNCH OFFERS!</span>
          <span className="mr-4">•</span>
        </span>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
