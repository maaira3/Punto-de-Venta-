import React from 'react'
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import Complemento from './Components/Complemento'
import  { useState } from 'react'
import Collapse from 'react-bootstrap/Collapse'

export default function Complementos(props) {
    const [newcomplement,setNewComplement]=useState(false)
    const [formvalidcomplement, setFormValidComplement] =useState(false)
    const [open, setOpen] = useState(true);
    const [errorform, setErrorForm] = useState('');
    function newComplement(){
        if(formvalidcomplement&&props.complement.namecomplement!==''&&props.complement.pricecomplement!=='0.0'){
            setErrorForm('')
            setNewComplement(true)
            if(props.listcomplements.length===0){
                props.setListComplements(props.listcomplements.concat(props.complement))
            }else{
                const co =props.listcomplements[props.listcomplements.length-1]
                console.log(co.idcomplement+1)
                props.complement.idcomplement= co.idcomplement+1
                props.setListComplements(props.listcomplements.concat(props.complement))
            }
            clearInputs()
        }else{
            setErrorForm('Llene los campos requeridos.')
            setTimeout(function(){setErrorForm('') }, 2000);
        }
    }
    function clearInputs(){
        props.setComplement({
            idcomplement:0,
            namecomplement:'',
            idproduct:'',
            descriptioncomplement:'',
            pricecomplement:'0.0',
            index:'',
            typecomplement:''
        })
    }
    function removeComplement(i){
        props.setListComplements(props.listcomplements.filter(item => item.idcomplement !== i))
    }
    return (
        <div className="accordion-item">
            <button className="accordion-button" 
                type="button" 
                onClick={() => setOpen(!open)}
                aria-controls="collapse-complement"
                 aria-expanded={open}>
                <ControlPointIcon/>Complementos
            </button>
            <Collapse in={open}>
                <div id="collapse-complement" >
                <div className="accordion-body">
                    <br/>
                    <Complemento
                        index={0}
                        complement={props.complement}
                        setComplement={props.setComplement}
                        setFormValidComplement={setFormValidComplement}
                        removeComplement={removeComplement}
                        newcomplement={false}
                        newComplement={newComplement}
                        errorform={errorform}
                        listingredients={props.listingredients}
                    />
                    {props.listcomplements.map((item)=>(
                        <div className="" key={item.idcomplement}>
                            <Complemento
                                index={item.idcomplement}
                                complement={item}
                                setComplement={props.setComplement}
                                setFormValidComplement={setFormValidComplement}
                                removeComplement={removeComplement}
                                newcomplement={newcomplement}
                                newComplement={newComplement}
                                errorform={errorform}
                                listingredients={props.listingredients}
                            />
                        </div>
                    ))}
                </div>
                </div>
            </Collapse>
        </div>
    )
}
