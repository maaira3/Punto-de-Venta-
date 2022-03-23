import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import imageuser from '../../../assets/user.png'
import '../../../styles.scss'
import PersonAddIcon from '@mui/icons-material/PersonAdd';


function CardAdd(props) {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
    <>
        <div className="card mb-3" styles="max-width: 20rem; box-shadow: 0 0 20px #909BA2 ;">
            <div className="card-body-user">
               <br/>
                <PersonAddIcon className="icons add-user-icon" onClick={handleShow}/>
                <br/>
                <br/>
                <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                >
                <Modal.Header>
                    <Modal.Title><b>Agregar Empleado </b></Modal.Title>
                </Modal.Header>
                <form id="formLink"> 
                <Modal.Body>
                    <div className="row">
                        <div className="col-lg-12">
                        <div className="form-group" align="center">
                            <img  src={imageuser} width="150" height="150" className="rounded" alt="imagen usuario"/>
                            <br/>
                        <div >
                            <label className="col-form-label"><b> Nombre:</b></label>
                            <input type="text" className="form-control" value={props.nombreempleado} onChange={ e=> props.setName(e.target.value)}autoFocus/>
                        </div>
                        <div >
                            <label className="col-form-label"><b>Email:</b></label>
                            <input type="email" className="form-control" value={props.emailempleado} onChange={ e=> props.setEmail(e.target.value)}/>
                        </div>
                        <div >
                            <label className="col-form-label"><b>Telefono:</b></label>
                            <input type="tel" className="form-control" value={props.telempleado} onChange={ e=> props.setTel(e.target.value)}/>
                        </div>
                        <div >
                            <label className="col-form-label"><b>Direccion:</b></label>
                            <input type="text" className="form-control" value={props.dirempleado} onChange={ e=> props.setDir(e.target.value) }/>
                        </div>
                        </div>
                        </div>
                        </div>   
                </Modal.Body>
                </form>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                    </Button>
                    <Button variant="primary"  onClick={props.saveEmployee}>Agregar</Button>
                </Modal.Footer>
                </Modal>
            </div>
        </div>

    </>

    ) 
}

export default CardAdd

