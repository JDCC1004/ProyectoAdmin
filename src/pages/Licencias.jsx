import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Table, Button, Modal, Form, Input, message, Space, Select, DatePicker, Row, Col, InputNumber, Card, Tag } from "antd";
import { obtenerLicencias, crearLicencia, actualizarLicencia, eliminarLicencia } from "../services/licenciasService";
import { obtenerEstado } from "../services/estadosService";

const { Option } = Select;

export default function Licencias() {
  const [licencias, setLicencias] = useState([]);
  const [estados, setEstados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLicencia, setEditingLicencia] = useState(null);
  const [form] = Form.useForm();

  const cargarLicencias = async () => {
    setLoading(true);
    try {
      const data = await obtenerLicencias();
      setLicencias(data);
      console.log("Licencias cargadas:", data);
    } catch (error) {
      console.error("Error al cargar licencias:", error);
      message.error("Error al cargar licencias");
    }
    setLoading(false);
  };

  const cargarEstados = async () => {
    try {
      const data = await obtenerEstado();
      setEstados(data);
      console.log("Estados cargados:", data);
    } catch (error) {
      console.error("Error al cargar estados:", error);
      message.error("Error al cargar estados");
    }
  };

  useEffect(() => {
    cargarLicencias();
    cargarEstados();
  }, []);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (values.fecha_vencimiento) {
        values.fecha_vencimiento = values.fecha_vencimiento.format("YYYY-MM-DD");
      }

      if (values.fecha_adquisicion) {
        values.fecha_adquisicion = values.fecha_adquisicion.format("YYYY-MM-DD");
      }

      // Si es nueva, asigna fecha_actual
      if (!editingLicencia) {
        values.fecha_adquisicion = new Date().toISOString().split("T")[0];
      }

      console.log("Valores del formulario:", values);

      if (editingLicencia) {
        await actualizarLicencia(editingLicencia.id, values);
        message.success("Licencia actualizada");
      } else {
        await crearLicencia(values);
        message.success("Licencia creada");
      }

      form.resetFields();
      setIsModalOpen(false);
      setEditingLicencia(null);
      cargarLicencias();

    } catch (error) {
      console.error("Error al guardar:", error);

      if (error.errorFields) {
        const camposError = error.errorFields.map((f) => f.name[0]).join(", ");
        message.error(`Error en los campos: ${camposError}`);
      } else {
        message.error("Error al guardar la licencia");
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await eliminarLicencia(id);
      message.success("Licencia eliminada");
      cargarLicencias();
    } catch {
      message.error("Error al eliminar la licencia");
    }
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>Nueva Licencia</Button>
      </Space>

      <Table
        dataSource={licencias}
        rowKey="id"
        loading={loading}
        columns={[
          { title: "Nombre", dataIndex: "nombre_software", key: "nombre_software" },

          { title: "Proveedor", dataIndex: "proveedor", key: "proveedor" },

          { title: "Clave de Licencia", dataIndex: "clave_licencia", key: "clave_licencia" },

          {
            title: "Fecha de Adquisición",
            dataIndex: "fecha_adquisicion",
            key: "fecha_adquisicion",
            render: (v) =>
              v
                ? new Date(v).toLocaleDateString("es-CO", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                : "N/A",
          },

          { title: "Estado", dataIndex: "estado", key: "estado" },

          {
            title: "Acciones",
            key: "acciones",
            render: (_, record) => (
              <Space>
                <Button
                  onClick={() => {
                    setEditingLicencia(record);
                    form.setFieldsValue({
                      ...record,
                      fecha_vencimiento: record.fecha_vencimiento ? dayjs(record.fecha_vencimiento) : null,
                      fecha_adquisicion: record.fecha_adquisicion ? dayjs(record.fecha_adquisicion) : null,
                    });
                    setIsModalOpen(true);
                  }}
                >
                  Editar
                </Button>

                <Button danger onClick={() => handleDelete(record.id)}>
                  Eliminar
                </Button>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={editingLicencia ? "Editar Licencia" : "Nueva Licencia"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingLicencia(null);
        }}
      >
      <Form form={form} layout="vertical">

        {/* --- Información General --- */}
        <h3 style={{ marginTop: 10 }}>📌 Información General</h3>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="nombre_software"
              label="Nombre del Software"
              rules={[{ required: true, message: "Ingrese el nombre del software" }]}
            >
              <Input placeholder="Ej: Microsoft Office 365" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="proveedor"
              label="Proveedor"
              rules={[{ required: true, message: "Ingrese el proveedor" }]}
            >
              <Input placeholder="Ej: Microsoft, Adobe, WinRAR GmbH" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="clave_licencia"
              label="Clave de Licencia"
              rules={[{ required: true, message: "Ingrese la clave" }]}
            >
              <Input placeholder="Ej: XXXX-XXXX-XXXX-XXXX" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="cantidad_licencias"
              label="Cantidad de Licencias"
              rules={[{ required: true, message: "Ingrese la cantidad" }]}
            >
              <InputNumber
                min={1}
                style={{ width: "100%" }}
                placeholder="Ej: 5"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* --- Costos y Tipo de Licencia --- */}
        <h3 style={{ marginTop: 20 }}>💰 Costos y Tipo</h3>

        <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Costo Anual"
            name="costo_anual"
            rules={[{ required: true, message: "Ingrese el costo anual" }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
              placeholder="Ej: 1500000"
            />
          </Form.Item>
        </Col>
          <Col span={12}>
            <Form.Item
              name="tipo_licencia"
              label="Tipo de Licencia"
              rules={[{ required: true, message: "Seleccione un tipo" }]}
            >
              <Select placeholder="Seleccione una opción">
                <Option value="Suscripción Anual">Suscripción Anual</Option>
                <Option value="Suscripción Mensual">Suscripción Mensual</Option>
                <Option value="Licencia Permanente">Licencia Permanente</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* --- Fechas y Estado --- */}
        <h3 style={{ marginTop: 20 }}>📅 Fechas y Estado</h3>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="fecha_vencimiento"
              label="Fecha de Vencimiento"
              rules={[{ required: true, message: "Seleccione la fecha" }]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                style={{ width: "100%" }}
                placeholder="Seleccione una fecha"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="estado_id"
              label="Estado"
              initialValue="Vigente"
              rules={[{ required: true}]}
            >
              <Select>
                <Option value="vigente">Vigente</Option>
                <Option value="vencida">Vencida</Option>
                <Option value="proxima_a_vencer">Próxima a Vencer</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* --- Información Adicional --- */}
        <h3 style={{ marginTop: 20 }}>📝 Información Adicional</h3>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="contacto_proveedor" label="Contacto del Proveedor">
              <Input placeholder="Ej: soporte@empresa.com" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item name="notas" label="Notas">
              <Input.TextArea rows={3} placeholder="Información extra de la licencia" />
            </Form.Item>
          </Col>
        </Row>

      </Form>
      </Modal>
    </div>
  );
}