import { useEffect, useState } from "react";
import axios from "axios";

function Roles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Aquí reemplaza la URL con la de tu API real
    axios.get("https://tuapi.com/roles")
      .then((res) => {
        setRoles(res.data);  // asumimos que la API devuelve un array de roles
        setLoading(false);
      })
      .catch((err) => {
        setError("Error al cargar los roles");
        setLoading(false);
        console.error(err);
      });
  }, []);

  if (loading) return <p>Cargando roles...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Roles</h1>
      <ul>
        {roles.map((rol) => (
          <li key={rol.id}>{rol.nombre}</li>
        ))}
      </ul>
    </div>
  );
}

export default Roles;
