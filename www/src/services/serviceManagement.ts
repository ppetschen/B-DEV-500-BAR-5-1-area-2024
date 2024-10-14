import { isAxiosError } from "axios";
import apiClient from "./api";

export const deleteService = async (service: string) => {
    const response = await apiClient.delete("/service-management/auth/delete-service-subscription", { data: service });
    return response;
};

export const authenticateToService = async (service: string) => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/service-management/auth/${service}`;
};

export const isUserSubscribedToService = async (service: string) => {
    try {
        const response = await apiClient.post("/service-management/auth/is_user_subscribed", { service });
        return response.data;
    } catch (error) {
        if(isAxiosError(error)) {
            if (!error.response || error.response.status === 404) {
                return false; 
            }
        }
        return undefined;
    }
};
