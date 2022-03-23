import React from 'react'
import Login from '../Logout'
import '../../../styles.scss'
import Clock from './Time'
import ScheduleIcon from '@mui/icons-material/Schedule'

function Form(){
    return (
    <>
    <div className="ocean">
	    <div className="wave"></div>
	    <div className="wave"></div>
    </div>
      <div className='form-container'>
        <div className='form-content-left'>
        <ScheduleIcon className="login-cal-icon"/>
        <Clock/>
        </div>
        <Login/>
      </div>
    </>
  );
};

export default Form
