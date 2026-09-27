import client from "./client";

export const registerUser = (data) => {
  return client.post("/register/", data);
};

export const loginUser = (data) => {
  return client.post("/login/", data);
};

export const refreshToken = (refresh) => {
  return client.post("/token/refresh/", {
    refresh,
  });
};