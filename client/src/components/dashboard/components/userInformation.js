import React from 'react';
import axios from "axios";
import {Form, Row, Col, Input, Button, Icon, Switch, Select} from 'antd';

const {Option} = Select;

class UserInfo extends React.Component {
    state = {
        expand: false,
        country: null,
        countryPhone: null,
        visiblePasswordBlock: false,
    };

    async componentWillMount() {
        await this.handlerGetCountry()
    }

    handleSearch = e => {
        e.preventDefault();

        this.props.form.validateFields((err, values) => {
            console.log('Received values of form: ', values);
        });
    };

    handleReset = () => this.props.form.resetFields();

    toggle = () => this.setState({expand: !this.state.expand});

    switchPasswordBlock = checked => this.setState({visiblePasswordBlock: checked});

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
        const {getFieldDecorator} = this.props.form;

        const {expand, visiblePasswordBlock, country, countryPhone} = this.state;

        return (
            <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
                <Row>
                    <Col span={24}>
                        <Form.Item label="Name">
                            {getFieldDecorator('name', {
                                rules: [
                                    {
                                        required: true,
                                        message: 'Name is required!',
                                    },
                                ],
                            })(<Input placeholder="name"/>)}
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="E-mail">
                            {getFieldDecorator('email', {
                                rules: [
                                    {
                                        type: 'email',
                                        message: 'The input is not valid E-mail!',
                                    },
                                    {
                                        required: true,
                                        message: 'E-mail is required!',
                                    },
                                ],
                            })(<Input placeholder="email"/>)}
                        </Form.Item>
                    </Col>

                    {expand &&
                    <>
                        <Col span={24}>
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
                            <Form.Item label="Phone number" className={`countryPhone ${countryPhone ? 'valid' : ''}`}>
                                <span className="print-phone">{countryPhone}</span>
                                <Input
                                    ref={node => {
                                        this.inputPhone = node
                                    }}
                                    onChange={e => this.handlerSetUserValue({['selectedCountryPhone']: e.target.value !== "" ? `${countryPhone}${e.target.value}` : undefined})}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <hr/>
                            <Form.Item label="Change password">
                                {getFieldDecorator(`field`, {})(<>
                                    <Switch onChange={this.switchPasswordBlock}/>

                                    {visiblePasswordBlock && <>
                                        <Input placeholder="password" type="password"/>
                                        <Input placeholder="password" type="password"/>
                                    </>}
                                </>)}
                            </Form.Item>
                        </Col>
                    </>}
                    <Col span={24} style={{textAlign: 'right'}}>
                        <a style={{marginBottom: 20, display: 'inline-block'}} onClick={this.toggle}>Collapse <Icon
                            type={expand ? 'up' : 'down'}/></a>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} style={{textAlign: 'right'}}>
                        <Button type="primary" htmlType="submit">Search</Button>
                        <Button style={{marginLeft: 8}} onClick={this.handleReset}>Clear</Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}

const WrappedUserInfo = Form.create({name: 'advanced_search'})(UserInfo);

export default WrappedUserInfo;
