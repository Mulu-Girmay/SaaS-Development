import api from "./axios";

export const getMySubscription = () => api.get("/subscription/me");
export const updatePlan = (plan) => api.post("/subscription/plan", { plan });
