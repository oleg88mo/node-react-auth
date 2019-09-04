import React from 'react';
import {Redirect} from 'react-router-dom';
import Dashboard from "../dashboard";

export default function Protected() {
    const isLoggin = window.localStorage.getItem('userFromMD');

    return isLoggin !== null ? <Dashboard/> : <Redirect to="/login"/>
}
