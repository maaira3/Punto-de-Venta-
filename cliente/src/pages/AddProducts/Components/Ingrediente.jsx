import React from 'react'
import  {useState, useEffect}  from 'react'
import axios from 'axios' //npm i axios
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add'

const baseURL = process.env.REACT_APP_API_URL //npm i dotenv

export default function Ingrediente(props) {

    const rol = localStorage.getItem('rol')
    const [errors, setErrors] = useState({
        idingredient:'*Campo obligatorio.', 
        portioningredient:'*Campo obligatorio.'})
    const expresiones = {
	text: /^[a-zA-ZÀ-ÿ\s]{1,50}$/, // Letras,espacios
	textnumbers: /^[a-zA-ZÀ-ÿ0-9\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
	float:/^[0-9.]{1,20}$/, // 1 a 20 digitos con punto.
    }
    const [listingredients, setListIngredients] = useState([])
    
    useEffect(() => {
        getIngredients()
        
    },[])

    useEffect(()=>{
        inputValidation()
    },[props.ingredients])

    const handleChange = e => {
        const { name, value } = e.target;
        props.setIngredients({
            ...props.ingredients,
            [name]: value
        });
    };
    const handleChangeIngredient = e => {
        const ingredient = listingredients[e.target.value];
        console.log(ingredient)
        props.setIngredients({
            ...props.ingredients,
            ['index']:e.target.value,
            ['idingredient']: ingredient.idingrediente,
            ['nameingredient']: ingredient.nombreingrediente,
            ['unitingredient']: ingredient.nombreunidad
        });
    };
    

    async function getIngredients(){
        const { data } = await axios.get(baseURL+'/ingredients'+`/${rol}`)
        setListIngredients(data)
    }

    function  inputValidation(){
        if(props.ingredients.nameingredient===''){
            setErrors({
                ...errors,
                ['idingredient']: "*Campo obligatorio."
            })
            //errors.idingredient="*Campo obligatorio."
        }else{
            setErrors({
                ...errors,
                ['idingredient']: ""
            })
            //errors.idingredient=""
            }

        if(!expresiones.float.test(props.ingredients.portioningredient)){
            setErrors({
                ...errors,
                ['portioningredient']: "Este campo solo puede contener numeros."
            })
            //errors.portioningredient="Este campo solo puede contener numeros."
        }else{
            if(props.ingredients.portioningredient==='0.0'){
                setErrors({
                    ...errors,
                    ['portioningredient']: "*Campo obligatorio."
                })
                //errors.portioningredient="*Campo obligatorio."
            }else{
                setErrors({
                    ...errors,
                    ['portioningredient']: ""
                })
                //errors.portioningredient=""
            }
        }
        if(errors.idingredient===''&&errors.portioningredient===''){
            props.setFormValidIngredients(true)
        }
    }

    return (
            <div className="row d-flex justify-content-center">
                {props.newingredient
                ?
                <div align="right">
                    <button className='btn' onClick={props.removeIngredient.bind(this,props.ingredients.idingredient)}><RemoveIcon/></button>
                </div>
                :<div/>}
                <div className="mb-3 col-md-4 mt-2">
                    <label className="col-form-label"><b> Ingrediente:</b></label>
                    {props.newingredient
                    ?<label className="col-form-label">&nbsp;{props.ingredients.nameingredient}</label>
                    :
                    <select className="form-select" id="floatingSelect" aria-label="Floating label select example" value={props.ingredients.index} onChange={handleChangeIngredient}>
                        <option value="">Seleccione un Ingrediente</option>
                        {listingredients.map((item,i) => (
                            <option
                                value={i}
                                key={item.idingrediente}
                            >
                                {item.nombreingrediente}
                            </option>
                            )
                            )
                            }
                    </select>}
                    {errors.idingredient && <p className="text-danger">{errors.idingredient}</p>}
                </div>
                <div className="mb-2 col-md-4 mt-2">
                    <label className="col-form-label"><b> Porción por producto:</b></label>
                    {props.newingredient
                    ? <label className="col-form-label">&nbsp;{props.ingredients.portioningredient}</label>
                    :<input type="text" className="form-control" name="portioningredient" value={props.ingredients.portioningredient} onChange={ handleChange}/>
                    }
                    {errors.portioningredient && <p className="text-danger">{errors.portioningredient}</p>}
                </div>
                <div className="mb-3 col-md-4 mt-2">
                    <label className="col-form-label"><b> Unidad:</b></label>
                    {props.newingredient
                    ?<></>
                    :<br/>
                    }
                    <label className="col-form-label">&nbsp;{props.ingredients.unitingredient}</label>
                </div>
                {props.newingredient
                ?<div/>
                :<div align="right">
                    {props.errorform && <p className="text-danger">{props.errorform}</p>}
                    <button className='btn btn-primary' onClick={props.newIngredient} ><AddIcon/></button>
                </div>}
                <br/>
                <br/>
            </div>
    )
}
