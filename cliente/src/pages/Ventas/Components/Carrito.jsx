import React, {useState,useEffect, useRef} from 'react'
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import PaymentIcon from '@mui/icons-material/Payment';
import { useHistory } from "react-router-dom";
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import axios from 'axios' //npm i 
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { useReactToPrint } from 'react-to-print';
import '../../../styles.scss';

const baseURL = process.env.REACT_APP_API_URL //npm i dotenv


export default function Carrito() {
    
  
    let history = useHistory()
    const rol = localStorage.getItem('rol')

    const [show, setShow] = useState(false);
    const [showticket, setShowTicket] = useState(false)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCloseTicket = () => setShowTicket(false);
    const handleShowTicket = () => setShowTicket(true);

    const[imagebinary, setImagebinary] = useState(null)
    const [productdata, setProductData] = useState([])
    const [complementdata, setComplementData] = useState([])
    const [multipledata, setMultipleData] = useState([])
    const [recibido, setRecibido] = useState(0)

    const [productverify, setProductVerify] = useState(null)
    const [ingredientverify, setIngredientVerify] = useState(null)   
    const [complementverify, setComplementVerify] = useState(null)
    const [ingredientcompverify, setIngredientCompVerify] = useState(null)
    const [modifierverify, setModifierVerify] = useState(null)

    const [total, setTotal] = useState(localStorage.getItem('Totalpagar'))
    const [nombre, setNombre] = useState('')

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
    });


    async function getNombre(){
        const {data} = await axios.get(baseURL+'http://localhost:5000/api/configuracion/getTemasEs'+`/${rol}`)
        setNombre(data.logo)
    }

    function getDatos(){
        if(localStorage["productdatas"]){
            setProductData(JSON.parse(localStorage["productdatas"]))
        }
        if(localStorage["complementdatas"]){
            setComplementData(JSON.parse(localStorage["complementdatas"]))
        }
        if(localStorage["multipledatas"]){
            setMultipleData(JSON.parse(localStorage["multipledatas"]))
        }
    }

    function getCurrentDate(){
        let today = new Date()
        let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        return `${date}`
    }
    
    function getCurrentHour(){
        let today = new Date()
        let time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
        return `${time}`
    }

    async function getImageCuenta(){
        const {data} = await axios.get(baseURL+'/sales/cuenta'+`/${rol}`)
        console.log("Imagen :", data.qrcuenta)
        if(data.qrcuenta===null){
            const resb = await fetch(
                baseURL+`/inventario/bringImgs/sin-imagen.jpg`+`/${rol}`
              );
              const datab = await resb.blob();
              var sauce= URL.createObjectURL(datab)
              setImagebinary(sauce)
          }else{
            const resb = await fetch(
                baseURL+`/inventario/bringImgs/${data.qrcuenta}`+`/${rol}`
            );
            const datab = await resb.blob();
            var sauce= URL.createObjectURL(datab)
            setImagebinary(sauce)
          }
    }

    function Consultas(){
        productdata.map(item =>(
            ConsultaCantidadesProductos(item.idproducto, item.cantidad),
            ConsultaCantidadesIngredientes(item.idproducto, item.cantidad)
        ))
        if (complementdata.length !== 0){
            complementdata.map(item =>(
                ConsultaCantidadesComplementos(item.id, item.cantidad),
                ConsultaCantidadesIngredientesComplementos(item.id, item.cantidad)
            ))
        }else{
            setComplementVerify(true)
            setIngredientCompVerify(true)
        }
        if (multipledata.length !== 0){
            multipledata.map(item=>(
                ConsultaCantidadesIngredientesModificadores(item.id, item.porcion)
            ))
        }else{
            setModifierVerify(true)
        }
               
    }

    

    function PagoEfectivo(pago){
        //Verifica la cantidad recibida del cliente
        if(recibido === 0 || recibido < localStorage.getItem('Totalpagar')){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El dinero recibido del cliente no es el adecuado. Porfavor verifica la cantidad'
              })
        }else{
            //Verifica las cantidades de productos
            if(productverify === false ){
                Swal.fire({
                    icon: 'error',
                    title: 'Producto agotado',
                    text: 'La venta no puede ser realizada. Revisa los inventarios de productos'
                  })
            }else if(ingredientverify === false || ingredientcompverify === false || modifierverify === false){
                Swal.fire({
                    icon: 'error',
                    title: 'Ingredientes agotados',
                    text: 'La venta no puede ser realizada. Revisa los inventarios de ingredientes'
                  })
            }else if (complementverify === false){
                Swal.fire({
                    icon: 'error',
                    title: 'Complementos agotados',
                    text: 'La venta no puede ser realizada. Revisa los inventarios de productos'
                  })
            }
            if (productverify === true && ingredientverify === true && ingredientcompverify === true && modifierverify === true && complementverify === true){
                Transaccion(pago)
            }  

            if (productverify === null || ingredientverify === null || ingredientcompverify === null || modifierverify === null || complementverify === null){
            let timerInterval
                Swal.fire({
                title: 'Verificación',
                html: 'No se han verificado las cantidades de los productos. Intentalo de nuevo',
                timer: 2000,
                timerProgressBar: true,
                didOpen: () => {
                    Swal.showLoading()     
                },
                willClose: () => {
                    clearInterval(timerInterval)
                }
                }).then((result) => {
                /* Read more about handling dismissals below */
                if (result.dismiss === Swal.DismissReason.timer) {
                    console.log('I was closed by the timer')
                }
                })
            }
        }
    }

    async function ConsultaCantidadesProductos(idproducto, cantidad){
        if(productdata.length !== 0){
            const {data} = await axios.get(baseURL+'/sales/verifyproduct'+`/${idproducto}`+`/${rol}`)
            //Se verifica la cantidad de productos
            if (data.cantidadproducto < cantidad){
                setProductVerify(false)
            }else{
                setProductVerify(true)
            }
        }
    }

    async function ConsultaCantidadesIngredientes(idproducto, cantidad){
        if(productdata.length !== 0){
            const {data} = await axios.get(baseURL+'/sales/verifyingredients'+`/${idproducto}`+`/${rol}`)
            if(data !== null){
                if (data.cantidadingrediente < cantidad){
                    setIngredientVerify(false)
                }else{
                    setIngredientVerify(true)
                }
            }else{
                setIngredientVerify(true)
            }
        }
    }

    async function ConsultaCantidadesComplementos(idcomplemento, cantidad){
        const {data} = await axios.get(baseURL+'/sales/verifycomplements'+`/${idcomplemento}`+`/${rol}`)
        if(data.cantidadproducto < cantidad){
            setComplementVerify(false)
        }else{
            setComplementVerify(true)
        }
    }

    async function ConsultaCantidadesIngredientesComplementos(idmodificador, cantidad){
            const {data} = await axios.get(baseURL+'/sales/verifycomplementsingredients'+`/${idmodificador}`+`/${rol}`)
            if(data !== null){
                if(data.cantidadingrediente < cantidad){
                    setIngredientCompVerify(false)
                }else{
                    setIngredientCompVerify(true)
                }  
            }else{
                setIngredientCompVerify(true)
            }
    }

    async function ConsultaCantidadesIngredientesModificadores(idopcion, cantidad){
            const {data} = await axios.get(baseURL+'/sales/verifymodifiersingredients'+`/${idopcion}`+`/${rol}`)
            if(data !== null){
                if(data.cantidadingrediente < cantidad){
                    setModifierVerify(false)
                }else{
                    setModifierVerify(true)
                }
        }else{
            setModifierVerify(true)
        }
    }


    async function Transaccion(pago){
        if(pago === 1){
            if(recibido === 0){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No has ingresado el dinero recibido!'
                })
            }else{
                if(productdata.length !== 0){
                    //productdata.map(item =>(
                    //    ConsultaCantidadesProductos(item.idproducto, item.cantidad)
                    //))

                    let tempventa = localStorage.getItem('Totalpagar')
                    let cambio = parseInt(recibido) - parseInt(tempventa) 

                    let idusuario = localStorage.getItem('userid')
                  
                    //Se agrega la venta como ticket de compra
                        addSale()
                    //Si hay productos en el carrito
                    if (Object.entries(productdata).length !== 0){
                        productdata.map(item =>(
                            updateProduct(idusuario, item.idproducto, item.cantidad, item.precioproducto, item.nombreproducto, item.nota, item.total)
                        ))
                        //Si hay complementos en el carrito 
                        if (Object.entries(complementdata).length !== 0){
                            complementdata.map(item =>(
                                updateComplement(idusuario, item.id, item.cantidad, item.nombre, item.precio, item.total)
                            ))
                            localStorage.removeItem("complementdatas")
                        }

                        //Si hay modificadores en el carrito 
                        if (Object.entries(multipledata).length !== 0){
                            multipledata.map(item =>(
                                updateModifier(idusuario, item.idmod, item.id, item.nombremodificador, item.nombre, item.precio, item.idingrediente, item.porcion)
                            ))
                            localStorage.removeItem("multipledatas")
                        }
                        localStorage.removeItem("productdatas")
                    }
                    
                    Swal.fire({
                        title: 'Venta realizada',
                        text: 'El cambio a entregar es: $'+`${cambio}`,
                        icon: 'success',
                        showDenyButton: true,
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Aceptar',
                        denyButtonText: 'Verificar Ticket',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            localStorage.setItem("Totalpagar",0)
                            history.push("/ventas");  
                            window.location.reload(true);
                        }else if (result.isDenied){
                            handleShowTicket()
                        }
                    })
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'El carrito está vacío!'
                    })
                }
            
            }
        }else{
            if(productdata.length !== 0){
                //productdata.map(item =>(
                //    ConsultaCantidadesProductos(item.idproducto, item.cantidad)
                //))

                let tempventa = localStorage.getItem('Totalpagar')
                let cambio = parseInt(recibido) - parseInt(tempventa) 

                let idusuario = localStorage.getItem('userid')
              
                //Se agrega la venta como ticket de compra
                    addSale()
                //Si hay productos en el carrito
                if (Object.entries(productdata).length !== 0){
                    productdata.map(item =>(
                        updateProduct(idusuario, item.idproducto, item.cantidad, item.precioproducto, item.nombreproducto, item.nota, item.total)
                    ))
                    //Si hay complementos en el carrito 
                    if (Object.entries(complementdata).length !== 0){
                        complementdata.map(item =>(
                            updateComplement(idusuario, item.id, item.cantidad, item.nombre, item.precio, item.total)
                        ))
                        localStorage.removeItem("complementdatas")
                    }

                    //Si hay modificadores en el carrito 
                    if (Object.entries(multipledata).length !== 0){
                        multipledata.map(item =>(
                            updateModifier(idusuario, item.idmod, item.id, item.nombremodificador, item.nombre, item.precio, item.idingrediente, item.porcion)
                        ))
                        localStorage.removeItem("multipledatas")
                    }
                    localStorage.removeItem("productdatas")
                }
                
                Swal.fire({
                    title: 'Venta realizada',
                    text: 'La transacción se deberá de ver reflejada en su cuenta de Mercado Pago',
                    icon: 'success',
                    showDenyButton: true,
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'Aceptar',
                    denyButtonText: 'Verificar Ticket',
                }).then((result) => {
                    if (result.isConfirmed) {
                        localStorage.setItem("Totalpagar",0)
                        history.push("/ventas");  
                        window.location.reload(true);
                    }else if (result.isDenied){
                        handleShowTicket()
                    }
                })
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'El carrito está vacío!'
                })
            }
        }

    }




    async function updateProduct(idusuario, idproducto, cantidad, precio, nombre, nota, total){
        const obj = {idusuario, idproducto, cantidad, nombre, nota, precio, total}
        //Modificar la cantidad del producto
        await axios.put(baseURL+'/sales/updateproduct'+`/${rol}`,obj)
        //Agregar detalles de la venta de productos
        await axios.post(baseURL+'/sales/addsaleproduct'+`/${rol}`, obj)

        //Rescata la porcion de cada ingrediente que utiliza el producto
        const {data} = await axios.get(baseURL+'/sales/verification/ingredient/portion'+`/${idproducto}`+`/${rol}`)
        
        //Si el producto tiene ingredientes le quita la cantidad utilizada
        if (data !== undefined){
        data.map(item =>(
            updateingredient(idproducto, item.porcion)
        ))
        }
    }

    async function updateModifier(idusuario, idmod, idop, nombremod, nombreop, precio, idingrediente, porcion){
        //Agregar detalles de la venta de modificadores
        const obj = {idusuario, idmod, idop, nombremod, nombreop, precio, idingrediente, porcion}
        await axios.post(baseURL+'/sales/addsalemodifier'+`/${rol}`,obj)
        await axios.put(baseURL+'/sales/modifier/updateingredient'+`/${rol}`,obj)
    }

    async function updateComplement(idusuario, idcomplemento, cantidad, nombre, precio, total){
        //Se obtiene el id del producto original
        const { data } = await axios.get(baseURL+'/sales/verification/complement'+`/${idcomplemento}`+`/${rol}`)
        let idproducto = data.idproductooriginal
        const obj = {idproducto, cantidad}
        
        //Modificar la cantidad del producto
        await axios.put(baseURL+'/sales/updateproduct'+`/${rol}`,obj)
        //Agregar detalles de la venta de complementos
        const objproduct = {idusuario, idcomplemento, cantidad, nombre, precio, total}
        await axios.post(baseURL+'/sales/addsalecomplement'+`/${rol}`, objproduct)
       
        //Rescata la porcion de cada ingrediente que utiliza el producto
        const {dataportion} = await axios.get(baseURL+'/verification/ingredient/portion'+`/${idproducto}`+`/${rol}`)
        
        //Si el complemento tiene ingredientes tambien quita la cantidad utilizada
        if (dataportion !== undefined){
            dataportion.map(item =>(
                updateingredient(idproducto, item.porcion)
            ))
        }

    }

    async function updateingredient(idproducto, porcion){
        console.log(porcion)
        console.log(idproducto)
        const obj = {porcion, idproducto}
        await axios.put(baseURL+'/sales/updateingredient'+`/${rol}`, obj)
    }


    async function addSale(){
        let fechaventa =getCurrentDate()
        let horaventa = getCurrentHour()
        let idusuario = localStorage.getItem('userid')
        let totalventa = localStorage.getItem('Totalpagar')
        let idcliente = 0
        let idpago = 1

        const obj = { idusuario, idcliente, idpago, totalventa , fechaventa, horaventa}
        const { data } = await axios.post(baseURL+'/sales/venta'+`/${rol}`, obj)

    }


    function LimpiarElemento(idcarrito){
        if(localStorage["productdatas"]){
            var temp = JSON.parse(localStorage["productdatas"])
        }
        console.log("Datos", temp)
        var indexproduct = productdata.findIndex((obj => obj.idcarrito == idcarrito))
        var restaventa = 0
            
        Swal.fire({
            title: '¿Estas seguro?',
            text: "Eliminarás el artículo del carrito",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, quiero eliminarlo!'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire(
                'Eliminado!',
                'El artículo ha sido eliminado.',
                'success'
              )
            //Busca el producto por indice del carrito y lo elimina
            if(indexproduct >= 0){
                restaventa += temp[indexproduct].total
                productdata.splice(indexproduct, 1)
            }
            //Recorre los arreglos, elimina los elementos que coincidan con el idcarrito
            complementdata.forEach(function(elemento, indice, array){
                if(elemento.idcarrito === idcarrito){
                    restaventa += complementdata[indice].total
                    complementdata.splice(indice, 1)
                }
            })

            multipledata.forEach(function(elemento, indice, array){
                if(elemento.idcarrito === idcarrito){
                    restaventa += multipledata[indice].precio
                    multipledata.splice(indice, 1)
                }
            })
       
            localStorage.removeItem("productdatas")
            localStorage.removeItem("complementdatas")
            localStorage.removeItem("multipledatas")

            localStorage["productdatas"] = JSON.stringify(productdata)
            localStorage["complementdatas"] = JSON.stringify(complementdata)
            localStorage["multipledatas"] = JSON.stringify(multipledata)
            
            console.log("Product:",productdata)

            var tempventa = localStorage.getItem('Totalpagar')
            var totalventa = parseInt(tempventa) - parseInt(restaventa)
            localStorage.setItem('Totalpagar', totalventa)
            setTotal(totalventa)

            history.push("/ventas")  
            }
          })
            

    }

    async function PagoTarjeta(pago){
        Swal.fire({
            title: '¿Se ha realizado la transacción',
            text: "Asegurate de que la transacción se haya realizado con éxito antes de continuar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, continua!'
          }).then((result) => {
            if (result.isConfirmed) {
                Transaccion(pago)
            }
          })
    }

    function LimpiarCarrito(){
        Swal.fire({
            title: '¿Estas seguro?',
            text: "Eliminarás todo el carrito de compras",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, quiero eliminarlo!'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire(
                'Eliminado!',
                'El carrito ha sido eliminado.',
                'success'
              )
                localStorage.removeItem("productdatas")
                localStorage.removeItem("complementdatas")
                localStorage.removeItem("multipledatas")
                localStorage["Totalpagar"] = 0
                window.location.reload(true);
            }
          })
        
    }

    useEffect(() =>{
        getNombre()
        getDatos()  
        getImageCuenta()
    }, [])

    
    const selectedComplement = (e, idcarrito) => {
        const value = e.target.value
        let cantidadanterior
        let nuevototal
        let precio
        let total
        var productdata = JSON.parse(localStorage["productdatas"])
        var indexproduct = JSON.parse(localStorage["productdatas"]).findIndex((obj => obj.idcarrito == idcarrito))

        //Se modifica la cantidad del producto que se venderá
        if(indexproduct >= 0){
            //Cantidad antes de cambiar
            cantidadanterior = productdata[indexproduct].cantidad
            //Se cambia la cantidad por el nuevo valor del input
            productdata[indexproduct].cantidad = parseInt(value)

            //Se guarda el total
            total = productdata[indexproduct].total

            //Rescata el total del carrito
            let cantidadcarrito = localStorage.getItem('Totalpagar')

            //Le resta la cantidad 
            cantidadcarrito = parseInt(cantidadcarrito) - parseInt(total)
        
            precio = productdata[indexproduct].precioproducto
            nuevototal = parseInt(precio) * parseInt(value)
            productdata[indexproduct].total = nuevototal
            cantidadcarrito = parseInt(cantidadcarrito) + nuevototal
            setTotal(cantidadcarrito)
            localStorage.setItem('Totalpagar', cantidadcarrito)
        }
        console.log(productdata)
        localStorage.removeItem("productdatas")
        localStorage["productdatas"] = JSON.stringify(productdata)
    }

    return (
        <div className="carrito" >
            <div className="card products-cart"> 
            {productdata.map(item =>(
                <div className="card">
                    <div className="row">
                        <div className="col-4" algin="center">
                            {item.nombreproducto}
                        </div>
                        <div className="col-3" align="center">
                            {complementdata.map(comp =>(
                                <div>
                                    {(item.idcarrito === comp.idcarrito) ?  
                                        <div className="cart-com-mod">
                                            <span className="cart-comp">{comp.nombre}</span>
                                        </div>
                                    : ''}
                                </div>     
                            ))}
                            {multipledata.map(mul =>(
                                <div>
                                {(item.idcarrito === mul.idcarrito) ?  
                                    <div className="cart-com-mod">
                                        <span className="cart-comp">{mul.nombre} {mul.cantidad}</span>
                                    </div>
                                : ''}
                            </div> 
                            ))}
                        </div>  
                        
                        <div className="col-4">
                            <DeleteForeverIcon className="icons delete-icon" onClick={LimpiarElemento.bind(this, item.idcarrito)}/>
                            <input type="number" className="product-cant-input" placeholder="1" min="1" max="10" defaultValue={item.cantidad} onChange={(e) => {selectedComplement(e, item.idcarrito)}}/>
                        </div>
                    </div>
                </div>  
            ))}
            </div>
            <div className="input-cart" onMouseOver={Consultas.bind(this)}>
                <div className="info-cobro">
                    <div className="total">
                        <span>Total</span>
                        <input type="text" value={total} disabled className="total-input"/>    
                    </div>
                    <div className="total">
                        <span>Recibido</span>
                        <input type="text" onChange={ e=> setRecibido(e.target.value)} className="total-input"/>    
                    </div>    
                </div>
                <div className="input-cobrar">
                    <button className="btn btn-primary btn-cobrar" onClick={PagoEfectivo.bind(this, 1)}><AttachMoneyIcon/>Cobrar</button>
                </div>
                <div className="input-cobrar">
                    <button className="btn btn-primary btn-cobrar" onClick={handleShow}><PaymentIcon/>Tarjeta</button>
                </div>
                <div className="input-cobrar">
                    <button className="btn btn-primary btn-cobrar" onClick={LimpiarCarrito.bind(this)}><CleaningServicesIcon/>Limpiar</button>
                </div>
            </div>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header>
                    <Modal.Title>Muestra el QR al cliente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <img src={imagebinary}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={PagoTarjeta.bind(this, 2)} >Aceptar Transacción </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showticket} onHide={handleCloseTicket} backdrop="static" keyboard={false}>
                <Modal.Header>
                    <Modal.Title>Ticket</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="ticket" ref={componentRef}>
                    <p className="centrado">{nombre}</p>
                    <hr/>
                    <p className="centrado">TICKET DE VENTA {getCurrentDate()} {getCurrentHour()}</p>
                    <hr/>
                        <table className="r-table">
                            <thead>
                                <tr>
                                    <th className="cantidad">CANT..........................PRODUCTO...........................PRECIO</th>

                                </tr>
                            </thead>
                            <tbody>
                            {productdata.map(item=>(
                                <div>
                                    <tr>
                                        <td className="cantidadtd">{item.cantidad}</td>
                                        <td className="productotd">{item.nombreproducto}</td>
                                        <td className="preciotd">${item.total}</td>
                                    </tr>
                                    {complementdata.map(com =>(
                                        (item.idcarrito === com.idcarrito) ? 
                                        <tr>
                                        <td className="cantidadtd">{com.cantidad}</td>
                                        <td className="productotd">{com.nombre}</td>
                                        <td className="preciotd">${com.precio}</td>
                                    </tr>
                                    : ''
                                    ))}
                                    {multipledata.map(mul =>(
                                        (item.idcarrito === mul.idcarrito) ? 
                                        <tr>
                                        <td className="cantidadtd"></td>
                                        <td className="productotd">{mul.nombre}</td>
                                        <td className="preciotd">${mul.precio}</td>
                                    </tr>
                                    : ''
                                    ))}
                                </div>
                                ))}
                                <tr className="totalticket">Total a pagar: ${total}</tr>
                            </tbody>
                        </table>
                        <p class="centrado">¡GRACIAS POR SU COMPRA!</p>
                    </div>
                   
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseTicket}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handlePrint}>Imprimir ticket </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}
