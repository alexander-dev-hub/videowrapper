
import React, { Fragment } from 'react';

import Video from './Video';
import Text from './Text';
import GifImages from './GifImages';
import Subtitles from './Subtitles';
import { videoStudioSteps } from '../../../utils/links';

const getCurrentStep = (editPreviewSwitched, stepIndex) => {
    let currentStepComponent;
    switch(stepIndex) {
        case videoStudioSteps[0].index:
            currentStepComponent = <Video editPreviewSwitched={editPreviewSwitched} />;
            break;
        case videoStudioSteps[1].index:
            currentStepComponent = <Text editPreviewSwitched={editPreviewSwitched} />;
            break;
        case videoStudioSteps[2].index:
            currentStepComponent = <GifImages editPreviewSwitched={editPreviewSwitched} />;
            break;
        case videoStudioSteps[3].index:
            currentStepComponent = <Subtitles />;
            break;
        default:
            break;
    }
    return currentStepComponent;
}

const VideoStudioStep = ({editPreviewSwitched, stepIndex}) => (
    <Fragment>
        {getCurrentStep(editPreviewSwitched, stepIndex)}
    </Fragment>
);

export default VideoStudioStep;
