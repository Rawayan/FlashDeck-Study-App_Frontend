import client from "./client";

export const loginUser = async (credentials) => {
  const response = await client.post(
    "/login/",
    credentials
  );

  return response.data;
};

export const registerUser = async (data) => {
  const response = await client.post(
    "/register/",
    data
  );

  return response.data;
};

export const refreshToken = async (refresh) => {
  const response = await client.post(
    "/token/refresh/",
    {
      refresh,
    }
  );

  return response.data;
};