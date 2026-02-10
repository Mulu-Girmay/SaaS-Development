export default function InviteList({ invites, onAccept, onDecline }) {
  if (!invites || invites.length === 0) {
    return (
      <div className="empty-state">
        No invites right now.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {invites.map((invite) => (
        <div key={invite._id} className="note-card">
          <div className="flex-1">
            <div className="text-sm font-semibold text-slate-800">
              {invite.note?.title || "Untitled note"}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              From {invite.fromUser?.name || invite.fromUser?.email || "User"} ·{" "}
              {invite.permission}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              className="btn btn-secondary"
              onClick={() => onDecline(invite._id)}
            >
              Decline
            </button>
            <button
              className="btn btn-accent"
              onClick={() => onAccept(invite._id)}
            >
              Accept
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
