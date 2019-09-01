
import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';

import { setBackgroundSize } from '../../actions/videoStepper';
import { sizeDimensionName, setResponsiveStyle } from '../../utils/utility';

const styles = theme => {
    const mobileVideoPreviewDimension = {
        flexGrow: 1
    };
    const desktopVideoPreviewDimension = {
        flexGrow: 0
    };
    const breakpoint = 'sm';
    const videoPreviewDimension = setResponsiveStyle(breakpoint, theme, mobileVideoPreviewDimension, desktopVideoPreviewDimension);
    return { videoPreviewDimension }
};

const BackgroundSize = ({
    classes,
    setBackgroundSize,
    videoStepperBackgroundSize,
    videoStepperVideo,
    videoStepperTexts,
    videoStepperGifImages
}) => {
    const validateBackgroundSize = (dimensionName, newVal) => {
        const elements = videoStepperVideo ?
            [videoStepperVideo, ...videoStepperTexts, ...videoStepperGifImages] :
            [...videoStepperTexts, ...videoStepperGifImages];
        
        let invalid = {
            bgWidth: false,
            bgHeight: false
        };

        if (elements.length === 0) {
            return invalid;
        }

        switch(dimensionName) {
            case sizeDimensionName.width:
                const rightOverIndex = elements.findIndex(element => {
                    const rightEdge = element.x + element.width;
                    return rightEdge > newVal;
                });
                if (rightOverIndex >= 0) {
                    invalid.bgWidth = true;
                }
                break;
            case sizeDimensionName.height:
                const bottomOverIndex = elements.findIndex(element => {
                    const bottomEdge = element.y + element.height;
                    return bottomEdge > newVal;
                });
                if (bottomOverIndex >= 0) {
                    invalid.bgHeight = true;
                }
                break;
            default:
                break;
        }
        return invalid;
    };

    const sizeChangeHandler = dimensionName => event => {
        const newVal = event.target.value < 0 ? 0 : event.target.value;
        const invalid = validateBackgroundSize(dimensionName, newVal);
        switch(dimensionName) {
            case sizeDimensionName.width:
                const updatedWidth = parseInt(newVal, 10);
                if (invalid.bgWidth) {
                    return;
                }
                setBackgroundSize({
                    ...videoStepperBackgroundSize,
                    width: updatedWidth
                });
                break;
            case sizeDimensionName.height:
                const updatedHeight = parseInt(newVal, 10);
                if (invalid.bgHeight) {
                    return;
                }
                setBackgroundSize({
                    ...videoStepperBackgroundSize,
                    height: updatedHeight
                });
                break;
            default:
                break;
        }
    };
    return (
        // TODO: block negative numbers in width and height input
        <Box display="flex">
            <Box pt={1} pr={.5} className={classes.videoPreviewDimension}>
                <TextField
                    id="width"
                    label={`${sizeDimensionName.width} (px)`}
                    value={videoStepperBackgroundSize.width}
                    onChange={sizeChangeHandler(sizeDimensionName.width)}
                    type="number"
                    fullWidth
                    InputLabelProps={{
                        shrink: true
                    }}
                    margin="dense"
                    variant="outlined" />
            </Box>
            <Box pt={1} pl={.5} className={classes.videoPreviewDimension}>
                <TextField
                    id="height"
                    label={`${sizeDimensionName.height} (px)`}
                    value={videoStepperBackgroundSize.height}
                    onChange={sizeChangeHandler(sizeDimensionName.height)}
                    type="number"
                    fullWidth
                    InputLabelProps={{
                        shrink: true
                    }}
                    margin="dense"
                    variant="outlined" />
            </Box>
        </Box>
    );
};

const mapStateToProps = state => ({
    videoStepperBackgroundSize: state.videoStepper.backgroundSize,
    videoStepperVideo: state.videoStepper.video,
    videoStepperTexts: state.videoStepper.texts,
    videoStepperGifImages: state.videoStepper.gifImages
});
const mapActionToProps = {
    setBackgroundSize
};

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(BackgroundSize));
