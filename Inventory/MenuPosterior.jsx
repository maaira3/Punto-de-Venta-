import React, { useState, useEffect, useRef} from "react";
import * as BiIcons from "react-icons/bi";
import '../../styles.scss';
//import "./Inventarios.css";
import {Link} from 'react-router-dom';
import _ from "lodash";
import { useReactToPrint } from 'react-to-print';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const baseURL = process.env.REACT_APP_API_URL //npm i dotenv

function MenuPosterior() {

  const [name, setName] = useState('1');
  const [users, setUsers] = useState([]);
  const[paginatedPosts, setPaginatedposts]=useState([])
  const[currentPage, setCurrentpage]= useState(1)

  const rol = localStorage.getItem('rol')

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  
  const pageSize="5";
  const handleShowIngredients = async (e) => {
    /* console.log(name) */

    const res = await fetch(
      baseURL+`/inventario/getInventario2/${rol}/${name}`
    );
    const data = await res.json();
    setUsers(data);
    setPaginatedposts(_(data).slice(0).take(pageSize).value())
  };

  useEffect(()=>{
    handleShowIngredients();
  },[name])

  const pageCount = users ? Math.ceil(users.length/pageSize) : 0;
  /* if(pageCount===0) return null; */
  const pages = _.range(1, pageCount+1)

  const pagination=(pageNo)=>{
    setCurrentpage(pageNo);
    const startIndex=(pageNo - 1) * pageSize;
    const paginatedPosts = _(users).slice(startIndex).take(pageSize).value();
    setPaginatedposts(paginatedPosts);
  }



  return (
    <div className="inventory">
      <div>
        <div className="row">
        <div className="col-md-4">
          <div className="card card-item-inv">
          <Link to="./inventory/add">
            <span className="card-title">Agregar Inventario</span>
            <div className="card-money">
              <AddShoppingCartIcon className="icons"/>
            </div>
            </Link>
          </div>
        </div>
        <div className="col-md-4">
        <div className="card card-item-inv">
        <Link to="/inventory/report">
          <span className="card-title">Reporte merma</span>
          <div className="card-money">
            <ReportGmailerrorredIcon className="icons"/>
          </div>
        </Link>
        </div>
        </div>
    <div className="col-md-4">
        <div className="card card-item-inv">
        <Link to="/inventory/import">
          <span className="card-title">Importar inventario</span>
          <div className="card-money">
            <UploadFileIcon className="icons"/>
          </div>
          </Link>
        </div>
        </div>
    </div>
    </div>

    <div className="card container" ref={componentRef}>
      <div className="container row my-5">
        <h3 className="fs-4 mh-3">Inventario</h3>
        <div className="mb-3 align-self-center">
          <select
            className="form-select"
            id="floatingSelect"
            onChange={(e) => setName(e.target.value)}
            value={name}
            onClick={handleShowIngredients}
          >
            <option value="1">Ingredientes</option>
            <option value="2">Productos</option>
            <option value="3">Productos con bajo inventario</option>
            <option value="4">Ingredientes con bajo inventario</option>
            <option value="8">Últimos movimientos inventario</option>
            <option value="7">Mermas reportadas</option>
          </select>
        </div>

        

        <div className="col-12 table-responsive">
          <table className="table rounded shadow-sm table-hover">
            <thead>
              <tr>
                <th scope="col" width="50">
                  {
                    (name==="8") ? 'Usuario' : 'Código'
                  }
                </th>
                <th scope="col">{(name==="8") ? 'Descripción' : 'Producto'}</th>
                <th scope="col">{(name==="8") ? 'Gasto total' : 'Descripción'}</th>
                <th scope="col">{(name==="8") ? 'Fecha de compra' : 'Costo'}</th>
                <th scope="col">Precio </th>
                <th scope="col">Unidad</th>
                <th scope="col">Stock</th>
                <th scope="col">Proveedor</th>
                <th scope="col">Fecha/Hora</th>
              </tr>
            </thead>
            <tbody>
              { !paginatedPosts ? ("no data found") :
              (name === "1" || name === "4" || name === 1 || name===4)
                ? paginatedPosts.map((user, index) => (
                    <tr key={index}>
                      <td>{user.idingrediente}</td>
                      <td>{user.nombreingrediente}</td>
                      <td>{"Ingredientes no tienen descripción"}</td>
                      <td>{user.costo}</td>
                      <td>{"Ingredientes no se venden"}</td>
                      <td>{(user.idunidad===1) ? "Kg" : (user.idunidad===2) ? "gramos" : (user.idunidad===3) ? "litros" : (user.idunidad===4) ? "mililitros" : (user.idunidad===5) ? "unidad" : "desconocido"}</td>
                      <td>{user.cantidadingrediente}</td>
                      <td>{user.nombreproveedor}</td>
                      <td>{user.fecha}</td>
                    </tr>
                  ))
                : (name === "6" || name===6)
                ? paginatedPosts.map((user, index) => (
                    <tr key={index}>
                      <td>{user.idingrediente}</td>
                      <td>{user.nombreingrediente}</td>
                      <td>{"Ingredientes no tienen descripción"}</td>
                      <td>{user.costo}</td>
                      <td>{"Ingredientes no se venden"}</td>
                      <td>{(user.idunidad===1) ? "Kg" : (user.idunidad===2) ? "gramos" : (user.idunidad===3) ? "litros" : (user.idunidad===4) ? "mililitros" : (user.idunidad===5) ? "unidad" : "desconocido"}</td>
                      <td>{user.cantidad}</td>
                      <td>{user.nombreproveedor}</td>
                      <td>{user.fecha}</td>
                    </tr>
                  ))
                  : (name === "8" || name===8)
                  ? paginatedPosts.map((user, index) => (
                    <tr key={index}>
                      <td>{user.usuario}</td>
                      <td>{user.descripcion}</td>
                      <td>{user.total}</td>
                      <td>{user.fechamovimiento}</td>
                      <td>{"---"}</td>
                      <td>{"---"}</td>
                      <td>{"---"}</td>
                      <td>{"---"}</td>
                      <td>{"---"}</td>
                    </tr>
                  ))
                  : (name === "7" || name===7)
                  ? paginatedPosts.map((user, index) => (
                    <tr key={index}>
                      <td>{user.idproducto}</td>
                      <td>{user.nombreproducto}</td>
                      <td>{user.descripcionmerma}</td>
                      <td>{"no aplica"}</td>
                      <td>{"no aplica"}</td>
                      <td>{(user.idunidad===1) ? "Kg" : (user.idunidad===2) ? "gramos" : (user.idunidad===3) ? "litros" : (user.idunidad===4) ? "mililitros" : (user.idunidad===5) ? "unidad" : "desconocido"}</td>
                      <td>{user.cantidadmerma}</td>
                      <td>{"no aplica"}</td>
                      <td>{user.fechareportez}</td>
                    </tr>
                  ))
                : paginatedPosts.map((user, index) => (
                    <tr key={index}>
                      <td>{user.idproducto}</td>
                      <td>{user.nombreproducto}</td>
                      <td>{user.descripcionproducto}</td>
                      <td>{user.costoproducto}</td>
                      <td>{user.precioproducto}</td>
                      <td>{(user.idunidad===1) ? "Kg" : (user.idunidad===2) ? "gramos" : (user.idunidad===3) ? "litros" : (user.idunidad===4) ? "mililitros" : (user.idunidad===5) ? "unidad" : "desconocido"}</td>
                      <td>{user.cantidadproducto}</td>
                      <td>{user.nombreproveedor}</td>
                      <td>{user.fecha}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
          <nav className="d-flex justify-content-center">
                  <ul className="pagination">
                      {
                      pages.map((page,index)=>(
                        <li key={index} className={page=== currentPage ? "page-item active" : "page-item"
                      }><p className="page-link btn-primary" onClick={()=>pagination(page)}>{page}</p></li>
                      ))
                      }
                  </ul>
          </nav>
        </div>
        <div className="d-flex justify-content-end mt-3">
          <button
            onClick={handlePrint}
            className="p-2 btn btn-primary"
          >
            Reporte
          </button>
        </div>
      </div>
    </div>

    </div>
  );
}

export default MenuPosterior;
