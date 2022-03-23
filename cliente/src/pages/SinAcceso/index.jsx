import React from 'react'
import errores from '../../assets/errores.png'

export default function Index() {
    return (
        <div align="center" className="acceso">
            <img src={errores} alt="Error" width="100" height="100" className="errores"/>
            <span className="errores">No tienes los permisos necesarios para ingresar a esta sección</span>
        </div>
    )
}
