import React, { useEffect, useState } from "react";

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUsuarios(); // servicio protegido
        setUsuarios(data);
      } catch (err) {
        console.error("Error cargando usuarios", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Usuarios</h2>
      <ul>
        {usuarios.map((u) => (
          <li key={u.id_usuario}>{u.nombre} - {u.correo}</li>
        ))}
      </ul>
    </div>
  );
}

export default Usuarios;
