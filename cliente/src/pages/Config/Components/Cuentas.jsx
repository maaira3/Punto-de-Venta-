import React, {useState, useEffect} from 'react'
import product from '../../../assets/products.png'
import axios from 'axios'


export default function Cuentas() {

    const rol = localStorage.getItem('rol')
    const [activocuentas, setActivoCuenta] = useState(false)
    const[imagebinary, setImagebinary] = useState(null)
    const[productimagenvalid, setImageproductvalid]= useState(null);
    const[formDataS, setFormdatas]= useState(null)
    const[todosvalidos, setTodosvalidos]= useState(null);
    const [imagebd, setImageBD] = useState(null)
    const baseURL = process.env.REACT_APP_API_URL //npm i dotenv

    async function getImageCuenta(){
      const {data} = await axios.get(baseURL+`/sales/cuenta`+`/${rol}`)
      if(data.qrcuenta===null){
          const resb = await fetch(
            baseURL+`/inventario/bringImgs/sin-imagen.jpg`+`/${rol}`
            );
            const datab = await resb.blob();
            var sauce= URL.createObjectURL(datab)
            setImageBD(sauce)
        }else{
          const resb = await fetch(
            baseURL+`/inventario/bringImgs/${data.qrcuenta}`+`/${rol}`
          );
          const datab = await resb.blob();
          var sauce= URL.createObjectURL(datab)
          setImageBD(sauce)
        }
  }

  async function guardar(){
    const obj = {imagebinary}
    if(formDataS!==null){
      const resImgs = await fetch(
        baseURL+`/cuentas/manejoImgs/${rol}`,
        {
          method: "PUT",
          body: formDataS
        }
      );
      await resImgs.json();
    }
  } 

    const convertiraBase64=(archivos)=>{
      Array.from(archivos).forEach(archivo=>{
        if(archivo.type.match(/image.*/i)){
          const imgurl= URL.createObjectURL(archivo)
          setImagebinary(imgurl)
          var formData = new FormData();
          var fileField = document.querySelector("input[type='file']");
          formData.append('file', fileField.files[0]);
          setFormdatas(formData)
          setImageproductvalid('true')
        }else{
            setImagebinary(null)
            setImageproductvalid('false')
            setTodosvalidos('false')
        }
      })
    }

    useEffect(() =>{
      getImageCuenta()
  }, [])

    return (
        <div className="row d-flex justify-content-center">
        <div className="card col-md-11 m-4">
          <h3 className="config-title" onClick={() => setActivoCuenta(!activocuentas)}>
            {activocuentas === true
              ? "- Click para cerrar esta sección"
              : "+ Click aquí para definir los datos de la cuenta del negocio"}
          </h3>
          {activocuentas === true ? (
            <div className="row">
                <div className="card col-md-4">
                        <img src={(imagebinary===null) ? imagebd : imagebinary} width="350" height="500" className="rounded" alt="imagen producto " align="center"/>
                        <div className="input-group">
                            <input type="file" className="form-control" id="file" name="file" accept="image/*" onChange={(e)=>convertiraBase64(e.target.files)}/>
                        </div>
                </div>
                
          <button className="btn btn-primary" onClick={guardar.bind(this)}>Guardar</button>
            </div>
          ) : (
            <div>
              <p>Define el código QR necesario para hacer transferencias y pagos mediante Mercado Pago</p>
            </div>
          )}
        </div>
      </div>
    )
}
