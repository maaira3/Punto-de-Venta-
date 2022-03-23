import React from 'react'
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import Ingrediente from './Components/Ingrediente'
import  {useState}  from 'react'
import Collapse from 'react-bootstrap/Collapse'

export default function Ingredientes(props) {
    
    const [newingredient,setNewIngredient]=useState(false)
    const [formvalidingredients, setFormValidIngredients] =useState(false)
    const [open, setOpen] = useState(true);
    const [errorform, setErrorForm] = useState('');
    function newIngredient(){
        if(formvalidingredients&&props.ingredients.index!==''&&props.ingredients.portioningredient!=='0.0'){
            setErrorForm('')
            setNewIngredient(true)
            props.setListIngredientsProducts(props.listingredientsproducts.concat(props.ingredients))
            clearInputs()
            setFormValidIngredients(false)
        }else{
            setErrorForm('Llene los campos requeridos.')
            setTimeout(function(){setErrorForm('') }, 2000);
        }
    }
    function clearInputs(){
        props.setIngredients({
            index:'',
            idingredient:'',
            nameingredient:'',
            portioningredient:'0.0',
            unitingredient:'',
            idproduct:''
        })
    }
    function removeIngredient(i){
        props.setListIngredientsProducts(props.listingredientsproducts.filter(item => item.idingredient !== i))
    }
    return (
        <div className="accordion-item">
            <button className="accordion-button" 
                type="button" 
                onClick={() => setOpen(!open)}
                aria-controls="collapse-ingredients"
                aria-expanded={open}>
                <ControlPointIcon/>Ingredientes
            </button>
            <Collapse in={open}>
            <div id="collapse-ingredients" >
                <div className="accordion-body">
                    <br/>
                    <Ingrediente
                        ingredients={props.ingredients}
                        setIngredients={props.setIngredients}
                        setFormValidIngredients={setFormValidIngredients}
                        removeIngredient={removeIngredient}
                        newingredient={false}
                        newIngredient={newIngredient}
                        errorform={errorform}
                    />
                    {props.listingredientsproducts.map(item=>(
                        <div className="" key={item.idingredient}>
                            <Ingrediente
                                ingredients={item}
                                setIngredients={props.setIngredients}
                                setFormValidIngredients={setFormValidIngredients}
                                removeIngredient={removeIngredient}
                                newingredient={newingredient}
                                newIngredient={newIngredient}
                                errorform={errorform}
                            />
                        </div>
                    ))}
                </div>
            </div>
            </Collapse>
        </div>
    )
}
