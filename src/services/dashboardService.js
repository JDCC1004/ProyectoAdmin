import axios from "axios";

const API_URL = "http://localhost:5000/api/dashboard";

export const obtenerResumen = async () => {
    const token = localStorage.getItem("token");
    const { data } = await axios.get(`${API_URL}/resumen`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data.data;
};