import apiClient from "./api";

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
