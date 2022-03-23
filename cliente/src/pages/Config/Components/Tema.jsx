import React,{useState,useEffect} from 'react'
import Swal from 'sweetalert2'
import InvertColorsIcon from '@mui/icons-material/InvertColors';

const baseURL = process.env.REACT_APP_API_URL //npm i dotenv

function Tema() {

    const [activotemas, setActivotemas]= useState(false)
    const [estiloactivo, setEstiloactivo]= useState(false)
    const [temaescogido, setTemaescogido]= useState('blue')
    const [nombreempresa, setNombreEmpresa]= useState('POS')
    const[nombreempresavalid, setNombreempresavalid]=useState(true)
    const rol = localStorage.getItem('rol')
    
    const datosInicio=async()=>{
      //////////datos de temas desde el inicio ////////////////////////
      const res1 = await fetch(
        baseURL+`/configuracion/getTemasEs`+`/${rol}`
      );
      const data1 = await res1.json();
      if(data1===null){
        setEstiloactivo('light')
        setTemaescogido('blue')
        setNombreEmpresa('POS')
      }else{
        if(data1.modo==='dark')
        setEstiloactivo(true)
        else
        setEstiloactivo(false)
        
        setTemaescogido(data1.color)
        setNombreEmpresa(data1.logo)
      }
    }

    const handleDefTema= async(e) =>{
      e.preventDefault()

      let estiloactivo1;
      if(estiloactivo===true){
        estiloactivo1='dark'
      } else{
        estiloactivo1='light'
      } 

      if(nombreempresavalid===true){

        const res = await fetch(
          baseURL+`/configuracion/editTema`+`/${rol}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              estiloactivo1,
              temaescogido,
              nombreempresa,
            }),
          }
        );
        const data=await res.json();
        Swal.fire('Bien!',data.msg, 'success')
        window.location.reload(true);
      }else{
        Swal.fire('Atención!','corrige el nombre de tu empresa!', 'error')
      }
    }

    const validacion = () =>{
    if(expresiones.nombre.test(nombreempresa)){
      setNombreempresavalid(true)
    } else{
      setNombreempresavalid(false)
    }
  } 
const expresiones = {
nombre: /^[a-zA-ZÀ-ÿ0-9\s]{3,20}$/, // Letras y espacios, pueden llevar acentos.
}

    useEffect(()=>{
      datosInicio()
    },[])

    return (
      <div className="row d-flex justify-content-center">
        <div className="card col-md-11 p-2" >
          <h2>Configuraciones</h2>
        </div>
        <div className="card col-md-11 m-4">
          <h3 className="config-title" onClick={() => setActivotemas(!activotemas)}>
            {activotemas === true
              ? "- Clíck para cerrar esta sección"
              : "+ Clíck aquí para definir tu tema y logo"}
          </h3>
          {activotemas === true ? (
            <div>
              <form className="row d-flex justify-content-around">
                <div className="card mb-3 col-md-6 col-12">
                    <label htmlFor="negocioName" className="form-label">
                       Como se llama tu negocio?
                    </label>
                  <input
                    type="text"
                    className="form-control"
                    id="negocioName"
                    aria-describedby="temaHelp"
                    value={nombreempresa}
                    onChange={(e)=>setNombreEmpresa(e.target.value)}
                  />
                  <div id="temaHelp" className="form-text">
                    {
                      nombreempresavalid===true ? 
                      <p>Aqui se define tu logo</p> :
                      <p className="text-danger">Mínimo 3 caracteres, máximo 20</p>
                    }
                  </div>
                </div>
                <div className="card form-check form-switch col-md-4 col-12 m-3">
                  <div className="d-flex justify-content-start">
                    <p>Escoge un modo: light/nocturno</p>
                  </div>
                  <div className="d-flex justify-content-center">
                    <input
                      className="form-check-input offset-md-2"
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                      value={estiloactivo}
                      checked={estiloactivo}
                      onChange={() => setEstiloactivo(!estiloactivo)}
                    />
                  </div>
                  <label
                    className="form-check-label"
                    htmlFor="flexSwitchCheckDefault"
                  >
                    {estiloactivo === true
                      ? "Desactiva el modo nocturno"
                      : "Activa el modo nocturno"}
                  </label>
                </div>
                <div className="col-12">
                  <div className="d-flex justify-content-start">
                    <h5>Ahora escoge un tema (Clickea una gota):</h5>
                  </div>
                  <div className="d-flex justify-content-around m-3 temas">
                    <InvertColorsIcon className="icons red-icon" onClick={()=>setTemaescogido('red')}/>
                    <InvertColorsIcon className="icons blue-icon" onClick={()=>setTemaescogido('blue')}/>
                    <InvertColorsIcon className="icons cyan-icon" onClick={()=>setTemaescogido('cyan')}/>
                    <InvertColorsIcon className="icons green-icon" onClick={()=>setTemaescogido('green')}/>
                  </div>
                </div>
                <div className="col-12">
                  <input
                    type="text"
                    className="form-control"
                    id="temaescogido1"
                    aria-describedby="temaescHelp"
                    value={temaescogido}
                    disabled
                  />
                  <div id="temaescHelp" className="form-text mb-3">
                    Tema escogido:
                  </div>
                </div>
                <button className="btn btn-primary" type="submit" onClick={handleDefTema} onMouseOver={validacion}>
                  Guardar
                </button>
              </form>
            </div>
          ) : (
            <div>
              <p>Modifica el tema, colores y nombre del negocio en este apartado</p>
            </div>
          )}
        </div>
      </div>
    );
}

export default Tema;
