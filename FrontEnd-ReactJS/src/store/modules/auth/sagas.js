import { all, call, put, takeLatest } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import api from '~/services/api';
import * as AuthActions from './actions';
import history from '~/services/history';

export function* signIn({ payload }) {
    try {
        const { email, password } = payload;

        const response = yield call(api.post, 'sessions', { email, password });

        const { token, user } = response.data;

        if (!user.provider) {
            toast.error('Unauthorized, this user is not a provider.');
            yield put(AuthActions.signFailure());
            return;
        }

        api.defaults.headers.Authorization = `Barear ${token}`;

        yield put(AuthActions.signInSucess(token, user));

        history.push('/dashboard');
    } catch (error) {
        toast.error(
            'Autentication fail, please check your email and password.'
        );
        yield put(AuthActions.signFailure());
    }
}

export function* signUp({ payload }) {
    try {
        const { name, email, password } = payload;

        yield call(api.post, 'users', {
            name,
            email,
            password,
            provider: true,
        });

        history.push('/');
        toast.success('Account created with sucess');
    } catch (error) {
        toast.error('Please check your informations and try again.');
        yield put(AuthActions.signFailure());
    }
}

export function setToken({ payload }) {
    if (!payload) return;

    const { token } = payload.auth;

    api.defaults.headers.Authorization = `Barear ${token}`;
}

export function signOut() {
    history.push('/');
}

export default all([
    takeLatest('persist/REHYDRATE', setToken),
    takeLatest('@auth/SIGN_IN_REQUEST', signIn),
    takeLatest('@auth/SIGN_UP_REQUEST', signUp),
    takeLatest('@auth/SIGN_OUT', signOut),
]);
