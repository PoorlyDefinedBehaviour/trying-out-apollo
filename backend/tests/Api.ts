import axios from "axios";

const api = axios.create({ baseURL: `http://localhost:${process.env.PORT || 8080}/graphql` });

export default api;
