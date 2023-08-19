import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function Create() {
  const navigate = useNavigate();
  const initialFormState = {
    Nombre: "",
    Numero: "",
    email: "",
    rut: "",
    clientType: "individual",
    rutEmpresa: "",
    nombreFantasia: "",
    numeroContacto: "",
    correoContacto: "",
    razonSocial: "",
    giroComercial: "",
    direccionComercial: ""
  };

  const [form, setForm] = useState(initialFormState);
  const [clientFound, setClientFound] = useState([]);

  function updateForm(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === "rut" && value.length >= 7) {
        checkForExistingClient(value, 'individual');
    } else if (name === "rutEmpresa" && value.length >= 8) {
        checkForExistingClient(value, 'business');
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
      <h3>Crear nuevo cliente</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Tipo de Cliente:</label>
          <select name="clientType" value={form.clientType} onChange={updateForm} className="form-control">
            <option value="individual">Individual</option>
            <option value="business">Negocio</option>
          </select>
        </div>
        {form.clientType === "individual" && (
          <>
            <div className="form-group">
              <label>RUT:</label>
              <input type="text" name="rut" value={form.rut} onChange={updateForm} className="form-control" />
            </div>
            {clientFound.length > 0 && form.rut ? (
              <div>
                {clientFound.map((client, index) => (
                  <button key={index} type="button" onClick={() => populateClientData(client)}>
                    Use Data: {client.Nombre}
                  </button>
                ))}
              </div>
            ) : null}
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
          </>
        )}
        {form.clientType === "business" && (
          <>
            <div className="form-group">
              <label>RUT Empresa:</label>
              <input type="text" name="rutEmpresa" value={form.rutEmpresa} onChange={updateForm} className="form-control" />
            </div>
            {clientFound.length > 0 && form.rutEmpresa ? (
              <div>
                {clientFound.map((business, index) => (
                  <button key={index} type="button" onClick={() => populateClientData(business)}>
                    Add Data: {business.nombreFantasia}
                  </button>
                ))}
              </div>
            ) : null}
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
          </>
        )}
        <div className="form-group">
          <input type="submit" value="Create Client" className="btn btn-primary" disabled={clientFound.length > 0} />
        </div>
      </form>
    </div>
  );
}
