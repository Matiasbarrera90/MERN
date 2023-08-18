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
  const [isDataUsed, setIsDataUsed] = useState(false);


  function updateForm(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === "rut") {
        setIsDataUsed(false);

        if (value.length >= 7) {
            checkForExistingClient(value);
        }
    }
}


  async function checkForExistingClient(rut) {
    const response = await fetch(`http://localhost:5050/record?rut=${rut}`);
    const data = await response.json();
  
    if (data && data.length) {
      setClientFound(data);  // This will set all the found records instead of just the first one.
    } else {
      setClientFound([]);
    }
  }
  
  function populateClientData(client, event) {
    event.stopPropagation();
    setForm(prevState => ({ ...prevState, ...client }));
    setIsDataUsed(true);
}



  async function onSubmit(e) {
    e.preventDefault();
    const newClient = { ...form };

    await fetch("http://localhost:5050/record", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newClient),
    })
    .catch(error => {
      window.alert(error);
      return;
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

            {clientFound.length > 0 ? (
  <div>
    {clientFound.map((client, index) => (
    <button type="button" key={index} onClick={(event) => populateClientData(client, event)}>Use Data: {client.Nombre}</button>

    ))}
  </div>
) : form.rut.length >= 7 ? (
  <p>No se encuentra cliente</p>
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
              <label>Giro Comercíal:</label>
              <input type="text" name="giroComercial" value={form.giroComercial} onChange={updateForm} className="form-control" />
            </div>

            <div className="form-group">
              <label>Dirección Comercial:</label>
              <input type="text" name="direccionComercial" value={form.direccionComercial} onChange={updateForm} className="form-control" />
            </div>
          </>
        )}

        <div className="form-group">
        <input type="submit" value="Create Client" className="btn btn-primary" disabled={isDataUsed} />

        </div>
      </form>
    </div>
  );
}

       