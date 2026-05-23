import React from 'react';



const EventBanner = ({ event, onBack }) => {
  return (
    <div className="w-full h-64 md:h-80 relative">
      <img src={event.imgEvent || getCoverImage(event.category)} alt={event.category} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>

      {/* ปุ่ม Back มุมซ้ายบน */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 md:left-12 flex items-center gap-2 bg-surface-container-lowest/80 backdrop-blur-md px-4 py-2 rounded-full font-bold text-on-surface-variant hover:bg-white transition-all shadow-md"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span> Back
      </button>
    </div>
  );
};

export default EventBanner;
