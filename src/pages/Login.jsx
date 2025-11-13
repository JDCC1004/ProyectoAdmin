import { Form, Input, Button, Card, message } from "antd";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const { data } = await api.post("/auth/login", values);
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("usuario", JSON.stringify(data.usuario));
        message.success("Inicio de sesión exitoso");
        navigate("/");
      } else {
        message.error(data.message || "Credenciales inválidas");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Error de autenticación");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card title="Iniciar Sesión" style={{ width: 350 }}>
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item name="email" label="Correo" rules={[{ required: true, type: "email" }]}>
            <Input placeholder="usuario@empresa.com" />
          </Form.Item>
          <Form.Item name="contraseña" label="Contraseña" rules={[{ required: true }]}>
            <Input.Password placeholder="********" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Ingresar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
