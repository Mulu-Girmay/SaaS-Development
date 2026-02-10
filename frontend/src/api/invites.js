import api from "./axios";

export const getInvites = () => api.get("/invites");
export const acceptInvite = (id) => api.post(`/invites/${id}/accept`);
export const declineInvite = (id) => api.post(`/invites/${id}/decline`);
