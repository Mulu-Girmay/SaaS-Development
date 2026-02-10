import api from "./axios";

export const createTeam = (data) => api.post("/teams", data);
export const getMyTeam = () => api.get("/teams/me");
export const addTeamMember = (data) => api.post("/teams/members", data);
