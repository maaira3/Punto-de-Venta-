import React, {useEffect, useState} from 'react'
import '../../../styles.scss';
import axios from 'axios'
import PacmanLoader from "react-spinners/PacmanLoader";
import {Doughnut, Bar, PolarArea} from 'react-chartjs-2'

    var ingredientNot = ''
    var totalingredients = ''

    var complementos = []
    var cuentacomp = []

    var usuarios = []
    var cuenta = []

    const baseURL = process.env.REACT_APP_API_URL //npm i dotenv

export default function Secondcards() {

    const rol = localStorage.getItem('rol')
    async function getProductsToday(){
        const {data} = await axios.get(baseURL+`/dashboard/doughnut`+`/${rol}`)
        if(usuarios.length === 0 && cuenta.length === 0){
            data.map(item =>(
                usuarios.push(item.nombreempleado),
                cuenta.push(item.count)
            ))
            }
    }

    async function getSalesComplement(){
        const {data} = await axios.get(baseURL+`/dashboard/complement`+`/${rol}`)
        if(complementos.length === 0 && cuentacomp.length === 0){
            data.map(item =>(
                complementos.push(item.nombrecomplemento),
                cuentacomp.push(item.idcomplemento)
            ))
            }
    }

    async function getIngredientNot(){
        const {data} = await axios.get(baseURL+`/dashboard/ingredientnot`+`/${rol}`)
        if (ingredientNot === ''){
            ingredientNot = data.count
        }
    }

    async function getTotalIngredients(){
        const {data} = await axios.get(baseURL+`/dashboard/ingredient`+`/${rol}`)
        if (totalingredients === ''){
            totalingredients = data.count
        }
    }

    useEffect(() =>{
        getIngredientNot()
        getTotalIngredients()
        getSalesComplement()
        getProductsToday()
    }, [])

    const dataGraph1={
        labels: ['Ingredientes próximos a terminarse','Ingredientes estandar'],
        datasets:[{
            label: "Inventario de ingredientes",
            data: [ingredientNot,totalingredients-ingredientNot],
        }]
    }

    const dataGraph2={
        labels: complementos,
        datasets:[{
            label: "Complementos más utilizados",
            data: cuentacomp,
        }]
    }

    const dataDoughnut={
        labels: usuarios,
        datasets:[{
            label: "Productos vendidos en el día",
            data: cuenta,
        }]
    }

    const optionGraph1={
        maintainAspectRadio: false,
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top'
            }
        }
    }

    const optionGraph2={
        maintainAspectRadio: false,
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'bottom'
            }
        }
    }

    const optionDoughnut={
        maintainAspectRadio: false,
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'bottom'
            },
            title: {
                display: true,
                position: 'top',
                text: 'Ventas de empleados',
            }
        }
    }

    return (
        <div>
            <div className="dash-cards">
            <div className="card second-graph">
                <Bar data={dataGraph1} options={optionGraph1} />
                <Bar data={dataGraph2} options={optionGraph2} />
            </div>
            <div className="card second-graph">
                <div className="second-card-item">
                    <Doughnut data={dataDoughnut} options={optionDoughnut} />
                </div>
            </div>
      </div>
        </div>
    )
}
