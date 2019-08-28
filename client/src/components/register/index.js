import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import axios from 'axios';
import {
    Form,
    Input,
    Select,
    Checkbox,
    Button,
    Icon,
    Modal,
    notification
} from 'antd';

import {
    setUser
} from '../../redux/users/actions'

const {Option} = Select;

const openNotificationWithIcon = (type, description) => {
    notification[type]({
        message: '/register',
        description
    });
};

class Register extends Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        visible: false,
        agree: false,
        name: null,
        email: null,
        password: null,
        confirmPassword: null,
        country: null,
        selectedCountry: undefined,
        phone: null,
        countryPhone: null,
        selectedCountryPhone: undefined,
    };

    async componentWillMount() {
        await this.handlerGetCountry()
    }

    componentDidMount() {
        this.props.form.validateFields();
    }

    hasErrors = fieldsError => Object.keys(fieldsError).some(field => fieldsError[field]);

    handlerGetCountry = () => axios.get('https://restcountries.eu/rest/v2/all').then(res => {
        let country = res && res.data.map(country => {
                return {
                    name: country.name,
                    phone: country.callingCodes[0]
                };
            }
        );

        this.setState({country})
    });

    handlerRegister = e => {
        e.preventDefault();

        this.props.form.validateFieldsAndScroll(err => {
            if (!err) {
                const {name, email, password, selectedCountryPhone, selectedCountry} = this.state;

                axios.post('http://localhost:4000/api/user/register', {
                    name,
                    email,
                    password,
                    phone: selectedCountryPhone,
                    country: selectedCountry,
                })
                    .then(response => {
                        if (response && response.data) {
                            this.props.setUser(response.data.user)
                        }
                    })
                    .catch(error => {
                        openNotificationWithIcon('error', error.response.data)
                    });
            }
        });
    };

    handleConfirmBlur = e => {
        const {value} = e.target;

        this.setState({confirmDirty: this.state.confirmDirty || !!value});
    };

    compareToFirstPassword = (rule, value, callback) => {
        const {form} = this.props;

        if (value && value !== form.getFieldValue('password')) {
            callback('Two passwords is inconsistent!');
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, next) => {
        const {form} = this.props;

        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], {force: true});
        }
        next();
    };

    showModal = () => this.setState({visible: true});

    handleOk = () => this.setState({visible: false});

    handleCancel = () => this.setState({visible: false});

    onChange = e => this.setState({agree: e.target.checked});

    handlerSetUserValue = val => this.setState({...val});

    handlerChangeCountry = option => {
        if (option !== undefined) {
            let oneCountry = option.split(',');

            this.setState({
                countryPhone: `+${oneCountry[1]}`,
                selectedCountry: oneCountry[0]
            }, () => this.inputPhone.focus());
        } else {
            this.setState({countryPhone: null, selectedCountry: null})
        }
    };

    render() {
        const {getFieldDecorator, getFieldsError} = this.props.form;

        const {country, agree, countryPhone} = this.state;

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 10},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 14},
            },
        };

        return (
            <div className="register-form">
                <h2><Icon type="user"/> Register</h2>
                <Form {...formItemLayout} onSubmit={this.handlerRegister}>
                    <Form.Item label="Name">
                        {getFieldDecorator('name', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please input your name!',
                                },
                            ],
                        })(<Input
                            onChange={e => this.handlerSetUserValue({['name']: e.target.value !== "" ? e.target.value : null})}
                        />)}
                    </Form.Item>
                    <Form.Item label="E-mail">
                        {getFieldDecorator('email', {
                            rules: [
                                {
                                    type: 'email',
                                    message: 'The input is not valid E-mail!',
                                },
                                {
                                    required: true,
                                    message: 'Please input your E-mail!',
                                },
                            ],
                        })(<Input
                            onChange={e => this.handlerSetUserValue({['email']: e.target.value !== "" ? e.target.value : null})}
                        />)}
                    </Form.Item>
                    <Form.Item label="Password" hasFeedback>
                        {getFieldDecorator('password', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please input your password!',
                                },
                                {
                                    validator: this.validateToNextPassword,
                                },
                            ],
                        })(<Input.Password
                            onChange={e => this.handlerSetUserValue({['password']: e.target.value !== "" ? e.target.value : null})}
                        />)}
                    </Form.Item>
                    <Form.Item label="Confirm Password" hasFeedback>
                        {getFieldDecorator('confirm', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please confirm your password!',
                                },
                                {
                                    validator: this.compareToFirstPassword,
                                },
                            ],
                        })(<Input.Password
                            onBlur={this.handleConfirmBlur}
                            onChange={e => this.handlerSetUserValue({['confirmPassword']: e.target.value !== "" ? e.target.value : null})}
                        />)}
                    </Form.Item>
                    <Form.Item label="Country">
                        <Select
                            style={{width: '100%'}}
                            allowClear={true}
                            onChange={this.handlerChangeCountry}
                            showSearch
                            showArrow={true}
                        >
                            {country && country.map(c => (
                                <Option value={`${c.name},${c.phone}`} key={c.name}>{c.name}</Option>)
                            )}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Phone Number" className={`countryPhone ${countryPhone ? 'valid' : ''}`}>
                        <span className="print-phone">{countryPhone}</span>
                        <Input
                            ref={node => {
                                this.inputPhone = node
                            }}
                            onChange={e => this.handlerSetUserValue({['selectedCountryPhone']: e.target.value !== "" ? `${countryPhone}${e.target.value}` : undefined})}
                        />
                    </Form.Item>
                    <Form.Item className="full-center">
                        {getFieldDecorator('agreement', {
                            valuePropName: 'checked',
                        })(
                            <>
                                <Checkbox onChange={this.onChange}>
                                    I have read the
                                </Checkbox>
                                <a href="#" onClick={this.showModal}>agreement</a>
                            </>,
                        )}
                    </Form.Item>
                    <Form.Item className="full-center">
                        <Button type="primary" htmlType="submit" disabled={this.hasErrors(getFieldsError()) || !agree}>
                            Register
                        </Button>
                        <br/>
                        Or <Link to="/login">Logged in!</Link>
                    </Form.Item>
                </Form>
                <Modal
                    title="Basic Modal"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                >
                    <p>Some contents...</p>
                </Modal>
            </div>
        )
    }
}

const mapDispatchers = {setUser};
const WrappedRegistrationForm = Form.create({name: 'register'})(Register);
export default connect(null, mapDispatchers)(WrappedRegistrationForm);
