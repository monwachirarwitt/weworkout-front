import React from 'react';

const EventHostCard = ({ host, isHost }) => {
  return (
    <div className="bg-surface-container-lowest rounded-[2rem] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-outline-variant/10 text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-r from-primary to-primary-container"></div>
      <div className="relative z-10">
        <div className="w-20 h-20 mx-auto rounded-full bg-surface-container-lowest p-1 mb-3">
          <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-2xl">
            {host?.name?.charAt(0) || 'H'}
          </div>
        </div>
        <p className="text-xs font-bold text-outline uppercase tracking-widest mb-1">Event Host</p>
        <h3 className="text-xl font-headline font-black text-on-background">{host?.name}</h3>
        {isHost && (
          <span className="inline-block mt-2 bg-secondary/10 text-secondary text-[10px] font-black uppercase px-3 py-1 rounded-full">
            It's You!
          </span>
        )}
      </div>
    </div>
  );
};

export default EventHostCard;
