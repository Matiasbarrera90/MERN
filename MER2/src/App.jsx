import React from "react";
 
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
 
// We import all the components we need in our app
import Navbar from "./components/navbar";
import RecordList from "./components/clientes/recordList";
import Edit from "./components/clientes/edit";
import Create from "./components/clientes/create";
import Productos from "./components/productos/productos"
import ProductList from "./components/productos/productList"; 
import EditProduct from "./components/productos/editProduct";
import BusinessForm from "./components/clientes/businessForm";

const App = () => {
 return (
   <div>
     <Navbar />
     <Routes>
     <Route exact path="/" element={<><RecordList /><ProductList /></>} />
     <Route path="/edit-product/:id" element={<EditProduct />} />
       <Route path="/edit/:id" element={<Edit />} />
       <Route path="/create" element={<Create />} />
       <Route path="/productos" element={<Productos />} />
       <Route path="/businessForm" element={<BusinessForm />} />
     </Routes>
   </div>
 );
};
 
export default App;