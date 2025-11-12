import { Card, Statistic, Row, Col } from "antd";

export default function Dashboard() {
  return (
    <div>
      <h2 style={{ marginBottom: 20 }}>Resumen General</h2>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="Activos Totales" value={125} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Licencias Vigentes" value={78} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Usuarios Registrados" value={15} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
