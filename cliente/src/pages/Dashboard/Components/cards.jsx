import React, {useEffect, useState} from 'react'
import '../../../styles.scss';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TrendingDownIcon from '@material-ui/icons/TrendingDown';
import StoreIcon from '@material-ui/icons/Store';
import NotificationsIcon from '@material-ui/icons/Notifications';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import axios from 'axios'
import useBubbletownApi from '../../Gestor/helpers/useBubbletownApi';
import CircularProgress from "@material-ui/core/CircularProgress";

const baseURL = process.env.REACT_APP_API_URL //npm i dotenv


export default function Cards() {

    const [salestoday, setSalesToday] = useState('')
    const [salesyes, setSalesYes] = useState('')
    const [productnot, setProductNot] = useState('')

    const {data: Participantes, loading} = useBubbletownApi({
        path: 'participantes'
    })

    const rol = localStorage.getItem('rol')

    function getCurrentDate(separator='-'){
        let newDate = new Date()
        let date = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear();
        return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date}`
    }

    function getYesDate(separator='-'){
        let newDate = new Date()
        let date = newDate.getDate();
        date = date - 1
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear();
        console.log(year)
        return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date}`
    }

    async function getSalesToday(){
        let fechaventa = getCurrentDate()
        const {data} = await axios.get(baseURL+`/dashboard`+`/${fechaventa}`+`/${rol}`)
        setSalesToday(data.sum)
    }

    async function getSalesYes(){
        let fechaventa = getYesDate()
        const {data} = await axios.get(baseURL+`/dashboard`+`/${fechaventa}`+`/${rol}`)
        setSalesYes(data.sum)
    }

    async function getProductNot(){
        const {data} = await axios.get(baseURL+`/dashboard`+`/${rol}`)
        setProductNot(data.count)
    }

    useEffect(() =>{
        getSalesToday()
        getSalesYes()
        getProductNot()
    }, [])

    if (loading) return <CircularProgress/>
    return (
        <div>
            <div className="row">
                <div className="col-md-4">
            <div className="card card-item">
                <span className="card-title">Ventas</span>
                <div className="card-money">
                    <StoreIcon className="icons"/>
                    <span className="card-money-title">$ {salestoday}</span>
                        {(salestoday-salesyes > 0) ? 
                            <span className="card-money-sub"> 
                                $ {salestoday-salesyes}
                                <TrendingUpIcon className="iconsuparrow"/>
                            </span> 
                            : (salestoday-salesyes < 0 ) ?
                            <span className="card-money-sub"> 
                            $ {salestoday-salesyes}
                            <TrendingDownIcon className="icons downarrow"/>
                        </span>
                        : ''
                        } 
                </div>
            </div>    
            </div>
            <div className="col-md-4">
            <div className="card card-item">
                <span className="card-title">Alertas de productos</span>
                <div className="card-money">
                    <NotificationsIcon className="icons"/>
                    <span className="card-money-title">{productnot}</span>
                </div>
            </div>
            </div>
            <div className="col-md-4">
            <div className="card card-item">
                <span className="card-title">Clientes afiliados</span>
                <div className="card-money">
                    <PersonAddIcon className="icons"/>
                    <span className="card-money-title">{Object.keys(Participantes.Participantes).length}</span>
                </div>
            </div>
            </div>
            </div>
        </div>
    )
}
