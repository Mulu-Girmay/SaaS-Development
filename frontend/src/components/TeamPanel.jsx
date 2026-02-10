import { useState } from "react";

export default function TeamPanel({
  team,
  onCreateTeam,
  onAddMember,
}) {
  const [teamName, setTeamName] = useState("");
  const [memberEmail, setMemberEmail] = useState("");

  return (
    <div className="space-y-3">
      <div className="section-title">Team</div>
      {team ? (
        <>
          <div className="text-sm font-semibold text-slate-800">
            {team.name}
          </div>
          <div className="text-xs text-slate-500">
            Members: {team.members?.length || 0}
          </div>
          <div className="flex gap-2">
            <input
              className="input"
              placeholder="Member email"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
            />
            <button
              className="btn btn-accent"
              onClick={() => {
                if (!memberEmail) return;
                onAddMember({ email: memberEmail });
                setMemberEmail("");
              }}
            >
              Add
            </button>
          </div>
        </>
      ) : (
        <>
          <input
            className="input"
            placeholder="Team name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={() => {
              if (!teamName) return;
              onCreateTeam({ name: teamName });
              setTeamName("");
            }}
          >
            Create Team
          </button>
        </>
      )}
    </div>
  );
}
