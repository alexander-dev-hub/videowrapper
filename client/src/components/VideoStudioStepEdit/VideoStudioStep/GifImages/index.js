
import React, { Fragment, Component } from 'react';
import { connect } from 'react-redux';

import ContainedButton from '../../../ContainedButton';
import DropzoneArea from '../../../DropzoneArea';
import CustomizedDialog from '../../../CustomizedDialog';
import ImageGrid from '../../../ImageGrid';
import { addGifImage, removeGifImageByClientId, removeGifImageByFileId } from '../../../../actions/videoStepper';
import AlertDialog from '../../../AlertDialog';
import RemoveList from '../../../RemoveList';
import Loading from '../../../Loading';
import config from '../../../../config';
import { getUploadedUrl, fetchData } from '../../../../utils/api';
import { uploadType, uploadAccessType, contentType } from '../../../../utils/links';
import { checkAnimationClubValidation } from '../../../../utils/utility';

class GifImages extends Component {
    state = {
        myUploadsModalOpen: false,
        page: 1,
        showLoadMoreButton: true,
        // animation club
        acModalOpen: false,
        // graphics pack gifs
        isMyUploadsLoading: false,
        myUploads: [],
        acAlertOpen: false,
        animationClub: [],
        // TODO: block graphics pack gifs
        // gpgModalOpen: false,
        // gpgAlertOpen: false,
        // gpgs: [],
        isACLoading: false
    };

    componentDidMount() {
        this._mounted = true;
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    fetchMyUploadsCallback = ({files: myUploads, showLoadMoreButton}) => {
        if (this._mounted) {
            this.setState({isMyUploadsLoading: false, myUploads, showLoadMoreButton});
        }
    };

    incrementPageNumber = (type) => {
        const { page } = this.state;
        this.setState({page: page + 1}, () => {
            if (type === contentType.animatedClub) {
                this.fetchAC();
            } else if (type === contentType.myUploads) {
                this.fetchMyUploads();
            }
        });
    };

    fetchMyUploads = () => {
        const { page } = this.state;
        const myUploadsUrl = getUploadedUrl(uploadType.gifImages, page);
        this.setState({isMyUploadsLoading: true});
        fetchData(myUploadsUrl, this.fetchMyUploadsCallback)
    };

    fetchACCallback = ({files: animationClub, showLoadMoreButton}) => {
        if (this._mounted) {
            this.setState({isACLoading: false, animationClub, showLoadMoreButton});
        }
    };

    fetchAC = () => {
        const { page } = this.state;
        const animationClubUrl = getUploadedUrl(uploadType.gifImages, page, uploadAccessType.public);
        this.setState({isACLoading: true});
        fetchData(animationClubUrl, this.fetchACCallback);
    };

    onMyUploadsClickHandler = () => {
        this.setState(({ page: 1 }), () => {
            this.myUploadsModalOpenCloseHandler(true);
            this.fetchMyUploads();
        })
    };

    onACClickHandler = () => {
        this.setState(({ page: 1 }), () => {
            this.acModalOpenCloseHandler(true);
            this.fetchAC();
        })
    };

    myUploadsModalOpenCloseHandler = opened => {
        this.setState({myUploadsModalOpen: opened});
    };
    
    acModalOpenCloseHandler = opened => {
        this.setState({acModalOpen: opened});
    };

    // TODO: block graphics pack gifs
    // gpgModalOpenCloseHandler = opened => {
    //     this.setState({gpgModalOpen: opened});
    // };

    myUploadsSelectHandler = gifImage => {
        const { addGifImage, editPreviewSwitched } = this.props;
        addGifImage(gifImage);

        this.setState({myUploadsModalOpen: false});
        editPreviewSwitched();
    };

    myUploadsDeleteHandler = response => {
        const { myUploads } = this.state;
        const { removeGifImageByFileId } = this.props;
        const { success, fileId } = response;
        if (success) {
            const newMyUploads = myUploads.filter(item => item._id !== fileId);
            this.setState({myUploads: newMyUploads});
            removeGifImageByFileId(fileId);
        }
    };

    acSelectHandler = gifImage => {
        const { addGifImage, editPreviewSwitched } = this.props;
        console.log('ray : [acSelectHandler] gifImage => ', gifImage);
        addGifImage(gifImage);

        this.setState({acModalOpen: false});
        editPreviewSwitched();
    };

    // TODO: block graphics pack gifs
    // gpgSelectHandler = gifImage => {
    //     const { addGifImage, editPreviewSwitched } = this.props;
    //     console.log('ray : [gpgSelectHandler] gifImage => ', gifImage);
    //     addGifImage(addGifImage);
    //     this.setState({gpgModalOpen: false});
    //     editPreviewSwitched();
    // };

    acAlertOpenCloseHandler = opened => {
        this.setState({acAlertOpen: opened});
    };

    // TODO: block graphics pack gifs
    // gpgAlertOpenCloseHandler = opened => {
    //     this.setState({gpgAlertOpen: opened});
    // };

    render() {
        const {
            isMyUploadsLoading,
            myUploads,
            myUploadsModalOpen,
            acAlertOpen,
            acModalOpen,
            animationClub,
            showLoadMoreButton
            // TODO: block graphics pack gifs
            // gpgModalOpen,
            // gpgAlertOpen,
            // gpgs
        } = this.state;
        const { videoStepperGifImages, removeGifImageByClientId, editPreviewSwitched, addGifImage, user } = this.props;
        const removeGifImageList = videoStepperGifImages.map(gifImage => {
            return {
                title: gifImage.clientId,
                handler: () => removeGifImageByClientId(gifImage.clientId)
            };
        });
        const myUploadsContent = isMyUploadsLoading ? (
            <Loading />
        ) : (
            <ImageGrid
                imageList={myUploads}
                incrementPageNumber={() => this.incrementPageNumber(contentType.myUploads)}
                showLoadMoreButton={showLoadMoreButton}
                selectHandler={this.myUploadsSelectHandler}
                deleteHandler={this.myUploadsDeleteHandler}
                gridCellHeight="auto"
                gridListSizeOverride={{width: '100%', height: '100%'}} />
        );
        const animationClubContent =
            <ImageGrid
                imageList={animationClub}
                incrementPageNumber={() => this.incrementPageNumber(contentType.animatedClub)}
                showLoadMoreButton={showLoadMoreButton}
                selectHandler={this.acSelectHandler}
                gridCellHeight="auto"
                gridListSizeOverride={{width: '100%', height: '100%'}} />;
        // TODO: block graphics pack gifs
        // const graphicsPackGifs =
        //     <ImageGrid
        //         imageList={gpgs}
        //         selectHandler={this.gpgSelectHandler}
        //         gridCellHeight="auto"
        //         gridListSizeOverride={{width: '100%', height: '100%'}} />;
        return (
            <Fragment>
                <div>
                    <CustomizedDialog
                        opened={myUploadsModalOpen}
                        closed={() => this.myUploadsModalOpenCloseHandler(false)}
                        title="Select GIF Images"
                        content={myUploadsContent} />
                    {/* TODO: not sure about scenario */}
                    <AlertDialog
                        opened={acAlertOpen}
                        closed={() => this.acAlertOpenCloseHandler(false)}
                        title="No Access"
                        content={['You have no access to the Animations club Videos.']} />
                    <CustomizedDialog
                        opened={acModalOpen}
                        closed={() => this.acModalOpenCloseHandler(false)}
                        title="Select GIF Images"
                        content={animationClubContent} />
                    {/* TODO: block graphics pack gifs */}
                    {/* TODO: not sure about scenario */}
                    {/* <AlertDialog
                        opened={gpgAlertOpen}
                        closed={() => this.gpgAlertOpenCloseHandler(false)}
                        title="No Access"
                        content={['You have no access to the Graphics Pack GIFs.']} /> */}
                    {/* <CustomizedDialog
                        opened={gpgModalOpen}
                        closed={() => this.gpgModalOpenCloseHandler(false)}
                        title="Select GIF Images"
                        content={graphicsPackGifs} /> */}
                    <DropzoneArea
                        noticeCore="animation image"
                        subNoticeCore="image"
                        switchToPreview={editPreviewSwitched}
                        addElementToPreview={addGifImage}
                        acceptedFiles={config.acceptedUploadImageFiles}
                        maxFileSize={config.uploadImageMaxSize}
                        uploadWhat={uploadType.gifImages} />
                    <ContainedButton
                        secondary
                        clicked={this.onMyUploadsClickHandler}>
                        My Uploads
                    </ContainedButton>
                    <ContainedButton
                        secondary
                        clicked={checkAnimationClubValidation(user) ?
                            this.onACClickHandler :
                            () => this.acAlertOpenCloseHandler(true)}>
                        Animation Club
                    </ContainedButton>
                    {/* TODO: block graphics pack gifs */}
                    {/* <ContainedButton
                        secondary
                        // TODO: validation check
                        clicked={() => this.gpgModalOpenCloseHandler(true)}>
                        clicked={() => this.gpgAlertOpenCloseHandler(true)}>
                        Graphics Pack GIFs
                    </ContainedButton> */}
                </div>
                <RemoveList list={removeGifImageList} />
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    user: state.auth.user,
    videoStepperGifImages: state.videoStepper.gifImages
});
const mapActionToProps = {
    addGifImage,
    removeGifImageByClientId,
    removeGifImageByFileId
};

export default connect(mapStateToProps, mapActionToProps)(GifImages);
