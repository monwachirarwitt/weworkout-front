import React, { useEffect, useRef } from 'react';

const DiscussionBoard = ({ comments, currentUser, eventHostId, newComment, setNewComment, onSendComment }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    // เลื่อนลงล่างสุดอัตโนมัติเมื่อมีคอมเมนต์ใหม่
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments]);

  return (
    <div className="bg-surface-container-lowest rounded-[2rem] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.06)] border border-outline-variant/10 flex flex-col h-[500px]">
      <h2 className="text-2xl font-headline font-black text-on-background mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">forum</span> Discussion Board
      </h2>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto pr-2 space-y-4 mb-6 custom-scrollbar">
        {/*ถ้า comments ว่างเปล่า (ความยาวเป็น 0) มันจะแสดงไอคอนรูปคำพูดพร้อมข้อความว่า "No messages yet. Start the conversation!" เพื่อบอกผู้ใช้ว่ายังไม่มีใครพิมพ์อะไรเลย */}
        {comments.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-outline">
            <span className="material-symbols-outlined text-4xl mb-2">chat_bubble</span>
            <p className="font-medium">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          comments.map(c => (
            //(คนพิมพ์ใช่ตัวเราไหม? ถ้าใช่ให้อยู่ท้าย ถ้าไม่ให้อยู่ขวา)
            <div key={c.id} className={`flex ${c.user.id === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${c.user.id === currentUser?.id ? 'bg-primary text-white rounded-br-none' : 'bg-surface-container-low text-on-background rounded-bl-none border border-outline-variant/20'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold ${c.user.id === currentUser?.id ? 'text-white/80' : 'text-primary'}`}>
                    {c.user.name} {c.user.id === eventHostId && '(Host)'}
                  </span>
                  <span className="text-[10px] opacity-70">
                    {new Date(c.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm md:text-base leading-relaxed">{c.message}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={onSendComment} className="flex gap-3 relative">
        <input 
          type="text" 
          placeholder="Type a message..." 
          value={newComment} 
          onChange={(e) => setNewComment(e.target.value)} 
          className="w-full bg-surface-container-low border-none rounded-full px-6 py-4 pr-16 focus:ring-2 focus:ring-primary/20 outline-none"
        />
        <button 
          type="submit" 
          className="absolute right-2 top-2 bottom-2 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
        >
          <span className="material-symbols-outlined text-[20px] ml-1">send</span>
        </button>
      </form>
    </div>
  );
};

export default DiscussionBoard;
