import React from "react";
import ReactDOM from "react-dom";
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import reducers from "./redux";
import {Layout} from 'antd';
// components & style
import 'antd/dist/antd.css';
import './index.css';
import App from "./app";
import Contacts from "./components/contacts";
import Catalog from "./components/catalog";
import Nav from "./components/nav";
import Login from "./components/login";
import Register from "./components/register";
import Protected from './components/protected';
import PageNotFound from './components/404';

const store = createStore(reducers, composeWithDevTools(applyMiddleware(thunk)));

const {Content, Footer} = Layout;

const Root = () => {
    return (
        <Provider store={store}>
            <Router>
                <Layout>
                    <Nav/>
                    <Content style={{background: '#fff', padding: '0 50px', marginTop: 64}}>
                        <div className="content-container">
                            <Switch>
                                <Route exact path="/" component={App}/>
                                <Route path="/contacts" component={Contacts}/>
                                <Route path="/catalog" component={Catalog}/>
                                <Route path="/login" component={Login}/>
                                <Route path="/register" component={Register}/>

                                <Protected exact path="/admin"/>
                                <Route component={PageNotFound}/>
                            </Switch>
                        </div>
                    </Content>
                    <Footer>Ant Design ©2018 Created by Ant UED</Footer>
                </Layout>
            </Router>
        </Provider>
    );
};

ReactDOM.render(<Root/>, document.getElementById("web"));
