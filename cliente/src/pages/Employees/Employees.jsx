import React from 'react'
import Card from './Components/Card'
import CardAdd from './Components/CardAdd'
import  { useEffect, useState } from 'react'
import axios from 'axios' //npm i axios
import '../../styles.scss'
import Swal from 'sweetalert2'
import emailjs from 'emailjs-com' //npm i emailjs-com 

const baseURL = process.env.REACT_APP_API_URL //npm i dotenv

function Employees() {
    const [ listEmployees, setListEmployees ] = useState([])
    const [ idempleado, setId ] = useState('')
    const [ nombreempleado, setName ] = useState('')
    const [ emailempleado, setEmail ] = useState('')
    const [ telempleado, setTel ] = useState('')
    const [ dirempleado, setDir ] = useState('')
    const [ update, setUpdate ] = useState(false)
    const rol = localStorage.getItem('rol')

    useEffect(() => {
        getEmployees()
    },[])

    async function getEmployees(){
      const { data } = await axios.get(baseURL+`/${rol}`)
      setListEmployees(data)
  }

    function getCurrentDate(separator=''){
        let newDate = new Date()
        let date = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear();
        return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date}`
    }

    function sendEmail(passwordempleado){
      console.log(passwordempleado)
      emailjs.send('service_vvmlhv5','template_80673b6',{ email: emailempleado,
        message: "Su contraseña es: "+ passwordempleado,
        name: nombreempleado}, 'user_vE01873KnIdtHQnqhpb3Q', )
      .then((response) => {
             console.log('SUCCESS!', response.status, response.text);
      }, (err) => {
             console.log('FAILED...', err);
      });
    }

    async function saveEmployee(){
        let fechacontra=getCurrentDate()
        const obj = { nombreempleado,fechacontra, emailempleado, telempleado,dirempleado}
        const { data } = await axios.post(baseURL+`/${rol}`, obj)
        sendEmail(data)
        clearInput()
        getEmployees()

        Swal.fire({
            icon: 'success',
            title: '¡Se agregó el empleado correctamente!',
            showConfirmButton: false,
            timer: 1500
          })
   
    }

    function clearInput(){
        setName('')
        setEmail('')
        setTel('')
        setDir('')
    }

    async function deleteEmployee(emailempleado){
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-primary',
              cancelButton: 'btn btn-secondary'
            },
            buttonsStyling: false
          })
          
          swalWithBootstrapButtons.fire({
            title: '¿Estas segur@?',
            text: "No se podrán revertir los cambios después.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '¡Si, eliminalo!',
            cancelButtonText: '¡No, cancela!',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              swalWithBootstrapButtons.fire(
                '¡Eliminado!',
                'El empleado ha sido eliminado de forma correcta.',
                'success'
              )
              deleteEmployeeAlert(emailempleado)
            } else if (
              /* Read more about handling dismissals below */
              result.dismiss === Swal.DismissReason.cancel
            ) {
              swalWithBootstrapButtons.fire(
                'Cancelado',
                'El empleado aun se encuentra en el sistema.',
                'error'
              )
            }
          })

    }

    async function deleteEmployeeAlert(emailempleado){
        const { data } = await axios.post(baseURL+`/${emailempleado}`+`/${rol}`)
        console.log(data)
        getEmployees()
    }

    async function getEmployee(idempleado){
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
              confirmButton: 'btn btn-primary',
              cancelButton: 'btn btn-secondary'
            },
            buttonsStyling: false
          })
          
          swalWithBootstrapButtons.fire({
            title: '¿Estas segur@?',
            text: "Podrás cambiar los datos más adelante.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: '¡Si, modificalo!',
            cancelButtonText: '¡No, cancela!',
            reverseButtons: true
          }).then((result) => {
            if (result.isConfirmed) {
              swalWithBootstrapButtons.fire(
                '¡Modificado!',
                'Los datos del empleado han sido modificados exitosamente.',
                'success'
              )
              getEmployeeAlert(idempleado)
            } else if (
              /* Read more about handling dismissals below */
              result.dismiss === Swal.DismissReason.cancel
            ) {
              swalWithBootstrapButtons.fire(
                'Cancelado',
                'No se han modificado los datos del empleado.',
                'error'
              )
            }
          })
    }

    async function getEmployeeAlert(idempleado){
            setUpdate(true)
            const {data} = await axios.get(baseURL+`/${idempleado}`+`/${rol}`)
            let nombre =  data.nombreempleado
            let email =  data.emailempleado
            let tel = data.telempleado
            let dir = data.dirempleado
            setId(idempleado)
            if (nombreempleado==='')
                setName(nombre)
            if (emailempleado==='')
                setEmail(email)
            if (telempleado==='')
                setTel(tel)
            if (dirempleado==='')
                setDir(dir)
    }

    async function updateEmployee(){
        const obj = {idempleado,nombreempleado, emailempleado, telempleado,dirempleado}
        const { data } = await axios.put(baseURL+`/${rol}`,obj)
        console.log(data)
        clearInput()
        getEmployees()
     }
     

    return (
        
        <div className="p-3 mb-2" >
            <div className='row'>
                { listEmployees.map(item => (
                 <div className="col-md-4" key={item.idempleado}>
                        <Card
                        idempleado={item.idempleado}
                        nombreempleado={item.nombreempleado}
                        emailempleado={item.emailempleado}
                        telempleado={item.telempleado}
                        dirempleado={item.dirempleado}
                        fechacontra={item.fechacontra}
                        setName={setName}
                        setEmail={setEmail}
                        setTel={setTel}
                        setDir={setDir}
                        deleteEmployee={deleteEmployee}
                        getEmployee={getEmployee}
                        updateEmployee={updateEmployee}
                        update={update}
                        setUpdate={setUpdate}
                        />
                </div>
                ))}
                <div className='col-md-3'>
                    <CardAdd
                    nombreempleado={nombreempleado}
                    emailempleado={emailempleado}
                    telempleado={telempleado}
                    dirempleado={dirempleado}
                    setName={setName}
                    setEmail={setEmail}
                    setTel={setTel}
                    setDir={setDir}
                    saveEmployee={saveEmployee}
                    />
                </div>
            </div>
        </div>
    )
}

export default Employees