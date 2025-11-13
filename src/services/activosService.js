import axios from "axios";

const API_URL = "http://localhost:5000/api/activos";

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const obtenerActivos = async () => {
  const res = await axios.get(API_URL, authHeaders());
  return res.data.data;
};

export const crearActivo = async (activo) => {
  const res = await axios.post(API_URL, activo, authHeaders());
  console.log(res.data);
  console.log("Datos a enviar al backend:", activo);
  return res.data;
};

export const actualizarActivo = async (id, activo) => {
  const res = await axios.put(`${API_URL}/${id}`, activo, authHeaders());
  return res.data;
};

export const eliminarActivo = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`, authHeaders());
  return res.data;
};
