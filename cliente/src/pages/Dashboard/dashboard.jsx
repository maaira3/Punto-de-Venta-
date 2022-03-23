import React, {useState, useEffect} from 'react'
import Cards from './Components/cards'
import Chart from './Components/chart'
import '../../styles.scss';
import LeftTable from "./Components/lefttable"
import RightTable from "./Components/righttable"
import axios from 'axios'
import Graph from './Components/Graph';
import Secondcards from './Components/Secondcards';

const baseURL = process.env.REACT_APP_API_URL //npm i dotenv

export default function Dashboard() {

    const [enero, setEnero]= useState('')
    const [febrero, setFebrero] = useState('')
    const [marzo, setMarzo] = useState('')
    const [abril, setAbril] = useState('')
    const [mayo, setMayo] = useState('')
    const [junio, setJunio] = useState('')
    const [julio, setJulio] = useState('')
    const [agosto, setAgosto] = useState('')
    const [septiembre, setSeptiembre] = useState('')
    const [octubre, setOctubre] = useState('')
    const [noviembre, setNoviembre] = useState('')
    const [diciembre, setDiciembre] = useState('')

    const rol = localStorage.getItem('rol')

    async function getSalesEnero(){
        let newDate = new Date()
        let year = newDate.getFullYear();
        const {data} = await axios.get(baseURL+`/dashboard/salesEnero`+`/${year}`+`/${rol}`)
        setEnero(data.count)
    }

    async function getSalesFebrero(){
        let newDate = new Date()
        let year = newDate.getFullYear();
        const {data} = await axios.get(baseURL+`/dashboard/salesFebrero`+`/${year}`+`/${rol}`)
        setFebrero(data.count)
    }

    async function getSalesMarzo(){
        let newDate = new Date()
        let year = newDate.getFullYear();
        const {data} = await axios.get(baseURL+`/dashboard/salesMarzo`+`/${year}`+`/${rol}`)
        setMarzo(data.count)
    }

    async function getSalesAbril(){
        let newDate = new Date()
        let year = newDate.getFullYear();
        const {data} = await axios.get(baseURL+`/dashboard/salesAbril`+`/${year}`+`/${rol}`)
        setAbril(data.count)
    }

    async function getSalesMayo(){
        let newDate = new Date()
        let year = newDate.getFullYear();
        const {data} = await axios.get(baseURL+`/dashboard/salesMayo`+`/${year}`+`/${rol}`)
        setMayo(data.count)
    }

    async function getSalesJunio(){
        let newDate = new Date()
        let year = newDate.getFullYear();
        const {data} = await axios.get(baseURL+`/dashboard/salesJunio`+`/${year}`+`/${rol}`)
        setJunio(data.count)
    }
    
    async function getSalesJulio(){
        let newDate = new Date()
        let year = newDate.getFullYear();
        const {data} = await axios.get(baseURL+`/dashboard/salesJulio`+`/${year}`+`/${rol}`)
        setJulio(data.count)
    }

    async function getSalesAgosto(){
        let newDate = new Date()
        let year = newDate.getFullYear();
        const {data} = await axios.get(baseURL+`/dashboard/salesAgosto`+`/${year}`+`/${rol}`)
        setAgosto(data.count)
    }

    async function getSalesSeptiembre(){
        let newDate = new Date()
        let year = newDate.getFullYear();
        const {data} = await axios.get(baseURL+`/dashboard/salesSeptiembre`+`/${year}`+`/${rol}`)
        setSeptiembre(data.count)
    }

    async function getSalesOctubre(){
        let newDate = new Date()
        let year = newDate.getFullYear();
        const {data} = await axios.get(baseURL+`/dashboard/salesOctubre`+`/${year}`+`/${rol}`)
        setOctubre(data.count)
    }

    async function getSalesNoviembre(){
        let newDate = new Date()
        let year = newDate.getFullYear();
        const {data} = await axios.get(baseURL+`/dashboard/salesNoviembre`+`/${year}`+`/${rol}`)
        setNoviembre(data.count)
    }

    async function getSalesDiciembre(){
        let newDate = new Date()
        let year = newDate.getFullYear();
        const {data} = await axios.get(baseURL+`/dashboard/salesDiciembre`+`/${year}`+`/${rol}`)
        setDiciembre(data.count)
    }

    useEffect(() =>{
        getSalesEnero()
        getSalesFebrero()
        getSalesMarzo()
        getSalesAbril()
        getSalesMayo()
        getSalesJunio()
        getSalesJulio()
        getSalesAgosto()
        getSalesSeptiembre()
        getSalesOctubre()
        getSalesNoviembre()
        getSalesDiciembre()
    }, [])

    const userdata = [
        {
          month: 'Ene',
          sales: enero,
        },
        {
            month: 'Feb',
            sales: febrero,
        },
        {
            month: 'Mar',
            sales: marzo,
        },
        {
            month: 'Abr',
            sales: abril,
        },
        {
            month: 'May',
            sales: mayo,
        },
        {
            month: 'Jun',
            sales: junio,
        },
        {
            month: 'Jul',
            sales: julio,
        },
        {
            month: 'Ago',
            sales: agosto,
        },
        {
            month: 'Sep',
            sales: septiembre,
        },
        {
            month: 'Oct',
            sales: octubre,
        },
        {
            month: 'Nov',
            sales: noviembre,
        },
        {
            month: 'Dic',
            sales: diciembre,
        },
    
      ];

    return (
        <div className="dashboard">
            <Cards/>
            <div className="second-bar">
            <Graph/>
            <Chart data={userdata} title="Gráfica de Ventas (Anual)" grid dataKey="sales"/>
            </div>
            <div className="div">
                <Secondcards/>
            </div>
            <div className="dash-tables">
                <LeftTable/>
                <RightTable/>
            </div>
        </div>
    )
}
