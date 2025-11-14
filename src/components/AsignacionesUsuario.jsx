import { useEffect, useState } from "react";
import { Modal, Table, Select, Button, Space, message } from "antd";

import {
  obtenerAsignacionesUsuario,
  obtenerActivos,
  obtenerLicencias,
  asignarActivo,
  retirarActivo,
  asignarLicencia,
  retirarLicencia,
} from "../services/asignacionesService";

const { Option } = Select;

export default function AsignacionesUsuario({ usuario, open, onClose }) {
  const [activos, setActivos] = useState([]);
  const [licencias, setLicencias] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [activoSeleccionado, setActivoSeleccionado] = useState(null);
  const [licenciaSeleccionada, setLicenciaSeleccionada] = useState(null);

  // =====================================================
  // CARGA SEGURA DE DATOS
  // =====================================================
  const cargarDatos = async () => {
    try {
      const [asig, act, lic] = await Promise.all([
        obtenerAsignacionesUsuario(usuario.id),
        obtenerActivos(),
        obtenerLicencias(),
    ]);

    console.log("Activos recibidos:", act);
    console.log("Licencias recibidas:", lic);
      
      const normalizar = (raw) => {
        if (!raw) return [];
        if (Array.isArray(raw)) return raw;
        if (raw.data && Array.isArray(raw.data)) return raw.data;
        return [];
      };

      console.log("Asignaciones crudas:", asig);

      setAsignaciones(normalizar(asig));
      setActivos(normalizar(act));
      setLicencias(normalizar(lic));
    } catch (err) {
      console.error("Error al cargar datos:", err);
      message.error("Error al cargar datos");
    }
  };

  // =====================================================
  // EFECTO PARA RECARGAR CUANDO EL MODAL SE ABRE
  // =====================================================
  useEffect(() => {
    if (open) cargarDatos();
  }, [open]);

  // =====================================================
  // ACCIONES
  // =====================================================
  const handleAsignarActivo = async () => {
    if (!activoSeleccionado) return message.error("Seleccione un activo");
    await asignarActivo(usuario.id, activoSeleccionado);
    message.success("Activo asignado");
    cargarDatos();
  };

  const handleAsignarLicencia = async () => {
    if (!licenciaSeleccionada) return message.error("Seleccione una licencia");
    await asignarLicencia(usuario.id, licenciaSeleccionada);
    message.success("Licencia asignada");
    cargarDatos();
  };

  const handleRetirarActivo = async (idActivo) => {
    await retirarActivo(usuario.id, idActivo);
    message.success("Activo retirado");
    cargarDatos();
  };

  const handleRetirarLicencia = async (idLicencia) => {
    await retirarLicencia(usuario.id, idLicencia);
    message.success("Licencia retirada");
    cargarDatos();
  };

  return (
    <Modal
      open={open}
      title={`Asignaciones de ${usuario.nombre}`}
      width={900}
      onCancel={() => onClose(false)}
      onOk={() => onClose(true)}
    >
      {/* ============================================== */}
      {/* ASIGNAR ACTIVO */}
      {/* ============================================== */}
      <h3>Asignar Activo</h3>
      <Space>
        <Select
          style={{ width: 250 }}
          placeholder="Seleccione un activo"
          onChange={setActivoSeleccionado}
        >
          {activos.map((a) => (
            <Option key={a.id} value={a.id}>
              {a.nombre} — {a.codigo_activo || a.codigo}
            </Option>
          ))}
        </Select>
        <Button type="primary" onClick={handleAsignarActivo}>
          Asignar
        </Button>
      </Space>

      {/* ============================================== */}
      {/* ASIGNAR LICENCIA */}
      {/* ============================================== */}
      <h3 style={{ marginTop: 20 }}>Asignar Licencia</h3>
      <Space>
        <Select
          style={{ width: 250 }}
          placeholder="Seleccione una licencia"
          onChange={setLicenciaSeleccionada}
        >
          {licencias.map((l) => (
            <Option key={l.id} value={l.id}>
              {l.nombre_software} — {l.clave_licencia}
            </Option>
          ))}
        </Select>
        <Button type="primary" onClick={handleAsignarLicencia}>
          Asignar
        </Button>
      </Space>

      {/* ============================================== */}
      {/* TABLA DE ASIGNACIONES */}
      {/* ============================================== */}
      <h3 style={{ marginTop: 30 }}>Asignaciones Actuales</h3>

      <Table
        dataSource={asignaciones}
        rowKey={(row) => row.id || `${row.tipo}-${row.id_recurso}`}
        columns={[
          { title: "Tipo", dataIndex: "tipo", key: "tipo" },
          { title: "Nombre", dataIndex: "nombre", key: "nombre" },
          { title: "Detalle", dataIndex: "detalle", key: "detalle" },
          {
            title: "Acciones",
            key: "acciones",
            render: (_, record) => (
              <Button
                danger
                onClick={() =>
                  record.tipo === "Activo"
                    ? handleRetirarActivo(record.id_recurso)
                    : handleRetirarLicencia(record.id_recurso)
                }
              >
                Retirar
              </Button>
            ),
          },
        ]}
      />
    </Modal>
  );
}