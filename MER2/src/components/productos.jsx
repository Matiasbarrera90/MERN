import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function Productos() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    label: "",
    variants: [""]
  });

  const navigate = useNavigate();

  function updateForm(e) {
    const { name, value } = e.target;
    
    if (name.startsWith("variant")) {
      const index = parseInt(name.split("-")[1], 10);
      const newVariants = [...form.variants];
      newVariants[index] = value;
      setForm(prev => ({ ...prev, variants: newVariants }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  }

  function addVariant() {
    setForm(prev => ({ ...prev, variants: [...prev.variants, ""] }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    const newProduct = { ...form };

    await fetch("http://localhost:5050/productos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newProduct),
    })
    .catch(error => {
      window.alert(error);
      return;
    });

    setForm({ name: "", price: "", label: "", variants: [""] });
    navigate("/");
  }

  return (
    <div>
      <h3>Crear Nuevo Producto</h3>
      <form onSubmit={onSubmit}>

        <div className="form-group">
          <label>Nombre:</label>
          <input type="text" name="name" value={form.name} onChange={updateForm} className="form-control" />
        </div>

        <div className="form-group">
          <label>Precio:</label>
          <input type="text" name="price" value={form.price} onChange={updateForm} className="form-control" />
        </div>

        <div className="form-group">
          <label>Etiqueta:</label>
          <input type="text" name="label" value={form.label} onChange={updateForm} className="form-control" />
        </div>

        <div className="form-group">
          <label>Variantes:</label>
          {form.variants.map((variant, index) => (
            <div key={index}>
              <input type="text" name={`variant-${index}`} value={variant} onChange={updateForm} className="form-control" />
            </div>
          ))}
          <button type="button" onClick={addVariant}>Agregar variante</button>
        </div>

        <div className="form-group">
          <input type="submit" value="Crear Producto" className="btn btn-primary" />
        </div>

      </form>
    </div>
  );
}
