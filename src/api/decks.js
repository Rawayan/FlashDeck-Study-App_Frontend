import client from "./client";

export const getDecks = (params = {}) => {
  return client.get("/decks/", { params });
};

export const getDeck = (id) => {
  return client.get(`/decks/${id}/`);
};

export const createDeck = (data) => {
  return client.post("/decks/", data);
};

export const updateDeck = (id, data) => {
  return client.patch(`/decks/${id}/`, data);
};

export const deleteDeck = (id) => {
  return client.delete(`/decks/${id}/`);
};

export const getStudyCards = (deckId) => {
  return client.get(`/decks/${deckId}/study/`);
};

export const getStats = () => {
  return client.get("/stats/");
};