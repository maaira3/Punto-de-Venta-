import React,{useState,useEffect} from 'react'
import Swal from 'sweetalert2'
import PacmanLoader from "react-spinners/PacmanLoader";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const baseURL = process.env.REACT_APP_API_URL //npm i dotenv

function RolesSeguridad() {

    const[desplegarsecc, setDesplegarsecc]= useState(false)
    const [listemployees, setListemployees]= useState([])
    const [permisoempleados, setPermisoempleados]= useState('')
    const [permisoinventarios, setPermisoinventarios]= useState(false)
    const [permisoconfiguracion, setPermisoconfiguracion]= useState(false)
    const [permisogestor, setPermisogestor]= useState(false)
    const [permisoproductos, setPermisoproductos]= useState(false)
    const [permisoventas, setPermisoventas]= useState(false)
    const[permisocontabilidad, setPermisocontabilidad]= useState(false)
    const[idusuario, setIdusuario]= useState(null)
    const [loading, setLoading]=useState(false)
    const rol = localStorage.getItem('rol')

    const DatosInicio= async()=>{
      const res2 = await fetch(
        baseURL+`/configuracion/getEmpleados`+`/${rol}`
      );
      const data2 = await res2.json();
      setListemployees(data2)
    }

    const cleanstates=()=>{
      setPermisoconfiguracion(false)
      setPermisoempleados(false)
      setPermisogestor(false)
      setPermisocontabilidad(false)
      setPermisoproductos(false)
      setPermisoventas(false)
      setPermisoinventarios(false)
    }

    const bringPermisos=async(actualempleado)=>{
        if(actualempleado===''){
          Swal.fire('Atención!','no tienes empleados aún!', 'info')
        }
        else{

          const res3 = await fetch(
            baseURL+`/configuracion/getIdusuario/${actualempleado}`+`/${rol}`
          );
          const data3 = await res3.json();
          let userid= data3.idusuario;
          setIdusuario(data3.idusuario)
          const res4 = await fetch(
            baseURL+`/configuracion/getPermisos/${userid}`+`/${rol}`
          );
          const data4 = await res4.json();
          data4.map((permiso)=>{
            if(permiso.idpermiso===1){
              setPermisoempleados(permiso.acceso)
            }
            if(permiso.idpermiso===2){
              setPermisoinventarios(permiso.acceso)
            }
            if(permiso.idpermiso===3){
              setPermisoconfiguracion(permiso.acceso)
            }
            if(permiso.idpermiso===4){
              setPermisogestor(permiso.acceso)
            }
            if(permiso.idpermiso===5){
              setPermisoproductos(permiso.acceso)
            }
            if(permiso.idpermiso===6){
              setPermisoventas(permiso.acceso)
            }
            if(permiso.idpermiso===7){
              setPermisocontabilidad(permiso.acceso)
            }
          })

        }
    }

    const handlePermisos= async(e)=>{
        e.preventDefault();

        if(permisoempleados!==''){

          setLoading(true)
          const res = await fetch(
            baseURL+`/configuracion/editPermisoEmpleados`+`/${rol}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                idusuario,
                permisoempleados
              }),
            }
          );
            await res.json();
          ////////editar permiso de inventarios//////////////////
          const resinv = await fetch(
            baseURL+`/configuracion/editPermisoInventarios`+`/${rol}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                idusuario,
                permisoinventarios
              }),
            }
          );
            await resinv.json();
          ///////////editar permiso de configuracion//////////////////
          const rescon = await fetch(
            baseURL+`/configuracion/editPermisoConfiguracion`+`/${rol}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                idusuario,
                permisoconfiguracion
              }),
            }
          );
            await rescon.json();
          /////////////////editar permisos de gestor //////////////////
          const resges = await fetch(
            baseURL+`/configuracion/editPermisoGestor`+`/${rol}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                idusuario,
                permisogestor
              }),
            }
          );
            await resges.json();
          /////////////editar permisos de productos///////////////////
          const respro = await fetch(
            baseURL+`/configuracion/editPermisoProductos`+`/${rol}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                idusuario,
                permisoproductos
              }),
            }
          );
            await respro.json();
          ////////////editar permisos de ventas//////////////////
          const resven = await fetch(
            baseURL+`/configuracion/editPermisoVentas`+`/${rol}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                idusuario,
                permisoventas
              }),
            }
          );
            await resven.json();
          //////////editar permisos de contabilidad//////////////
          const resconta = await fetch(
            baseURL+`/configuracion/editPermisoContabilidad`+`/${rol}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                idusuario,
                permisocontabilidad
              }),
            }
          );
            await resconta.json();
            Swal.fire('Bien!','Permisos actualizados!', 'success')
            cleanstates()
            setLoading(false)
            window.location.reload(true);
        }else{
            Swal.fire('Error!','selecciona un empleado primero!', 'error')
        }
    }

    useEffect(()=>{
      DatosInicio()
    },[])

    function InfoEmpleados(){
      Swal.fire({
        icon: 'info',
        title: 'Empleados',
        text: "En esta sección se encuentran los datos personales de los empleados registrados en el sistema. Se pueden agregar empleados, modificar sus datos y eliminarlos del sistema"
      })
    }

    function InfoConfiguración(){
      Swal.fire({
        icon: 'info',
        title: 'Configuración',
        text: "Dentro de las configuraciones se puede cambiar el estilo del sistema, los permisos de los usuarios y cambiar los datos de la cuenta del negocio."
      })
    }
    function InfoProductos(){
      Swal.fire({
        icon: 'info',
        title: 'Flujo de venta',
        text: "En esta sección se pueden agregar nuevos productos, agregar categorias, paquetes y modificaciones en el flujo de venta."
      })
    }

    function InfoContabilidad(){
      Swal.fire({
        icon: 'info',
        title: 'Contabilidad',
        text: "En esta sección se pueden hacer retiros de efectivo, añadir cambio a la caja, realizar parciales, agregar observaciones, cierre de caja y apertura de caja."
      })
    }

    function InfoInventarios(){
      Swal.fire({
        icon: 'info',
        title: 'Inventarios',
        text: "Sección para la gestión de inventarios de los productos e ingredientes registrados en el sistema."
      })
    }

    function InfoGestor(){
      Swal.fire({
        icon: 'info',
        title: 'Gestor de campañas',
        text: "En esta sección se muestran las diferentes promociones de los clientes afiliados al programa de lealtad"
      })
    }

    function InfoVentas(){
      Swal.fire({
        icon: 'info',
        title: 'Ventas',
        text: "En esta sección se hacen las ventas de los productos registrados en el sistema"
      })
    }

    return (
      <div className="row d-flex justify-content-center seguridad">
        {
          loading===true ? 
          (
            <div
            className="d-flex justify-content-center align-items-center"
            id="cargascreen"
          >
            <div>
              <PacmanLoader size={30} color={"#123adc"} loading={loading} />
            </div>
          </div>
          )
        :
        <div className="card col-md-11 m-4">
          <h3 className="config-title" onClick={() => setDesplegarsecc(!desplegarsecc)}>
            {desplegarsecc === false
              ? "+ Clíck aquí para definir la seguridad del POS"
              : "- Clíck para cerrar esta sección"}
          </h3>
          {desplegarsecc === true ? (
            <div>
              <form className="row d-flex justify-content-around">
                <div className="card col-12 m-2 ">
                  <h6>Selecciona un empleado</h6>
                </div>
                <div className="col-6 m-2">
                  <p className="mb-0">Empleados:</p>
                  <select
                    className="form-select"
                    aria-label="Floating label select example"
                    onClick={(e)=>bringPermisos(e.target.value)}
                  >
                    {
                      listemployees.map((employee,index) => (
                        <option
                          value={employee.idempleado}
                          key={index}
                        >
                          {employee.nombreempleado}
                        </option>
                      ))
                    }
                  </select>
                </div>
                <div className="card col-12 m-2">
                  <h6>
                    Selecciona los módulos a los que tiene acceso Laporte
                  </h6>
                </div>
                <div className="card m-2 col-5">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={permisoempleados}
                      onChange={(e)=>setPermisoempleados(e.target.checked)}
                      id="checkEmp"
                      checked={permisoempleados}
                    />
                    <label className="form-check-label" htmlFor="checkEmp">
                      Empleados
                    </label>   
                  <HelpOutlineIcon onClick={InfoEmpleados.bind(this)} className="icons help-icon"/>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={permisoconfiguracion}
                      onChange={(e)=>setPermisoconfiguracion(e.target.checked)}
                      checked={permisoconfiguracion}
                      id="checkConf"
                    />
                    <label className="form-check-label" htmlFor="checkConf">
                      Configuración
                    </label>
                    <HelpOutlineIcon onClick={InfoConfiguración.bind(this)} className="icons help-icon"/>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={permisoproductos}
                      onChange={(e)=>setPermisoproductos(e.target.checked)}
                      id="checkProd"
                      checked={permisoproductos}
                    />
                    <label className="form-check-label" htmlFor="checkProd">
                      Flujo de venta
                    </label>
                    <HelpOutlineIcon onClick={InfoProductos.bind(this)} className="icons help-icon"/>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={permisocontabilidad}
                      onChange={(e)=>setPermisocontabilidad(e.target.checked)}
                      id="checkCont"
                      checked={permisocontabilidad}
                    />
                    <label className="form-check-label" htmlFor="checkCont">
                      Contabilidad
                    </label>
                    <HelpOutlineIcon onClick={InfoContabilidad.bind(this)} className="icons help-icon"/>
                  </div>
                </div>
                <div className="card m-2 col-5">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={permisoinventarios}
                      onChange={(e)=>setPermisoinventarios(e.target.checked)}
                      id="checkInv"
                      checked={permisoinventarios}
                    />
                    <label className="form-check-label" htmlFor="checkInv">
                      Inventarios
                    </label>
                    <HelpOutlineIcon onClick={InfoInventarios.bind(this)} className="icons help-icon"/>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={permisogestor}
                      onChange={(e)=>setPermisogestor(e.target.checked)}
                      id="checkGDC"
                      checked={permisogestor}
                    />
                    <label className="form-check-label" htmlFor="checkGDC">
                      Gestor de campañas
                    </label>
                    <HelpOutlineIcon onClick={InfoGestor.bind(this)} className="icons help-icon"/>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value={permisoventas}
                      onChange={(e)=>setPermisoventas(e.target.checked)}
                      id="checkVen"
                      checked={permisoventas}
                    />
                    <label className="form-check-label" htmlFor="checkVen">
                      Ventas
                    </label>
                    <HelpOutlineIcon onClick={InfoVentas.bind(this)} className="icons help-icon"/>
                  </div>
                </div>
                <button className="btn btn-primary" type="submit" onClick={handlePermisos}>
                  Guardar
                </button>
              </form>
            </div>
          ) : (
            <div>
              <p>
                Define los permisos de los usuarios del sistema
              </p>
            </div>
          )}
        </div>
      }
      </div>
    );
}

export default RolesSeguridad
