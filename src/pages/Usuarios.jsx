import { useEffect, useState } from "react";
import { Table, Button, Space, message } from "antd";
import AsignacionesUsuario from "../components/AsignacionesUsuario";
import { obtenerUsuarios } from "../services/asignacionesService";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [openAsignaciones, setOpenAsignaciones] = useState(false);

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const data = await obtenerUsuarios();
      setUsuarios(data);
    } catch (err) {
      console.error(err);
      message.error("Error al cargar usuarios");
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={cargarUsuarios}>Refrescar</Button>
      </Space>

      <Table
        dataSource={usuarios}
        rowKey="id"
        loading={loading}
        columns={[
          { title: "Nombre", dataIndex: "nombre", key: "nombre" },
          { title: "Correo", dataIndex: "email", key: "email" },
          { title: "Rol", dataIndex: "rol", key: "rol" },
          { title: "Estado", dataIndex: "estado", key: "estado" },
          {
            title: "Acciones",
            key: "acciones",
            render: (_, record) => (
              <Button
                type="primary"
                onClick={() => {
                  setUsuarioSeleccionado(record);
                  setOpenAsignaciones(true);
                }}
              >
                Administrar Asignaciones
              </Button>
            ),
          },
        ]}
      />

      {openAsignaciones && usuarioSeleccionado && (
        <AsignacionesUsuario
          open={openAsignaciones}
          usuario={usuarioSeleccionado}
          onClose={(shouldReload = false) => {
            setOpenAsignaciones(false);
            setUsuarioSeleccionado(null);
            if (shouldReload) cargarUsuarios();
          }}
        />
      )}
    </div>
  );
}