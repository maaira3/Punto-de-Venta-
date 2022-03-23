import React from 'react'
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import   {useState, useEffect}  from 'react'
import Modificador from './Components/Modificador'
import Collapse from 'react-bootstrap/Collapse'
import axios from 'axios' //npm i axios

const baseURL = process.env.REACT_APP_API_URL //npm i dotenv

function Modificadores(props) {
    const [newmodifier,setNewModifier]=useState(false)
    const [formvalidmodifiers, setFormValidModifiers] =useState(false)
    const [open, setOpen] = useState(true);
    const [modifiers,setModifiers]=useState([])
    const [errorform, setErrorForm] = useState('');
    const [listoptionsmodifier, setListOptionsModifier]= useState([])
    const [newoptionmodifier,setNewOptionModifier]=useState(false)
    const [newmodifieroptions, setNewModifierOptions] = useState(false)
    const [newmodifierselect, setNewModifierSelect] = useState(false)
    const [optionmodifier,setOptionModifier] = useState({
        idoptionmodifier:0,
        index:'',
        name:'',
        price:'0.0',
        idingredient:'',
        nameingredient:'',
        portion:'0.0',
    })
    const rol = localStorage.getItem('rol')
    useEffect(() => {
        getModifiers()
    },[])
    const handleChangeModifier = e => {
        if(e.target.value==='-1'){
            console.log('nuevo modificador')
            clearInputs()
            setNewModifierSelect(true)
            setNewModifierOptions(true)
        }else{
            props.setModifier(modifiers.find(item => item.idmodifieroriginal == e.target.value))
            setNewOptionModifier(true)
            setNewModifierSelect(false)
            setNewModifierOptions(false)
        }
    };
    function newModifier(){
        if(formvalidmodifiers&&props.modifier.namemodifier!==''){
            setErrorForm('')
            setNewModifier(true)
            if(listoptionsmodifier.length!==0){
                setNewModifierOptions(true)
                props.modifier.optionsmodifier=listoptionsmodifier
            }
            if(props.listmodifiers.length===0){
                
                props.setListModifiers(props.listmodifiers.concat(props.modifier))
                
            }else{
                const mo =props.listmodifiers[props.listmodifiers.length-1]
                props.modifier.idmodifier= mo.idmodifier+1
                props.setListModifiers(props.listmodifiers.concat(props.modifier))
            }
            setListOptionsModifier([])
            clearInputs()
        }else{
            setErrorForm('Llene los campos requeridos.')
            setTimeout(function(){setErrorForm('') }, 2000);
        }
    }
    function clearInputs(){
        props.setModifier({
            idmodifier:0,
            namemodifier:'',
            pricemodifier:'0.0',
            optionsmodifier:[],
            pricemodifierchecked:false,
            requiredchecked:false,
            idmodifieroriginal:0
        })
    }
    function removeModifier(i){
        props.setListModifiers(props.listmodifiers.filter(item => item.idmodifier !== i))
    }

    async function getModifiers(){
        const { data } = await axios.get(baseURL+'/products/modifiers/'+`${rol}`)
        setModifiers(data)
    }

    return (
        <div className="accordion-item">
            <button className="accordion-button" type="button" 
                onClick={() => setOpen(!open)}
                aria-controls="collapse-modifiers"
                aria-expanded={open}>
                <ControlPointIcon/>Modificadores
            </button>
            <Collapse in={open}>
                <div id="collapse-modifiers" >
                <div className="accordion-body">
                    <Modificador
                        index={0}
                        modifier={props.modifier}
                        setModifier={props.setModifier}
                        setFormValidModifiers={setFormValidModifiers}
                        listingredients={props.listingredients}
                        removeModifier={removeModifier}
                        newmodifier={false}
                        newModifier={newModifier}
                        errorform={errorform}
                        modifiers={modifiers}
                        optionmodifier={optionmodifier}
                        setOptionModifier={setOptionModifier}
                        listoptionsmodifier={listoptionsmodifier}
                        setListOptionsModifier={setListOptionsModifier}
                        newoptionmodifier={newoptionmodifier}
                        setNewOptionModifier={setNewOptionModifier}
                        newmodifieroptions={newmodifieroptions}
                        modifiers={modifiers}
                        handleChangeModifier={handleChangeModifier}
                        newmodifierselect={newmodifierselect}
                    />
                    {
                    props.listmodifiers.map((item)=>(
                        <div className="" key={item.idmodifier}>
                        <Modificador
                            index={item.idmodifier}
                            modifier={item}
                            setModifier={props.setModifier}
                            setFormValidModifiers={setFormValidModifiers}
                            listingredients={props.listingredients}
                            removeModifier={removeModifier}
                            newmodifier={newmodifier}
                            newModifier={newModifier}
                            errorform={errorform}
                            modifiers={modifiers}
                            optionmodifier={optionmodifier}
                            setOptionModifier={setOptionModifier}
                            listoptionsmodifier={item.optionsmodifier}
                            setListOptionsModifier={setListOptionsModifier}
                            newoptionmodifier={newoptionmodifier}
                            setNewOptionModifier={setNewOptionModifier}
                            newmodifieroptions={false}
                            modifiers={modifiers}
                            handleChangeModifier={handleChangeModifier}
                            newmodifierselect={false}
                        />
                        </div>
                    ))}
                </div>
            </div>
            </Collapse>
        </div>
    )
}
export default Modificadores
