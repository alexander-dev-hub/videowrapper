
import * as TYPES from './types';

export const setBackgroundSize = backgroundSize => dispatch => {
    dispatch({
        type: TYPES.SET_VIDEOSTEPPER_BACKGROUND_SIZE,
        payload: backgroundSize
    });
};

export const setVideo = video => dispatch => {
    dispatch({
        type: TYPES.SET_VIDEOSTEPPER_VIDEO,
        payload: video
    });
};

export const removeVideoByFileId = fileId => (dispatch, getState) => {
    const { videoStepper: { video } } = getState();
    if (video && video._id === fileId) {
        dispatch({
            type: TYPES.SET_VIDEOSTEPPER_VIDEO,
            payload: null
        });
    }
};

export const addVideoDuration = duration => (dispatch, getState) => {
    const { videoStepper: { video } } = getState();
    const newVideo = {
        ...video,
        duration
    };
    dispatch({
        type: TYPES.SET_VIDEOSTEPPER_VIDEO,
        payload: newVideo
    });
}

export const updateVideoSizePos = ({width, height, x, y}) => (dispatch, getState) => {
    const { videoStepper: { video, scale } } = getState();
    // store logical rendering size from physical size on canvas
    const logicalWidth = width * scale;
    const logicalHeight = height * scale;
    const logicalX = x * scale;
    const logicalY = y * scale;
    const newVideo = {
        ...video,
        width: logicalWidth,
        height: logicalHeight,
        x: logicalX,
        y: logicalY
    };
    dispatch({
        type: TYPES.SET_VIDEOSTEPPER_VIDEO,
        payload: newVideo
    });
};

export const addText = text => dispatch => {
    dispatch({
        type: TYPES.ADD_VIDEOSTEPPER_TEXT,
        payload: text
    });
};

export const updateText = (newText, updateIndex) => (dispatch, getState) => {
    const { videoStepper: { texts } } = getState();

    const newTexts = [...texts];
    newTexts[updateIndex] = newText;
    
    dispatch({
        type: TYPES.UPDATE_VIDEOSTEPPER_TEXTS,
        payload: newTexts
    });
};

export const removeText = removeIndex => (dispatch, getState) => {
    const { videoStepper: { texts } } = getState();

    const newTexts = [...texts];
    newTexts.splice(removeIndex, 1);
    
    dispatch({
        type: TYPES.UPDATE_VIDEOSTEPPER_TEXTS,
        payload: newTexts
    });
};

export const updateTextSizePos = clientId => (dispatch, getState) => ({width, height, x, y}) => {
    const { videoStepper: { texts, scale } } = getState();
    
    const targetIndex = texts.findIndex(element => element.clientId === clientId);
    const logicalWidth = width * scale;
    const logicalHeight = height * scale;
    const logicalX = x * scale;
    const logicalY = y * scale;
    const newText = {
        ...texts[targetIndex],
        width: logicalWidth,
        height: logicalHeight,
        x: logicalX,
        y: logicalY
    };
    const newTexts = [...texts];
    newTexts[targetIndex] = newText;
    
    dispatch({
        type: TYPES.UPDATE_VIDEOSTEPPER_TEXTS,
        payload: newTexts
    });
};

export const addGifImage = gifImage => (dispatch, getState) => {
    const payload = {
        clientId: Date.now(),
        ...gifImage
    };
    dispatch({
        type: TYPES.ADD_VIDEOSTEPPER_GIFIMAGE,
        payload
    });
};

export const removeGifImageByClientId = clientId => (dispatch, getState) => {
    const { videoStepper: { gifImages } } = getState();

    const targetIndex = gifImages.findIndex(element => element.clientId === clientId);
    const newGifImages = [...gifImages];
    newGifImages.splice(targetIndex, 1);

    dispatch({
        type: TYPES.UPDATE_VIDEOSTEPPER_GIFIMAGES,
        payload: newGifImages
    });
};

export const removeGifImageByFileId = fileId => (dispatch, getState) => {
    const { videoStepper: { gifImages } } = getState();

    const newGifImages = gifImages.filter(element => element._id !== fileId);

    dispatch({
        type: TYPES.UPDATE_VIDEOSTEPPER_GIFIMAGES,
        payload: newGifImages
    });
};

export const updateGifImageSizePos = clientId => (dispatch, getState) => ({width, height, x, y}) => {
    const { videoStepper: { gifImages, scale } } = getState();
    
    const targetIndex = gifImages.findIndex(element => element.clientId === clientId);
    const logicalWidth = width * scale;
    const logicalHeight = height * scale;
    const logicalX = x * scale;
    const logicalY = y * scale;
    const newGifImage = {
        ...gifImages[targetIndex],
        width: logicalWidth,
        height: logicalHeight,
        x: logicalX,
        y: logicalY
    };
    const newGifImages = [...gifImages];
    newGifImages[targetIndex] = newGifImage;
    
    dispatch({
        type: TYPES.UPDATE_VIDEOSTEPPER_GIFIMAGES,
        payload: newGifImages
    });
};

export const addSubtitle = subtitle => dispatch => {
    dispatch({
        type: TYPES.ADD_VIDEOSTEPPER_SUBTITLE,
        payload: subtitle
    });
};

export const updateSubtitle = (newSubtitle, updateIndex) => (dispatch, getState) => {
    const { videoStepper: { subtitles } } = getState();

    const newSubtitles = [...subtitles];
    newSubtitles[updateIndex] = newSubtitle;
    
    dispatch({
        type: TYPES.UPDATE_VIDEOSTEPPER_SUBTITLES,
        payload: newSubtitles
    });
};

export const removeSubtitle = removeIndex => (dispatch, getState) => {
    const { videoStepper: { subtitles } } = getState();

    const newSubtitles = [...subtitles];
    newSubtitles.splice(removeIndex, 1);
    
    dispatch({
        type: TYPES.UPDATE_VIDEOSTEPPER_SUBTITLES,
        payload: newSubtitles
    });
};

export const setScale = scale => dispatch => {
    dispatch({
        type: TYPES.SET_VIDEOSTEPPER_SCALE,
        payload: scale
    });
};

export const clearData = () => dispatch => {
    dispatch({
        type: TYPES.CLEAR_VIDEOSTEPPER_DATA
    });
};
