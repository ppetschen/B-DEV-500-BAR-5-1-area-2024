import { apiClient } from "./api";

export const login = async (
  data: { email: string; password: string },
  method: string,
) => {
  const response = await apiClient.post(
    `/user-management/login?method=${method}`,
    data,
  );
  if (!response || !response.data || !response.data.token) {
    return undefined;
  } else {
    localStorage.setItem("token", response.data.token);
    return response.data;
  }
};

export const register = async (
  data: { email: string; password: string },
  method: string,
) => {
  const response = await apiClient.post(
    `/user-management/register?method=${method}`,
    data,
  );
  if (!response || !response.data || !response.data.token) {
    return undefined;
  } else {
    localStorage.setItem("token", response.data.token);
    return response.data;
  }
};

export const userInformation = async () => {
  const responseUser = await apiClient.get(`/user-management/get-user`);
  if (!responseUser || !responseUser.data) {
    return undefined;
  }

  const responseServices = await apiClient.get(
    `/service-management/auth/get-services-by-user`,
  );
  if (!responseServices || !responseServices.data) {
    return undefined;
  }
  const user = {
    ...responseUser.data,
    ...responseServices.data,
  };
  console.log(user);
  return user;
};

export const deleteUser = async () => {
  const response = await apiClient.delete(`/user-management/delete-user`);
  if (!response || !response.data) {
    return undefined;
  }
  return response.data;
};
