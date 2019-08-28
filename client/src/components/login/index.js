import React, {Component} from "react";
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {Form, Icon, Input, Button} from 'antd';

class Login extends Component {
    async componentDidMount() {
        // await this.handlerLoggedIn()
    }

    // handlerLoggedIn = () => {
    //     axios.post('http://localhost:4000/api/user/login', {
    //         password: 'myname12345',
    //         email: 'myemail@gmail.com'
    //     })
    //         .then(function (response) {
    //             console.log('response',response);
    //         })
    //         .catch(function (error) {
    //             console.log('error',error);
    //         });
    // };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    };


    render() {
        const {getFieldDecorator} = this.props.form;

        return (
            <div className="login-form">
                <h2><Icon type="login"/> Login</h2>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Item>
                        {getFieldDecorator('username', {
                            rules: [{required: true, message: 'Please input your username!'}],
                        })(
                            <Input
                                prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                placeholder="Username"
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
                        <a className="login-form-forgot" href="">
                            Forgot password?
                        </a>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log in
                        </Button>
                        Or <Link to="/register">Register now!</Link>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

const mapStateToProps = state => ({});

const mapDispatchers = {};

const WrappedNormalLoginForm = Form.create({name: 'normal_login'})(Login);

export default connect(
    mapStateToProps,
    mapDispatchers,
)(WrappedNormalLoginForm);
