import { isAxiosError } from "axios";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_BASE_URL = process.env["API_BASE_URL"] ??
    "http://localhost:8000";

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

apiClient.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export const login = async (data: { email: string; password: string }) => {
    const response = await apiClient.post("/user-management/login", data);
    if (!response || !response.data || !response.data.token) {
        return undefined;
    } else {
        await AsyncStorage.setItem("token", response.data.token);
        return response.data;
    }
};

export const register = async (data: { email: string; password: string }) => {
    const response = await apiClient.post("/user-management/register", data);
    if (!response || !response.data || !response.data.token) {
        return undefined;
    } else {
        await AsyncStorage.setItem("token", response.data.token);
        return response.data;
    }
};

export const deleteService = async (service: string) => {
    const response = await apiClient.delete(
        "/service-management/auth/delete-service-subscription",
        { data: service },
    );
    return response;
};

export const authenticateToService = async (service: string) => {
    console.log(
        `Navigate to: ${API_BASE_URL}/service-management/auth/${service}`,
    );
};

export const isUserSubscribedToService = async (service: string) => {
    try {
        const response = await apiClient.post(
            "/service-management/auth/is_user_subscribed",
            { service },
        );
        return response.data;
    } catch (error) {
        if (isAxiosError(error)) {
            if (!error.response || error.response.status === 404) {
                return false;
            }
        }
        return undefined;
    }
};

export type AreaElement = {
    id: string;
    service_name: string;
    event_type: string;
    payload: unknown;
    created_at: string;
    owner_id: number;
};

export const listAreas = async () => {
    const response = await apiClient.get<AreaElement[]>(
        "/area-composition/list",
    );

    if (!response || !response.data) {
        return [];
    }

    return response.data;
};

type AreaInput = {
    from_service_name: string;
    from_event_type: string;
    from_payload: unknown;
    to_service_name: string;
    to_execution_endpoint: string;
};

type AreaOutput = {
    actionId: string;
    reactionId: string;
};

export const setupArea = async (area: AreaInput) => {
    const response = await apiClient.post<AreaOutput>(
        "/area-composition/create",
        area,
    );

    if (!response || !response.data) {
        return null;
    }

    const { actionId } = response.data;

    return {
        endpoint: `${API_BASE_URL}/area-composition/execute?id=${actionId}`,
    };
};

export default apiClient;
