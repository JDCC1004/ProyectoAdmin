import { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, message } from "antd";
import { obtenerResumen } from "../services/dashboardService";
import {
  LaptopOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  DeleteOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";

export default function Dashboard() {
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        const data = await obtenerResumen();
        setResumen(data);
      } catch (err) {
        console.error(err);
        message.error("Error al cargar los datos del dashboard");
      }
      setLoading(false);
    };
    cargarDatos();
  }, []);

  if (!resumen) return null;

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 24 }}>Panel de Control</h2>

      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Activos Totales"
              value={resumen.total_activos}
              prefix={<LaptopOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Disponibles"
              value={resumen.total_disponibles}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "green" }}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Asignados"
              value={resumen.total_asignados}
              prefix={<WarningOutlined />}
              valueStyle={{ color: "orange" }}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Descartados"
              value={resumen.total_descartados}
              prefix={<DeleteOutlined />}
              valueStyle={{ color: "red" }}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Valor Total del Inventario"
              value={resumen.valor_total}
              prefix={<DollarCircleOutlined />}
              precision={0}
              formatter={(val) => `$ ${val.toLocaleString("es-CO")}`}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}