import React, {Component} from 'react';
import axios from "axios";
import {connect} from 'react-redux';
import {Skeleton, Card, Row, Col} from 'antd';
import {getPhotos} from '../../../redux/users/actions'

class Photos extends Component {
    async componentDidMount() {
        await this.handlerGetPhoto();
    }

    handlerGetPhoto = () => {
        if (!this.props.photos.length) {
            axios.get('http://localhost:4000/api/user/photo/all').then(res => this.props.getPhotos(res.data))
        }
    };

    render() {
        const {photos} = this.props;

        return (
            <>
                <Row>
                    {photos && photos.length > 0 ?
                        photos.map(photo => {
                            if (photo.isImage) {
                                return (
                                    <Col span={8} style={{paddingLeft: 8, paddingRight: 8}} key={photo._id}>
                                        <Card>
                                            <img src={`http://localhost:4000/image/${photo.filename}`}/>
                                        </Card>
                                    </Col>
                                )
                            } else {
                                return photo.filename
                            }
                        })
                        : (
                            <>
                                {
                                    [1, 2, 3].map(i => (
                                        <Col span={8} style={{paddingLeft: 8, paddingRight: 8}} key={i}>
                                            <Card>
                                                <Skeleton avatar active/>
                                            </Card>
                                        </Col>
                                    ))
                                }
                            </>
                        )
                    }
                </Row>
            </>
        )
    }
}

const mapDispatchers = {
    getPhotos,
};
const mapStateToProps = state => ({
    photos: state.users.photos,
});

export default connect(mapStateToProps, mapDispatchers)(Photos);
