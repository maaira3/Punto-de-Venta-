import React  from 'react'
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import Tema from './Components/Tema';
import RolesSeguridad from './Components/RolesSeguridad';
import Cuentas from './Components/Cuentas'


export default function Config() {

    const rol = localStorage.getItem('rol')

    return (
        <div className="configuration">
            <div className="theme-container">
                <Tema />
                <RolesSeguridad />
                <Cuentas/>
            </div>
        </div>
    )
}
