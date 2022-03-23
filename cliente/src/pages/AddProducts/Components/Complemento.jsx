import React from 'react'
import  { useEffect, useState } from 'react'
import axios from 'axios' //npm i axios
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
const baseURL = process.env.REACT_APP_API_URL //npm i dotenv

export default function Complemento(props) {
    
    const rol = localStorage.getItem('rol')
    const [listproducts, setListProducts] = useState([])
    const [errors, setErrors] = useState({
        namecomplement:'*Campo obligatorio.', 
        pricecomplement:'*Campo obligatorio.', })
    const expresiones = {
	text: /^[a-zA-ZÀ-ÿ\s]{1,50}$/, // Letras,espacios
	textnumbers: /^[a-zA-ZÀ-ÿ0-9\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
	float:/^[0-9.]{1,20}$/, // 1 a 20 digitos con punto.
    }
    useEffect(() => {
        getProducts()
        
    },[])
    useEffect(()=>{
        inputValidation()
    },[props.complement])

    const handleChange = e => {
        const { name, value } = e.target;
        props.setComplement({
            ...props.complement,
            [name]: value
        });
    };
    async function getProducts(){
        const { data } = await axios.get(baseURL+'/products'+`/${rol}`)
      //  console.log(props.listingredients)
        for(let i=0;i<data.length;i++){
            data[i].typecomplement='producto'
        }
        var product= {idproducto: '', nombreproducto: '', typecomplement:'ingrediente'}
        for(let i=0;i<props.listingredients.length;i++){
            product= {idproducto: props.listingredients[i].idingrediente, nombreproducto:props.listingredients[i].nombreingrediente,typecomplement:'ingredient'}
            data.push(product)
            product= {idproducto: '', nombreproducto: '',typecomplement:'ingrediente'}
        }
        console.log(data)
        setListProducts(data)
    }
    function  inputValidation(){
        if(props.complement.namecomplement===''){
            setErrors({
                ...errors,
                ['namecomplement']: "*Campo obligatorio."
            })
            //errors.namecomplement="*Campo obligatorio."
            props.setFormValidComplement(false)
        }else{
            setErrors({
                ...errors,
                ['namecomplement']: ""
            })
            //errors.namecomplement=""
            props.setFormValidComplement(true)
            }

        if(!expresiones.float.test(props.complement.pricecomplement)){
            setErrors({
                ...errors,
                ['pricecomplement']: "Este campo solo puede contener numeros enteros."
            })
            //errors.pricecomplement="Este campo solo puede contener numeros enteros."
            props.setFormValidComplement(false)
        }else{
            if(props.complement.pricecomplement==='0.0'){
                setErrors({
                    ...errors,
                    ['pricecomplement']: "*Campo obligatorio."
                })
                //errors.pricecomplement="*Campo obligatorio."
                props.setFormValidComplement(false)
            }else{
                setErrors({
                    ...errors,
                    ['pricecomplement']: ""
                })
                //errors.pricecomplement=""
                props.setFormValidComplement(true)
            }
        }
    }

    const handleChangeComplement = e => {
        console.log(listproducts)
        const product = listproducts[e.target.value];
        console.log(product)
        props.setComplement({
            ...props.complement,
            ['index']:e.target.value,
            ['idproduct']: product.idproducto,
            ['namecomplement']: product.nombreproducto,
            ['typecomplement']: product.typecomplement,
        });
    };

    return (
        <div className="row d-flex justify-content-center">
            {props.newcomplement
            ?
            <div align="right">
                <button className='btn' onClick={props.removeComplement.bind(this,props.index)}><RemoveIcon/></button>
            </div>
            :<div/>}
            <div className="mb-3 col-md-4 mt-2">
                <label className="col-form-label"><b> Complemento:</b></label>
                {props.newcomplement
                ?<label className="col-form-label">&nbsp;{props.complement.namecomplement}</label>
                :<select className="form-select" id="floatingSelect" aria-label="Floating label select example" name="namecomplement" value={props.complement.index} onChange={handleChangeComplement}>
                    <option value="">Seleccione un Complemento</option>
                    {listproducts.map((product,i) => (
                        <option
                            value={i}
                            key={product.idproduct}
                        >
                            {product.nombreproducto}
                        </option>
                        ))}
                {errors.namecomplement && <p className="text-danger">{errors.namecomplement}</p>}
                </select>}
            </div>
            <div className="mb-2 col-md-2 mt-2">
                <label className="col-form-label"><b> Precio:</b></label>
                {props.newcomplement
                ? <label className="col-form-label">&nbsp;{props.complement.pricecomplement}</label>
                :<input type="text" className="form-control" name="pricecomplement" value={props.complement.pricecomplement} onChange={ handleChange} />
                }
                {errors.pricecomplement && <p className="text-danger">{errors.pricecomplement}</p>}
            </div>
            <div className="mb-2 col-md-5 mt-2">
                <label className="col-form-label"><b> Descripción:</b></label>
                {props.newcomplement
                ? <label className="col-form-label">&nbsp;{props.complement.descriptioncomplement}</label>
                :  <input type="text" className="form-control" name="descriptioncomplement" value={props.complement.descriptioncomplement} onChange={ handleChange}  />
                }
            </div>
            {props.newcomplement
            ?<div/>
            :<div align="right">
                {props.errorform && <p className="text-danger">{props.errorform}</p>}
                <button className='btn btn-primary' onClick={props.newComplement} ><AddIcon/></button>
            </div>}
            
            <br/>
            <br/>
        </div>
    )
}
