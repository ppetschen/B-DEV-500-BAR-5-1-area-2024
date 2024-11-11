import apiClient from "./api";

export const getAvailableAreas = async () => {
    const response = await apiClient.get(`/area-composition/available`);
  
    if (!response.data) {
      return {
        actions: [],
        reactions: [],
      };
    }
  
    return {
      actions: [response.data.actions],
      reactions: [response.data.reactions],
    }
  };