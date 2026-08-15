import api from "../api/axios";
import type { DashboardData } from "../types/dashboard.types";

export const dashboardService = {
    get: ()=> api.get<DashboardData>("/dashboard"),
};