
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import DropzoneArea from '../../components/DropzoneArea';
import ContainedButton from '../../components/ContainedButton';
import Loading from '../../components/Loading';
import VideoGrid from '../../components/VideoGrid';
import ImageGrid from '../../components/ImageGrid';
import CustomizedDialog from '../../components/CustomizedDialog';
import { getUploadedUrl, fetchData } from '../../utils/api';
import { uploadType, videoStudioSteps, uploadAccessType } from '../../utils/links';
import config from '../../config';
import { getSpacingUnit } from '../../utils/utility';

const styles = theme => {
    const spacingUnit = getSpacingUnit(theme);
    return {
        instructions: {
            paddingLeft: spacingUnit / 2,
            paddingRight: spacingUnit / 2
        }
    };
};

class Settings extends Component {
    state = {
        page: 1,
        showLoadMoreButton: true,
        acModalOpen: false,
        isACLoading: false,
        animationClubType: null,
        videoAnimationClub: [],
        gifAnimationClub: []
    };

    componentDidMount() {
        this._mounted = true;
    }

    componentWillUnmount() {
        this._mounted = false;
    }

    fetchVideoACCallback = ({files: animationClub, showLoadMoreButton}) => {
        if (this._mounted) {
            this.setState({isACLoading: false, videoAnimationClub: animationClub, showLoadMoreButton});
        }
    };

    fetchGifACCallback = ({files: animationClub, showLoadMoreButton}) => {
        if (this._mounted) {
            this.setState({isACLoading: false, gifAnimationClub: animationClub, showLoadMoreButton});
        }
    };

    incrementPageNumber = (type) => {
        const { page } = this.state;
        this.setState({page: page + 1}, () => {
            this.fetchAC(type);
        });
    }

    fetchAC = uploadTypeParam => {
        const { page } = this.state;
        const animationClubUrl = getUploadedUrl(uploadTypeParam, page, uploadAccessType.public);
        this.setState({isACLoading: true});
        if (uploadTypeParam === uploadType.video) {
            fetchData(animationClubUrl, this.fetchVideoACCallback);
        } else if (uploadTypeParam === uploadType.gifImages) {
            fetchData(animationClubUrl, this.fetchGifACCallback);
        }
    };

    onACClickHandler = uploadTypeParam => {
        this.setState({page: 1}, () => {
            this.acModalOpenCloseHandler(true, uploadTypeParam);
            this.fetchAC(uploadTypeParam);
        })
    };

    acModalOpenCloseHandler = (opened, uploadTypeParam) => {
        this.setState({acModalOpen: opened, animationClubType: uploadTypeParam});
    };

    videoACDeleteHandler = response => {
        const { success, fileId } = response;
        const { videoAnimationClub } = this.state;
        if (success) {
            const newVideoAnimationClub = videoAnimationClub.filter(item => item._id !== fileId);
            this.setState({videoAnimationClub: newVideoAnimationClub});
        }
    };

    gifACDeleteHandler = response => {
        const { success, fileId } = response;
        const { gifAnimationClub } = this.state;
        if (success) {
            const newGifAnimationClub = gifAnimationClub.filter(item => item._id !== fileId);
            this.setState({gifAnimationClub: newGifAnimationClub});
        }
    };

    render () {
        const { classes, user } = this.props;
        const {
            isACLoading,
            videoAnimationClub,
            gifAnimationClub,
            acModalOpen,
            animationClubType,
            showLoadMoreButton
        } = this.state;
        if (!(user && user.role && user.role.admin)) {
            return <Typography>No permission</Typography>
        }
        
        let animationClubContent = null;
        if (isACLoading) {
            animationClubContent = <Loading />;
        } else {
            if (animationClubType === uploadType.video) {
                animationClubContent = (
                    <VideoGrid
                        videoList={videoAnimationClub}
                        incrementPageNumber={() => this.incrementPageNumber(animationClubType)}
                        showLoadMoreButton={showLoadMoreButton}
                        deleteHandler={this.videoACDeleteHandler}
                        gridCellHeight="auto"
                        gridListSizeOverride={{width: '100%', height: '100%'}}
                        publicDelete={uploadAccessType.public} />
                );
            } else if (animationClubType === uploadType.gifImages) {
                animationClubContent = (
                    <ImageGrid
                        imageList={gifAnimationClub}
                        incrementPageNumber={() => this.incrementPageNumber(animationClubType)}
                        showLoadMoreButton={showLoadMoreButton}
                        deleteHandler={this.gifACDeleteHandler}
                        gridCellHeight="auto"
                        gridListSizeOverride={{width: '100%', height: '100%'}}
                        publicDelete={uploadAccessType.public} />
                );
            }
        }
        
        return (
            <Fragment>
                <CustomizedDialog
                    opened={acModalOpen}
                    closed={() => this.acModalOpenCloseHandler(false, null)}
                    title="Manage Animation Club"
                    content={animationClubContent} />
                <Box pt={2}>
                    <Box pb={6}>
                        <Typography className={classes.instructions}>{`Upload Animation Club(${videoStudioSteps[0].label})`}</Typography>
                        <DropzoneArea
                            noticeCore="animation video"
                            subNoticeCore="video"
                            switchToPreview={null}
                            addElementToPreview={null}
                            acceptedFiles={config.acceptedUploadVideoFiles}
                            maxFileSize={config.uploadVideoMaxSize}
                            uploadWhat={uploadType.video}
                            publicUpload
                            multiple />
                        <ContainedButton
                            secondary
                            clicked={() => this.onACClickHandler(uploadType.video)}>
                            Video Animation Club
                        </ContainedButton>
                    </Box>
                    <Box pb={6}>
                        <Typography className={classes.instructions}>{`Upload Animation Club(${videoStudioSteps[2].label})`}</Typography>
                        <DropzoneArea
                            noticeCore="animation image"
                            subNoticeCore="image"
                            switchToPreview={null}
                            addElementToPreview={null}
                            acceptedFiles={config.acceptedUploadImageFiles}
                            maxFileSize={config.uploadImageMaxSize}
                            uploadWhat={uploadType.gifImages}
                            publicUpload
                            multiple />
                        <ContainedButton
                            secondary
                            clicked={() => this.onACClickHandler(uploadType.gifImages)}>
                            GIF Animation Club
                        </ContainedButton>
                    </Box>
                </Box>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    user: state.auth.user
});

export default connect(mapStateToProps)(withStyles(styles)(Settings));
