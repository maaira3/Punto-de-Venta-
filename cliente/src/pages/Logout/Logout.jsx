import {React, useEffect} from 'react';
import '../../styles.scss';
import { useHistory } from "react-router-dom";
import{ init } from 'emailjs-com';
init("user_vE01873KnIdtHQnqhpb3Q");

const Login = () => {

  let history = useHistory();

  function logout(){
    setTimeout(function(){
      localStorage.removeItem("user")
      localStorage.removeItem('role')
      localStorage.removeItem('token')
      history.push("/");
    }, 5000);
  }

    useEffect(() =>{
      logout()
    })

  return (
    <div className="login">
        <div className='form-content-right'>
                <h1 className="title">Hasta Luego</h1>
                <span className="subtitle">¡Esperamos verte pronto!</span>          
      
        </div>

    </div>
    
  );
};

export default Login;