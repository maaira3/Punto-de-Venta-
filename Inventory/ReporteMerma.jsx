import React, {useState, useEffect} from 'react'
import Swal from 'sweetalert2'

const baseURL = process.env.REACT_APP_API_URL //npm i dotenv

function ReporteMerma() {

  const[esproducto, setEsproducto]=useState(3);
  const[actualproduct, setActualProduct]= useState('')
  const[actualingredient, setActualIngredient]= useState('')
  const[products, setProducts]=useState([])
  const[ingredients, setIngredients]= useState([])
  const[productcantidad, setProductcantidad]=useState('')
  const[productunidad, setProductunidad]=useState('')
  const[productcode, setProductCode]=useState('')
  const[productdescrip, setProductdescrip]=useState('')
  const[productname, setProductname]=useState('')
  const[productcost, setProductcost]= useState('')
  const[inicialstock, setInicialstock]= useState('')
  const[productdescripvalid, setProductdescripvalid]= useState(null)
  const[productcantidadvalid, setProductcantidadvalid]= useState(null)
  const[productunidadvalid, setProductunidadvalid]= useState(null)
  const[todosvalidos, setTodosvalidos]=useState(null);
  const [idusuarioes, setIdUsuarioEs] = useState(null)
  
  const rol = localStorage.getItem('rol')
  

  ///////////////Reiniciar los estados /////////////////////////////////////////////////////////

    const cleanstates=()=>{
      setProductcantidad('');
      setProductdescrip('');
      setProductunidad('');
      setProductcost('')
      setProductdescripvalid(null)
      setProductcantidadvalid(null)
      setProductunidadvalid(null)
      setTodosvalidos(null)
    }

  //////////////////////////////////////////////////////////////////////////////////////////////

  ///////Funciones para traer todos los productos/ingredientes//////////////////////////////////

  const handleShowAllMerca2= async (e)=>{

    const res = await fetch(
      baseURL+`/inventario/getInventario/${rol}/1`
    );
    const data = await res.json();
    setIngredients(data);
  }

  const handleShowAllMerca = async (e) => {
    
      const res = await fetch(
        baseURL+`/inventario/getInventario/${rol}/2`
      );
      const data = await res.json();
      setProducts(data);
    
  setIdUsuarioEs(localStorage.getItem('userid'))
  };

  useEffect(()=>{
    handleShowAllMerca();
    handleShowAllMerca2();
}, [])
  /////////////////////////////////////////////////////////////////////////////////////////////////////

  //////////////////Funciones que manejan la información del producto/ingrediente seleccionado//////////

  const handleActualProduct = async (actualproduct) => {
    setEsproducto(1);
    
    const res = await fetch(
      baseURL+`/inventario/getActualProduct/${rol}/${actualproduct}`
    );
    const data = await res.json();
    setProductunidad(data.idunidad);
    setProductCode(data.idproducto);
    setInicialstock(data.cantidadproducto)
    setProductname(data.nombreproducto);
    setProductcost(data.costoproducto)
  };

  const handleActualIngredient = async (actualingredient) =>{

    setEsproducto(2);

    const res = await fetch(
      baseURL+`/inventario/getActualIngredient/${rol}/${actualingredient}`
    );
    const data = await res.json();
    setProductunidad(data.idunidad);
    setProductCode(data.idingrediente);
    setInicialstock(data.cantidadingrediente)
    setProductname(data.nombreingrediente)
    setProductcost(data.costo)
  }
///////////////////////////////////////////////////////////////////////////////////////////////////////
const traduccionUnidades= () =>{
  var unidad='';
  if(productunidad===1)
          unidad='kg'
        else if(productunidad===2)
          unidad='gramos'
        else if(productunidad===3)
          unidad='Litros'
        else if(productunidad===4)
          unidad='ml'
        else unidad='unidades';
   return unidad;
}
/////////////////////////Función para hacer la inserción/////////////////////////////////////////////////

const handleinsert = async (e) =>{
    e.preventDefault();

    if(todosvalidos==='true' && inicialstock>=productcantidad){
      
        const res = await fetch(
          baseURL+`/inventario/mermaProducto/${rol}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              productcode,
              productdescrip,
              productcantidad,
              productname, 
              productunidad
            }),
          }
        );
        const data = await res.json();
        console.log(data);
        /////Si la merma es de un producto, que actualice el stock de ese producto//////
        if(esproducto===1){
        const stockParcial1= parseFloat(inicialstock)-parseFloat(productcantidad)
        const res2 = await fetch(
          baseURL+`/inventario/editProductMerma/${rol}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              productcode,
              stockParcial1
            }),
          }
        );
        const data2 = await res2.json();
        console.log(data2);
      }else{
        const stockParcial1= parseFloat(inicialstock)-parseFloat(productcantidad)
            const res = await fetch(
              baseURL+`/inventario/editIngredientMerma/${rol}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  productcode,
                  stockParcial1,
                }),
              }
            );
            const data = await res.json();
            console.log(data);
      }
        //////////////////////Insercion del movimiento de productos///////////////////////
        var totalinversion= parseFloat(productcost)* parseFloat(productcantidad)
        var unidad=traduccionUnidades();
        var descripcionmov=('Se perdieron '+productcantidad+unidad+ ' de ('+productname+')')
        var razon='merma'
        var tipo='salidaInventario'
        const res9 = await fetch(
          baseURL+`/inventario/insertInventarioMovimiento/${rol}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              totalinversion,
              descripcionmov,
              razon,
              tipo,
              idusuarioes,
            }),
          }
        );
         const data9=await res9.json();
         console.log(data9)

        cleanstates();
        Swal.fire('Bien!','la merma se ha reportado satisfacoriamente','success')
      }else if(todosvalidos!=='true'){
        Swal.fire('Error','No se reportó la merma, revisa los campos que llenaste','warning')
      }
      else{
        Swal.fire('Error','No tienes tanta cantidad de este producto','warning')
      }
      
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////Código para las validaciones///////////////////////////////////////////////////

const validacion = () => {
  setTodosvalidos("true");
  if (expresiones.numerosfloat.test(productcantidad)) {
    setProductcantidadvalid("true");
  } else {
    setProductcantidadvalid("false");
    setTodosvalidos("false");
  }
  if (expresiones.nombre.test(productdescrip)) {
    setProductdescripvalid("true");
  } else {
    setProductdescripvalid("false");
    setTodosvalidos("false");
  }
  if (expresiones.codigo.test(productunidad)) {
    setProductunidadvalid("true");
  } else {
    setProductunidadvalid("false");
    setTodosvalidos("false");
  }
};
const expresiones = {
	nombre: /^[a-zA-ZÀ-ÿ0-9\s,]{1,40}$/, // Letras y espacios, pueden llevar acentos.
  codigo:/^[a-zA-Z0-9]{1,40}$/,   //mayusculas, minusculas y numeros
	numerosfloat:/^[0-9.]{1,20}$/, // 1 a 20 digitos con punto.
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
    return (
      <div className="report">
        <div className="container" id="colors">
          <div className="row d-flex justify-content-center">
            <h4 className="card p-3" id="colors2">
              Llene el formulario para reportar la merma:
            </h4>
            <form className="card mt-4 row">
            <div className="row " id="colors2">
              <h6>Selecciona un producto o ingrediente!</h6>
              <div className="card col-md-4 p-3" style={esproducto===1 ? {background: '#CCFFC0'}: {background: 'white'}}>
                <p className="mb-0">Productos:</p>
                <select
                  className="form-select"
                  id="nombrePedir"
                  aria-label="Floating label select example"
                  onChange={(e) => setActualProduct(e.target.value)}
                  onClick={(e) => handleActualProduct(e.target.value)}
                >
                  {products.map((product) => (
                    <option value={product.idproducto} key={product.idproducto}>
                      {product.nombreproducto}
                    </option>
                  ))}
                </select>
              </div>

              <div className="card col-md-4 offset-md-3 p-3" style={esproducto===2 ? {background: '#CCFFC0'}: {background: 'white'}}>
                <p className="mb-0">Ingredientes:</p>
                <select
                  className="form-select"
                  id="nombrePedir"
                  aria-label="Floating label select example"
                  onChange={(e) => setActualIngredient(e.target.value)}
                  onClick={(e) => handleActualIngredient(e.target.value)}
                >
                  {ingredients.map((ingredient) => (
                    <option
                      value={ingredient.idingrediente}
                      key={ingredient.idingrediente}
                    >
                      {ingredient.nombreingrediente}
                    </option>
                  ))}
                </select>
              </div>
            </div>
                    <div className="row">
              <div className="card mb-3 col-md-4 my-3">
                <label htmlFor="exampleInputCantidad1" className="form-label">
                  Cantidad de pérdida:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleInputCantidad1"
                  aria-describedby="QuantityHelp"
                  onChange={(e)=>setProductcantidad(e.target.value)}
                  value={productcantidad}
                />
                <div id="QuantityHelp" className="form-text">
                      {(productcantidadvalid)==='false' ? <p className="text-danger">Mínimo 1 caracter, y solo números</p> : <p>Bien</p> }
                </div>
              </div>

              <div className="card col-md-4 offset-md-3 my-3">
                <label htmlFor="exampleInputUnidad1" className="form-label">
                  Unidad:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleInputUnidad1"
                  aria-describedby="UnidadHelp"
                  disabled
                  value={(productunidad===1) ? "Kg" : (productunidad===2) ? "gramos" : (productunidad===3) ? "litros" : (productunidad===4) ? "mililitros" : (productunidad===5) ? "unidad" : "desconocido"}
          
                />
               
                <div id="UnidadHelp" className="form-text">
                      {(productunidadvalid)==='false' ? <p className="text-danger">Selecciona un producto para hacer una merma</p> : <p>Bien</p> }
                </div>
              </div>
              </div>
                    <div className="card col-md-11">
              <p className="mb-0 mt-3">Descripción:</p>
              <div className="form-floating my-3 col-md-12">
                <textarea
                  className="form-control"
                  aria-describedby="descripHelp"
                  id="floatingTextarea2"
                  style={{ height: "100px" }}
                  onChange={(e)=>setProductdescrip(e.target.value)}
                  value={productdescrip}
                />
                <label htmlFor="floatingTextarea2">
                  Cómo se dió la pérdida de mercancia?
                </label>
                <div id="descripHelp" className="form-text">
                  {(productdescripvalid)==='false' ? <p className="text-danger">Solo letras y números, no caracteres raros</p> : <p>Bien</p> }
                </div>
              </div>
              </div>
              <div className="d-flex justify-content-center">
                <div className="mx-2 my-4">
                  <button type="submit" className="btn btn-primary" onMouseOver={validacion} onClick={handleinsert}>
                    Enviar
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        
      </div>
    );
}

export default ReporteMerma
