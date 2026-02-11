export default function ActivityLog({ notifications, auditLogs, onMarkRead }) {
  const notificationItems = (notifications || []).map((item) => ({
    id: `n-${item._id}`,
    message: item.message,
    time: item.createdAt,
    meta: item.read ? "Read" : "New",
  }));
  const auditItems = (auditLogs || []).map((item) => ({
    id: `a-${item._id}`,
    message: item.action,
    time: item.createdAt,
    meta: item.user?.email || "System",
  }));
  const merged = [...notificationItems, ...auditItems].sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="section-title">Activity Log</div>
        <button className="btn btn-secondary" onClick={onMarkRead}>
          Mark read
        </button>
      </div>
      {merged.length ? (
        merged.slice(0, 8).map((item) => (
          <div key={item.id} className="activity-item">
            <div className="activity-main">
              <div className="activity-message">{item.message}</div>
              <div className="activity-time">
                {new Date(item.time).toLocaleString()}
              </div>
            </div>
            <span className="activity-meta">{item.meta}</span>
          </div>
        ))
      ) : (
        <div className="empty-state">No activity yet.</div>
      )}
    </div>
  );
}
