import React, {useState, useEffect} from 'react'
import '../../../styles.scss';
import axios from 'axios'

const baseURL = process.env.REACT_APP_API_URL //npm i dotenv

export default function Righttable() {

    const rol = localStorage.getItem('rol')

    const Button = ({type}) =>{
        return <button className={"table-button "+ type}>{type}</button>
    }

    const [transacciones, setTransacciones] = useState([])

    function getCurrentDate(separator='-'){
        let newDate = new Date()
        let date = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear();
        return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date}`
    }


    async function getTransactions(){
        let fecha=getCurrentDate()
        const {data} = await axios.get(baseURL+`/dashboard/transactions`+`/${fecha}`+`/${rol}`)
        setTransacciones(data)
    }

    useEffect(() =>{
        getTransactions()
    }, [])

    return (
        <div className="right-table">
            <span className="right-title">Transacciones recientes</span>
            <table className="r-table">
                <tr className="right-tr">
                    <th className="right-th-user">Id</th>
                    <th className="right-th-user">Empleado</th>
                    <th className="right-th-date">Fecha</th>
                    <th className="right-th-total">Total</th>
                    <th className="right-th-type">Tipo de pago</th>
                </tr>
                {transacciones.map(item =>(
                <tr className="right-tr">
                    <td><span className="td-username">{item.idempleado}</span></td>
                    <td>
                        <span className="td-username">{item.nombreempleado}</span>
                    </td>
                    <td className="td-date">{item.fechaventa}</td>
                    <td className="td-total">${item.totalventa}</td>
                    <td className="td-type"><Button type={item.tipopago}/></td>
                </tr>
                ))}
            </table>
        </div>
    )
}
