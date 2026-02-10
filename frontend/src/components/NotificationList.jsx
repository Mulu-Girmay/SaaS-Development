export default function NotificationList({ notifications, onMarkRead }) {
  const unread = notifications?.filter((n) => !n.read) ?? [];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="section-title">Notifications</div>
        <button className="btn btn-secondary" onClick={onMarkRead}>
          Mark read
        </button>
      </div>
      {notifications?.length ? (
        notifications.map((n) => (
          <div key={n._id} className="note-card">
            <div className="flex-1">
              <div className="text-sm font-semibold text-slate-800">
                {n.message}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {new Date(n.createdAt).toLocaleString()}
              </div>
            </div>
            {!n.read && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                New
              </span>
            )}
          </div>
        ))
      ) : (
        <div className="empty-state">No notifications yet.</div>
      )}
      {unread.length > 0 && (
        <div className="text-xs text-slate-500">
          {unread.length} unread
        </div>
      )}
    </div>
  );
}
