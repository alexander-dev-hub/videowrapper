module.exports = {
    publicUploadDev: false, // upload to public clubs for dev
    newAnimatedBannerUrl: 'https://www.facebook.com/videowrapprofficial/videos/152377878980905/',
    acceptedUploadImageFiles: 'image/*',
    uploadImageMaxSize: 50000000,
    initialBackgroundSize: {
        width: 600,
        height: 600
    },
    acceptedUploadVideoFiles: 'video/*',
    uploadVideoMaxSize: 5000000000,
    ttfFontListPathPrefix: './assets/fonts/',

    stripe: {
        publicKey: 'pk_test_WZ83WqUtiRIHQYl5r7VeXqui',
        currency: 'USD'
    },
    proxyUrl: 'http://localhost:3001',
};
