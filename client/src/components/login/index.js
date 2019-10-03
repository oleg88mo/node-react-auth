import React, {Component} from "react";
import {Link} from 'react-router-dom';
import axios from 'axios';
import {Form, Icon, Input, Button, notification} from 'antd';

const openNotificationWithIcon = (type, description) => {
    notification[type]({
        message: '/register',
        description
    });
};

class Login extends Component {
    state = {
        loading: false
    };

    handlerLoggedIn = values => axios.post('http://localhost:4000/api/user/login', values)
        .then(response => {
            console.log('req.body----', response)
            window.localStorage.setItem('userFromMD', JSON.stringify(response.data.user));
            window.location = '/';
            this.setState({loading: false})
        })
        .catch(error => {
            openNotificationWithIcon('error', error.response.data)
            this.setState({loading: false})
        });

    handleSubmit = e => {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({loading: true}, () => this.handlerLoggedIn(values))
            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const {loading} = this.state;

        return (
            <div className="login-form-center">
                <div className="login-form">
                    <h2><Icon type="login"/> Login</h2>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Item>
                            {getFieldDecorator('email', {
                                rules: [
                                    {required: true, message: 'Please input your email!'},
                                    {type: 'email', message: 'The input is not valid E-mail!'}
                                ],
                            })(
                                <Input
                                    prefix={<Icon type="mail" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder="Email"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {
                                rules: [{required: true, message: 'Please input your Password!'}],
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    type="password"
                                    placeholder="Password"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item className="full-center">
                            <Button className="login-form-forgot">Forgot password?</Button>
                            <Button type="primary"
                                    htmlType="submit"
                                    disabled={loading}
                                    className="login-form-button"
                            >
                                {loading ?
                                    <Icon type="loading"/> :
                                    <Icon type="login"/>
                                } Log in</Button>
                            Or <Link to="/register">Register now!</Link>
                        </Form.Item>
                    </Form>
                </div>
            </div>)
    }
}

const WrappedNormalLoginForm = Form.create({name: 'normal_login'})(Login);
export default WrappedNormalLoginForm;
