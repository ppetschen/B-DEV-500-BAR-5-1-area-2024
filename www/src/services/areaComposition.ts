import apiClient, { API_BASE_URL } from "./api";

export type AreaElement = {
  id: string;
  markup: string;
  service_name: string;
  execution_endpoint: string;
  status: string;
  executed_at: string | null;
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
