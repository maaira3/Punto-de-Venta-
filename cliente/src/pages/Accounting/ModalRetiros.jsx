import React,{useState} from 'react'
import Modal from 'react-modal'
//import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
//import {faMoneyBill} from '@fortawesome/free-solid-svg-icons'
import mil from './Components/imgs/billetemil.jpg'
import quinientos from './Components/imgs/billete500.jpg'
import doscientos from './Components/imgs/billete200.png'
import cien from './Components/imgs/billete100.jpg'
import cincuenta from './Components/imgs/billete50.jpg'
import veinte from './Components/imgs/20pesos.jpg'
import diez from './Components/imgs/10Pesos.jpg'
import cinco from './Components/imgs/5pesos.jpg'
import dos from './Components/imgs/2Pesos.jpg'
import uno from './Components/imgs/1Peso.jpg'
import cincuentac from './Components/imgs/50Centavos.jpg'
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
//import './Modal.css'
import Swal from 'sweetalert2'
import '../../styles.scss'

const ModalRetiros = () => {

  const[showRetirar, setShowretirar]= useState(false)
  const[cantidadRetiro, setCantidadretiro]= useState(0)
  const[cantidadretirovalid, setCantidadretirovalid]= useState('true')
  const[lock, setLock]= useState(false)
  const baseURL = process.env.REACT_APP_API_URL //npm i dotenv

  const rol = localStorage.getItem('rol')

  const handleCantidadTotal = () =>{
    setCantidadretiro(0);
    setShowretirar(false)
  }

  const handleRetiro= async (e)=>{
      e.preventDefault();
      setLock(true)

      ///////////Variables de sesión/////////////////////
      const user = localStorage.getItem("user")

       const res222 = await fetch(
        baseURL+`/accesibilidad/getIdUsuario/${rol}/${user}`
        );
        const data222 = await res222.json();

        const idusuarioes= data222.idusuario;
      ////////////////////////////////////////////////////

       ////////////////Insertar el movimiento para la contabilidad////////////////////1111
       if(cantidadretirovalid==='true'){
        var totalretiro= cantidadRetiro
        var razon='retiro'
        var tipo='salidaefectivo'
        var idusuario=idusuarioes
        var descripcionmov=('Se hizo un retiro de '+totalretiro+ ' pesos')
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
         setCantidadretiro(0)
         setShowretirar(false)
       }else{
        setLock(false)
        Swal.fire('Error!','checa el campo que llenaste','error')
       }
  }

  const handleValid =()=>{
    if(expresiones.numerosfloat.test(cantidadRetiro)){
      setCantidadretirovalid('true')
    } else{
      setCantidadretirovalid('false')
    }
  }

  const expresiones = {
    numerosfloat:/^[0-9.]{1,20}$/, // 1 a 20 digitos con punto.
  }

  return (
    <div>
      <div>
     <div className="card card-item" onClick={() => setShowretirar(true)}>
                <span className="card-title">Realizar Retiros</span>
                <div className="card-money">
                    <MoneyOffIcon className="icons"/>
                </div>
        </div>
      </div>
      <Modal isOpen={showRetirar} ariaHideApp={false}>
        <div className="row" id="modales">
          <h2 className="bg-dark text-white">Inserta la cantidad del retiro:</h2>
          <div className="d-flex justify-content-center mt-3">
            <img src={mil} onClick={()=>setCantidadretiro(parseFloat(cantidadRetiro)+parseFloat(1000))} alt="billete mil" className="p-1" />
            <img src={quinientos} onClick={()=>setCantidadretiro(parseFloat(cantidadRetiro)+parseFloat(500))} alt="billete quinientos" className="p-1" />
            <img src={doscientos} onClick={()=>setCantidadretiro(parseFloat(cantidadRetiro)+parseFloat(200))} alt="billete doscientos" className="p-1" />
          </div>
          <div className="d-flex justify-content-center">
            <img src={cien} onClick={()=>setCantidadretiro(parseFloat(cantidadRetiro)+parseFloat(100))} alt="billete cien" className="p-1" />
            <img src={cincuenta} onClick={()=>setCantidadretiro(parseFloat(cantidadRetiro)+parseFloat(50))} alt="billete cincuenta" className="p-1" />
            <img src={veinte} onClick={()=>setCantidadretiro(parseFloat(cantidadRetiro)+parseFloat(20))} alt="billete veinte" className="p-1" />
          </div>
          <div className="d-flex justify-content-center">
            <img src={diez} onClick={()=>setCantidadretiro(parseFloat(cantidadRetiro)+parseFloat(10))} alt="moneda diez" className="p-1" id="moneda" />
            <img src={cinco} onClick={()=>setCantidadretiro(parseFloat(cantidadRetiro)+parseFloat(5))} alt="moneda cinco" className="p-1" id="moneda" />
            <img src={dos} onClick={()=>setCantidadretiro(parseFloat(cantidadRetiro)+parseFloat(2))} alt="moneda dos" className="p-1" id="moneda" />
            <img src={uno} onClick={()=>setCantidadretiro(parseFloat(cantidadRetiro)+parseFloat(1))} alt="moneda dos" className="p-1" id="moneda" />
            <img
              src={cincuentac}
              onClick={()=>setCantidadretiro(parseFloat(cantidadRetiro)+parseFloat(.50))}
              alt="moneda dos"
              className="p-1"
              id="moneda"
            />
          </div>
          <form className="d-flex justify-content-center m-3">
              <div className="col-3 p-2">
                <input
                  type="text"
                  className="form-control"
                  id="helpRetiro"
                  aria-describedby="QuantityHelp"
                  value={cantidadRetiro}
                  onChange={(e)=>setCantidadretiro(e.target.value)}
                />
                <div id="helpRetiro" className="form-text">
                    {cantidadretirovalid === 'false' ? (
                        <p className="text-danger">
                          Solo números , incluso con punto
                        </p>
                     ) : (
                        <p>Toca los billetes o teclea el monto de cambio</p>
                    )}
                </div>
              </div>

            <div className="p-2">
              <button
                type="submit"
                className="btn btn-success p-2"
                disabled={lock}
                onClick={handleRetiro}
                onMouseOver={handleValid}
              >
                Listo!
              </button>
            </div>
            <div className="p-2">
              <button
                className="btn btn-danger p-2"
                onClick={handleCantidadTotal}
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

export default ModalRetiros
