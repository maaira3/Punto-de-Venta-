import React from 'react'
import '../../../styles.scss';
import VisibilityIcon from '@material-ui/icons/Visibility';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import useBubbletownApi from '../../Gestor/helpers/useBubbletownApi';
import CircularProgress from "@material-ui/core/CircularProgress";

export default function Lefttable() {

    const {data: Participantes, loading} = useBubbletownApi({
        path: 'participantes'
    })

    if (loading) return <CircularProgress/>
    return (
        <div className="left-table">
            <span className="left-title">Nuevas afiliaciones</span>
            <ul className="left-list">
                {Participantes.Participantes.map(item =>(
                    <li className="left-list-item">
                    <AccountCircleIcon className="user-icon"/>
                    <div className="list-item-user">
                        <span className="item-username">{item.nombre} {item.paterno}</span>
                        <span className="item-user-date">Saldo: {item.saldo}</span>
                    </div>
                    <button className="left-list-button">
                        <VisibilityIcon className="visible-icon"/>
                        Sellos {item.sellos} 
                    </button>
                </li>        
                ))}         
            </ul>
        </div>
    )
}
