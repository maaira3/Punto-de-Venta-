import React from 'react'
import  { useEffect, useState } from 'react'
import RemoveIcon from '@mui/icons-material/Remove'
import CheckIcon from '@mui/icons-material/Add';
export default function OpcionModificador(props) {
    const expresiones = {
        text: /^[a-zA-ZÀ-ÿ\s]{1,50}$/, // Letras,espacios
        textnumbers: /^[a-zA-ZÀ-ÿ0-9\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
        float:/^[0-9.]{1,20}$/, // 1 a 20 digitos con punto.
    }
    const [errors,setErrors] = useState({
        nameoption:'*Campo obligatorio.', 
        priceoption:'',
        portionoption:'*Campo obligatorio.',
        idingredientoption:'*Campo obligatorio.'})

    const handleChange = e => {
            const { name, value } = e.target;
            props.setOptionModifier({
                ...props.optionmodifier,
                [name]: value
            });
        
    };

    useEffect(()=>{
        inputValidation()
    },[props.optionmodifier])

    function  inputValidation(){
        if(props.optionmodifier.name===''){
            setErrors({
                ...errors,
                ['nameoption']: "*Campo obligatorio."
            })
            //errors.nameoption="*Campo obligatorio."
            props.setFormValidOptions(false)
        }else{
            setErrors({
                ...errors,
                ['nameoption']: ""
            })
            //errors.nameoption=""
            props.setFormValidOptions(true)
            }

        if(!expresiones.float.test(props.optionmodifier.price)){
            setErrors({
                ...errors,
                ['priceoption']: "Este campo solo puede contener numeros."
            })
            //errors.priceoption="Este campo solo puede contener numeros."
            props.setFormValidOptions(false)
        }else{
            setErrors({
                ...errors,
                ['priceoption']: ""
            })
            //errors.priceoption=""
            props.setFormValidOptions(true)
        }
        if(props.optionmodifier.idingredient===''){
            setErrors({
                ...errors,
                ['idingredientoption']: "*Campo obligatorio."
            })
            //errors.idingredientoption="*Campo obligatorio."
            props.setFormValidOptions(false)
        }else{
            setErrors({
                ...errors,
                ['idingredientoption']: ""
            })
            //errors.idingredientoption=""
            props.setFormValidOptions(true)
            }
        if(!expresiones.float.test(props.optionmodifier.portion)){
            setErrors({
                ...errors,
                ['portionoption']: "Este campo solo puede contener numeros"
            })
            //errors.portionoption="Este campo solo puede contener numeros."
            props.setFormValidOptions(false)
        }else{
            if(props.optionmodifier.portion==='0.0'){
                setErrors({
                    ...errors,
                    ['portionoption']: "*Campo obligatorio."
                })
                //errors.portionoption="*Campo obligatorio."
                props.setFormValidOptions(false)
            }else{
                setErrors({
                    ...errors,
                    ['portionoption']: ""
                })
                //errors.portionoption=""
                props.setFormValidOptions(true)
            }
        }
    }
    const handleChangeIngredient = e => {
            const ingredient = props.listingredients[e.target.value];
            console.log(ingredient)
            props.setOptionModifier({
                ...props.optionmodifier,
                ['index']:e.target.value,
                ['idingredient']: ingredient.idingrediente,
                ['nameingredient']: ingredient.nombreingrediente,
            });
    };


    return (
        <div className="card container px-4 px-lg-5 h-100" >
            {props.newoptionmodifier
            ?<>{props.newmodifieroptions
                ?<div align="right">
                    <button className='btn' onClick={props.removeOptionModifier.bind(this,props.index)}><RemoveIcon/></button>
                </div>
                :<></>
            }</>
            :<div/>}
            <div className="row d-flex justify-content-center ">
                <div className="col-md-6" >
                    <label className="col-form-label"><b> Nombre opción:</b></label>
                    {props.newoptionmodifier
                    ? <label className="col-form-label">&nbsp; {props.optionmodifier.name}</label>
                    :<input type="text" className="form-control" name="name" value={props.optionmodifier.name} onChange={ handleChange}/>
                    }
                    {errors.nameoption && <p className="text-danger">{errors.nameoption}</p>}
                
                    </div>
                <div className="col-md-4">
                    <label className="col-form-label"><b> Precio:</b></label>
                    {props.newoptionmodifier
                        ? <label className="col-form-label">&nbsp; {props.optionmodifier.price}</label>
                        :<input type="text" className="form-control" name="price" value={props.optionmodifier.price} onChange={ handleChange} />
                    }
                    {errors.priceoption && <p className="text-danger">{errors.priceoption}</p>}
                </div>
                <br/>
            </div>
            <div className="row d-flex justify-content-center">
                <div className="col-md-6" >
                    <label className="col-form-label"><b> Ingrediente:</b></label>
                    {props.newoptionmodifier
                    ?<label className="col-form-label">&nbsp; {props.optionmodifier.nameingredient}</label>
                    :
                    <select className="form-select" id="floatingSelect" aria-label="Floating label select example" value={props.optionmodifier.index} onChange={handleChangeIngredient}>
                        <option value="">Seleccione un Ingrediente</option>
                        {props.listingredients.map((item,i) => (
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
                    {errors.idingredientoption && <p className="text-danger">{errors.idingredientoption}</p>}
                </div>
                <div className="col-md-5">
                    <label className="col-form-label"><b> Porción utilizada:</b></label>
                    {props.newoptionmodifier
                        ? <label className="col-form-label">&nbsp; {props.optionmodifier.portion}</label>
                        :<>
                            <input type="text" className="form-control" name="portion" value={props.optionmodifier.portion} onChange={ handleChange}/>
                            {errors.portionoption && <p className="text-danger">{errors.portionoption}</p>}
                        </>
                    }
                    <br/>
                </div>
                {props.newoptionmodifier
                    ?<div/>
                    :<div align="right">
                        {props.errorform && <p className="text-danger">{props.errorform}</p>}
                        <button className='btn btn-primary' onClick={props.newOptionModifier} ><CheckIcon></CheckIcon></button>
                        <br/>
                        <br/>
                </div>}
            </div>
        </div>
    )
}
