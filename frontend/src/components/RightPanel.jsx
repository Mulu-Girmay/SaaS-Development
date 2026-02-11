import ActivityLog from "./ActivityLog";
import TeamPanel from "./TeamPanel";
import SubscriptionPanel from "./SubscriptionPanel";
import InviteList from "./InviteList";
import AdminPanel from "./AdminPanel";

export default function RightPanel({ 
  user,
  notifications, 
  auditLogs, 
  invites, 
  team, 
  subscription, 
  analytics,
  onMarkRead, 
  onAcceptInvite, 
  onDeclineInvite, 
  onCreateTeam, 
  onAddMember, 
  onPlanChange,
  onClose
}) {
  return (
    <div className="w-[320px] bg-[var(--bg-panel)] border-l border-[var(--border-color)] flex flex-col h-full absolute right-0 top-0 z-20 shadow-xl overflow-y-auto transform transition-transform duration-200">
      <div className="p-5 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-sidebar)] sticky top-0 z-10 backdrop-blur-md bg-opacity-90">
        <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--text-secondary)]">Information</h3>
        <button onClick={onClose} className="p-1 rounded-md text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div className="p-5 space-y-8">
        {/* Activity & Notifications */}
        <Section title="Activity">
            <ActivityLog notifications={notifications} auditLogs={auditLogs} onMarkRead={onMarkRead} />
        </Section>

        {/* Invites (Only show if there are invites) */}
        {invites && invites.length > 0 && (
            <Section title="Invites">
                <InviteList invites={invites} onAccept={onAcceptInvite} onDecline={onDeclineInvite} />
            </Section>
        )}
        
        {/* Team Management */}
        <Section title="Team">
            <TeamPanel team={team} onCreateTeam={onCreateTeam} onAddMember={onAddMember} />
        </Section>

        {/* Subscription */}
        <Section title="Subscription">
            <SubscriptionPanel subscription={subscription} onPlanChange={onPlanChange} />
        </Section>

        {/* Admin (Only for admins) */}
        {user?.role === "admin" && (
             <Section title="Admin Console">
                <AdminPanel analytics={analytics} auditLogs={auditLogs} />
             </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-3">
      <div className="text-[11px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider pl-1">{title}</div>
      <div className="bg-[var(--bg-app)] border border-[var(--border-color)] rounded-xl p-3 shadow-sm">
        {children}
      </div>
    </div>
  );
}
