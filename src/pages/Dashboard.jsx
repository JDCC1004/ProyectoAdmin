import { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, message, Table, Button } from "antd";
import {
   obtenerResumen,
   obtenerPorCategoria,
   obtenerActividadReciente,
   } from "../services/dashboardService";
import {
  LaptopOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  DeleteOutlined,
  DollarCircleOutlined,
  DownloadOutlined,
  WarningFilled,
  WarningTwoTone,
} from "@ant-design/icons";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Legend,
  Bar,
} from "recharts";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Dashboard() {
  const [resumen, setResumen] = useState(null);
  const [porCategoria, setPorCategoria] = useState([]);
  const [actividadReciente, setActividadReciente] = useState([]);
  const [loading, setLoading] = useState(false);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A", "#33AA99"];

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      try {
        const [resumenData, categoriaData, actividadData] = await Promise.all([
          obtenerResumen(),
          obtenerPorCategoria(),
          obtenerActividadReciente(),
        ]);

        const resumenFormateado = {
          total_activos: Number(resumenData.total_activos),
          total_disponibles: Number(resumenData.disponibles),
          total_asignados: Number(resumenData.asignados),
          total_mantenimiento: Number(resumenData.mantenimiento),
          total_descartados: Number(resumenData.descartados),
          valor_total: Number(resumenData.valor_total),
        }

        setResumen(resumenFormateado);
        console.log("Resumen formateado:", resumenFormateado);
        setPorCategoria(categoriaData);
        console.log("Datos por categoría:", categoriaData);
        setActividadReciente(actividadData);
        console.log("Actividad reciente:", actividadData);
      } catch (err) {
        console.error(err);
        message.error("Error al cargar los datos del dashboard");
      }
      setLoading(false);
    };
    cargarDatos();
  }, []);

  const exportarExcel = () => {
    if (!resumen) return;
    const dataExport = [
      { Métrica: "Total Activos", Valor: resumen.total_activos },
      { Métrica: "Disponibles", Valor: resumen.total_disponibles },
      { Métrica: "Asignados", Valor: resumen.total_asignados },
      { Métrica: "En Mantenimiento", Valor: resumen.total_mantenimiento },
      { Métrica: "Descartados", Valor: resumen.total_descartados },
      { Métrica: "Valor Total (COP)", Valor: resumen.valor_total },
    ];
    const ws = XLSX.utils.json_to_sheet(dataExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Resumen");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(blob, "reporte_dashboard.xlsx");
  };

  if (!resumen) return null;

  return (
    <div style={{ padding: 24 }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <h2>📊 Panel de Control</h2>
        <Button type="primary" icon={<DownloadOutlined />} onClick={exportarExcel}>
          Exportar Reporte
        </Button>
      </Row>

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
              title="En Mantenimiento"
              value={resumen.total_mantenimiento}
              prefix={<WarningTwoTone />}
              valueStyle={{ color: "blue" }}
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
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Activos (COP)"
              value={resumen.valor_total}
              prefix={<DollarCircleOutlined />}
              valueStyle={{ color: "green" }}
              loading={loading}
            />
          </Card>
        </Col>        
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title="Distribución por Categoría">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={porCategoria}>
                <XAxis dataKey="categoria" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#1890ff" label/>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Distribución por Estado">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: "Disponibles", value: resumen.total_disponibles },
                    { name: "Asignados", value: resumen.total_asignados },
                    { name: "Descartados", value: resumen.total_descartados },
                    { name: "En Mantenimiento", value: resumen.total_mantenimiento},
                  ]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {COLORS.map((color, index) => (
                    <Cell key={index} fill={color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="🕓 Actividad Reciente (últimos 10 cambios)">
            <Table
              rowKey="id"
              dataSource={actividadReciente}
              loading={loading}
              pagination={false}
              columns={[
                { title: "Usuario", dataIndex: "usuario" },
                { title: "Tabla", dataIndex: "tabla_afectada" },
                { title: "Operación", dataIndex: "tipo_operacion" },
                { title: "Descripción", dataIndex: "descripcion" },
                {
                  title: "Fecha",
                  dataIndex: "fecha_creacion",
                  render: (v) =>
                    new Date(v).toLocaleString("es-CO", {
                      dateStyle: "short",
                      timeStyle: "short",
                    }),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}