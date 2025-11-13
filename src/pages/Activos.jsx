import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Space, InputNumber, Select } from "antd";
import { obtenerActivos, crearActivo, actualizarActivo, eliminarActivo } from "../services/activosService";
import { obtenerCategorias } from "../services/categoriasService";

const { Option } = Select;

export default function Activos() {
  const [activos, setActivos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivo, setEditingActivo] = useState(null);
  const [form] = Form.useForm();

  const cargarActivos = async () => {
    setLoading(true);
    try {
      const data = await obtenerActivos();
      setActivos(data);
    } catch {
      message.error("Error al cargar activos");
    }
    setLoading(false);
  };

  const cargarCategorias = async () => {
    try {
      const data = await obtenerCategorias();
      console.log("Categorias recibidas del backend:", data);
      setCategorias(data);
    } catch (error){
      console.error("Error al obtener categorías", error);
      message.error("Error al cargar categorías");
    }
  };

  useEffect(() => {
    cargarActivos();
    cargarCategorias();
  }, []);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if(!editingActivo){
        values.fecha_adquisicion = new Date().toISOString().split("T")[0];
      }

      console.log("Valores del formulario:", values);

      if (editingActivo) {
        await actualizarActivo(editingActivo.id, values);
        message.success("Activo actualizado");
      } else {
        await crearActivo(values);
        message.success("Activo creado");
      }
      form.resetFields();
      setIsModalOpen(false);
      setEditingActivo(null);
      cargarActivos();
    } catch (error){
      console.error("Error al guardar activo", error);
      message.error("Error al guardar activo");

      if (error.errorFields) {
        const camposError = error.errorFields.map((field) => field.name[0]).join(", ");
        message.error(`Por favor, corrija los siguientes campos: ${camposError}`);
      } else {
        message.error("Error al guardar el activo");
      }
    }
  };

  const handleDelete = async (id) => {
    await eliminarActivo(id);
    message.success("Activo eliminado");
    cargarActivos();
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>Nuevo Activo</Button>
      </Space>

      <Table
        dataSource={activos}
        rowKey="id"
        loading={loading}
        columns={[
          { title: "Nombre", dataIndex: "nombre" },
          { title: "Descripción", dataIndex: "descripcion" },
          { title: "Valor (COP)", dataIndex: "costo_adquisicion", render: (value) => value ? `$ ${Number(value).toLocaleString("es-CO")}` : "-" },
          { title: "Estado", dataIndex: "estado" },
          { title: "Ubicación", dataIndex: "ubicacion" },
          {
            title: "Acciones",
            render: (_, record) => (
              <Space>
                <Button onClick={() => { setEditingActivo(record); form.setFieldsValue(record); setIsModalOpen(true); }}>Editar</Button>
                <Button danger onClick={() => handleDelete(record.id)}>Eliminar</Button>
              </Space>
            ),
          },
        ]}
      />

<Modal
  title={editingActivo ? "Editar Activo" : "Nuevo Activo"}
  open={isModalOpen}
  onOk={handleOk}
  onCancel={() => { setIsModalOpen(false); setEditingActivo(null); }}
>
  <Form form={form} layout="vertical">
    <Form.Item name="codigo_activo" label="Código" rules={[{ required: true }]}>
      <Input />
    </Form.Item>

    <Form.Item name="nombre" label="Nombre" rules={[{ required: true }]}>
      <Input />
    </Form.Item>

    <Form.Item name="descripcion" label="Descripción">
      <Input />
    </Form.Item>

    <Form.Item name="categoria_id" label="Categoría" rules={[{ required: true, message: "Categoria requerida" }]}>
      <Select placeholder = "Seleccione una categoria">
        {categorias.map((cat) => (
          <Option key={cat.id} value={cat.id}>{cat.nombre}</Option>
        ))}  
      </Select>
    </Form.Item>

    <Form.Item name="marca" label="Marca">
      <Input />
    </Form.Item>

    <Form.Item name="modelo" label="Modelo">
      <Input />
    </Form.Item>

<Form.Item
  name="costo_adquisicion"
  label="Valor (COP)"
  rules={[
    { required: true, message: "El valor de adquisición es obligatorio" },
    {
      validator: (_, value) => {
        if (value === undefined || value === null || value === "") {
          return Promise.reject("Debe ingresar un valor numérico mayor a 0");
        }
        const numeric = Number(value);
        if (!Number.isFinite(numeric) || numeric <= 0) {
          return Promise.reject("Debe ingresar un valor numérico mayor a 0");
        }
        return Promise.resolve();
      },
    },
  ]}
  // 🧩 Forzar que AntD trate el valor como número
  getValueFromEvent={(value) => {
    if (typeof value === "string") {
      // limpiar cualquier caracter no numérico
      const cleaned = value.replace(/[^\d]/g, "");
      return cleaned ? Number(cleaned) : undefined;
    }
    return value;
  }}
>
  <InputNumber
    min={0}
    style={{ width: "100%" }}
    placeholder="Ej: 3500000"
    formatter={(v) =>
      v !== undefined && v !== null
        ? `$ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        : ""
    }
    parser={(v) => {
      // Este parser devuelve solo dígitos en formato numérico
      const cleaned = v.replace(/[^\d]/g, "");
      return cleaned ? Number(cleaned) : undefined;
    }}
  />
</Form.Item>
  
  <Form.Item
    name="estado"
    label="Estado"
    initialValue="disponible"
    rules={[{ required: true }]}
  >
    <Select>
      <Option value="disponible">Disponible</Option>
      <Option value="asignado">Asignado</Option>
      <Option value="en_mantenimiento">En mantenimiento</Option>
      <Option value="descartado">Descartado</Option>
    </Select>
  </Form.Item>

  <Form.Item
  name="numero_serie"
  label="Número de Serie"
  rules={[{ required: true, message: "El número de serie es obligatorio" }]}
  >
    <Input placeholder="Ej: SN-45983XYZ" />
  </Form.Item>

    <Form.Item name="ubicacion" label="Ubicación">
      <Input />
    </Form.Item>
  </Form>
</Modal>

    </div>
  );
}