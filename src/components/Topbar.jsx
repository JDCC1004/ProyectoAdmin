import { Layout, Button, Dropdown, Space } from "antd";
import { DownOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header } = Layout;

export default function Topbar() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  const menuItems = [
    { key: "perfil", label: "Perfil" },
    { key: "logout", label: "Cerrar sesión", onClick: handleLogout },
  ];

  return (
    <Header
      style={{
        background: "#fff",
        padding: "0 16px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <h2 style={{ margin: 0 }}>Panel de Administración</h2>
      <Dropdown
        menu={{ items: menuItems }}
        trigger={["click"]}
      >
        <Space>
          <UserOutlined /> {usuario?.nombre || "Usuario"}
          <DownOutlined />
        </Space>
      </Dropdown>
    </Header>
  );
}
