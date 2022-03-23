import React,{useState} from 'react'
import Modal from 'react-modal'
//import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
//import {faEye} from '@fortawesome/free-solid-svg-icons'
import Observacion from './Components/imgs/observaciones.jpg'
//import './Modal.css'
import Swal from 'sweetalert2'
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import '../../styles.scss'

const ModalCambio = () => {

  const[showobservaciones, setShowobservaciones]= useState(false)
  const[observacionesvar, setObservacionesvar]= useState('')
  const[observacionesvalid, setObservacionesvalid]= useState('true')
  const[lock, setLock]= useState(false)

  const baseURL = process.env.REACT_APP_API_URL //npm i dotenv
  const rol = localStorage.getItem('rol')

  const handleCierre=()=>{
        setObservacionesvar('');
        setShowobservaciones(false)
        setObservacionesvalid('true')
  }

  const handleObservaciones= async(e)=>{
      e.preventDefault()
      setLock(true)
    
      ///////////Variables de sesión/////////////////////
      const user = localStorage.getItem("user")

      const res222 = await fetch(
      baseURL+`/accesibilidad/getIdUsuario/${rol}/${user}`
      );
      const data222 = await res222.json();

      const idusuarioes= data222.idusuario;
      ////////////////////////////////////////////////////

      if(observacionesvalid==='true'){
         ////////////////Insertar el movimiento para la contabilidad////////////////////1111
         var totalretiro= 0
         var razon='observacion'
         var tipo='notificarobservacion'
         var idusuario=idusuarioes
         var descripcionmov=('Observación: '+observacionesvar)
         const res9 = await fetch(
          baseURL+`/contabilidad/insertContabilidadMovimiento/${rol}`,
           {
             method: "POST",
             headers: {
               "Content-Type": "application/json",
             },
             body: JSON.stringify({
               idusuario,
               totalretiro,
               descripcionmov,
               razon,
               tipo
             }),
           }
         );
          const data9=await res9.json();
          console.log(data9)
          setLock(false)
          Swal.fire('Bien hecho!',data9.msg,'success')
          setObservacionesvar('')
          setShowobservaciones(false)
      }else{
          setLock(false)
          Swal.fire('Error!','Revisa el campo que llenaste','error')
      }
      
  }

  const handleValid =()=>{
    console.log('pasa por aqui')
    if(expresiones.descripcion.test(observacionesvar)){
      setObservacionesvalid('true')
    } else{
      setObservacionesvalid('false')
    }
  }

  const expresiones = {
    descripcion: /^[a-zA-ZÀ-ÿ0-9\s,]{5,100}$/, // Letras y espacios, pueden llevar acentos.
  }

  return (
    <div>
      <div className="card card-item" onClick={() => setShowobservaciones(true)}>
                <span className="card-title">Observaciones</span>
                <div className="card-money">
                    <NoteAltIcon className="icons"/>
                </div>
            </div>
      <Modal isOpen={showobservaciones} ariaHideApp={false}>
        <div className="row" id="modales">
          <h4 className="bg-dark text-white">Escribe alguna observacion que tengas para el cierre de hoy:</h4>
          <div className="d-flex justify-content-center mt-3">
              <img src={Observacion} alt="observaciones imagen"/>
          </div>
          <form className="d-flex justify-content-center m-3">
              <div className="col-4 p-2 form-floating">
                <textarea
                  type="text"
                  className="form-control"
                  style={{ height: "100px" }}
                  aria-describedby="helpObservaciones"
                  value={observacionesvar}
                  onChange={(e)=>setObservacionesvar(e.target.value)}
                />
                <div id="helpObservaciones" className="form-text">
                    {observacionesvalid === 'false' ? (
                        <p className="text-danger">
                          Mínimo 5 letras, máximo 100. No carácteres especiales
                        </p>
                     ) : (
                        <p>Escribe las observaciones de este cierre</p>
                    )}
                </div>
              </div>

            <div className="p-2">
              <button
                type="submit"
                className="btn btn-info p-2"
                disabled={lock}
                onClick={handleObservaciones}
                onMouseOver={handleValid}
              >
                Listo!
              </button>
            </div>
            <div className="p-2">
              <button
                className="btn btn-danger p-2"
                onClick={handleCierre}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}

export default ModalCambio
