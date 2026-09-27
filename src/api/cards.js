import client from "./client";

export const getCards = (params = {}) => {
  return client.get("/cards/", { params });
};

export const getCard = (id) => {
  return client.get(`/cards/${id}/`);
};

export const createCard = (data) => {
  return client.post("/cards/", data);
};

export const updateCard = (id, data) => {
  return client.patch(`/cards/${id}/`, data);
};

export const deleteCard = (id) => {
  return client.delete(`/cards/${id}/`);
};

export const reviewCard = (id, correct) => {
  return client.post(`/cards/${id}/review/`, {
    correct,
  });
};