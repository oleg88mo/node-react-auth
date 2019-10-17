import React, {Component} from 'react';

import UserInfo from './components/userInformation';
import Chat from './components/chat';
import Photos from './components/photos';

class RenderComponents extends Component {
    render() {
        const {componentName} = this.props;
        const component = () => {
            switch (componentName) {
                case 'userInformation':
                    return <UserInfo/>;
                case 'chat':
                    return <Chat/>;
                case 'photos':
                    return <Photos/>;
                default:
                    return null;
            }
        };

        return component();
    }

}

export default RenderComponents;
