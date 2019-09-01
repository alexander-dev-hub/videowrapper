
import React, { Fragment } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { connect } from 'react-redux';
import LoadingOverlay from 'react-loading-overlay';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './hoc/Layout';
import TemplateGallery from './containers/TemplateGallery';
import VideoGallery from './containers/VideoGallery';
import VideoStudio from './containers/VideoStudio';
import Register from './containers/Authentication/Register';
import Login from './containers/Authentication/Login';
import Logout from './containers/Authentication/Logout';
import ForgotPassword from './containers/Authentication/ForgotPassword';
import ResetPassword from './containers/Authentication/ResetPassword';
import Pricing from './containers/Pricing';
import Settings from './containers/Settings';
import NoMatch from './components/NoMatch';
import { pageLinks, jwtTokenKey } from './utils/links';
import { hasValidToken } from './utils/utility';
import setAuthToken from './security/setAuthToken';
import { getCurrentUser, logoutUser } from './actions/authentication';
import store from './store';

const OVERLAY_ZINDEX = 2000;
// TODO: store jwt token to redux state and rehydrate instead of local storage for security
// users can access local storage but not redux
// token expiration logic
if (localStorage.getItem(jwtTokenKey)) {
    setAuthToken(localStorage.getItem(jwtTokenKey));
    // TODO: no need key for token decryption
    const decoded = jwt_decode(localStorage.getItem(jwtTokenKey));
    store.dispatch(getCurrentUser(decoded));
    // TODO: server and client timezone -> error prone
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
        // routing history param is not needed because once refresing, routing structure will detect it automatically based on hasValidToken method
        store.dispatch(logoutUser());
    }
}

const App = ({ loadingStatus, user }) => {
  return (
    <Fragment>
        <ToastContainer />
        <LoadingOverlay
            active={loadingStatus.loading}
            spinner
            styles={{
            overlay: (base) => ({
                ...base,
                zIndex: OVERLAY_ZINDEX
            })
            }}
            text={loadingStatus.text}>
            <Switch>
                <Route path={pageLinks.Register.url} component={Register} />
                <Route path={pageLinks.Login.url} component={Login} />
                <Route path={pageLinks.Logout.url} component={Logout} />
                <Route path={pageLinks.ForgotPassword.url} component={ForgotPassword} />
                <Route path={pageLinks.ResetPassword.url} component={ResetPassword} />
                <Route render={ () => (
                // TODO: we must have one true source, we are supposed to use redux for authentication
                // localstorage is just for storing auth info considering when refreshing and redux state formating
                // double check whether we can use only redux for authentication state
                hasValidToken() ? (
                    <Layout>
                        <Switch>
                            {/* TODO: not sure about meaningful route urls */}
                            <Route path={pageLinks.TemplateGallery.url} component={TemplateGallery} />
                            <Route path={pageLinks.VideoGallery.url} component={VideoGallery} />
                            <Route path={pageLinks.VideoStudio.url} component={VideoStudio} />
                            <Route path={pageLinks.Pricing.url} component={Pricing} />
                            { user && user.role && user.role.admin && (
                                <Route path={pageLinks.Settings.url} component={Settings} />
                            ) }
                            <Route path={pageLinks.Home.url} exact component={VideoStudio} />
                            <Route component={NoMatch}/>
                        </Switch>
                    </Layout>
                ) : (
                    <Redirect to={pageLinks.Login.url} />
                )
                ) } />
            </Switch>
        </LoadingOverlay>
    </Fragment>
  );
}

const mapStateToProps = state => ({
    user: state.auth.user,
    loadingStatus: state.loadingStatus.loadingStatusParams
});

export default connect(mapStateToProps)(App);
