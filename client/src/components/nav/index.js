import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from "react-redux";
import {Layout, Menu, Icon, Dropdown, Button} from "antd";

const {Header} = Layout;

class Nav extends Component {
    state = {
        isLoggin: undefined,
        userName: undefined
    };

    async componentWillMount() {
        await this.handlerCheckIsLoggin()
    }

    handlerCheckIsLoggin = () => {
        const isLoggin = window.localStorage.getItem('userFromMD');

        if (isLoggin !== null) {
            const {name} = JSON.parse(isLoggin);

            this.setState({isLoggin: true, userName: name})
        }
    };

    handlerLogout = () => {
        window.localStorage.removeItem('userFromMD');
        window.location = '/';
    };

    render() {
        const menu = (
            <Menu>
                <Menu.Item key="0">
                    <Link to="/dashboard"><Icon type="user"/> Dashboard</Link>
                </Menu.Item>
                <Menu.Item key="1">
                    <Button onClick={this.handlerLogout}>
                        <Icon type="logout"/>Logout
                    </Button>
                </Menu.Item>
            </Menu>
        );

        return (
            <Header style={{position: 'fixed', zIndex: 1, width: '100%'}}>
                <div className="logo"/>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    selectedKeys={['1']}
                    style={{lineHeight: '64px'}}
                >
                    <Menu.Item key="1"><Link to="/">Home</Link></Menu.Item>
                    <Menu.Item key="2"><Link to="/catalog">Catalog</Link></Menu.Item>
                    <Menu.Item key="3"><Link to="/contacts">Contacts</Link></Menu.Item>
                    {!this.state.isLoggin &&
                    <Menu.Item key="4" style={{float: 'right'}} className="ant-menu-item"><Link to="/login"><Icon
                        type="login"/>Login</Link></Menu.Item>}
                    {!this.state.isLoggin &&
                    <Menu.Item key="5" style={{float: 'right'}} className="ant-menu-item"><Link to="/register"><Icon
                        type="user"/>Register</Link></Menu.Item>}
                    {this.state.isLoggin && <Menu.Item key="6" style={{float: 'right'}}>
                        <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
                            <a className="ant-dropdown-link" href="#">
                                <Icon type="user"/> {this.state.userName} <Icon type="down"/>
                            </a>
                        </Dropdown>
                    </Menu.Item>}
                </Menu>
            </Header>
        )
    }
}

const mapStateToProps = state => ({
    user: state.users,
});

const mapDispatchers = {};

export default connect(
    mapStateToProps,
    mapDispatchers,
)(Nav);
