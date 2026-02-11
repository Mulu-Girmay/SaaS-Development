export default function AdminPanel({ analytics, auditLogs }) {
  return (
    <div className="space-y-3">
      <div className="section-title">Admin</div>
      <div className="text-sm text-slate-600">
        Total events:{" "}
        <span className="font-semibold text-slate-800">
          {analytics?.totalEvents ?? 0}
        </span>
      </div>
      <div className="space-y-2">
        {(auditLogs || []).slice(0, 5).map((log) => (
          <div key={log._id} className="note-card">
            <div className="flex-1">
              <div className="text-sm font-semibold text-slate-800">
                {log.action}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {log.user?.email || "User"} ·{" "}
                {new Date(log.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
        {(!auditLogs || auditLogs.length === 0) && (
          <div className="empty-state">No audit logs.</div>
        )}
      </div>
    </div>
  );
}
