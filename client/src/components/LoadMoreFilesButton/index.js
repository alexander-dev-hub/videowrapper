import React from 'react'
import IconContainedButton from '../IconContainedButton';

const LoadMoreFilesButton = ({ incrementPageNumber }) => (
    <IconContainedButton
        primary
        clicked={() => incrementPageNumber()}>
        LOAD MORE FILES
    </IconContainedButton>
)

export default LoadMoreFilesButton