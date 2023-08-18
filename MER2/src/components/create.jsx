import React, { useState } from "react";
import { useNavigate } from "react-router";

/* para crear clientes */
export default function Create() {
 const [form, setForm] = useState({
   Nombre: "",
   Numero: "", // Changed from Number to Numero
   email: "",
   rut: "",
 });
 const navigate = useNavigate();

 function updateForm(e) {
   const { name, value } = e.target;
   setForm(prev => ({ ...prev, [name]: value }));
 }

 async function onSubmit(e) {
   e.preventDefault();
   const newPerson = { ...form };

   await fetch("http://localhost:5050/record", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(newPerson),
   })
   .catch(error => {
     window.alert(error);
     return;
   });

   setForm({ Nombre: "", Numero: "", email: "", rut: "" }); // Changed from Number to Numero
   navigate("/");
 }

 return (
   <div>
     <h3>Crear nuevo cliente</h3>
     <form onSubmit={onSubmit}>

     <div className="form-group">
         <label>RUT:</label>
         <input type="text" name="rut" value={form.rut} onChange={updateForm} className="form-control" />
       </div>

       <div className="form-group">
         <label>Nombre:</label>
         <input type="text" name="Nombre" value={form.Nombre} onChange={updateForm} className="form-control" />
       </div>
       
       <div className="form-group">
         <label>Número:</label> {/* Changed the label from Number to Numero */}
         <input type="text" name="Numero" value={form.Numero} onChange={updateForm} className="form-control" />
       </div>

       <div className="form-group">
         <label>Email:</label>
         <input type="email" name="email" value={form.email} onChange={updateForm} className="form-control" />
       </div>



       <div className="form-group">
         <input type="submit" value="Create Client" className="btn btn-primary" />
       </div>
     </form>
   </div>
 );
}
