import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
/* para editar clientes */
export default function Edit() {
 const [form, setForm] = useState({
   Nombre: "",
   Numero: "",
   email: "",
   rut: "",
 });
 const params = useParams();
 const navigate = useNavigate();

 useEffect(() => {
   async function fetchData() {
     try {
       const id = params.id.toString();
       const response = await fetch(`http://localhost:5050/record/${id}`);

       if (!response.ok) {
         const message = `An error has occurred: ${response.statusText}`;
         window.alert(message);
         return;
       }

       const record = await response.json();
       if (record && record.error) {
         window.alert(`Record with id ${id} not found`);
         navigate("/");
         return;
       }

       setForm({
         Nombre: record.Nombre,
         Numero: record.Numero,
         email: record.email,
         rut: record.rut,
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
   const editedPerson = {
     Nombre: form.Nombre,
     Numero: form.Numero,
     email: form.email,
     rut: form.rut,
   };

   await fetch(`http://localhost:5050/record/${params.id}`, {
     method: "PATCH",
     body: JSON.stringify(editedPerson),
     headers: {
       'Content-Type': 'application/json'
     },
   });

   navigate("/");
 }


 return (
   <div>
     <h3>Actualizar cliente</h3>
     <form onSubmit={onSubmit}>
       <div className="form-group">
         <label htmlFor="Nombre">Nombre</label>
         <input
           type="text"
           required
           className="form-control"
           id="Nombre"
           value={form.Nombre}
           onChange={(e) => updateForm({ Nombre: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="Numero">Número</label>
         <input
           type="text"
           required
           className="form-control"
           id="Numero"
           value={form.Numero}
           onChange={(e) => updateForm({ Numero: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="email">Email</label>
         <input
           type="email"
           required
           className="form-control"
           id="email"
           value={form.email}
           onChange={(e) => updateForm({ email: e.target.value })}
         />
       </div>
       <div className="form-group">
         <label htmlFor="rut">RUT</label>
         <input
           type="text"
           required
           className="form-control"
           id="rut"
           value={form.rut}
           onChange={(e) => updateForm({ rut: e.target.value })}
         />
       </div>
       <div className="form-group">
         <input
           type="submit"
           value="Actualizar cliente"
           className="btn btn-primary"
         />
       </div>
     </form>
   </div>
 );
}
