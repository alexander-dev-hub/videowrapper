
import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';

import ImageGrid from '../../components/ImageGrid';
import headerOnlyImg from '../../assets/images/wrapper-list/header-only.jpg';
import footerOnlyImg from '../../assets/images/wrapper-list/footer-only.jpg';
import headerFooterImg from '../../assets/images/wrapper-list/header-and-footer.jpg';
import stepOne from '../../assets/images/wrapper-list/step-one.png';
import { pageLinks } from '../../utils/links';

const wrapperIdParamName = 'wrapperId';

const wrapperList = [
    {
        _id: 'header-and-footer',
        url: headerFooterImg,
        title: 'Header and Footer',
        subTitle: 'Paul Lynch'
    },
    {
        _id: 'header-only',
        url: headerOnlyImg,
        title: 'Header Only',
        subTitle: 'Paul Lynch'
    },
    {
        _id: 'footer-only',
        url: footerOnlyImg,
        title: 'Footer Only',
        subTitle: 'Paul Lynch'
    }
];

class WrapperList extends Component {
    wrapperClickHandler = tile => {
        const { history } = this.props;
        history.push({
            pathname: pageLinks.VideoStudio.url,
            search: `?${wrapperIdParamName}=${tile._id}`
        });
    };

    render () {
        // TODO: alt strategy unclear
        const imageGridTitle = <img height="64" src={stepOne} alt="choose your wrap" />;
        return (
            <Fragment>
                <ImageGrid
                    title={imageGridTitle}
                    imageList={wrapperList}
                    selectHandler={this.wrapperClickHandler}
                    gridCellHeight="auto"
                    gridListSizeOverride={{width: '100%', height: '100%'}} />
            </Fragment>
        );
    }
}

export default withRouter(WrapperList);
