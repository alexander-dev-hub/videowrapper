
// TODO: pageLinks structure is not good, some hardcoded
const pageLinks = {
    Home: {
        url: '/'
    },
    TemplateGallery: {
        url: '/select-template'
    },
    VideoGallery: {
        url: '/my-videos'
    },
    VideoStudio: {
        url: '/design-video'
    },
    Register: {
        url: '/register'
    },
    Login: {
        url: '/login'
    },
    Logout: {
        url: '/logout'
    },
    ForgotPassword: {
        url: '/forgot-password'
    },
    ResetPassword: {
        url: '/reset-password'
    },
    Pricing: {
        url: '/pricing'
    },
    Settings: {
        url: '/settings'
    }
};

const jwtTokenKey = 'jwtToken';

const getBreadCrumbName = link => {
    let breadCrumbName
    Object.keys(pageLinks)
        .forEach(key => {
            if (pageLinks[key].url === link) {
                breadCrumbName = key;
            }
        });
    return breadCrumbName;
};

const videoStudioSteps = [
    {
        index: 0,
        label: 'Video',
        content: 'Upload or select a Video.',
        initialSize: {
            width: 50
        },
        optional: false
    },
    {
        index: 1,
        label: 'Text',
        content: 'Don\'t want to add Text? Just click NEXT.',
        initialSize: {
            width: 50
        },
        optional: true
    },
    {
        index: 2,
        label: 'GIF & Images',
        content: 'Don\'t want to add GIFs or images? Just click NEXT.',
        initialSize: {
            width: 300
        },
        optional: true
    },
    {
        index: 3,
        label: 'Subtitles',
        content: 'Don\'t want to add Subtitles? Just click FINISH.',
        optional: true
    }
];

// since it should have full size at first, the positioning is annoying
const initialElementPosition = {
    x: 0,
    y: 0
};

const initialBackgroundColor = '#757575'; // grey[600]
const defaultFontWeight = 900;

const uploadType = {
    video: 'video',
    gifImages: 'gif-images',
    createdVideo: 'created-video'
};

// TODO: improve progressively
const uploadAccessType = {
    private: 0,
    public: 1
};

const contentType = {
    animatedClub: 'animatedClub',
    myUploads: 'myUploads'
}

export { 
    pageLinks,
    getBreadCrumbName,
    jwtTokenKey,
    videoStudioSteps,
    uploadType,
    uploadAccessType,
    initialElementPosition,
    initialBackgroundColor,
    defaultFontWeight,
    contentType
};
