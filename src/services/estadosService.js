import axios from "axios";

const API_URL = "http://localhost:5000/api/licencias";

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const obtenerEstado = async () => {
    const res = await axios.get(API_URL, authHeaders());
    console.log(res.data);
    return res.data.data;
}