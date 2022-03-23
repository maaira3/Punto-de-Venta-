import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import Navbar from './Components/Navbar/Navbar'
import Sidebar from './Components/sidebar/sidebar'

export const ProtectedRoute = ({ component: Component, ...rest}) => {
    const token = localStorage.getItem('token')
    return (
    <Route
        {...rest}
        render = {props => {
            if (token!=null) {
                return <><Navbar /><div className="sidebar-container">
                    <Sidebar />
                    <div className="principal-page">
                        <Component {...props} />              
                    </div>
                </div></>;
            }
            else {
                return <Redirect to = {
                 {
                    pathname: "/login",
                    state: {
                        from: props.location
                    }
                 }
                } />
            } 
        }}
      />
    );
};