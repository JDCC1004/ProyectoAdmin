import { Layout, Button } from "antd";

const { Header } = Layout;

export default function Topbar() {
  return (
    <Header
      style={{
        background: "#fff",
        padding: "0 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <h2 style={{ margin: 0 }}>Panel de Administración</h2>
      <Button type="primary">Cerrar Sesión</Button>
    </Header>
  );
}