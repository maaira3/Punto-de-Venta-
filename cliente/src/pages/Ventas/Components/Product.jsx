import React, {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import Header from './Header'
import SearchIcon from '@mui/icons-material/Search'
import axios from 'axios'
import Carrito from './Carrito'
import { useHistory } from "react-router-dom";

    const dataModifier = []
    const dataMultiple = []
    const dataComplement = []
    const data = []
    var totalventa = 0

    const baseURL = process.env.REACT_APP_API_URL //npm i dotenv

export default function Product() {

    let history = useHistory();
    const params = useParams();

    const rol = localStorage.getItem('rol')

    const [productName, setProductName] = useState('')
    const [productDescr, setProductDescr] = useState('')
    const [productPrice, setProductPrice] = useState('')
    const[imagebinary, setImagebinary] = useState(null)
    const [cant, setCant] = useState(1)
    const [nota, setNota] = useState('')

    const [obligatorycomp, setObligatoryComp] = useState(0)


    const [complementlist, setComplementList] = useState([])
    const [modifierlist, setModifierList] = useState([])
    const [optionlist, setOptionList] = useState([])


    
    async function getProduct(){
        const {data} = await axios.get(baseURL+'/getproducts'+`/${params.id}`+`/${rol}`)
        setProductName(data.nombreproducto)
        setProductDescr(data.descripcionproducto)
        setProductPrice(data.precioproducto)

        var imgblob= data.imagebproducto;
        if(imgblob===null){
            const resb = await fetch(
                baseURL+`/inventario/bringImgs/sin-imagen.jpg`+`/${rol}`
              );
              const datab = await resb.blob();
              var sauce= URL.createObjectURL(datab)
              setImagebinary(sauce)
          }else{
            const resb = await fetch(
                baseURL+`/inventario/bringImgs/${imgblob}`+`/${rol}`
            );
            const datab = await resb.blob();
            var sauce= URL.createObjectURL(datab)
            setImagebinary(sauce)
          }

    }
    
    async function getListComplements(){
        const {data} = await axios.get('http://localhost:5000/api/complements'+`/${params.id}`+`/${rol}`)
        setComplementList(data)
    }

    async function getListModifiers(){
        const {data} = await axios.get(baseURL+'/modifiers'+`/${params.id}`+`/${rol}`)
        setModifierList(data)
        modifierlist.map(item =>(
            (item.obligatorio === true) ? setObligatoryComp(obligatorycomp + 1) : ''
        ))
         

    }

 
    async function getListOptions(idmodificador){
        const {data} = await axios.get(baseURL+'/options'+`/${idmodificador}`+`/${rol}`)
        setOptionList(data)
        console.log(dataMultiple)
    } 

    const selectedRadio = (e, idmod, nombremod, id, name, price, ingrediente, porcion) => {
        var length = ''
        length = dataMultiple.filter(p => p.idmod === idmod).length 

        //Si es un modificador nuevo
        if (length === 0){
            totalventa += price
            dataMultiple.push({idcarrito: '', idproducto: params.id, idmod: idmod, nombremodificador: nombremod, id: id, nombre: name, precio: price, idingrediente: ingrediente, porcion: porcion})
        //Si es un modificador que ya existe
        }else{
            var index = dataMultiple.findIndex((obj => obj.idmod === idmod))
            console.log("Indice:", index)
            //Sobreescribe la opcion seleccionada
            if(index >= 0){
                totalventa -= dataMultiple[index].precio 
                dataMultiple[index].precio = price
                dataMultiple[index].id = id
                dataMultiple[index].nombre = name
                totalventa += price
                console.log("Elegir otra opcion:", dataMultiple) 
            }else{
                totalventa += price
                dataMultiple.push({idcarrito: '', idproducto: params.id, idmod: idmod, nombremodificador: nombremod, id: id, nombre: name, precio: price, idingrediente: ingrediente, porcion: porcion})
            }          
        }
        
    };

    const selectedComplement = (e, id, name, price) => {
        const value = e.target.value
        
        var length = ''
            //Si el valor es diferente de 0
            if (value !== '0'){
                length = dataComplement.filter(p => p.id == id).length 
                //Si no existe en el arreglo se hace un push
                if (length === 0){
                    totalventa += price * value
                    console.log(value)
                    dataComplement.push({idcarrito: '', idproducto: params.id, id: id, nombre: name, precio: price, cantidad: parseInt(value), total: price * parseInt(value)}) 
                //Si existe en el arreglo
                }else{
                    var index = dataComplement.findIndex((obj => obj.id == id))
                    //Encuentra el indice y cambia el precio
                    if(index >= 0){
                        totalventa -= dataComplement[index].total
                        dataComplement[index].total = price * value
                        dataComplement[index].cantidad = parseInt(value)
                        totalventa += price * value
                    }else{
                        dataComplement.push({idcarrito: '', idproducto: params.id, id: id, nombre: name, precio: price, cantidad: parseInt(value), total: price * parseInt(value)})
                    }          
                }
          }else{
            var index = dataComplement.findIndex((obj => obj.id == id))
            console.log("Entro")
            if(index >= 0){
                dataComplement.splice(index, 1)
            }
          }
          console.log("Complementos", dataComplement)
    }
          
    
    function addCart(){
        if(localStorage["productdatas"]){
            //Guarda los datos de localstorage en temp
            var ptemp = JSON.parse(localStorage["productdatas"])
            var length = ''
            length = ptemp.length 
            var carrito = length + 1
            //Push a data con los datos en localstorage
            ptemp.map(item => (
                data.push({idcarrito: item.idcarrito, idproducto: item.idproducto, nombreproducto: item.nombreproducto, precioproducto: item.precioproducto, cantidad: item.cantidad, total: item.total, nota: item.nota})
            ))

            //Push a data para guardar los valores
            let totalproducto = parseInt(productPrice) * parseInt(cant)
            totalventa += parseInt(productPrice) * parseInt(cant)
            data.push({idcarrito: carrito, idproducto: params.id, nombreproducto: productName, precioproducto: productPrice, cantidad: parseInt(cant), total: totalproducto, nota: nota})
            console.log('Primer push:',data)

            //Se guarda data en localstore mydatas
            localStorage["productdatas"] = JSON.stringify(data)
        }else{
            carrito = 1
            //Push a data para guardar los valores
            let totalproducto = parseInt(productPrice) * parseInt(cant)
            totalventa += parseInt(productPrice) * parseInt(cant)
            data.push({idcarrito: carrito, idproducto: params.id, nombreproducto: productName, precioproducto: productPrice, cantidad: parseInt(cant), total: totalproducto, nota: nota})
            console.log('Push localstore limpio:',data)

            //Se guarda data en localstore mydatas
            localStorage["productdatas"] = JSON.stringify(data)
        }
        console.log(JSON.parse(localStorage["productdatas"]))

        //Se guarda el total a pagar en el carrito
        var tempventa = localStorage.getItem('Totalpagar')
        totalventa += parseInt(tempventa)
        localStorage.setItem('Totalpagar', totalventa)

        if(dataComplement.length !== 0){
            var index = 0
            dataComplement.map(item =>(
                (item.idcarrito === '') ? 
                    item.idcarrito = carrito
                : ''
            ))
            if(localStorage["complementdatas"]){
                //Guarda los datos de localstorage en temp
                var ctemp = JSON.parse(localStorage["complementdatas"])
                var length = ''
                length = ctemp.length                 
                //Push a data con los datos en localstorage
                ctemp.map(item => (
                    dataComplement.push({idcarrito: item.idcarrito, idproducto: item.idproducto, id: item.id, nombre: item.nombre, precio: item.precio, cantidad: item.cantidad, total: item.total})
                ))
                //Se guarda data en localstore mydatas
                localStorage["complementdatas"] = JSON.stringify(dataComplement)
            }else{
                //Se guarda data en localstore mydatas
                localStorage["complementdatas"] = JSON.stringify(dataComplement)
            }
        }

        if(dataMultiple.length !== 0){
            var index = 0
            dataMultiple.map(item =>(
                (item.idcarrito === '') ? 
                    item.idcarrito = carrito
                : ''
            ))
            if(localStorage["multipledatas"]){
                //Guarda los datos de localstorage en temp
                var multemp = JSON.parse(localStorage["multipledatas"])

                var length = ''
                length = multemp.length                 
                //Push a data con los datos en localstorage
                multemp.map(item => (
                    dataMultiple.push({idcarrito: item.idcarrito, idproducto: item.idproducto, idmod: item.idmod, nombremodificador: item.nombremodificador, id: item.id, nombre: item.nombre, precio: item.precio, idingrediente: item.idingrediente, porcion: item.porcion})
                ))
                //Se guarda data en localstore mydatas
                localStorage["multipledatas"] = JSON.stringify(dataMultiple)
            }else{
                //Se guarda data en localstore mydatas
                localStorage["multipledatas"] = JSON.stringify(dataMultiple)
            }
        }
        history.push("/ventas");  
        window.location.reload(true);
           

    }

    useEffect(() =>{
        getProduct()
        getListComplements()
        getListModifiers()
        
    }, [])

    

    return (
        <div className="product">
            
            <Header/>
            <div className="search-bar">
                <div className="card search-card">
                    <div class="row">  
                        <div class="col-11">
                            <input type="text" placeholder="Buscar" className="search-input" />
                        </div>
                        <div class="col-1"><button className="btn btn-primary"><SearchIcon/></button></div>
                    </div>
                </div> 
            </div>
            <div className="row">
                <div className="col-7">
                    <div className="card image-card">
                        <img src={imagebinary} className="product-image" />
                    </div>
                    <div className="card">
                        <span className="product-name">{productName} | Precio: ${productPrice}</span>
                        <span className="product-descr">{productDescr}</span>
                        <hr/>
                        {(complementlist.length === 0) ? '' : 
                        <div>
                            <span className="product-section">Complementos a elegir:</span>
                            {complementlist.map(item =>(
                            <div className="row">
                                <br/>
                                <div className="col-3">
                                    <span className="product-details-name">{item.nombrecomplemento}</span>
                                </div>
                                <div className="col-5">
                                    <span className="product-descr">{item.descripcioncomplemento}</span>
                                </div>
                                <div className="col-4">
                                    <span className="product-price">+MX ${item.preciocomplemento}</span>
                                    <input type="number" className="product-cant-input" placeholder="0" min="0" max="5" onChange={(e) => {selectedComplement(e, item.idcomplemento, item.nombrecomplemento, item.preciocomplemento);}}/>                
                                </div>
                                <br/><br/>
                            </div>
                        ))}
                        </div>
                        }
                        {(modifierlist.length === 0) ? '' : 
                        <div>
                            {modifierlist.map(item =>(
                                (item.obligatorio === true) ? 
                                    <div>
                                        <div className="row">
                                            <br/>
                                            <div className="col-8">
                                            <span className="product-details-name" onClick={getListOptions.bind(this, item.idmodificador)}>{item.nombremodificador}</span>
                                            </div>
                                            <div className="col-4">
                                            <span className="product-name">Obligatorio</span>
                                            </div>
                                            </div>
                                            {optionlist.map(op =>(
                                                (item.idmodificador === op.idmodificador) ?
                                                <div className="row">
                                                    <div className="col-3"/>
                                                    <div className="col-5">
                                                        {op.nombreopcion}
                                                    </div>
                                                    <div className="col-4">
                                                        +MX $ {op.precioopcionmodificador}
                                                        <button className="btn btn-primary" onClick={(e) => {selectedRadio(e, item.idmodificador, item.nombremodificador, op.idopcionmodificador, op.nombreopcion, op.precioopcionmodificador, op.idingrediente, op.opcionporcion);}}>Elegir</button>
                                                    </div>
                                                    <br/>
                                                    <br/>
                                                    <hr/>
                                                </div>
                                                : ''
                                            ))}
                                            <hr/>
                                         </div>
                                :
                                <div>
                                        <div className="row">
                                            <br/>
                                            <div className="col-8">
                                            <span className="product-details-name" onMouseOver={getListOptions.bind(this, item.idmodificador)}>{item.nombremodificador}</span>
                                            </div>
                                            <div className="col-4">
                                            <span className="product-details-name">Opcional</span>
                                            </div>
                                            </div>
                                            {optionlist.map(op =>(
                                                <div className="row">
                                                    <div className="col-3"/>
                                                    <div className="col-5">
                                                        {op.nombreopcion}
                                                    </div>
                                                    <div className="col-4">
                                                        +MX $ {op.precioopcionmodificador}
                                                        <button className="btn btn-primary" onClick={(e) => {selectedRadio(e, item.idmodificador, item.nombremodificador, op.idopcionmodificador, op.nombreopcion, op.precioopcionmodificador, op.idingrediente, op.opcionporcion);}}>Elegir</button>
                                                    </div>
                                                    <br/>
                                                </div>
                                            ))}
                                            <hr/>
                                         </div>
                            ))}
                        </div>
                        }
                        <br/>
                        <textarea className="product-coments" rows="3" placeholder="Añade especificaciones y/o comentarios" onChange={(e) => {setNota(e.target.value)}}></textarea>
                        <br/>
                        <div className="product-buttons">
                            <span className="product-name">Cantidad: 
                                <input type="number" className="product-cant-input" placeholder="1" min="1" max="10" onChange={(e) => {setCant(e.target.value)}}/>
                            </span>
                            <button className="btn btn-primary" onClick={addCart.bind(this)}>Añadir al carrito:</button>
                        </div>
                    </div> 
                </div>
                <div className="col-5">
                    <div className="card">
                        <Carrito/>
                    </div>
                </div>
            </div>
        </div>
    )
}
