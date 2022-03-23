import React, {useState} from 'react'
import "../../../styles.scss"
import "./themes.css"
import PaletteIcon from '@material-ui/icons/Palette';

const mode_settings = [
    {
    id: 'light',
    name: 'Light',
    background: 'light-background',
    class: 'theme-mode-light'
        
},
{
    id: 'dark',
    name: 'Dark',
    background: 'dark-background',
    class: 'theme-mode-dark'
        
}
]

const color_settings = [
    {
        id: 'blue',
        name: 'Azul',
        background: 'blue-color',
        class: 'theme-color-blue'
    },
    {
        id: 'red',
        name: 'Rojo',
        background: 'red-color',
        class: 'theme-color-red'
    },
    {
        id: 'cyan',
        name: 'Cyan',
        background: 'cyan-color',
        class: 'theme-color-cyan'
    },
    {
        id: 'green',
        name: 'Verde',
        background: 'green-color',
        class: 'theme-color-green'
    }
]

const ThemeMenu = () => {

    const [currMode, setcurrMode] = useState('light')

    const setMode = mode =>{
        setcurrMode(mode.id)
        localStorage.setItem('themeMode', mode.class)
    }


    return (
        <div className="theme-options">
                    
        </div>
    )
}
export default ThemeMenu;