import { useEffect, useState } from "react";
import { Modal, Select, message } from "antd";
import { obtenerLicenciasDisponibles, asignarLicencia } from "../services/asignacionesService";

const { Option } = Select;

export default function ModalAsignarLicencia({ open, onClose, usuarioId }) {
  const [licencias, setLicencias] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const cargar = async () => {
    try {
      const data = await obtenerLicenciasDisponibles();
      setLicencias(data);
    } catch (err) {
      console.error(err);
      message.error("Error al cargar licencias disponibles");
    }
  };

  useEffect(() => {
    if (open) cargar();
  }, [open]);

  const handleOk = async () => {
    if (!selected) {
      message.warning("Seleccione una licencia");
      return;
    }
    setLoading(true);
    try {
      await asignarLicencia({ usuario_id: usuarioId, licencia_id: selected });
      message.success("Licencia asignada");
      onClose(true);
    } catch (err) {
      console.error(err);
      message.error("Error al asignar licencia");
    }
    setLoading(false);
  };

  return (
    <Modal open={open} title="Asignar Licencia" onOk={handleOk} onCancel={() => onClose(false)} okButtonProps={{ loading }}>
      <Select
        showSearch
        placeholder="Seleccione una licencia disponible"
        style={{ width: "100%" }}
        onChange={(val) => setSelected(val)}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {licencias.map((l) => (
          <Option key={l.id} value={l.id}>
            {l.nombre_software} — {l.clave_licencia || l.tipo_licencia}
          </Option>
        ))}
      </Select>
    </Modal>
  );
}