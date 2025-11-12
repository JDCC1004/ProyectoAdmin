import { useEffect, useState } from "react";
import { Table, Button, Space, message, Popconfirm } from "antd";
import ActivoForm from "../components/ActivoForm";
import api from "../services/api";

export default function Activos() {
  const [activos, setActivos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingActivo, setEditingActivo] = useState(null);

  // 🧭 Obtener activos
  const fetchActivos = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/activos");
      setActivos(data);
    } catch (error) {
      message.error("Error al cargar los activos");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchActivos();
  }, []);

  // ➕ Crear activo
  const handleCreate = async (values) => {
    try {
      await api.post("/activos", values);
      message.success("Activo agregado correctamente");
      setModalVisible(false);
      fetchActivos();
    } catch (error) {
      message.error("Error al agregar activo");
    }
  };

  // ✏️ Editar activo
  const handleEdit = async (values) => {
    try {
      await api.put(`/activos/${editingActivo.id}`, values);
      message.success("Activo actualizado");
      setEditingActivo(null);
      setModalVisible(false);
      fetchActivos();
    } catch (error) {
      message.error("Error al actualizar activo");
    }
  };

  // 🗑️ Eliminar activo
  const handleDelete = async (id) => {
    try {
      await api.delete(`/activos/${id}`);
      message.success("Activo eliminado");
      fetchActivos();
    } catch (error) {
      message.error("Error al eliminar activo");
    }
  };

  // 📋 Columnas de tabla
  const columns = [
    { title: "Nombre", dataIndex: "nombre", key: "nombre" },
    { title: "Categoría", dataIndex: "categoria", key: "categoria" },
    { title: "Estado", dataIndex: "estado", key: "estado" },
    {
      title: "Acciones",
      key: "acciones",
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setEditingActivo(record);
              setModalVisible(true);
            }}
          >
            Editar
          </Button>
          <Popconfirm
            title="¿Eliminar este activo?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button type="link" danger>
              Eliminar
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Gestión de Activos</h2>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => {
          setEditingActivo(null);
          setModalVisible(true);
        }}
      >
        Agregar Activo
      </Button>

      <Table
        columns={columns}
        dataSource={activos}
        loading={loading}
        rowKey="id"
      />

      {modalVisible && (
        <ActivoForm
          visible={modalVisible}
          onCancel={() => {
            setEditingActivo(null);
            setModalVisible(false);
          }}
          onSubmit={editingActivo ? handleEdit : handleCreate}
          initialValues={editingActivo}
        />
      )}
    </div>
  );
}
