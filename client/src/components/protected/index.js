import React,{Component} from 'react';
import { connect } from 'react-redux';
import {Redirect} from 'react-router-dom';
import App from "../../app";

class Protected extends Component{
    render(){
        return this.props.token !== null ? <App {...this.props}/> : <Redirect to="/login"/>
    }
}

const mapStateToProps = state => ({
    token: state.auth.token,
});

export default connect(
    mapStateToProps,
    null,
)(Protected);

