export default function ActivityLog({ notifications, auditLogs, onMarkRead }) {
  // Normalize notifications
  const notificationItems = (notifications || []).map((item) => ({
    id: `n-${item._id}`,
    message: item.message,
    time: item.createdAt,
    type: 'notification',
    isRead: item.read,
  }));
  
  // Normalize audit logs (if we want to show them mixed in)
  const auditItems = (auditLogs || []).map((item) => ({
    id: `a-${item._id}`,
    message: item.action?.replace('_', ' '), // "NOTE_SHARED" -> "NOTE SHARED"
    time: item.createdAt,
    type: 'audit',
    meta: item.user?.email,
  }));

  // Combine and sort by newest first
  const merged = [...notificationItems, ...auditItems].sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
  );

  const hasUnread = notifications?.some(n => !n.read);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-[10px] text-[var(--text-tertiary)]">Recent updates</span>
        {hasUnread && (
          <button 
            className="text-[10px] font-bold text-[var(--p-accent)] hover:underline" 
            onClick={onMarkRead}
          >
            Mark all read
          </button>
        )}
      </div>
      
      {merged.length ? (
        <div className="space-y-3">
          {merged.slice(0, 10).map((item) => (
            <div key={item.id} className="flex gap-3 items-start group">
               <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${item.type === 'notification' ? (item.isRead ? 'bg-[var(--border-color)]' : 'bg-[var(--p-accent)]') : 'bg-[var(--text-tertiary)]'}`}></div>
               <div className="flex-1 min-w-0">
                 <p className={`text-sm leading-snug ${item.isRead === false ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                    {item.message}
                 </p>
                 <p className="text-[10px] text-[var(--text-tertiary)] mt-0.5">
                    {new Date(item.time).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                 </p>
               </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-[var(--text-tertiary)] text-xs italic">
          No recent activity.
        </div>
      )}
    </div>
  );
}
