import { request } from "../api/request";

export const obtenerUsuarios = () => request("/api/usuarios");

export const obtenerActivos = () => request("/api/activos");
export const obtenerLicencias = () => request("/api/licencias");

export const obtenerAsignacionesUsuario = (usuarioId) =>
  request(`/api/asignaciones/usuario/${usuarioId}`);

export const asignarActivo = (empleado_id, activo_id, fecha_entrega) =>
  request("/api/asignaciones/asignar-activo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ empleado_id, activo_id, fecha_entrega })
  });

export const retirarActivo = (usuarioId, activoId) =>
  request("/api/asignaciones/retirar-activo", {
    method: "POST",
    body: JSON.stringify({ usuarioId, activoId })
  });

export const asignarLicencia = (usuarioId, licenciaId) =>
  request("/api/asignaciones/asignar-licencia", {
    method: "POST",
    body: JSON.stringify({ usuarioId, licenciaId })
  });

export const retirarLicencia = (usuarioId, licenciaId) =>
  request("/api/asignaciones/retirar-licencia", {
    method: "POST",
    body: JSON.stringify({ usuarioId, licenciaId })
  });