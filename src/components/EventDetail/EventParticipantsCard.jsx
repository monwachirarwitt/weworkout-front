import React from 'react';

const EventParticipantsCard = ({ participants, maxParticipants, isHost, onManageParticipant }) => {
  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-outline-variant/10">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-headline font-black text-lg text-on-background">Participants</h3>
        <span className="bg-surface-container-low text-primary text-xs font-bold px-3 py-1 rounded-full">
          {participants?.length || 0} / {maxParticipants}
        </span>
      </div>

      {participants?.length === 0 ? (
        <p className="text-center text-sm font-medium text-outline italic py-6">No participants yet.</p>
      ) : (
        <ul className="space-y-3">
          {participants.map(p => (
            <li key={p.id} className="flex flex-col bg-surface-container-low p-3 rounded-xl border border-outline-variant/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-surface-container-lowest flex items-center justify-center text-primary font-bold text-xs shadow-sm">
                    {p.user?.name?.charAt(0)}
                  </div>
                  <span className="font-bold text-sm text-on-background line-clamp-1">{p.user?.name}</span>
                </div>
                
                {/* ป้ายบอกสถานะ */}
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-sm ${
                  p.status === 'ACCEPTED' ? 'bg-tertiary-fixed-dim text-on-tertiary-container' : 
                  p.status === 'REJECTED' ? 'bg-error-container text-error' : 
                  'bg-secondary-fixed text-on-secondary-fixed-variant'
                }`}>
                  {p.status}
                </span>
              </div>

              {/* 💥 โซนพลังอำนาจ: ถ้าเราเป็น Host และลูกตี้คนนี้ยัง PENDING อยู่ จะโชว์ปุ่มให้กดยอมรับ/ปฏิเสธ */}
              {isHost && p.status === 'PENDING' && (
                <div className="flex gap-2 mt-2 pt-2 border-t border-outline-variant/10">
                  <button 
                    onClick={() => onManageParticipant(p.userId || p.user.id, 'ACCEPTED')} 
                    className="flex-1 bg-green-500 text-white py-1.5 rounded-lg text-xs font-bold hover:bg-[#1f5021] transition-colors shadow-sm"
                  >
                    Accept
                  </button>
                  <button 
                    onClick={() => onManageParticipant(p.userId || p.user.id, 'REJECTED')} 
                    className="flex-1 bg-red-500 text-on-surface py-1.5 rounded-lg text-xs font-bold hover:bg-error hover:text-white transition-colors shadow-sm"
                  >
                    Decline
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventParticipantsCard;
