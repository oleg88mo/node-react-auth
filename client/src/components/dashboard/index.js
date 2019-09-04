import React, {Component} from "react";
import {Layout, Menu, Icon} from 'antd';
import RenderComponents from './renderComponents';

const {Header, Sider, Content} = Layout;
const {SubMenu} = Menu;

class Dashboard extends Component {
    state = {
        collapsed: false,
        componentName: 'userInformation'
    };

    toggle = () => this.setState({collapsed: !this.state.collapsed});

    handlerRenderComponent = (e, componentName) => {
        e.preventDefault();

        this.setState({componentName})
    };

    render() {
        return (
            <Layout className="dashboard">
                <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
                    <div className="logo">dd</div>
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['222']} defaultOpenKeys={['sub1']}>
                        <SubMenu
                            key="sub1"
                            title={
                                <span>
                                  <Icon type="user"/>
                                  <span>Profile</span>
                                </span>
                            }
                        >
                            <Menu.Item key="222">
                                <a onClick={(e) => this.handlerRenderComponent(e, 'userInformation')}>Information</a>
                            </Menu.Item>
                            <Menu.Item key="3333">
                                <a onClick={(e) => this.handlerRenderComponent(e, 'chat')}>Chat</a>
                            </Menu.Item>
                            <Menu.Item key="44444">Alex</Menu.Item>
                        </SubMenu>
                        <Menu.Item key="2">
                            <Icon type="video-camera"/>
                            <span>nav 2</span>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Icon type="upload"/>
                            <span>nav 3</span>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{background: '#fff', padding: 0}}>
                        <Icon
                            className="trigger"
                            type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.toggle}
                        />
                    </Header>
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            background: '#fff',
                            minHeight: 280,
                        }}
                    >
                        <RenderComponents componentName={this.state.componentName}/>
                    </Content>
                </Layout>
            </Layout>
        )
    }
}

export default Dashboard;
