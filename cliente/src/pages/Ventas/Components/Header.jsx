import React, {useState, useEffect} from 'react'
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import {Fab, TextareaAutosize} from '@material-ui/core'
import {ArrowBack} from '@material-ui/icons'
import { Link } from "react-router-dom";
import QrScan from 'react-qr-reader'
import useBubbletownApi from '../../Gestor/helpers/useBubbletownApi';
import axios from 'axios';
import Swal from 'sweetalert2'

const baseURL = process.env.REACT_APP_API_URL //npm i dotenv

export default function Header(props) {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [participante, setParticipante] = useState('')

    const [nombre, setNombre] = useState('')
    const [apellido, setApellido] = useState('')
    const [sellos, setSellos] = useState('')

    const [qrscan, setQrscan] = useState('');
    const handleScan = data => {
        if (data) {
            setQrscan(data)
        }
    }
    const handleError = err => {
    console.error(err)
    }

    var length = 0
    if(localStorage["productdatas"]){
        const product = JSON.parse(localStorage["productdatas"])
        length = product.length
        }

    async function getParticipante(){
        if(qrscan !== ''){
            const {data} = await axios.get('http://localhost:5001/participante'+`/${qrscan}`)
            setNombre(data.nombre)
            setApellido(data.paterno)
            setSellos(data.tarjeta_sellos.num_sellos)

        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ocurrió un error al obtener el ID del cliente. Intenta de nuevo',
                showConfirmButton: false,
                timer: 1500
              }) 
        }
        setShow(false)
    }
    
    return (
        <div className="sales-header-container">
            <div className="header-left">
                <span className="client-title">Atiende a Cliente: {nombre} {apellido} <AddCircleOutlineIcon className="header-icons" onClick={handleShow}/></span>
                <span className="client.promo">Tu tarjeta de sellos tiene: {sellos} <MoreHorizIcon className="header-icons"/></span>       
            </div>
            <div className="header-right">
                <div className="product-cant">
                    <span className="p-cant">{length}</span>                
                </div>
                <LocalGroceryStoreIcon/>
            </div>   
            <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Escanea el QR de la tarjeta del cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <center>
            <div style={{marginTop:30}}>
                <QrScan
                    delay={300}
                    onError={handleError}
                    onScan={handleScan}
                    style={{ height: 240, width: 320 }}
                />
            </div>
            
            <TextareaAutosize
                style={{fontSize:18, width:320, height:100, marginTop:100}}
                rowsMax={4}
                placeholder="Ingresa el ID del cliente"
                defaultValue=''
                value={qrscan}

            />
            </center>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={getParticipante.bind(this)}>Aceptar</Button>
        </Modal.Footer>
      </Modal>
        </div>

        
    )
}
