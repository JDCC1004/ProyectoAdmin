import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  LaptopOutlined,
  KeyOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { NavLink, useLocation } from "react-router-dom";

const { Sider } = Layout;

export default function Sidebar() {
  const location = useLocation();

  const items = [
    { key: "/", label: <NavLink to="/">Dashboard</NavLink>, icon: <DashboardOutlined /> },
    { key: "/activos", label: <NavLink to="/activos">Activos</NavLink>, icon: <LaptopOutlined /> },
    { key: "/licencias", label: <NavLink to="/licencias">Licencias</NavLink>, icon: <KeyOutlined /> },
    { key: "/usuarios", label: <NavLink to="/usuarios">Usuarios</NavLink>, icon: <UserOutlined /> },
  ];

  return (
    <Sider breakpoint="lg" collapsedWidth="0">
      <div className="logo" style={{ color: "white", padding: "16px", fontSize: "18px" }}>
        Gestión Activos
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={items}
      />
    </Sider>
  );
}
