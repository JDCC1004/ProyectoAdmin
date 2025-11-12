import { Modal, Form, Input, Select } from "antd";
const { Option } = Select;

export default function ActivoForm({ visible, onCancel, onSubmit, initialValues }) {
  const [form] = Form.useForm();

  // Cargar valores si se edita
  if (initialValues) {
    form.setFieldsValue(initialValues);
  }

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        onSubmit(values);
        form.resetFields();
      })
      .catch(info => console.log("Error:", info));
  };

  return (
    <Modal
      title={initialValues ? "Editar Activo" : "Agregar Activo"}
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleOk}
      okText="Guardar"
      cancelText="Cancelar"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="nombre"
          label="Nombre del Activo"
          rules={[{ required: true, message: "Por favor ingrese el nombre del activo" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="categoria"
          label="Categoría"
          rules={[{ required: true, message: "Seleccione una categoría" }]}
        >
          <Select>
            <Option value="Computadores">Computadores</Option>
            <Option value="Audiovisual">Audiovisual</Option>
            <Option value="Mobiliario">Mobiliario</Option>
            <Option value="Otro">Otro</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="estado"
          label="Estado"
          rules={[{ required: true, message: "Seleccione un estado" }]}
        >
          <Select>
            <Option value="Operativo">Operativo</Option>
            <Option value="Mantenimiento">Mantenimiento</Option>
            <Option value="Dañado">Dañado</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}