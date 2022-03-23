import React from 'react'
import  { useEffect, useState } from 'react'
import OpcionModificador from './OpcionModificador';
import RemoveIcon from '@mui/icons-material/Remove';
import CheckIcon from '@mui/icons-material/Check';

function Modificador(props) {
    const [formvalidoptions,setFormValidOptions]=useState(false)
    const [errors, setErrors] = useState({
        namemodifier:'*Campo obligatorio.',
        pricemodifier:'*Campo obligatorio'})

    const expresiones = {
	text: /^[a-zA-ZÀ-ÿ\s]{1,50}$/, // Letras,espacios
	textnumbers: /^[a-zA-ZÀ-ÿ0-9\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
	float:/^[0-9.]{1,20}$/, // 1 a 20 digitos con punto.
    }
    useEffect(()=>{
        inputValidation()
    },[props.modifier])

    const handleChange = e => {
        const { name, value } = e.target;
        props.setModifier({
            ...props.modifier,
            [name]: value
        });
    };


    const [errorform, setErrorForm] = useState('');
    
    function  inputValidation(){
        if(props.modifier.namemodifier===''){
            setErrors({
                ...errors,
                ['namemodifier']: "*Campo obligatorio."
            })
            //errors.namemodifier="*Campo obligatorio."
            props.setFormValidModifiers(false)
        }else{
            setErrors({
                ...errors,
                ['namemodifier']: ""
            })
            //errors.namemodifier=""
            props.setFormValidModifiers(true)
            }

        if(props.modifier.pricemodifierchecked){
            if(!expresiones.float.test(props.modifier.pricemodifier)){
                setErrors({
                    ...errors,
                    ['pricemodifier']: "Este campo solo puede contener numeros."
                })
                //errors.pricemodifier="Este campo solo puede contener numeros."
                props.setFormValidModifiers(false)
            }else{
                if(props.modifier.pricemodifier==='0.0'){
                    setErrors({
                        ...errors,
                        ['pricemodifier']: "*Campo obligatorio"
                    })
                    //errors.pricemodifier="*Campo obligatorio."
                    props.setFormValidModifiers(false)
                }else{
                    setErrors({
                        ...errors,
                        ['pricemodifier']: ""
                    })
                    //errors.pricemodifier=""
                    props.setFormValidModifiers(true)
                }
            }
        }
    }

    function newOptionModifier(){
        if(formvalidoptions&&props.optionmodifier.name!==''&&props.optionmodifier.portion!='0.0'){
            setErrorForm('')
            props.setNewOptionModifier(true)
            if(props.listoptionsmodifier.length===0){
                props.setListOptionsModifier(props.listoptionsmodifier.concat(props.optionmodifier))
            }else{
                const opt =props.listoptionsmodifier[props.listoptionsmodifier.length-1]
                console.log(opt.idoptionmodifier+1)
                props.optionmodifier.idoptionmodifier= opt.idoptionmodifier+1
                props.setListOptionsModifier(props.listoptionsmodifier.concat(props.optionmodifier))
            }
            clearInputs()
        }else{
            setErrorForm('Llene los campos requeridos.')
            setTimeout(function(){setErrorForm('') }, 2000);
        }
    }
    function clearInputs(){
        props.setOptionModifier({
            idoptionmodifier:0,
            index:'',
            name:'',
            price:'0.0',
            idingredient:'',
            nameingredient:'',
            portion:'0.0',
            idoptionmodifieroriginal:''
        })
    }
    function removeOptionModifier(i){
        props.setListOptionsModifier(props.listoptionsmodifier.filter(item => item.idoptionmodifier !== i))
    }

    return (
            <div className="row d-flex justify-content-center">
            <div className="">
                <div className="row d-flex justify-content-center">
                {props.newmodifier
                ?
                <div align="right">
                    <button className='btn' onClick={props.removeModifier.bind(this,props.index)}><RemoveIcon/></button>
                </div>
                :<div/>}
                {props.newmodifier
                    ?<div className="mb-2 col-md-4  ">
                        <label className="col-form-label"><b> Nombre modificador:</b></label>
                        <label className="col-form-label">&nbsp; {props.modifier.namemodifier}</label>
                    </div>
                    :<div className="mb-2 col-md-4 mt-2 ">
                        <label className="col-form-label"><b> Seleccione un modificador:</b></label>
                        <select
                            className="form-select" aria-label="Floating label select example"  value={props.modifier.idmodifieroriginal} onChange={props.handleChangeModifier}>
                            <option value=""></option>
                            <option value="-1">Nuevo Modificador</option>
                            {props.modifiers.map((modifier) => (
                            <option
                                value={modifier.idmodifieroriginal}
                                key={modifier.idmodifieroriginal}
                            >
                                {modifier.name}
                            </option>
                            ))}
                        </select>
                        {props.newmodifierselect
                        ?<></>
                        : <>{errors.namemodifier && <p className="text-danger">{errors.namemodifier}</p>}</>
                        }
                    </div>}
                    {props.newmodifierselect
                    ?<><div className="mb-2 col-md-4 mt-2 ">
                        <label className="col-form-label"><b> Nombre modificador:</b></label>
                        <input type="text" className="form-control" name="namemodifier" value={props.modifier.namemodifier} onChange={handleChange} />
                        {errors.namemodifier && <p className="text-danger">{errors.namemodifier}</p>}
                    </div>
                    <div className="mb-2 col-md-4 mt-2 "></div></>
                    :<></>
                    } 
                {props.newmodifier
                ?<div className="mb-2 col-md-3" align="center" >
                    <label className="col-form-label" for="flexCheckDefault">
                        <b>Obligatorio:</b>
                        {props.modifier.requiredchecked
                        ?  <label className="form-check-label" >&nbsp; Sí</label>
                        : <label className="form-check-label" >&nbsp; No</label>
                        }
                    </label>
                </div>
                :props.newmodifierselect
                ?<div className="mb-2 col-md-2 "  align="center" >
                    <br/>
                    <input className="form-check-input" type="checkbox" id="flexCheckDefault" checked={props.modifier.requiredchecked} name="requiredchecked" onChange={ e=> props.setModifier({...props.modifier,['requiredchecked']: !props.modifier.requiredchecked})}/>
                    <label className="form-check-label" >
                        Obligatorio
                    </label>
                </div>
                :<></>
                }
                {props.newmodifier
                ?<div className="mb-2 col-md-2" >
                    <label className="col-form-label"><b> Precio:</b></label>
                    <label className="col-form-label">&nbsp; {props.modifier.pricemodifier}</label>
                    {errors.pricemodifier && <p className="text-danger">{errors.pricemodifier}</p>}
                </div>
                :props.newmodifierselect
                ?<div className="mb-3 col-md-5 ">
                    <div className="row d-flex justify-content-center">
                    <div className="mb-2 col-md-6 mt-4 "  align="center" >
                        <input className="form-check-input" type="checkbox" name="pricemodifierchecked" checked={props.modifier.pricemodifierchecked} onChange={e=> props.setModifier({...props.modifier,['pricemodifierchecked']: !props.modifier.pricemodifierchecked})}/>
                        <label className="form-check-label" for="flexCheckDefault">
                            Habilitar Precio
                        </label>
                    </div>
                    {props.modifier.pricemodifierchecked
                    ?<div className="mb-2 col-md-6" >
                        <label className="col-form-label"><b> Precio:</b></label>
                        <input type="text" className="form-control" name="pricemodifier" value={props.modifier.pricemodifier} onChange={handleChange}/>
                        {errors.pricemodifier && <p className="text-danger">{errors.pricemodifier}</p>}
                    </div>
                    :<div/>}
                    </div>
                </div>
                :<></>

                }
            
                </div>
                </div>
                    {props.newmodifieroptions
                    ?<>
                    <div className="mb-2 col-md-2  "  align="center"></div>
                        <div className="mb-2 col-md-10  "  align="center">
                        <OpcionModificador
                            index={0}
                            listingredients={props.listingredients}
                            optionmodifier={props.optionmodifier}
                            setOptionModifier={props.setOptionModifier}
                            setFormValidOptions={setFormValidOptions}
                            removeOptionModifier={removeOptionModifier}
                            newoptionmodifier={false}
                            newOptionModifier={newOptionModifier}
                            errorform={errorform}
                            newmodifieroptions={props.newmodifieroptions}
                        />
                    </div>
                    </>
                    :<></>}
                    {props.newmodifieroptions
                    
                    ?<>
                    {props.listoptionsmodifier.map((item)=>(
                        <div className="row d-flex justify-content-center " >
                        <div className="mb-2 col-md-2 "  align="center"></div>
                        <div className="mb-2 col-md-10 "  align="center" key={item.idoptionmodifier} >
                            <OpcionModificador
                                index={item.idoptionmodifier}
                                listingredients={props.listingredients}
                                optionmodifier={item}
                                setOptionModifier={props.setOptionModifier}
                                setFormValidOptions={setFormValidOptions}
                                removeOptionModifier={removeOptionModifier}
                                newoptionmodifier={props.newoptionmodifier}
                                newOptionModifier={newOptionModifier}
                                errorform={errorform}
                                newmodifieroptions={props.newmodifieroptions}
                            />
                        </div>
                        </div>
                    ))
                    }
                    </>
                    :<> {props.modifier.optionsmodifier.map((item,index)=>(
                        <div className="row d-flex justify-content-center " >
                        <div className="mb-2 col-md-2 "  align="center"></div>
                        <div className="mb-2 col-md-10 "  align="center" key={index} >
                            <OpcionModificador
                                index={index}
                                listingredients={props.listingredients}
                                optionmodifier={item}
                                setOptionModifier={props.setOptionModifier}
                                setFormValidOptions={setFormValidOptions}
                                removeOptionModifier={removeOptionModifier}
                                newoptionmodifier={props.newoptionmodifier}
                                newOptionModifier={newOptionModifier}
                                errorform={errorform}
                                newmodifieroptions={props.newmodifieroptions}
                            />
                        </div>
                        </div>
                    ))}
                    </>
                    }
                <br/>
                {props.newmodifier
                ?<div/>
                :<div align="right">
                    <br/>
                    {props.errorform && <p className="text-danger">{props.errorform}</p>}
                    <button className='btn btn-primary' onClick={props.newModifier} ><CheckIcon/> Agregar Modificador</button>
                    <br/>
                    <br/>
                </div>}
            </div>
    )
}
export default Modificador
