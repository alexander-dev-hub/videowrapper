
import { videoStudioSteps } from './links';

const videoStepperValidate = (stepIndex, videoStepperState) => {
    const { backgroundSize, video } = videoStepperState;
    let valid = true;
    let alertStrings = [];
    switch(stepIndex) {
        case videoStudioSteps[0].index:
            if (!video) {
                valid = false;
                alertStrings = [
                    ...alertStrings,
                    'Please select video by clicking on My Uploads button.'
                ];
            }
            break;
        case videoStudioSteps[1].index:
            break;
        case videoStudioSteps[2].index:
            break;
        case videoStudioSteps[3].index:
            if (!backgroundSize || backgroundSize.width <= 0 || backgroundSize.height <= 0) {
                valid = false;
                alertStrings = [
                    ...alertStrings,
                    'Please input valid background size.'
                ];
            }
            break;
        default:
            break;
    }

    return { valid, alertStrings };
};

export {
    videoStepperValidate
};
