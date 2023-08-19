import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function Create() {
  const navigate = useNavigate();
  const initialFormState = {
    Nombre: "",
    Numero: "",
    email: "",
    rut: "",
    clientType: "individual"
  };

  const [form, setForm] = useState(initialFormState);
  const [clientFound, setClientFound] = useState([]);

  function updateForm(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === "rut" && value.length >= 7) {
        checkForExistingClient(value, 'individual');
    } else if (name === "rut" && value === '') {
        setClientFound([]); // Clear client found if rut is deleted
    }
  }

  async function checkForExistingClient(rutValue, clientType) {
    let url = clientType === 'individual' 
      ? `http://localhost:5050/record?rut=${rutValue}`
      : `http://localhost:5050/businesses?rutEmpresa=${rutValue}`;
    const response = await fetch(url);
    const data = await response.json();
    setClientFound(data && data.length ? data : []);
  }

  function populateClientData(client) {
    setForm({ ...form, ...client });
  }

  async function onSubmit(e) {
    e.preventDefault();
    const endpoint = form.clientType === "individual"
      ? "record"
      : form.clientType === "business"
      ? "businesses"
      : null;

    if (!endpoint) {
      window.alert("Invalid client type!");
      return;
    }

    await fetch(`http://localhost:5050/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
      })
      .catch(error => {
        window.alert(error);
      });

    setForm(initialFormState);
    navigate("/");
  }

  return (
    <div>
      <h3>Crear cliente individual</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>RUT:</label>
          <input type="text" name="rut" value={form.rut} onChange={updateForm} className="form-control" />
        </div>
        {form.rut.length >= 7 && (
          clientFound.length > 0 ? (
            clientFound.map((client, index) => (
              <button key={index} type="button" onClick={() => populateClientData(client)}>
                Usar datos: {client.Nombre}
              </button>
            ))
          ) : (
            <p>No se encuentra cliente.</p>
          )
        )}
        <div className="form-group">
          <label>Nombre:</label>
          <input type="text" name="Nombre" value={form.Nombre} onChange={updateForm} className="form-control" />
        </div>
        <div className="form-group">
          <label>Número:</label>
          <input type="text" name="Numero" value={form.Numero} onChange={updateForm} className="form-control" />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={form.email} onChange={updateForm} className="form-control" />
        </div>
        <div className="form-group">
          <input type="submit" value="Crear Cliente" className="btn btn-primary" disabled={clientFound.length > 0} />
        </div>
      </form>
    </div>
  );
}
