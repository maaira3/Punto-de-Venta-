import React, { useState } from 'react'
import imageuser from '../../../assets/user.png'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import '../../../styles.scss'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';


function Card(props) {
    const [show, setShow] = useState(false);
    const handleClose = () => {
        if (props.update)
        {
            props.updateEmployee();
            setShow(false);
            props.setUpdate(false);
        }
        else
            setShow(false);
    };
    const handleShow = () => setShow(true);

    return (
        <div className="card mb-3" max-width="20rem" box-shadow="0 0 20px #909BA2" >
            <div className="card-body-user">
                <div className="text-center">
                    <img src={imageuser} width="100" height="100" className="rounded" alt="imagen usuario"/>
                </div>
                <br/>
                <div ><b className="card-sub">Nombre: </b>{props.nombreempleado} </div>
                <div ><b className="card-sub">E-mail: </b>{props.emailempleado} </div>
                <div ><b className="card-sub">Telefono: </b> {props.telempleado} </div>
                <div ><b className="card-sub">Dirección: </b>{props.dirempleado} </div>
                <div ><b className="card-sub">Fecha Alta:</b> {props.fechacontra} </div>
                <br/>
                <div className="card-buttons">
                <button className="btn btn-primary" onClick={props.deleteEmployee.bind(this, props.emailempleado)}><DeleteOutlineIcon className="icons"/> Eliminar</button>   
                <button className="btn btn-primary" onClick={handleShow}><EditIcon className="icons"/>Editar</button>
                </div>
                <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                >
                <Modal.Header>
                    <Modal.Title>Editar Empleado</Modal.Title>
                </Modal.Header>
                <form id="formEdit"> 
                <Modal.Body>
                    <div className="row">
                        <div className="col-lg-12">
                        <div className="form-group" align="center">
                            <img  src={imageuser} width="150" height="150" className="rounded" alt="imagen usuario"/>
                            <br/>
                        <div >
                            <label className="col-form-label"><b> Nombre:</b></label>
                            <input type="text" placeholder="Nombre"className="form-control" onChange={ (e)=> {props.setName(e.target.value)}} defaultValue={props.nombreempleado} autoFocus/>
                        </div>
                        <div >
                            <label className="col-form-label"><b>Email:</b></label>
                            <input type="text" className="form-control" defaultValue={props.emailempleado} onChange={ (e)=> {props.setEmail(e.target.value)}} />
                        </div>
                        <div >
                            <label className="col-form-label"><b>Telefono:</b></label>
                            <input type="text" className="form-control"  defaultValue={props.telempleado} onChange={ (e)=> {props.setTel(e.target.value)} }/>
                        </div>
                        <div >
                            <label className="col-form-label"><b>Direccion:</b></label>
                            <input type="text" className="form-control" defaultValue={props.dirempleado} onChange={ (e)=> {props.setDir(e.target.value)}}/>
                        </div>
                        </div>
                        </div>
                        </div>  
                </Modal.Body>
                </form>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                    <CloseIcon className="icons"/>Cerrar
                    </Button>
                    <Button variant="primary"  onClick={props.getEmployee.bind(this, props.idempleado)}><SaveIcon className="icons"/>Guardar</Button>
                </Modal.Footer>
                </Modal>
        </div>
        </div>
    )
}

export default Card
