import { useEffect, useState } from "react";

export default function UsuariosTable() {
  const [usuarios, setUsuarios] = useState([]);

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetch("http://localhost/Urban/src/Admin/index.php")
      .then((res) => res.json())
      .then((data) => setUsuarios(data))
      .catch((err) => console.error("Error cargando usuarios:", err));
  }, []);

  // Eliminar usuario
  const eliminarUsuario = async (id_usuario) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;

    try {
      const res = await fetch("http://localhost/Urban/src/Admin/eliminar_usuario.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_usuario }),
      });

      const data = await res.json();
      alert(data.message);

      // Recargar lista sin refrescar toda la página
      setUsuarios(usuarios.filter((u) => u.id_usuario !== id_usuario));
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  // Editar usuario (ejemplo simple)
  const editarUsuario = (usuario) => {
    alert(`Aquí deberías abrir un formulario para editar: ${usuario.nombre}`);
    // Puedes abrir un modal o redirigir a un formulario con los datos
  };

  return (
    <table className="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Usuario</th>
          <th>Correo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.length > 0 ? (
          usuarios.map((u) => (
            <tr key={u.id_usuario}>
              <td>{u.id_usuario}</td>
              <td>{u.nombre}</td>
              <td>{u.correo}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => editarUsuario(u)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => eliminarUsuario(u.id_usuario)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="4" className="text-center">
              
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
