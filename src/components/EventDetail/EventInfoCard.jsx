import React from 'react';

const EventInfoCard = ({ event, isHost, onDelete, onJoin }) => {
  return (
    <div className="bg-surface-container-lowest rounded-[2rem] p-8 md:p-10 shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-outline-variant/10">
      <div className="flex items-center justify-between mb-4">
        <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary font-black text-xs uppercase tracking-widest rounded-full">
          {event.category}
        </div>

        {/* 💥 ปุ่ม Delete โชว์ตรงนี้เลยครับ (ใช้สีแดงมาตรฐานของ Tailwind ให้เห็นชัวร์ๆ) */}
        {isHost && (
          <button 
            onClick={onDelete}
            className="flex items-center gap-2 bg-red-500 text-white hover:bg-red-600 px-4 py-2 rounded-full text-[10px] sm:text-xs font-black uppercase transition-all shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-[14px]">delete</span> Delete Activity
          </button>
        )}
      </div>
      
      <h1 className="text-4xl md:text-5xl font-headline font-black text-on-background mb-6 leading-tight">
        {event.title}
      </h1>
      
      <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
        {event.description}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20 mb-8">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-3 rounded-full text-primary">
            <span className="material-symbols-outlined text-2xl">calendar_month</span>
          </div>
          <div>
            <p className="text-xs font-bold text-outline uppercase tracking-wider mb-1">Date & Time</p>
            <p className="font-bold text-on-background">{new Date(event.eventDate).toLocaleDateString('en-GB', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            <p className="text-sm font-medium text-on-surface-variant">{event.startTime} - {event.endTime}</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 p-3 rounded-full text-primary">
            <span className="material-symbols-outlined text-2xl">location_on</span>
          </div>
          <div>
            <p className="text-xs font-bold text-outline uppercase tracking-wider mb-1">Location</p>
            <p className="font-bold text-on-background line-clamp-1">{event.locationName}</p>
            <a href={event.locationUrl} target="_blank" rel="noreferrer" className="text-sm font-bold text-secondary hover:underline flex items-center gap-1 mt-1">
              View on Map <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </a>
          </div>
        </div>
      </div>

      {/* โชว์ปุ่ม Join เฉพาะคนที่ไม่ใช่ Host */}
      {!isHost && (
        <button 
          onClick={onJoin}
          className="w-full py-4 bg-gradient-to-r from-secondary to-secondary-container text-white font-headline font-bold text-lg rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
        >
          Join Activity
          <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
        </button>
      )}
    </div>
  );
};

export default EventInfoCard;
