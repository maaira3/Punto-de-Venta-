import React,{useState, useEffect} from 'react'
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import Swal from 'sweetalert2'

function AperturaCaja() {

  const [montoapertura, setMontoapertura]= useState(0)
  const [cantidadaperturavalid, setCantidadaperturavalid]=useState('true')
  const [fechaactual, setFechaactual]= useState('desconocido')
  const [saldocaja, setSaldocaja]= useState(0)
  const [ventasefectivo, setVentasefectivo]= useState('desconocido')
  const [ventastarjetas, setVentastarjetas]= useState('desconocido')
  const [ventasvales, setVentasvales]= useState('desconocido')
  const [gananciasperdidas, setGananciasperdidas]= useState('desconocido')
  const [huboapertura, setHuboapertura] =useState('desconocido')
  const [empleado, setEmpleado]= useState('desconocido')
  const [rol1, setRol]= useState('desconocido')
  const [idusuarioes, setIdusuarioes]= useState(1)
  const baseURL = process.env.REACT_APP_API_URL

  const rol = localStorage.getItem('rol')

  const datosdesdeInicio = async () =>{

    ////////Variables del usuario en sesión///////////////
    const user = localStorage.getItem("user")
    const role = localStorage.getItem('role')

        setEmpleado(user);
        setRol(role)

        const res222 = await fetch(
          baseURL+`/accesibilidad/getIdUsuario/${rol}/${user}`
        );
        const data222 = await res222.json();

        setIdusuarioes(data222.idusuario)
        /////////////////////////////////////////////////////

    const tiempotranscurrido= Date.now();
    const hoy= new Date(tiempotranscurrido);
    setFechaactual(hoy.toDateString());

    const res = await fetch(
      baseURL+`/contabilidad/ultimoApertura/${rol}`
    );
    const data = await res.json();
    if(data===null){
        setSaldocaja(0)
    }else{
       setSaldocaja(data.saldoapertura)
    }

    const res2 = await fetch(
      baseURL+`/contabilidad/ultimosAperturas/${rol}`
    );
    const data2 = await res2.json();
    if(data===null){
        console.log('desconocido')
    }else{
       let acum=0;
       let pfechap=null;
       data2.map((ap)=>{
          acum=acum+1;
          if(acum===2){
          pfechap= ap.fechaapertura
          }
       })
       
       if(pfechap!==null){
        let vt=0;
        let ve=0;
        let vv=0;
        const res3 = await fetch(
          baseURL+`/contabilidad/VentasHastaAhora/${rol}/${pfechap}`
        );
        const data3 = await res3.json();
        if(data3.sum===null){
            setVentasefectivo(0);
            ve=0
        }else{
            setVentasefectivo(data3.sum);
            ve=data3.sum;
        }
        /////Obtener ventas de tarjetas desde el apertura
        const res4 = await fetch(
          baseURL+`/contabilidad/VentasHastaAhoraTarjetas/${rol}/${pfechap}`
        );
        const data4 = await res4.json();
        if(data4.sum===null){
            setVentastarjetas(0);
            vt=0;
        }else{
            setVentastarjetas(data4.sum);
            vt=data4.sum
        }
        //////////Obtener ventas de vales desde el apertura
        const res5 = await fetch(
          baseURL+`/contabilidad/VentasHastaAhoraVales/${rol}/${pfechap}`
        );
        const data5 = await res5.json();
        if(data5.sum===null){
            setVentasvales(0);
            vv=0;
        }else{
            setVentasvales(data5.sum);
            vv=data5.sum;
        }
        let vcargas=0;
        const res7 = await fetch(
          baseURL+`/contabilidad/inversionPeriodoPasado/${rol}/${pfechap}`
        );
        const data7 = await res7.json();
        if(data7.sum===null){
            vcargas=0;
        }else{
            vcargas=data7.sum;
        }
        setGananciasperdidas(parseFloat(vt)+parseFloat(ve)+parseFloat(vv)-parseFloat(vcargas))
       }
    }

  }

  const handleValid =()=>{
    if(expresiones.numerosfloat.test(montoapertura)){
      setCantidadaperturavalid('true')
    } else{
      setCantidadaperturavalid('false')
    }
  }

  const expresiones = {
    numerosfloat:/^[0-9.]{1,20}$/, // 1 a 20 digitos con punto.
  }

    const handleApertura=async(e)=>{
      e.preventDefault();

      if(cantidadaperturavalid==='true'){
        const res = await fetch(
          baseURL+`/contabilidad/ultimoApertura/${rol}`
        );
        const data = await res.json();
        if(data===null){
  
          const idusuario=idusuarioes;
          const cuenta=12345;
          const res9 = await fetch(
            baseURL+`/contabilidad/insertPrimerApertura/${rol}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                montoapertura,
                idusuario,
                cuenta
              }),
            }
          );
           const data9=await res9.json();
           console.log(data9)
           Swal.fire('Bien hecho!','apertura de caja registrado','success')
          window.location.replace('/dashboard')
        }else{
  
          const idcorte= data.idcortecaja;
  
          const res2 = await fetch(
            baseURL+`/contabilidad/editApertura/${rol}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              idcorte,
              montoapertura
            }),
          }
        );
        const data2 = await res2.json();
        console.log(data2.msg) 
        Swal.fire('Bien hecho!','apertura de caja registrado','success')
        window.location.replace('/dashboard')
        }
      }else{
          Swal.fire('Error!','checa el monto de apertura','error')
      }
    }

    useEffect(() => {
      datosdesdeInicio()
    }, [])

    return (
      <div className="container" id="layApertura">
        <div className="row d-flex justify-content-center">
          <div className="row col-12">
          <form>
            <div className="card d-flex" id="colors">
              <div className="row">
              <div className="col-md-8 mt-3">
                <h4>Apertura de caja</h4>
              </div>
              <div className="col-md-2 mt-3">
                <h5>{fechaactual}</h5>
              </div>
              </div>
              
            </div>
            
            <div className="card" id="colors">
              <div className="col-md-11">
                <h4>Saldo de apertura</h4> 
                  <input type="text" className="form-control" id="helpApertura" aria-describedby="helpApertura" value={montoapertura} onChange={(e)=>setMontoapertura(e.target.value)}/>
                    <div id="helpApertura" className="form-text">
                      {cantidadaperturavalid === 'false' ? (
                          <p className="text-danger">
                            Solo números , incluso con punto
                          </p>
                      ) : (
                          <p>Ingresa el monto de apertura</p>
                     )}
                    </div>            
              </div>
              <div className="col-md-4 col-12">
                <h6>Usuario: {empleado} ({rol1})</h6>
              </div>
            </div>

            <div className="d-flex justify-content-center">
              <div className="col-md-4 m-2" id="colors2">
                <h4>Saldo en caja:${saldocaja}</h4>
                {
                  saldocaja>0 ? <TrendingUpIcon id="icons" color="green"/>
                  : <TrendingDownIcon id="icons" color="red"/>
                }
              </div>
              <div className="col-md-4 m-2" id="colors2">
                <h4>Pérdidas y ganancias: ${gananciasperdidas}</h4>
                {
                  gananciasperdidas>0 ? <TrendingUpIcon id="icons" color="green"/>
                  : <TrendingDownIcon id="icons" color="red"/>
                }
              </div>
            </div>
            <div className="card">
              <div className="d-flex justify-content-center">
                <div className="col-md-6 col-12 m-2" id="colors2">
                  <h3>Resumen de cierre anterior:</h3>
                </div>
              </div>
              <div className="d-flex justify-content-center">
                <div className="col-md-4 col-12 m-2" id="colors2">
                  <h4>Efectivo: ${ventasefectivo}</h4>
                </div>
              </div>
              <div className="d-flex justify-content-center">
                <div className="col-md-4 col-12 m-2" id="colors2">
                  <h4>Tarjeta: ${ventastarjetas}</h4>
                </div>
              </div>
              <div className="d-flex justify-content-center">
                <div className="col-md-4 col-12 m-2" id="colors2">
                  <h4>Vales de despensa: ${ventasvales}</h4>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center my-5">
              <button type="submit" onClick={handleApertura} onMouseOver={handleValid} className="m-2 p-2 btn btn-primary">Abrir sesión</button>
            </div>
            </form>
          </div>
        </div>
      </div>
    );
}

export default AperturaCaja
