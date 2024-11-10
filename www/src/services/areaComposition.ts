import { apiClient } from "./api";

export type AreaElement = {
  id: string;
  service_name: string;
  event_type: string;
  payload: unknown;
  created_at: string;
  owner_id: number;
};

export const getAvailableAreas = async () => {
  const response = await apiClient.get(`/area-composition/available`);

  if (!response.data) {
    return {
      actions: [],
      reactions: [],
    };
  }

  return response.data as {
    actions: string[];
    reactions: string[];
  };
};

export const getCompletions = async (
  { from, to }: { from: string; to: string },
) => {
  const response = await apiClient.post(
    `/area-composition/completions`,
    { from, to },
  );

  if (!response.data) {
    return {
      from: undefined,
      to: undefined,
    };
  }

  return response.data as {
    from: { data: unknown[] };
    to: { data: unknown[] };
  };
};

export const composeArea = async (data: {
  from: {
    type: string;
    context: unknown;
  };
  to: {
    type: string;
    context: unknown;
  };
  markup: string;
}) => {
  console.log(data);

  if (data.from.type === "github") {
    const obj = data.from.context as Record<string, unknown>;
    if (!Array.isArray(obj.events)) {
      obj.events = [obj.events];
    }
  }

  const response = await apiClient.post(`/area-composition/compose`, data);
  console.log(response);

  if (!response.data) {
    return {
      action_id: undefined,
      reaction_id: undefined,
    };
  }

  return response.data as {
    action_id: string;
    reaction_id: string;
  };
};
