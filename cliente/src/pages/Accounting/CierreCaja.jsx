import React, {useState} from 'react'
import PacmanLoader from "react-spinners/PacmanLoader";
import Swal from 'sweetalert2'

function CierreCaja() {

  const [billmil, setMil] = useState(0);
  const [billquinientos, setQuinientos] = useState(0);
  const [billdoscientos, setDoscientos] = useState(0);
  const [billcien, setCien] = useState(0);
  const [billcincuenta, setCincuenta] = useState(0);
  const [billveinte, setVeinte] = useState(0);
  const [billdiez, setDiez] = useState(0);
  const [billcinco, setCinco] = useState(0);
  const [billdos, setDos] = useState(0);
  const [billuno, setUno] = useState(0);
  const [cincuentacent, setCincuentacent] = useState(0);
  const [diezcent, setDiezcent] = useState(0);
  const [montotarjeta, setMontotarjeta] = useState(0);
  const [montovales, setMontovales] = useState(0);
  const [recuento, setRecuento] = useState(0);
  const [fondodecambio, setFondodecambio]= useState(0);
  const [totalrecaudado, setTotalrecaudado]= useState(0);
  const [montotarjetavalid, setMontotarjetavalid]= useState(0)
  const [montovalesvalid, setMontovalesvalid]= useState(0)
  const [billmilvalid, setBillmilvalid]= useState(null)
  const [billquinientosvalid, setBillquinientosvalid]= useState(null)
  const [billdoscientosvalid, setBilldoscientosvalid]= useState(null)
  const [billcienvalid, setBillcienvalid]= useState(null)
  const [billcincuentavalid, setBillcincuentavalid]= useState(null)
  const [billveintevalid, setBillveintevalid]= useState(null)
  const [coindiezvalid, setCoindiezvalid]= useState(null)
  const [coincincovalid, setCoincincovalid]= useState(null)
  const [coindosvalid, setCoindosvalid]= useState(null)
  const [coinunovalid, setCoinunovalid]= useState(null)
  const [coincincuentacentvalid, setCoincincuentacentvalid]= useState(null)
  const [coindiezcentvalid, setCoindiezcentvalid]= useState(null)
  const [fondodecambiovalid, setFondodecambiovalid]= useState(null)
  const [todosvalidos, setTodosvalidos]= useState(null)
  const[loading, setLoading]= useState(false)

  const baseURL = process.env.REACT_APP_API_URL //npm i dotenv
  const rol = localStorage.getItem('rol')

  const handleTotalParcial = () =>{

    setRecuento(parseFloat(billmil*1000)+ parseFloat(billquinientos*500)
                +parseFloat(billdoscientos*200)+ parseFloat(billcien*100)
                +parseFloat(billcincuenta*50)+ parseFloat(billveinte*20)
                +parseFloat(billdiez*10)+ parseFloat(billcinco*5)
                +parseFloat(billdos*2)+ parseFloat(billuno*1)
                +parseFloat(cincuentacent*.50)+ parseFloat(diezcent*.10)
                +parseFloat(montotarjeta)+ parseFloat(montovales))
  }

  const handleTotalRecaudado = () =>{
      setTotalrecaudado(parseFloat(recuento)- parseFloat(fondodecambio))
  }

  const insertCierre= async (e) =>{
    e.preventDefault()

    ///////////Variables de sesión/////////////////////
    const user = localStorage.getItem("user")

        const res222 = await fetch(
          baseURL+`/accesibilidad/getIdUsuario/${rol}/${user}`
        );
        const data222 = await res222.json();

        const idusuarioes= data222.idusuario;
    ////////////////////////////////////////////////////

    if(todosvalidos==='true'){
      setLoading(true)
        console.log('la inserción se hará')

        var cuenta='12345';
        var idusuario=idusuarioes;
        const res = await fetch(
          baseURL+`/contabilidad/insertCierre/${rol}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              idusuario,
              cuenta,
              totalrecaudado,
              recuento,
              fondodecambio
            }),
          }
        );
        const data=await res.json();
        setLoading(false)
        Swal.fire('Bien hecho!',data.msg,'success')
        window.location.replace('/ReporteCierre')
    }else{
         Swal.fire('Error!','revisa los campos que llenaste','error')
    }
  }

/////////////Funciones para la validacion de los campos ///////////////////////////
const validacion = () => {
  handleTotalRecaudado()

  setTodosvalidos("true");
  if (expresiones.numerosfloat.test(montotarjeta)) {
    setMontotarjetavalid("true");
  } else {
    setMontotarjetavalid("false");
    setTodosvalidos("false");
  }
  if (expresiones.numerosfloat.test(montovales)) {
    setMontovalesvalid("true");
  } else {
    setMontovalesvalid("false");
    setTodosvalidos("false");
  }
  if (expresiones.numerosfloat.test(billmil)) {
    setBillmilvalid("true");
  } else {
    setBillmilvalid("false");
    setTodosvalidos("false");
  }
  if (expresiones.numerosfloat.test(billquinientos)) {
    setBillquinientosvalid("true");
  } else {
    setBillquinientosvalid("false");
    setTodosvalidos("false");
  }
  if (expresiones.numerosfloat.test(billdoscientos)) {
    setBilldoscientosvalid("true");
  } else {
    setBilldoscientosvalid("false");
    setTodosvalidos("false");
  }
  if (expresiones.numerosfloat.test(billcien)) {
    setBillcienvalid("true");
  } else {
    setBillcienvalid("false");
    setTodosvalidos("false");
  }
  if (expresiones.numerosfloat.test(billcincuenta)) {
    setBillcincuentavalid("true");
  } else {
    setBillcincuentavalid("false");
    setTodosvalidos("false");
  }
  if (expresiones.numerosfloat.test(billveinte)) {
    setBillveintevalid("true");
  } else {
    setBillveintevalid("false");
    setTodosvalidos("false");
  }
  if (expresiones.numerosfloat.test(billdiez)) {
    setCoindiezvalid("true");
  } else {
    setCoindiezvalid("false");
    setTodosvalidos("false");
  }
  if (expresiones.numerosfloat.test(billcinco)) {
    setCoincincovalid("true");
  } else {
    setCoincincovalid("false");
    setTodosvalidos("false");
  }
  if (expresiones.numerosfloat.test(billdos)) {
    setCoindosvalid("true");
  } else {
    setCoindosvalid("false");
    setTodosvalidos("false");
  }
  if (expresiones.numerosfloat.test(billuno)) {
    setCoinunovalid("true");
  } else {
    setCoinunovalid("false");
    setTodosvalidos("false");
  }
  if (expresiones.numerosfloat.test(cincuentacent)) {
    setCoincincuentacentvalid("true");
  } else {
    setCoincincuentacentvalid("false");
    setTodosvalidos("false");
  }
  if (expresiones.numerosfloat.test(diezcent)) {
    setCoindiezcentvalid("true");
  } else {
    setCoindiezcentvalid("false");
    setTodosvalidos("false");
  }
  if (expresiones.numerosfloat.test(fondodecambio)) {
    setFondodecambiovalid("true");
  } else {
    setFondodecambiovalid("false");
    setTodosvalidos("false");
  }
};
const expresiones = {
  numerosfloat: /^[0-9.]{1,20}$/, // 1 a 20 digitos con punto.
};
///////////////////////////////////////////////////////////////////////////////


    return (
      <div className="contenedor">
        {
          (loading===true) ? 
          <div className="d-flex justify-content-center align-items-center" id="cargascreen">
              <div>
                  <PacmanLoader size={30} color={"#123adc"} loading={loading}  />
              </div>
          </div> 
          :
      <div className="row">
        <div className="m-1">
          <h3>Recuento de Tarjetas, N° de Billetes y N° de Tarjetas</h3>
        </div>

        <div className="row d-flex justify-content-center">
          <div className="mb-3 col-md-4 mt-2">
            <label htmlFor="P1" className="form-label">
              Tarjetas:
            </label>
            <input type="text" className="form-control" value={montotarjeta} onChange={(e)=>setMontotarjeta(e.target.value)} id="P1" />
            <div id="P1" className="form-text">
                  { montotarjetavalid=== "false" ? (<p className="text-danger">Solo números, incluso con punto</p>
                  ) : (<p>Teclea el monto</p>)}
            </div>
          </div>

          <div className="mb-3 col-md-4 offset-md-1 mt-2">
            <label htmlFor="P2" className="form-label">
              Cupones:
            </label>
            <input type="text" className="form-control" value={montovales} onChange={(e)=>setMontovales(e.target.value)} id="P2" />
            <div id="P2" className="form-text">
                  { montovalesvalid=== "false" ? (<p className="text-danger">Solo números, incluso con punto</p>
                  ) : (<p>Teclea el monto</p>)}
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center">
          <div className="mb-3 col-md-4 mt-2">
            <label htmlFor="P3" className="form-label">
              $1000:
            </label>
            <input type="text" className="form-control" value={billmil} onChange={(e)=>setMil(e.target.value)} id="P3" />
            <div id="P3" className="form-text">
                  { billmilvalid=== "false" ? (<p className="text-danger">Solo números, incluso con punto</p>
                  ) : (<p>Número de billetes</p>)}
            </div>
          </div>

          <div className="mb-3 col-md-4 offset-md-1 mt-2">
            <label htmlFor="P4" className="form-label">
              $500:
            </label>
            <input type="text" className="form-control" value={billquinientos} onChange={(e)=>setQuinientos(e.target.value)} id="P4" />
            <div id="P4" className="form-text">
                  { billquinientosvalid=== "false" ? (<p className="text-danger">Solo números, incluso con punto</p>
                  ) : (<p>Número de billetes</p>)}
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center">
          <div className="mb-3 col-md-4 mt-2">
            <label htmlFor="P5" className="form-label">
              $200:
            </label>
            <input type="text" className="form-control" value={billdoscientos} onChange={(e)=>setDoscientos(e.target.value)} id="P5" />
            <div id="P5" className="form-text">
                  { billdoscientosvalid=== "false" ? (<p className="text-danger">Solo números, incluso con punto</p>
                  ) : (<p>Número de billetes</p>)}
            </div>
          </div>

          <div className="mb-3 col-md-4 offset-md-1 mt-2">
            <label htmlFor="P6" className="form-label">
              $100:
            </label>
            <input type="text" className="form-control" value={billcien} onChange={(e)=>setCien(e.target.value)} id="P6" />
            <div id="P6" className="form-text">
                  { billcienvalid=== "false" ? (<p className="text-danger">Solo números, incluso con punto</p>
                  ) : (<p>Número de billetes</p>)}
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center">
          <div className="mb-3 col-md-4 mt-2">
            <label htmlFor="P7" className="form-label">
              $50:
            </label>
            <input type="text" className="form-control" value={billcincuenta} onChange={(e)=>setCincuenta(e.target.value)}  id="P7" />
            <div id="P7" className="form-text">
                  { billcincuentavalid=== "false" ? (<p className="text-danger">Solo números, incluso con punto</p>
                  ) : (<p>Número de billetes</p>)}
            </div>
          </div>

          <div className="mb-3 col-md-4 offset-md-1 mt-2">
            <label htmlFor="P8" className="form-label">
              $20:
            </label>
            <input type="text" className="form-control" id="P8" value={billveinte} onChange={(e)=>setVeinte(e.target.value)} />
            <div id="P8" className="form-text">
                  { billveintevalid=== "false" ? (<p className="text-danger">Solo números, incluso con punto</p>
                  ) : (<p>Número de billetes</p>)}
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center">
          <div className="mb-3 col-md-4 mt-2">
            <label htmlFor="P9" className="form-label">
              $10:
            </label>
            <input type="text" className="form-control" value={billdiez} onChange={(e)=>setDiez(e.target.value)} id="P9" />
            <div id="P9" className="form-text">
                  { coindiezvalid=== "false" ? (<p className="text-danger">Solo números, incluso con punto</p>
                  ) : (<p>Número de monedas</p>)}
            </div>
          </div>

          <div className="mb-3 col-md-4 offset-md-1 mt-2">
            <label htmlFor="P10" className="form-label">
              $5:
            </label>
            <input type="text" className="form-control" value={billcinco} onChange={(e)=>setCinco(e.target.value)} id="P10" />
            <div id="P10" className="form-text">
                  { coincincovalid=== "false" ? (<p className="text-danger">Solo números, incluso con punto</p>
                  ) : (<p>Número de monedas</p>)}
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center">
          <div className="mb-3 col-md-4 mt-2">
            <label htmlFor="P11" className="form-label">
              $2:
            </label>
            <input type="text" className="form-control" id="P11" value={billdos} onChange={(e)=>setDos(e.target.value)} />
            <div id="P11" className="form-text">
                  { coindosvalid=== "false" ? (<p className="text-danger">Solo números, incluso con punto</p>
                  ) : (<p>Número de monedas</p>)}
            </div>
          </div>

          <div className="mb-3 col-md-4 offset-md-1 mt-2">
            <label htmlFor="P12" className="form-label">
              $1:
            </label>
            <input type="text" className="form-control" id="P12" value={billuno} onChange={(e)=>setUno(e.target.value)}/>
            <div id="P12" className="form-text">
                  { coinunovalid=== "false" ? (<p className="text-danger">Solo números, incluso con punto</p>
                  ) : (<p>Número de monedas</p>)}
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center">
          <div className="mb-3 col-md-4 mt-2">
            <label htmlFor="P13" className="form-label">
              50cent:
            </label>
            <input type="text" className="form-control" id="P13" value={cincuentacent} onChange={(e)=>setCincuentacent(e.target.value)}/>
            <div id="P13" className="form-text">
                  { coincincuentacentvalid=== "false" ? (<p className="text-danger">Solo números, incluso con punto</p>
                  ) : (<p>Número de monedas</p>)}
            </div>
          </div>

          <div className="mb-3 col-md-4 offset-md-1 mt-2">
            <label htmlFor="P14" className="form-label">
              10cent:
            </label>
            <input type="text" className="form-control" id="P14" value={diezcent} onChange={(e)=>setDiezcent(e.target.value)} />
            <div id="P14" className="form-text">
                  { coindiezcentvalid=== "false" ? (<p className="text-danger">Solo números, incluso con punto</p>
                  ) : (<p>Número de monedas</p>)}
            </div>
          </div>
        </div>

        <h6 className="p-2">Verifica el recuento</h6>

        <div className="d-flex justify-content-center">
          <div className="mb-3 col-md-4 mt-2">
            <label htmlFor="P14" className="form-label">
              Recuento:
            </label>
            <input type="text" className="form-control" readOnly value={recuento} onClick={handleTotalParcial} id="P14" />
            <div id="P14" className="form-text">Da click sobre este campo</div>
          </div>

          <div className="mb-3 col-md-4 offset-md-1 mt-2">
            <label htmlFor="P15" className="form-label">
              Fondo de cambio:
            </label>
            <input type="text" className="form-control" value={fondodecambio} onChange={(e)=>setFondodecambio(e.target.value)} id="P15" />
            <div id="P9" className="form-text">
                  { fondodecambiovalid=== "false" ? (<p className="text-danger">Solo números, incluso con punto</p>
                  ) : (<p>Número de monedas</p>)}
            </div>
          </div>
        </div>
        <h6 className="p-2">Verifica el total</h6>
        <div className="d-flex justify-content-around">
          <div className="mb-3 col-md-4 mt-2">
            <label htmlFor="P16" className="form-label">
              Total recaudado:
            </label>
            <input type="text" className="form-control" readOnly  value={totalrecaudado} onClick={handleTotalRecaudado} id="P16" />
            <div id="P16" className="form-text">Da click sobre este campo</div>
          </div>

          <div className="mx-2 my-4">
                <button type="submit" className="btn btn-primary" onMouseOver={validacion} onClick={insertCierre}>
                  Finalizar cierre
                </button>
          </div>
        </div>     
      </div>
}
      </div>
    );
}

export default CierreCaja
