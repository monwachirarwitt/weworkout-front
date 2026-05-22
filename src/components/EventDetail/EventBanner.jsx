import React from 'react';

// ฟังก์ชันสุ่มรูปปก (เหมือนในหน้าอื่นๆ)
const getCoverImage = (category) => {
  switch(category) {
    case 'Football': return 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1200&auto=format&fit=crop';
    case 'Basketball': return 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200&auto=format&fit=crop';
    case 'Running': return 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1200&auto=format&fit=crop';
    case 'Fitness': return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop';
    default: return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop';
  }
};

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
