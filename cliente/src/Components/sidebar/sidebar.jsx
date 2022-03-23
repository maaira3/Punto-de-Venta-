import React, {useState, useEffect} from 'react'
import "../../styles.scss"
import DashboardIcon from '@material-ui/icons/Dashboard';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import StorageIcon from '@material-ui/icons/Storage';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import {Link} from 'react-router-dom';
import axios from 'axios'
import Swal from 'sweetalert2'

const baseURL = process.env.REACT_APP_API_URL //npm i dotenv

function Sidebar() {
    const user = localStorage.getItem("user")
    const rol = localStorage.getItem('rol')
    const id = localStorage.getItem('userid')
    const role = localStorage.getItem('role')

    const [empleados, setEmpleados] = useState(null)
    const [ventas, setVentas] = useState(null)
    const [inventarios, setInventarios] = useState(null)
    const [configuracion, setConfiguracion] = useState(null)
    const [gestor, setGestor] = useState(null)
    const [productos, setProductos] = useState(null)
    const [contabilidad, setContabilidad] = useState(null)


    async function getUsuario(){
        const {data} = await axios.get(baseURL+'/usuario'+`/${id}`+`/${rol}`)
        getPermisos(data.idusuario)
    }

    async function getPermisos(idusuario){
        const {data} = await axios.get(baseURL+'/permisos'+`/${idusuario}`+`/${rol}`)
        data.map(item =>(
            RevisarPermisos(item.idpermiso, item.acceso)
        ))
    }

    function RevisarPermisos(permiso, acceso){
        if(permiso === 1){
            if(acceso === true){
                setEmpleados(true)
            }else{
                setEmpleados(false)
            }
        }
        if(permiso === 2){
            if(acceso === true){
                setInventarios(true)
            }else{
                setInventarios(false)
            }
        }
        if(permiso === 3){
            if(acceso === true){
                setConfiguracion(true)
            }else{
                setConfiguracion(false)
            }
        }
        if(permiso === 4){
            if(acceso === true){
                setGestor(true)
            }else{
                setGestor(false)
            }
        }
        if(permiso === 5){
            if(acceso === true){
                setProductos(true)
            }else{
                setProductos(false)
            }
        }
        if(permiso === 6){
            if(acceso === true){
                setVentas(true)
            }else{
                setVentas(false)
            }
        }
        if(permiso === 7){
            if(acceso === true){
                setContabilidad(true)
            }else{
                setContabilidad(false)
            }
        }
    }

    useEffect(() =>{
        getUsuario()
    }, [])

    return (
        <div className="sidebar">
            <div className="sidebar-wrapper">
                <div className="sidebar-profile">
                    <div className="sidebar-img">
                    <Link to = '/logout' className="link">
                        <LogoutIcon className="icons profile-icon"/>
                    </Link>
                    
                    </div>
                    <div className="sidebar-info">
                        <span className="sidebar-info-name">{user}</span>
                        <span className="sidebar-info-ocupation">{role}</span>
                    </div>
                     
                </div>
                <div className="sidebarMenu">
                    <ul className="sidebar-list">
                        <li className="sidebar-items active">
                            <Link to = '/dashboard' className= "link">
                                <DashboardIcon className="icons sidebar-icons"/> 
                                <span className="sidebar-pages">Dashboard</span>
                            </Link>
                        </li>
                        <hr/>
                        <li className="sidebar-items">
                            {(empleados === true) ? 
                            <Link to = '/employees' className= "link">
                                <AssignmentIndIcon className="icons sidebar-icons"/> <span className="sidebar-pages">Empleados</span>
                            </Link>
                            :
                            <Link to = '/sinacceso' className= "link">
                                <AssignmentIndIcon className="icons sidebar-icons"/> <span className="sidebar-pages">Empleados</span>
                            </Link>
                            }
                        </li>
                        <hr/>
                        <li className="sidebar-items">
                            {(ventas === true) ?
                            <Link to = '/ventas' className= "link">
                                <AttachMoneyIcon className="icons sidebar-icons"/> <span className="sidebar-pages">Ventas</span>
                            </Link>
                            :
                            <Link to = '/sinacceso' className= "link">
                                <AttachMoneyIcon className="icons sidebar-icons"/> <span className="sidebar-pages">Ventas</span>
                            </Link>
                            }
                        </li>
                        <hr/>
                        <li className="sidebar-items">
                            {(inventarios === true) ? 
                            <Link to = '/inventory' className= "link">  
                                <StorageIcon className="icons sidebar-icons"/> <span className="sidebar-pages">Inventario</span>
                            </Link>
                            :
                            <Link to = '/sinacceso' className= "link">  
                                <StorageIcon className="icons sidebar-icons"/> <span className="sidebar-pages">Inventario</span>
                            </Link>
                            }
                        </li>
                        <hr/>
                        <li className="sidebar-items">
                            {(productos === true) ?
                        <Link to = '/addproduct' className= "link">
                            <FastfoodIcon className="icons sidebar-icons"/> <span className="sidebar-pages">Flujo de venta</span>
                        </Link>
                        :
                        <Link to = '/sinacceso' className= "link">
                            <FastfoodIcon className="icons sidebar-icons"/> <span className="sidebar-pages">Flujo de venta</span>
                        </Link>
                        }
                        </li>
                        <hr/>
                        <li className="sidebar-items">
                            {(contabilidad === true) ? 
                            <Link to = "/accounting" className="link">
                                <MoneyOffIcon className="icons sidebar-icons"/> <span className="sidebar-pages">Contabilidad</span>
                            </Link>
                            :
                            <Link to = "/sinacceso" className="link">
                                <MoneyOffIcon className="icons sidebar-icons"/> <span className="sidebar-pages">Contabilidad</span>
                            </Link>
                            }
                        </li>
                        <hr/>
                        <li className="sidebar-items">
                            {(gestor === true) ? 
                            <Link to = "/gestor" className="link">
                                <MailOutlineIcon className="icons sidebar-icons"/> <span className="sidebar-pages">Gestor de campañas</span>
                            </Link>
                            :
                            <Link to = "/sinacceso" className="link">
                                <MailOutlineIcon className="icons sidebar-icons"/> <span className="sidebar-pages">Gestor de campañas</span>
                            </Link>
                            }
                        </li>
                        <hr/>
                        <li className="sidebar-items">
                            {(configuracion === true) ? 
                            <Link to = "/configuracion" className="link">
                                <SettingsIcon className="icons sidebar-icons"/> <span className="sidebar-pages">Configuración</span>
                            </Link>
                            :
                            <Link to = "/sinacceso" className="link">
                                <SettingsIcon className="icons sidebar-icons"/> <span className="sidebar-pages">Configuración</span>
                            </Link>
                            }
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
export default Sidebar;
