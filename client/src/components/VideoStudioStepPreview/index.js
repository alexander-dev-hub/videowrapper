
import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import blueGrey from '@material-ui/core/colors/blueGrey';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';

import {
    updateVideoSizePos,
    updateTextSizePos,
    updateGifImageSizePos,
    addVideoDuration,
    setScale
} from '../../actions/videoStepper';
import { getSpacingUnit, measureElement, getPhysicalSize } from '../../utils/utility';
import { videoStudioSteps } from '../../utils/links';
import { convertDurationString } from '../../utils/utility';
import ResponsiveVideoPlayer from '../../components/ResponsiveVideoPlayer';
import ResponsiveImage from '../../components/ResponsiveImage';
import RNDWrapper from '../../hoc/RNDWrapper';
import BackgroundSize from '../BackgroundSize';

const styles = theme => {
    const spacingUnit = getSpacingUnit(theme);
    const root = {
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        border: '1px solid',
        height: '100%',
        backgroundColor: blueGrey[500]
    };
    const timeBar = {
        backgroundColor: blueGrey[300]
    };
    const videoPreviewSquare = {
        margin: spacingUnit * .5,
    };
    
    return { root, timeBar, videoPreviewSquare };
};

class VideoStudioStepPreview extends Component {
    componentDidMount() {
        this.setScaleHandler(0);
        // prevent scroll while dragging elements on iOS
        if (this._studioPreview) {
            this._studioPreview.addEventListener('touchmove', function(e) {
                e.preventDefault();
            }, { passive: false });
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.videoStepperBackgroundSize !== this.props.videoStepperBackgroundSize) {
            console.log('ray : [VideoStudioStepPreview componentDidUpdate] video stepper background size changed');
            this.setScaleHandler(0);
        } else {
            console.log('ray : [VideoStudioStepPreview componentDidUpdate] video stepper background size not changed');
        }
    }

    componentWillUnmount() {
        if (this._studioPreview) {
            this._studioPreview.removeEventListener('touchmove', function(e) {
                e.preventDefault();
            }, { passive: false });
        }
    }

    setScaleHandler = (widthOffset = 0) => {
        if (this._canvas) {
            const { videoStepperBackgroundSize, setScale } = this.props;
            const canvasSize = measureElement(this._canvas);
            const { width: physicalWidth } = canvasSize;
            const { width: logicalWidth } = videoStepperBackgroundSize;
            const scale = logicalWidth / (physicalWidth - widthOffset);
            setScale(scale);
        }
    };

    setDuration = seconds => {
        const { addVideoDuration } = this.props;
        const integerSeconds = parseInt(seconds, 10);
        addVideoDuration(integerSeconds);
    };

    render() {
        const {
            classes,
            videoStepperBackgroundSize,
            videoStepperVideo,
            videoStepperTexts,
            videoStepperGifImages,
            videoStepperScale,
            updateVideoSizePos,
            updateTextSizePos,
            updateGifImageSizePos,
        } = this.props;
        const canvasSize = getPhysicalSize(videoStepperBackgroundSize, videoStepperScale);
        let videoPreviewStyle = {
            backgroundColor: '#FFF', // static value set
            ...canvasSize
        };

        return (
            <Fragment>
                <Typography
                    align="center"
                    variant="subtitle1">
                    Everything Looks Good? Click NEXT
                </Typography>
                <Typography
                    align="center"
                    variant="subtitle1">
                    Need to Edit? Switch To Edit Mode Above
                </Typography>
                <BackgroundSize />
                <div
                    ref={r => { this._studioPreview = r; }}
                    className={classes.root}>
                    <Typography
                        className={classes.timeBar}
                        align="center"
                        variant="h6">
                        {(videoStepperVideo && convertDurationString(videoStepperVideo.duration)) || '00:00:00'}
                    </Typography>
                    <div
                        className={classes.videoPreviewSquare}
                        ref={r => { this._canvas = r; }}>
                        <Paper
                            style={videoPreviewStyle}
                            square
                            elevation={1}>
                            { videoStepperVideo && (
                                <RNDWrapper
                                    lockRatio
                                    element={videoStepperVideo}
                                    logicalCanvasSize={videoStepperBackgroundSize}
                                    scale={videoStepperScale}
                                    stepIndex={videoStudioSteps[0].index}
                                    updateSizePos={updateVideoSizePos}>
                                    <ResponsiveVideoPlayer
                                        durationHandler={this.setDuration}
                                        source={videoStepperVideo.url} />
                                </RNDWrapper>
                            ) }
                            { videoStepperTexts.length > 0 && (
                                videoStepperTexts.map(text => (
                                    <RNDWrapper
                                        key={text.clientId}
                                        element={text}
                                        logicalCanvasSize={videoStepperBackgroundSize}
                                        scale={videoStepperScale}
                                        stepIndex={videoStudioSteps[1].index}
                                        updateSizePos={updateTextSizePos(text.clientId)}>
                                        <ResponsiveImage
                                            clientId={text.clientId}
                                            source={text.dataUrl} />
                                    </RNDWrapper>
                                ))
                            ) }
                            { videoStepperGifImages.length > 0 && (
                                videoStepperGifImages.map((gifImage, index) => (
                                    <RNDWrapper
                                        key={gifImage.clientId}
                                        element={gifImage}
                                        gifIndex={index}
                                        logicalCanvasSize={videoStepperBackgroundSize}
                                        scale={videoStepperScale}
                                        stepIndex={videoStudioSteps[2].index}
                                        updateSizePos={updateGifImageSizePos(gifImage.clientId)}>
                                        <ResponsiveImage
                                            clientId={gifImage.clientId}
                                            source={gifImage.url} />
                                    </RNDWrapper>
                                ))
                            ) }
                        </Paper>
                    </div>
                </div>
            </Fragment>
        );
    };
}

const mapStateToProps = state => ({
    videoStepperBackgroundSize: state.videoStepper.backgroundSize,
    videoStepperVideo: state.videoStepper.video,
    videoStepperTexts: state.videoStepper.texts,
    videoStepperGifImages: state.videoStepper.gifImages,
    videoStepperScale: state.videoStepper.scale,
});
const mapActionToProps = {
    updateVideoSizePos,
    updateTextSizePos,
    updateGifImageSizePos,
    addVideoDuration,
    setScale
};

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(VideoStudioStepPreview));
