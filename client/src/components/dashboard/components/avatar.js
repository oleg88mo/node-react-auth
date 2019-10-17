import React, {Component} from 'react';
import {connect} from 'react-redux';

import { Avatar } from 'antd';

class UserAvatar extends Component {
    render() {
        let avatar = this.props.user && this.props.user.avatar;

        return <div className="logo">
            <Avatar shape="square" size={45} icon="user" src={avatar !== '' ? avatar : ''} />
        </div>
    }
}

const mapStateToProps = state => ({
    user: state.users.data,
});

export default connect(mapStateToProps, null)(UserAvatar);