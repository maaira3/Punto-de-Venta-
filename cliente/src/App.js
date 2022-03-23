import React, {useState, useEffect} from 'react';
import Dashboard from './pages/Dashboard/dashboard';
import Inventory from './pages/Inventory/MenuPosterior'
import Form from './pages/Login/Components/Form';
import Employees from './pages/Employees/Employees';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import Configuracion from './pages/Config/Config'
import { ProtectedRoute } from './ProtectedRoute';
import AgregarInventario from './pages/Inventory/AgregarInventario';
import ImportarInv from './pages/Inventory/ImportarInv'
import ReporteMerma from './pages/Inventory/ReporteMerma'
import Logout from './pages/Logout/Components/Form'
import Ventas from './pages/Ventas/Ventas'
import Product from './pages/Ventas/Components/Product';
import './Themes.scss'
import AperturaCaja from './pages/Accounting/AperturaCaja'
import FinalizarCierre from './pages/Accounting/FinalizarCierre'
import Accounting from './pages/Accounting/Accounting'
import Addproducts from './pages/AddProducts/Addproducts'
import Config from './pages/Config/Config'
import axios from 'axios'
import TableRemote from './pages/Gestor/home/TableRemote'
import Menu from './pages/Gestor/navegation/Menu'
import NotificacionForm from "./pages/Gestor/forms/NotificacionWithMaterialUI";
import NivelesPaper from "./pages/Gestor/niveles/index";
import BirthdayPaper from "./pages/Gestor/birthdays/index";
import AyudaPaper from "./pages/Gestor/ayuda/index";
import SellosPaper from "./pages/Gestor/sellos/index";
import CatalogoPaper from "./pages/Gestor/catalogo/index";
import SinAcceso from './pages/SinAcceso/index'

const baseURL = process.env.REACT_APP_API_URL //npm i dotenv

function App() {

  const [tema, setTema] = useState('')
  const [color, setColor] = useState('')
  const rol = localStorage.getItem('rol')

  async function getTema(){
    const {data} = await axios.get(baseURL+'/configuracion/getTemasEs'+`/${rol}`)
    setTema(data.modo)
    setColor(data.color)
}


    if (tema === 'light') {
      document.documentElement.setAttribute("data-theme", "light");
    }else if(tema === 'dark'){
      document.documentElement.setAttribute("data-theme", "dark");
    }

    if (color === 'blue'){
      document.documentElement.setAttribute("data-color", "blue");
    }else if (color === 'red'){
      document.documentElement.setAttribute("data-color", "red");
    }else if (color === 'cyan'){
      document.documentElement.setAttribute("data-color", "cyan");
    }else if (color === 'green'){
      document.documentElement.setAttribute("data-color", "green");
    }

    useEffect(() =>{
      getTema()
  }, [])

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path ="/"><Form/></Route>   
          <ProtectedRoute exact path = "/dashboard" component={Dashboard}/>
          <ProtectedRoute exact path ="/employees" component={Employees}/>
          <ProtectedRoute exact path ="/configuration" component={Configuracion}/>
          <ProtectedRoute exact path ="/inventory" component={Inventory}/>
          <ProtectedRoute exact path = "/inventory/add" component={AgregarInventario} />
          <ProtectedRoute exact path = "/inventory/import" component= {ImportarInv} />
          <ProtectedRoute exact path = "/inventory/report" component={ReporteMerma} />
          <ProtectedRoute exact path = "/ventas" component={Ventas} />
          <ProtectedRoute exact path = "/product/:id" component={Product} />
          <ProtectedRoute exact path="/aperturaCaja" component={AperturaCaja} /> 
          <ProtectedRoute exact path="/reporteCierre" component={FinalizarCierre}/>
          <ProtectedRoute exact path="/accounting" component={Accounting}/>
          <ProtectedRoute exact path="/addproduct" component={Addproducts}/>
          <ProtectedRoute exact path="/configuracion" component={Config}/>
          <ProtectedRoute exact path="/gestor" component={Menu}/>

          <ProtectedRoute exact path="/gestor/notificaciones" component={NotificacionForm}/>
          <ProtectedRoute exact path="/gestor/ayuda" component={AyudaPaper}/>
          <ProtectedRoute exact path="/gestor/birthday" component={BirthdayPaper}/>
          <ProtectedRoute exact path="/gestor/catalogo" component={CatalogoPaper}/>
          <ProtectedRoute exact path="/gestor/sellos" component={SellosPaper}/>
          <ProtectedRoute exact path="/gestor/puntos" component={NivelesPaper}/>
          <ProtectedRoute exact path="/gestor/tabla" component={TableRemote}/>
          <ProtectedRoute exact path="/sinacceso" component={SinAcceso}/>



          <Route exact path ="/logout"><Logout/></Route> 
        </Switch>
        </BrowserRouter>
    </div>
  );
}

export default App;
