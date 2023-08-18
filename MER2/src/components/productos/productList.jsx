import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
/* para visualizar productos*/
const Product = (props) => (
 <tr>
   <td>{props.product.name}</td>
   <td>{props.product.price}</td>
   <td>{props.product.label}</td>
   <td>{props.product.variants[0]}</td>
   <td>
     <Link className="btn btn-link" to={`/edit-product/${props.product._id}`}>Editar</Link> |
     <button className="btn btn-link"
       onClick={() => {
         props.deleteProduct(props.product._id);
       }}
     >
       Borrar
     </button>
   </td>
 </tr>
);

export default function ProductList() {
 const [products, setProducts] = useState([]);

 useEffect(() => {
   async function getProducts() {
     const response = await fetch(`http://localhost:5050/productos/`);

     if (!response.ok) {
       const message = `An error occurred: ${response.statusText}`;
       window.alert(message);
       return;
     }

     const products = await response.json();
     setProducts(products);
   }

   getProducts();
 }, []);  // Emphasize: no dependency on products.length

 async function deleteProduct(id) {
   await fetch(`http://localhost:5050/productos/${id}`, {
     method: "DELETE"
   });

   const newProducts = products.filter((el) => el._id !== id);
   setProducts(newProducts);
 }

 function productList() {
   return products.map((product) => {
     return (
       <Product
         product={product}
         deleteProduct={deleteProduct}
         key={product._id}
       />
     );
   });
 }

 return (
   <div>
     <h3>Lista Productos</h3>
     <table className="table table-striped" style={{ marginTop: 20 }}>
       <thead>
         <tr>
           <th>Nombre</th>
           <th>Precio</th>
           <th>Etiqueta</th>
           <th>Primera Variante</th>
           <th>Modificar</th>
         </tr>
       </thead>
       <tbody>{productList()}</tbody>
     </table>
   </div>
 );
}