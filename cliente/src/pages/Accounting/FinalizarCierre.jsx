import React, {useState, useEffect} from 'react'
import jsPDF from 'jspdf'
import {Link} from 'react-router-dom'

function FinalizarCierre() {

  const [ultimocierre, setUltimocierre]= useState('desconocido')
  const [ultimoapertura, setUltimoapertura]= useState('desconocido')
  const [ultimoencargado,setUltimoencargado]= useState('desconocido')
  const [ventasefectivo, setVentasefectivo]= useState('desconocido')
  const [ventastarjetas, setVentastarjetas]= useState('desconocido')
  const [ventasvales, setVentasvales]= useState('desconocido')
  const [fondocambio, setCajafondocambio]= useState('desconocido')
  const [cajacobrado, setCajacobrado]= useState('desconocido')
  const [cajaretiros, setCajaretiros]= useState('desconocido')
  const [cajacambios, setCajacambios]= useState('desconocido')
  const [totalsistema, setTotalsistema]= useState('desconocido')
  const [movimientosperiodo, setMovimientosperiodo]= useState([])
  const baseURL = process.env.REACT_APP_API_URL //npm i dotenv

  const rol = localStorage.getItem('rol')

const handleReportInfo = async () => {
  
  const res = await fetch(
    baseURL+`/contabilidad/DatosUltimoCierre/${rol}`
  );
  const data = await res.json();
  if(data===null){
    setUltimocierre('primero haga un cierre')
    setUltimoencargado('primero haga un cierre')
    setCajacobrado('primero haga un cierre')
    setCajafondocambio('primero haga un cierre')
    setUltimoapertura('no se encontró')
  }else{
    setUltimocierre(data.fechacorte)
    setUltimoencargado(data.usuario)
    setCajacobrado(data.totalcorte)
    setCajafondocambio(data.saldoapertura)
    setUltimoapertura(data.fechaapertura)
  }

  ///////////Obtener el último apertura real /////////
  const res22 = await fetch(
    baseURL+`/contabilidad/ultimosAperturas/${rol}`
  );
  const data22 = await res22.json();
  if(data22===null){
      console.log('desconocido')
  }else{
     let acum=0;
     let pfechap=null;
     data22.map((ap)=>{
        acum=acum+1;
        if(acum===2){
        pfechap= ap.fechaapertura
        }
     })
      if(pfechap!==null){
        
      setUltimoapertura(pfechap)
      const res23 = await fetch(
        baseURL+`/contabilidad/ultimosMovimientos/${rol}/${pfechap}`
      );
      const data23 = await res23.json();
      setMovimientosperiodo(data23)
      
      const res3 = await fetch(
        baseURL+`/contabilidad/VentasHastaAhora/${rol}/${pfechap}`
      );
      const data3 = await res3.json();
      if (data3.sum === null) {
        setVentasefectivo(0);
        data3.sum=0;
      } else {
        setVentasefectivo(data3.sum);
      }
       /////Obtener ventas de tarjetas desde el apertura
       const res4 = await fetch(
        baseURL+`/contabilidad/VentasHastaAhoraTarjetas/${rol}/${pfechap}`
      );
      const data4 = await res4.json();
      if(data4.sum===null){
          setVentastarjetas(0);
          data4.sum=0;
      }else{
          setVentastarjetas(data4.sum);
      }
      //////////Obtener ventas de tarjetas desde el apertura
      const res5 = await fetch(
        baseURL+`/contabilidad/VentasHastaAhoraVales/${rol}/${pfechap}`
      );
      const data5 = await res5.json();
      if(data5.sum===null){
          setVentasvales(0);
          data5.sum=0;
      }else{
          setVentasvales(data5.sum);
      }
      setTotalsistema(parseFloat(data3.sum)+parseFloat(data4.sum)+parseFloat(data5.sum))
        //////////Obtener los gastos desde el apertura
        const res6 = await fetch(
          baseURL+`/contabilidad/GastosCaja/${rol}/${pfechap}`
        );
        const data6 = await res6.json();
        if(data6.sum===null){
            setCajaretiros(0);
        }else{
            setCajaretiros(data6.sum);
        }
        ///////Obtener los cambios ingresados desde apertura
        const res7 = await fetch(
          baseURL+`/contabilidad/CambiosCaja/${rol}/${pfechap}`
        );
        const data7 = await res7.json();
        if(data7.sum===null){
            setCajacambios(0);
        }else{
            setCajacambios(data7.sum);
        }

      }
    }

};

const generatePDF= ()=>{
  var doc= new jsPDF("p","px","a1");
  doc.html(document.querySelector('#content'),{
    callback:function(pdf){
      pdf.save("reporteCierre.pdf");
    }
  })
}

useEffect(() => {
  handleReportInfo()
}, [])

    return (
      <div className="container">
        <div className="row d-flex justify-content-center my-4" id="content">
          <div id="colors">
            <h2>Visualizador del reporte de cierre:</h2>
          </div>
          <div
            className="card col-md-6 mt-4 d-flex flex-row justify-content-between"
            id="colors"
          >
            <h5>Total en la caja=${cajacobrado}</h5>
            <h5>Total en el sistema=${totalsistema}</h5>
          </div>
          <div className="p-2 d-flex justify-content-center">
            <div
              className="card col-md-6 d-flex justify-content-center"
              id="colors"
            >
              <h5>
                {cajacobrado === totalsistema
                  ? "las cantidades cuadran :)"
                  : "las cantidades no cuadran :("}
              </h5>
            </div>
          </div>

          <div className="card col-md-6 m-1" id="colors">
            <div className="d-flex justify-content-center my-3">
              <h5>Ventas en el sistema:</h5>
            </div>

            <div className="p-2">
              <div className="d-flex justify-content-center">
                <p>Efectivo: ${ventasefectivo}</p>
              </div>

              <div className="d-flex justify-content-center">
                <p>Tarjetas: ${ventastarjetas}</p>
              </div>

              <div className="d-flex justify-content-center">
                <p>Vales: ${ventasvales}</p>
              </div>

              <div className="d-flex justify-content-center">
                <p>Total de Retiros: ${cajaretiros}</p>
              </div>

              <div className="d-flex justify-content-center">
                <p>Cambios agregados: ${cajacambios}</p>
              </div>
            </div>
          </div>
          <div className="card col-md-6 m-1" id="colors">
            <div className="d-flex justify-content-center my-2">
              <h5>Revisión en caja:</h5>
            </div>

            <div className="p-2">
              <div className="d-flex justify-content-center">
                <p>Total: ${cajacobrado}</p>
              </div>

              <div className="d-flex justify-content-center">
                <p>Fondo de cambio: ${fondocambio}</p>
              </div>
            </div>
          </div>

          <div className="card col-md-6 col-12 m-1" id="colors">
            <div className="d-flex justify-content-center my-2">
              <h5>Datos de sesión:</h5>
            </div>

            <div className="p-2">
              <div className="d-flex justify-content-center">
                <p>Encargado del cierre: {ultimoencargado}</p>
              </div>

              <div className="d-flex justify-content-center">
                <p>Cuenta: XXXXXXX</p>
              </div>
              <div className="d-flex justify-content-center m-2 col-12 table-responsive">
                <table className="table rounded shadow-sm table-hover">
                  <thead>
                    <tr>
                      <th scope="col" width="50">
                        usuario
                      </th>
                      <th scope="col" width="50">Razón</th>
                      <th scope="col" width="50">Total</th>
                      <th scope="col" width="70">Fecha</th>
                      <th scope="col" width="70">Descripción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      !movimientosperiodo ? ("no hay información de parciales")
                      :
                      movimientosperiodo.map((mov,index)=>(
                        <tr key={index}>
                        <td>{mov.usuario}</td>
                        <td>{mov.razon}</td>
                        <td>{mov.total}</td>
                        <td>{mov.fechamovimiento}</td>
                        <td>{mov.descripcion}</td>
                      </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-center">
                <p>Fecha de apertura: {ultimoapertura}</p>
              </div>
              <div className="d-flex justify-content-center">
                <p>Fecha de cierre: {ultimocierre}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center my-5">
          <button className="m-2 p-2 btn btn-primary" onClick={generatePDF}>
            Guardar Reporte
          </button>
          <Link to="/dashboard">
            <button className="m-2 p-2 btn btn-primary">Salir</button>
          </Link>
        </div>
      </div>
    );
}

export default FinalizarCierre
