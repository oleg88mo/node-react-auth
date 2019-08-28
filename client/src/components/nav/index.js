import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import {connect} from "react-redux";
import {Layout, Menu, Icon} from "antd";

const { Header } = Layout;

class Nav extends Component{
    render(){
        console.log('nav', this.props)
        return(
            <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                <div className="logo" />

                <Menu
                    theme="dark"
                    mode="horizontal"
                    selectedKeys={['1']}
                    style={{ lineHeight: '64px' }}
                >
                    <Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
                    <Menu.Item key="2"><Link to="/catalog">Catalog</Link></Menu.Item>
                    <Menu.Item key="3"><Link to="/contacts">Contacts</Link></Menu.Item>

                    <Menu.Item key="4" style={{float: 'right'}}><Link to="/login"><Icon type="login" />Login</Link></Menu.Item>
                    <Menu.Item key="5" style={{float: 'right'}}><Link to="/register"><Icon type="user" />Register</Link></Menu.Item>
                </Menu>
            </Header>
        )
    }
}
// TODO set user to Localstorage
const mapStateToProps = state => ({
    user: state.users,
});

const mapDispatchers = {

};

export default connect(
    mapStateToProps,
    mapDispatchers,
)(Nav);