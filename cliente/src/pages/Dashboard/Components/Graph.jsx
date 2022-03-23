import React, {useState, useEffect} from 'react'
import {Bar} from 'react-chartjs-2'
import axios from 'axios'
import { red } from '@mui/material/colors'

var labels = []
var datas = []
const baseURL = process.env.REACT_APP_API_URL //npm i dotenv

export default function Graph() {

    const rol = localStorage.getItem('rol')

    async function getGraphData(){
        const {data} = await axios.get(baseURL+`/dashboard/graphdata`+`/${rol}`)
        
        if(labels.length === 0 && datas.length === 0){
        data.map(item =>(
            labels.push(item.nombreproducto),
            datas.push(item.count)
        ))
        }
    }

    useEffect(() =>{
        getGraphData()
    }, [])

    const Graphdata={
        labels: labels,
        datasets:[{
            label: 'Productos más vendidos',
            data: datas
        }]
    }

    const opciones={
        maintainAspectRadio: false,
        responsive: true
    }

    return (
        <div className ="card col-md-4">
            <Bar data={Graphdata} options={opciones}/>
        </div>
    )
}
