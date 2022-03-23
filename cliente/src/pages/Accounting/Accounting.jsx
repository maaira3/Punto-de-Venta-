import React, {useState, useEffect} from 'react'
import BarraLateral from './BarraLateral'
import CierreCaja from './CierreCaja'
import { Link } from 'react-router-dom';
import PacmanLoader from "react-spinners/PacmanLoader";
import ModalRetiros from './ModalRetiros';
import ModalCambio from './ModalCambio';
import ModalObservaciones from './ModalObservaciones';
import Parcial from './Parcial';
const baseURL = process.env.REACT_APP_API_URL

export default function Accounting() {


    const [huboapertura,setHuboapertura]=useState('null')
    const [loading, setLoading]=useState(true)

    const rol = localStorage.getItem('rol')

    const handleShowContabilidad= async()=>{

      const res = await fetch(
        baseURL+`/contabilidad/DatosUltimoCierre/`+`${rol}`
      );
      const data = await res.json();
      if(data===null){
        setHuboapertura('false')
        setLoading(false)
      }else{
        const fcorte= data.fechacorte;
        const fapertura=data.fechaapertura;
        if(fcorte===fapertura){
          setHuboapertura('false')
          setLoading(false)
        }else{
          setHuboapertura('true')   
          setLoading(false)
        }
      }
      console.log(huboapertura)
    }

    useEffect(() => {
      handleShowContabilidad()
    }, [])

    console.log(huboapertura)
    return (
        <div>
            {huboapertura === 'true' ? (
                
              <div className="container">
                <div className="dash-cards">
            <ModalRetiros/>
            <ModalCambio/>
            <ModalObservaciones/>
            <Parcial/>
      </div>  
                <div className="row my-2">
                  <div className="card col-md-8 rounded-3 p-2 mx-2 my-3" id="colors">
                     <CierreCaja />
                  </div>
                  <div className="card col-md-3 rounded-3 p-2 m-3" id="colors">
                      <BarraLateral />
                  </div>
                </div>
              </div>
            ) : huboapertura==='false' ? (
              <div className="container">
                <div className="d-flex justify-content-center" id="colors">
                  <h1>Primero haz el apertura de caja</h1>
                </div>
                <div className="row">
                  <div className="d-flex justify-content-center m-3">
                    <Link to="/AperturaCaja">
                          <button className="p-2">Hacer apertura de caja</button>
                    </Link>
                  </div>
                </div>
              </div>
            ) : (<div className="d-flex justify-content-center align-items-center" id="cargascreen">
                  <div>
                      <PacmanLoader size={30} color={"#123adc"} loading={loading}  />
                  </div>
                </div>
             )}
        </div>
    )
}
