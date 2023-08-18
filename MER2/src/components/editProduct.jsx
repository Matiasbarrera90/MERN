import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
/* para editar productos */
export default function EditProduct() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    label: "",
    variants: [""]
  });
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const id = params.id.toString();
        const response = await fetch(`http://localhost:5050/productos/${id}`);

        if (!response.ok) {
          const message = `An error has occurred: ${response.statusText}`;
          window.alert(message);
          return;
        }

        const product = await response.json();
        if (product && product.error) {
          window.alert(`Product with id ${id} not found`);
          navigate("/");
          return;
        }

        setForm({
          name: product.name,
          price: product.price,
          label: product.label,
          variants: product.variants
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        window.alert("An unexpected error occurred. Please try again.");
      }
    }

    fetchData();
  }, [params.id, navigate]);

  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    const editedProduct = {
      name: form.name,
      price: form.price,
      label: form.label,
      variants: form.variants
    };

    await fetch(`http://localhost:5050/productos/${params.id}`, {
      method: "PATCH",
      body: JSON.stringify(editedProduct),
      headers: {
        "Content-Type": "application/json"
      },
    });

    navigate("/");
  }

  return (
    <div>
      <h3>Actualizar Producto</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            required
            className="form-control"
            id="name"
            value={form.name}
            onChange={(e) => updateForm({ name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="price">Precio</label>
          <input
            type="text"
            required
            className="form-control"
            id="price"
            value={form.price}
            onChange={(e) => updateForm({ price: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="label">Etiqueta</label>
          <input
            type="text"
            className="form-control"
            id="label"
            value={form.label}
            onChange={(e) => updateForm({ label: e.target.value })}
          />
        </div>
        {/* Add more inputs for other product attributes as required */}
        <div className="form-group">
          <input
            type="submit"
            value="Actualizar Producto"
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
}
