import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from "react-redux";
import axios from 'axios';
import {Layout, Menu, Icon, Dropdown, Button, notification} from "antd";
// actions
import {setUser} from '../../redux/users/actions'

const {Header} = Layout;
const openNotificationWithIcon = (type, description) => {
    notification[type]({
        message: '/user/auth',
        description
    });
};

class Nav extends Component {
    state = {
        isLoggin: undefined,
        userName: undefined,
        isLoadingAuth: false
    };

    async componentWillMount() {
        await this.handlerCheckIsLoggin()
    }

    handlerCheckIsLoggin = async () => {
        const isLoggin = await window.localStorage.getItem('userFromMD');

        if (isLoggin !== null) {
            const user = JSON.parse(isLoggin);

            if (user.id) {
                this.setState({isLoadingAuth: true}, () => axios.post('http://localhost:4000/api/user/auth', {...user.id})
                    .then(response => {
                        if (response.data === "User are required") {
                            this.props.setUser(user)
                            this.setState({isLoggin: true, userName: user.name ? user.name : user.email, isLoadingAuth: false})
                        }
                    })
                    .catch(error => {
                        openNotificationWithIcon('error', error.response.data)
                    })
                )
            }
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
                    {!this.state.isLoggin && <Menu.Item key="4" style={{float: 'right'}} className="ant-menu-item">
                        {this.state.isLoadingAuth ? <Icon type="loading"/> : <Link to="/login"><Icon type="login"/>Login</Link>}
                    </Menu.Item>}
                    {!this.state.isLoggin &&
                    <Menu.Item key="5" style={{float: 'right'}} className="ant-menu-item">
                        {this.state.isLoadingAuth ? <Icon type="loading"/> : <Link to="/register"><Icon type="user"/>Register</Link>}
                    </Menu.Item>}
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

const mapDispatchers = {
    setUser,
};

export default connect(
    mapStateToProps,
    mapDispatchers,
)(Nav);
