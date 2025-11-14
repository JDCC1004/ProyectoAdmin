import axios from "axios";

const API_URL = "http://localhost:5000/api/licencias";

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const obtenerLicencias = async () => {
  const res = await axios.get(API_URL, authHeaders());
  return res.data.data;
};

export const crearLicencia = async (licencia) => {
    const res = await axios.post(API_URL, licencia, authHeaders());
    console.log(res.data);
    console.log("Datos a enviar al backend:", licencia);
    return res.data;
};

export const actualizarLicencia = async (id, licencia) => {
    const res = await axios.put(`${API_URL}/${id}`, licencia, authHeaders());
    return res.data;
};

export const eliminarLicencia = async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`, authHeaders());
    return res.data;
};