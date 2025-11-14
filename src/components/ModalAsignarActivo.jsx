import { useEffect, useState } from "react";
import { Modal, Select, message, Button } from "antd";
import { obtenerActivosDisponibles, asignarActivo } from "../services/asignacionesService";

const { Option } = Select;

export default function ModalAsignarActivo({ open, onClose, usuarioId }) {
  const [activos, setActivos] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const cargar = async () => {
    try {
      const data = await obtenerActivosDisponibles();
      setActivos(data);
    } catch (err) {
      console.error(err);
      message.error("Error al cargar activos disponibles");
    }
  };

  useEffect(() => {
    if (open) cargar();
  }, [open]);

  const handleOk = async () => {
    if (!selected) {
      message.warning("Seleccione un activo");
      return;
    }
    if (!fechaEntrega){
        message.warning("Seleccione una fecha de entrega");
        return;
    }
    setLoading(true);
    try {

      const fechaFormateada = fechaEntrega.format("YYYY-MM-DD");
      await asignarActivo({ usuario_id: usuarioId, activo_id: selected, fechaFormateada });
      message.success("Activo asignado");
      onClose(true);
    } catch (err) {
      console.error(err);
      message.error("Error al asignar activo");
    }
    setLoading(false);
  };

  return (
    <Modal
      open={open}
      title="Asignar Activo"
      onOk={handleOk}
      onCancel={() => onClose(false)}
      okButtonProps={{ loading }}
    >
      <Select
        showSearch
        placeholder="Seleccione un activo disponible"
        style={{ width: "100%", marginBottom: 16 }}
        onChange={(val) => setSelected(val)}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {activos.map((a) => (
          <Option key={a.id} value={a.id}>
            {a.nombre_activo} — {a.serial || a.codigo || ""}
          </Option>
        ))}
      </Select>

      <DatePicker
        style={{ width: "100%" }}
        placeholder="Seleccione fecha de entrega"
        value={fechaEntrega}
        onChange={(date) => setFechaEntrega(date)}
        format="YYYY-MM-DD"
      />
    </Modal>
  );
}