import React, {useEffect, useState, Component} from 'react'
import Header from './Components/Header'
import SearchIcon from '@mui/icons-material/Search'
import axios from 'axios'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import DropdownItem from 'react-bootstrap/esm/DropdownItem'
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom';
import Carrito from './Components/Carrito'
import { useHistory } from "react-router-dom";

    const dataproduct = []
    const baseURL = process.env.REACT_APP_API_URL //npm i dotenv

export default function Ventas() {

    const [ListAllProducts, setAllProducts] = useState([])
    const [ListCategories, setCategories] = useState([])
    const [category, setCategory] = useState('Categorias')
    const [search, setSearch] = useState('')
   
    const rol = localStorage.getItem('rol')
    let history = useHistory();

    async function getAllProducts(){
        const {data} = await axios.get('http://localhost:5000/api/sales/products'+`/${rol}`)
        clear()
        setCategory('Categorias')
        setAllProducts(data)
    }

    async function getCategories(){
        const {data} = await axios.get(baseURL+'/sales/categories'+`/${rol}`)
        setCategories(data)
    }

    async function getProductsByCategory(idcategoria, nombrecategoria){
        const {data} = await axios.get('http://localhost:5000/api/sales/products/category'+`/${idcategoria}`+`/${rol}`)
        clear()
        setCategory(nombrecategoria)
        setAllProducts(data)
    }

    async function getProductByName(){
        const {data} = await axios.get(baseURL+'/sales/products/name'+`/${search}`+`/${rol}`)

        //Si no encuentra nada en la consulta de nombre, hace la consulta por código
        if (Object.entries(data).length === 0){
            getProductById()
        }else{
            clear()
            setAllProducts(data)
        }
    }

    async function getProductById(){
        const {data} = await axios.get(baseURL+'/sales/products/id'+`/${search}`+`/${rol}`)
        console.log(data)       
        if (Object.entries(data).length === 0){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                showConfirmButton: false,
                text: 'No se encuentra el producto en el sistema',
                timer: 1500
              })
        }else{
            verifyProductComplement()
        }
    }

    async function verifyProductComplement(){
        const {data} = await axios.get(baseURL+'/sales/verification/products/complements'+`/${search}`+`/${rol}`)
        console.log(data)
        if(data !== null){
            history.push('/product'+`/${search}`)
        }else{
            verifyProductModifier()
        }
    }

    async function verifyProductModifier(){
        const {data} = await axios.get(baseURL+'/sales/verification/products/modifiers'+`/${search}`+`/${rol}`)
        console.log(data)
        if(data !== null){
            history.push('/product'+`/${search}`)
        }else{
                getSearchProduct()
        }
    }

    async function getSearchProduct(){
        const {data} = await axios.get(baseURL+'/getproducts/'+`/${search}`+`/${rol}`)

        if(localStorage["productdatas"]){
            //Guarda los datos de localstorage en temp
            var ptemp = JSON.parse(localStorage["productdatas"])
            var length = ''
            length = ptemp.length 
            var carrito = length + 1
            //Push a data con los datos en localstorage
            ptemp.map(item => (
                dataproduct.push({idcarrito: item.idcarrito, idproducto: item.idproducto, nombreproducto: item.nombreproducto, precioproducto: item.precioproducto, cantidad: item.cantidad, total: item.total, nota: item.nota})
            ))

            //Push a data para guardar los valores
            dataproduct.push({idcarrito: carrito, idproducto: search, nombreproducto: data.nombreproducto, precioproducto: data.precioproducto, cantidad: 1, total: data.precioproducto, nota: 'x'})
            console.log('Primer push:',dataproduct)

            //Se guarda data en localstore mydatas
            localStorage["productdatas"] = JSON.stringify(dataproduct)
        }else{
            carrito = 1
            //Push a data para guardar los valores
            dataproduct.push({idcarrito: carrito, idproducto: search, nombreproducto: data.nombreproducto, precioproducto: data.precioproducto, cantidad: 1, total: data.precioproducto, nota: 'x'})
            console.log('Push localstore limpio:',dataproduct)

            //Se guarda data en localstore mydatas
            localStorage["productdatas"] = JSON.stringify(dataproduct)
        }
        console.log(JSON.parse(localStorage["productdatas"]))


        localStorage.setItem('Totalpagar', parseInt(localStorage.getItem('Totalpagar')) + parseInt(data.precioproducto))
        history.push("/ventas");  
        window.location.reload(true);
    }
    
    async function getProductsByPrice1(){
        const {data} = await axios.get(baseURL+'/sales/products/price1'+`/${rol}`)
        if (Object.entries(data).length === 0){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                showConfirmButton: false,
                text: 'No existen artículos con esos parámetros',
                timer: 1500
              })
            clear()
            getAllProducts()
        }else{
            clear()
            setAllProducts(data)
        }
    }

    async function getProductsByPrice2(){
        const {data} = await axios.get(baseURL+'/sales/products/price2'+`/${rol}`)
        if (Object.entries(data).length === 0){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                showConfirmButton: false,
                text: 'No existen artículos con esos parámetros',
                timer: 1500
              })
            clear()
            getAllProducts()
        }else{
            clear()
            setAllProducts(data)
        }
    }

    async function getProductsByPrice3(){

        const {data} = await axios.get(baseURL+'/sales/products/price3'+`/${rol}`)
        if (Object.entries(data).length === 0){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                showConfirmButton: false,
                text: 'No existen artículos con esos parámetros',
                timer: 1500
              })
            clear()
            getAllProducts()
        }else{
            clear()
            setAllProducts(data)
        }
    }

    function clear(){
        setAllProducts([])
        setCategory('Categorias')
    }

    useEffect(() =>{
        getAllProducts()
        getCategories()
    }, [])

    
    return (  
        <div className="sales">
            <Header/>
            <div className="search-bar">
                <div className="card search-card">
                    <div className="row">  
                        <div className="col-md-11">
                            <input type="text" placeholder="Buscar" className="search-input" onChange={ e=> setSearch(e.target.value)}/>
                        </div>
                        <div className="col-md-1"><button className="btn btn-primary" onClick={getProductByName.bind(this)}><SearchIcon/></button></div>
                    </div>
                </div> 
            </div>
            <div className="row">
                <div className="col-md-7">
                    <div className="card dropdown-card">
                        <div className="row">
                            <div className="col-md-5">
                            </div>
                            <div className="col-md-4">
                                <DropdownButton id="dropdown-basic-button" title={category}>
                                    <DropdownItem onClick={getAllProducts.bind(this)}>Todos los productos</DropdownItem>
                                    {ListCategories.map(item =>(
                                    <div>     
                                        <Dropdown.Item onClick={getProductsByCategory.bind(this, item.idcategoria, item.nombrecategoria)} key={item.nombrecategoria}>{item.nombrecategoria}</Dropdown.Item>       
                                    </div>
                                    ))}
                                </DropdownButton>
                            </div>
                            <div className="col-md-2">
                                <DropdownButton id="dropdown-basic-button" title='Filtros'>
                                    <DropdownItem onClick={getProductsByPrice1.bind(this)}>Precio $</DropdownItem>
                                    <DropdownItem onClick={getProductsByPrice2.bind(this)}>Precio $$</DropdownItem>
                                    <DropdownItem onClick={getProductsByPrice3.bind(this)}>Precio $$$</DropdownItem>
                                </DropdownButton>
                            </div>
                        </div>
                    </div>
                    <div className="card catalogue-card">
                        <div className="row">
                        {ListAllProducts.map(item => (
                            <div className="card product-card col-md-5">
                                <div className="row">
                                    <div className="col-md-12 product-info">
                                        <span className="product-name" key={item.nombreproducto}>{item.nombreproducto}</span>
                                        <span className="product-descr" key={item.descripcionproducto}>{item.descripcionproducto}</span>
                                        <br/>
                                        <span className="product-price" key={item.precioproducto}>MX ${item.precioproducto}</span>
                                        <br/>
                                        <Link to={'/product'+`/${item.idproducto}`} className="btn btn-primary" key={item.idproducto}>
                                                Agregar
                                        </Link>     
                                    </div>   
                                </div>
                                <hr/>
                            </div>
                        ))}
                    </div>
                    </div>
                </div>
                <div className="col-md-5">
                    <div className="card">
                        <Carrito/>
                    </div>
                </div>
            </div>
        </div>
    )
}
