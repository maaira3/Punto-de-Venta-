import React from 'react'
import Product from './Components/Product'
import Modificadores from './Modificadores'
import Complementos from './Complementos'
import Ingredientes from './Ingredientes'
import  {useState, useEffect}  from 'react'
import axios from 'axios' //npm i axios
import Swal from 'sweetalert2'
import CheckIcon from '@mui/icons-material/Check';

const baseURL = process.env.REACT_APP_API_URL //npm i dotenv

function Products() {

    const rol = localStorage.getItem('rol')
    const [listunits, setListUnits] = useState([])
    const [listingredients, setListIngredients] = useState([])
    const [modifierschecked, setModifiersChecked] = useState(false)
    const [complementschecked, setComplementsChecked] = useState(false)
    const [ingredientschecked, setIngredientsChecked] = useState(false)
    const [stockchecked, setStockChecked] = useState(false)
    const [formvalid, setFormValid] =useState(false)
    const [newcategory, setNewCategory] = useState(false)
    const [namecategory,setNameCategory] = useState('')
    const [imagebinary, setImagebinary] = useState(null)
    const [formproduct, setFormProduct] = useState({
        imageproduct:'',
        nameproduct:'',
        priceproduct:'0.0',
        costproduct:'0.0',
        idproduct:'',
        descriptionproduct:'',
        unitproduct:'',
        categoryproduct:'',
        stockinitproduct:'0',
        stocknotifiproduct:'0'
    })
    const [complement, setComplement] = useState({
        idcomplement:0,
        namecomplement:'',
        idproduct:'',
        descriptioncomplement:'',
        pricecomplement:'0.0',
        index:'',
        typecomplement:''
    })
    const [ingredients, setIngredients] = useState({
        index:'',
        idingredient:'',
        nameingredient:'',
        portioningredient:'0.0',
        unitingredient:'',
        idproduct:''
    })
    const [modifier, setModifier] = useState({
        idmodifier:0,
        namemodifier:'',
        pricemodifier:'0.0',
        optionsmodifier:[],
        pricemodifierchecked:false,
        requiredchecked:false,
        idmodifieroriginal:0,
        name:''
    })
    const [listcomplements, setListComplements]= useState([])
    const [listingredientsproducts, setListIngredientsProducts]= useState([])
    const [listmodifiers, setListModifiers]= useState([])
    const [formDataS, setFormdatas]= useState(null)
    let listidmodifiers=[]
    useEffect(() => {
        getUnits()
        getIngredients()
    },[])
    
    async function getUnits(){
        const { data } = await axios.get(baseURL+'/products/units'+`/${rol}`)
        setListUnits(data)
    }
    async function getIngredients(){
        const { data } = await axios.get(baseURL+'/ingredients'+`/${rol}`)
        setListIngredients(data)
    }

    async function handleSubmit(e){
        e.preventDefault()
        if(formvalid)
        {

            //Agrega categoria nueva
            const {data1}= await axios.post(baseURL+'/products/category'+`/${rol}`, {namecategory})
            //Agrega producto
            const {data}= await axios.post(baseURL+'/products'+`/${rol}`, formproduct)
            //Agregar información a ProductosProveedores
            await axios.post(baseURL+`/products/proveedores/${formproduct.idproduct}`+`/${rol}`)
            /////////////////Inserción de la imagen /////////////////////////////////
            const {resImgs} = await axios.put(`http://localhost:5000/api/inventario/manejoImgs/${formproduct.idproduct}`+`/${rol}`,formDataS)
              console.log(resImgs)
              setImagebinary(null)
            //Agrega modificadores
            if(listmodifiers.length!==0){
                for(let i=0;i<listmodifiers.length;i++){
                    console.log(listmodifiers[i])
                    const data4= await axios.post(baseURL+'/products/modifiers'+`/${formproduct.idproduct}`+`/${rol}`, listmodifiers[i] )
                    console.log(data4.data)
                    let listoptions=listmodifiers[i].optionsmodifier
                    listidmodifiers[i]=data4.data
                    //Agrega opciones modificadores
                    if(listoptions.length>0){
                        for(let j=0;j<listoptions.length;j++){
                            const {data5}= await axios.post(baseURL+'/products/modifiers/options'+`/${data4.data}`+`/${rol}`, listoptions[j])
                            console.log(data5)
                        }
                    } 
                }
                if(listidmodifiers.length!==listmodifiers.length){
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: 'No se pudo agregar los modificadores.'
                      })
                }
                else{
                    setListModifiers([])
                    setModifier({
                        idmodifier:0,
                        namemodifier:'',
                        pricemodifier:'0.0',
                        optionsmodifier:[],
                        pricemodifierchecked:false,
                        requiredchecked:false,
                        idmodifieroriginal:0,
                        name:''
                    })
                }
            }

            //Agrega complementos
            if(listcomplements.length!==0){
                for(let i=0;i<listcomplements.length;i++){
                    console.log(listcomplements[i])
                    const {data2}= await axios.post(baseURL+'/products/complements'+`/${formproduct.idproduct}`+`/${rol}`, listcomplements[i] )
                    if(data2!==1){
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'No se pudo agregar los complementos.'
                          })
                    }else{
                        setListComplements([])
                    }
                }
            }
            //Agrega ingredientes
            if(listingredientsproducts.length!==0){
                for(let i=0;i<listingredientsproducts.length;i++){
                    console.log(listingredientsproducts[i])
                    const {data3}= await axios.post(baseURL+'/products/ingredients'+`/${formproduct.idproduct}`+`/${rol}`, listingredientsproducts[i] )
                    if(data3!==1){
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'No se pudo agregar los ingredientes.'
                          })
                    }else{
                        setListIngredientsProducts([])
                    }
                }
            }

            if(data===1){
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Producto agregado',
                    showConfirmButton: false,
                    timer: 1500
                  })
                setFormProduct({
                    imageproduct:'',
                    nameproduct:'',
                    priceproduct:'0.0',
                    costproduct:'0.0',
                    idproduct:'',
                    descriptionproduct:'',
                    unitproduct:'0',
                    categoryproduct:'',
                    stockinitproduct:'0',
                    stocknotifiproduct:'0',
                })
                setNewCategory(false)
                setStockChecked(false)
                setListComplements([])
                setListIngredientsProducts([])
                setListModifiers([])

            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No se pudo agregar el producto.'
                  })
            }
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se pudo agregar el producto.'
              })

        }
      }
    return (
            <div className="container px-4 px-lg-5 h-100">
                <Product
                    formproduct={formproduct}
                    setFormProduct={setFormProduct}
                    formvalid={formvalid}
                    setFormValid={setFormValid}
                    namecategory={namecategory}
                    setNameCategory={setNameCategory}
                    newcategory={newcategory}
                    setNewCategory={setNewCategory}
                    stockchecked={stockchecked}
                    setStockChecked={setStockChecked}
                    listunits={listunits}
                    setFormdatas={setFormdatas}
                    imagebinary ={imagebinary }
                    setImagebinary={setImagebinary}
                />
                <div className="card">
                <label>Seleccione los módulos que desea habilitar</label>
                <div className="row d-flex justify-content-center ">
                <div className="mb-3 col-md-4" align="center" >
                        <br/>
                        <input className="form-check-input" type="checkbox" id="flexCheckDefault" checked={modifierschecked} onChange={ e=> setModifiersChecked(!modifierschecked)}/>
                        <label className="form-check-label">
                             Modificadores
                        </label>
                </div>
                <div className="mb-3 col-md-4" align="center" >
                        <br/>
                        <input className="form-check-input" type="checkbox" id="flexCheckDefault" checked={complementschecked} onChange={ e=> setComplementsChecked(!complementschecked)}/>
                        <label className="form-check-label" >
                             Complementos
                        </label>
                </div>
                <div className="mb-3 col-md-4 " align="center" >
                        <br/>
                        <input className="form-check-input" type="checkbox" id="flexCheckDefault" checked={ingredientschecked} onChange={ e=> setIngredientsChecked(!ingredientschecked)}/>
                        <label className="form-check-label" >
                             Ingredientes
                        </label>
                </div>
                </div>
                </div>
                {modifierschecked
                ?<Modificadores
                    listingredients={listingredients}
                    modifier={modifier}
                    setModifier={setModifier}
                    listmodifiers={listmodifiers}
                    setListModifiers={setListModifiers}
                />
                :<div/>}
                {complementschecked
                ?<Complementos
                    complement={complement}
                    setComplement={setComplement}
                    listcomplements={listcomplements}
                    setListComplements={setListComplements}
                    formproduct={formproduct}
                    listingredients={listingredients}
                />
                :<div/>}
                {ingredientschecked
                ?<Ingredientes
                    ingredients={ingredients}
                    setIngredients={setIngredients}
                    listingredientsproducts={listingredientsproducts}
                    setListIngredientsProducts={setListIngredientsProducts}
                />
                :<div/>}
                <br/>
                <div align='right'>
                    <button className='btn btn-primary' onClick={handleSubmit}><CheckIcon/> Agregar Producto</button>
                </div>
                <br/>
            </div>
    )
}

export default Products