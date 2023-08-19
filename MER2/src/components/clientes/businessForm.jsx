import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function BusinessForm() {
  const navigate = useNavigate();
  const initialFormState = {
    rutEmpresa: "",
    nombreFantasia: "",
    numeroContacto: "",
    correoContacto: "",
    razonSocial: "",
    giroComercial: "",
    direccionComercial: "",
    clientType: "business"
  };

  const [form, setForm] = useState(initialFormState);
  const [clientFound, setClientFound] = useState([]);

  function updateForm(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === "rutEmpresa" && value.length >= 7) {
        checkForExistingClient(value, 'business');
    } else if (name === "rutEmpresa" && value === '') {
        setClientFound([]); // Clear client found if rutEmpresa is deleted
    }
  }

  async function checkForExistingClient(rutValue, clientType) {
    let url = clientType === 'business' 
      ? `http://localhost:5050/businesses?rutEmpresa=${rutValue}`
      : null;
    const response = await fetch(url);
    const data = await response.json();
    setClientFound(data && data.length ? data : []);
  }

  function populateClientData(client) {
    setForm({ ...form, ...client });
  }

  async function onSubmit(e) {
    e.preventDefault();
    const endpoint = form.clientType === "business" ? "businesses" : null;
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
      <h3>Crear cliente negocio</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>RUT Empresa:</label>
          <input type="text" name="rutEmpresa" value={form.rutEmpresa} onChange={updateForm} className="form-control" />
        </div>
        {form.rutEmpresa.length >= 7 && (
          clientFound.length > 0 ? (
            clientFound.map((business, index) => (
              <button key={index} type="button" onClick={() => populateClientData(business)}>
                Usar datos: {business.nombreFantasia}
              </button>
            ))
          ) : (
            <p>No se encuentra cliente.</p>
          )
        )}
      
        <div className="form-group">
          <label>Nombre de Fantasía:</label>
          <input type="text" name="nombreFantasia" value={form.nombreFantasia} onChange={updateForm} className="form-control" />
        </div>
        <div className="form-group">
          <label>Número de Contacto:</label>
          <input type="text" name="numeroContacto" value={form.numeroContacto} onChange={updateForm} className="form-control" />
        </div>
        <div className="form-group">
          <label>Correo de Contacto:</label>
          <input type="email" name="correoContacto" value={form.correoContacto} onChange={updateForm} className="form-control" />
        </div>
        <div className="form-group">
          <label>Razón Social:</label>
          <input type="text" name="razonSocial" value={form.razonSocial} onChange={updateForm} className="form-control" />
        </div>
        <div className="form-group">
          <label>Giro Comercial:</label>
          <input type="text" name="giroComercial" value={form.giroComercial} onChange={updateForm} className="form-control" />
        </div>
        <div className="form-group">
          <label>Dirección Comercial:</label>
          <input type="text" name="direccionComercial" value={form.direccionComercial} onChange={updateForm} className="form-control" />
        </div>
        <div className="form-group">
          <input type="submit" value="Create Business Client" className="btn btn-primary" disabled={clientFound.length > 0} />
        </div>
      </form>
    </div>
  );
}