import React from 'react';
import axios from "axios";
import {connect} from 'react-redux';
import {Form, Row, Col, Input, Button, Icon, Switch, Select, Upload, message} from 'antd';

const {Option} = Select;

class UserInfo extends React.Component {
    state = {
        loadingAvatar: false,
        expand: false,
        country: null,
        visiblePasswordBlock: false,

        name: null,
        email: null,
        password: null,
        confirmPassword: null,
        selectedCountry: undefined,
        selectedCountryPhone: undefined,
        resetValue: {
            name: null,
            email: null,
            selectedCountry: undefined,
            selectedCountryPhone: undefined,
        },
        avatar: null,
    };

    static getDerivedStateFromProps(props, state) {
        if (props.user && !state.name) {
            const user = {
                name: props.user.name,
                email: props.user.email,
                selectedCountry: props.user.country,
                selectedCountryPhone: props.user.phone,
                avatar: props.user.avatar,
            };

            return {
                ...state,
                ...user,
                resetValue: {
                    ...user,
                }
            }
        }
    }

    async componentDidMount() {
        await this.handlerGetCountry();
    }

    handleChangeAvatar = info => {
        if (info.file.status === 'uploading') {
            this.setState({loadingAvatar: true});
            return;
        }
        if (info.file.status === 'done') {
            this.getBase64(info.file.originFileObj, avatar =>
                this.setState({
                    avatar,
                    loadingAvatar: false,
                }),
            );
        }
    };

    getBase64 = (img, callback) => {
        const reader = new FileReader();

        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    beforeUploadAvatar = file => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }

        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }

        return isJpgOrPng && isLt2M;
    };

    handlerSubmit = e => {
        e.preventDefault();

        this.props.form.validateFields(err => {
            if (!err) {
                this.handlerUpdateUser();
            }
        });
    };

    handlerUpdateUser = () => {
        console.log('state', this.state);

        axios.post('http://localhost:4000/api/user/update', this.state).then(res => {
            console.log('handlerUpdateUser', res);
        })
    };

    handlerReset = () => {
        const {resetValue} = this.state;

        this.setState({
            ...resetValue
        })
        // this.props.form.resetFields()
    };

    toggle = () => this.setState({expand: !this.state.expand});

    switchPasswordBlock = checked => this.setState({visiblePasswordBlock: checked});

    handlerGetCountry = () => axios.get('https://restcountries.eu/rest/v2/all').then(res => {
        let country = res && res.data.map(country => {
                return {
                    name: country.name
                };
            }
        );

        this.setState({country})
    });

    handlerChangeCountry = option => {
        if (option !== undefined) {
            this.setState({
                selectedCountry: option
            }, () => this.inputPhone.focus());
        } else {
            this.setState({selectedCountry: null})
        }
    };

    handlerSetUserValue = val => this.setState({...val});

    render() {
        const {
            expand,
            visiblePasswordBlock,
            country,
            name,
            email,
            selectedCountry,
            selectedCountryPhone,
            password,
            confirmPassword,

            avatar,
        } = this.state;
        // console.log('avatar',avatar);

        const uploadButtonAvatar = (
            <div>
                <Icon type={this.state.loadingAvatar ? 'loading' : 'plus'}/>
                <div className="ant-upload-text">Upload-!</div>
            </div>
        );

        return (
            <Form className="ant-advanced-search-form userInformation" onSubmit={this.handlerSubmit}>
                <Row>
                    <Col span={24}>
                        <span className="title">Name</span>
                        <Input
                            placeholder="Enter name"
                            value={name && name}
                            onChange={e => this.handlerSetUserValue({['name']: e.target.value !== "" ? e.target.value : null})}
                        />
                    </Col>
                    <Col span={24}>
                        <span className="title">Email</span>
                        <Input
                            placeholder="Enter email"
                            value={email && email}
                            onChange={e => this.handlerSetUserValue({['email']: e.target.value !== "" ? e.target.value : null})}
                        />
                    </Col>
                    {expand && <>
                        <Col span={24}>
                            {/*<Form.Item label="Country">*/}
                            {/*    <Select*/}
                            {/*        style={{width: '100%'}}*/}
                            {/*        allowClear={true}*/}
                            {/*        onChange={this.handlerChangeCountry}*/}
                            {/*        showSearch*/}
                            {/*        showArrow={true}*/}
                            {/*        defaultValue={selectedCountry && selectedCountry}*/}
                            {/*    >*/}
                            {/*        {country && country.map(c => (*/}
                            {/*            <Option value={c.name} key={c.name}>{c.name}</Option>)*/}
                            {/*        )}*/}
                            {/*    </Select>*/}
                            {/*</Form.Item>*/}
                            <div>
                                <span className="title">Country</span>
                                <Select
                                    style={{width: '100%'}}
                                    allowClear={true}
                                    onChange={this.handlerChangeCountry}
                                    showSearch
                                    showArrow={true}
                                    value={selectedCountry && selectedCountry}
                                >
                                    {country && country.map(c => (
                                        <Option value={c.name} key={c.name}>{c.name}</Option>)
                                    )}
                                </Select>
                            </div>
                            {/*<Form.Item label="Phone number">*/}
                            {/*    <Input*/}
                            {/*        ref={node => {*/}
                            {/*            this.inputPhone = node*/}
                            {/*        }}*/}
                            {/*        defaultValue={selectedCountryPhone && selectedCountryPhone}*/}
                            {/*        onChange={e => this.handlerSetUserValue({['selectedCountryPhone']: e.target.value !== "" ? e.target.value : undefined})}*/}
                            {/*    />*/}
                            {/*</Form.Item>*/}
                        </Col>
                        <Col span={24}>
                            <div>
                                <span className="title">Phone number</span>
                                <Input
                                    placeholder="Enter phone"
                                    value={selectedCountryPhone && selectedCountryPhone}
                                    ref={node => {
                                        this.inputPhone = node
                                    }}
                                    onChange={e => this.handlerSetUserValue({['selectedCountryPhone']: e.target.value !== "" ? e.target.value : null})}
                                />
                            </div>
                        </Col>
                        <Col span={24}>
                            <span className="title">Avatar</span>
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                beforeUpload={this.beforeUploadAvatar}
                                onChange={this.handleChangeAvatar}
                            >
                                {avatar ? <img src={avatar} alt="avatar" style={{width: '100%'}}/> : uploadButtonAvatar}
                            </Upload>

                            {avatar && <img src={`file://${avatar}`} alt="avatar" style={{width: '100px'}}/>}
                        </Col>
                        <Col span={24}>
                            <hr/>
                            <>
                                <Switch onChange={this.switchPasswordBlock}/> <span className="advancedSettings">Advanced settings</span>
                            </>
                        </Col>
                        <Col span={24}>
                            {visiblePasswordBlock && <>
                                <div>
                                    <span className="title">Change password</span>
                                </div>
                                <div>
                                    <Input
                                        style={{marginBottom: '5px'}}
                                        placeholder="Enter password"
                                        value={password && password}
                                        onChange={e => this.handlerSetUserValue({['selectedCountryPhone']: e.target.value !== "" ? e.target.value : null})}
                                    />
                                    <Input
                                        placeholder="Confirm password"
                                        value={confirmPassword && confirmPassword}
                                        onChange={e => this.handlerSetUserValue({['selectedCountryPhone']: e.target.value !== "" ? e.target.value : null})}
                                    />
                                </div>
                            </>}
                        </Col>
                    </>}
                    <Col span={24} style={{textAlign: 'right'}}>
                        <a style={{marginBottom: 20, display: 'inline-block'}} onClick={this.toggle}>Collapse <Icon
                            type={expand ? 'up' : 'down'}/></a>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} style={{textAlign: 'right'}}>
                        <Button style={{marginRight: 8}} onClick={this.handlerReset}>Clear</Button>
                        <Button type="primary" htmlType="submit">Submit</Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}


const mapStateToProps = state => ({
    user: state.users.data,
});

const WrappedUserInfo = Form.create({name: 'advanced_search'})(UserInfo);
export default connect(mapStateToProps, null)(WrappedUserInfo);
