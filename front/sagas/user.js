import { all, call, fork, put, takeLatest, throttle } from "redux-saga/effects";
import axios from "axios";
import {
  CHANGE_NICKNAME_FAILURE,
  CHANGE_NICKNAME_REQUEST,
  CHANGE_NICKNAME_SUCCESS,
  LOAD_MY_INFO_FAILURE,
  LOAD_MY_INFO_REQUEST,
  LOAD_MY_INFO_SUCCESS,
  LOAD_USER_FAILURE,
  LOAD_USER_REQUEST,
  LOAD_USER_SUCCESS,
  LOAD_USERS_FAILURE,
  LOAD_USERS_REQUEST,
  LOAD_USERS_SUCCESS,
  LOG_IN_FAILURE,
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_OUT_FAILURE,
  LOG_OUT_REQUEST,
  LOG_OUT_SUCCESS,
  SIGN_UP_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
} from "../reducers/user";

function loadMyInfoAPI() {
  return axios.get("/user");
}
function SignUpAPI(data) {
  return axios.post("/user", data);
}
function loadUserAPI(data) {
  return axios.get(`/user/${data}`);
}
function loadUsersAPI() {
  return axios.get("/user/all");
}
function ChangeNickNameAPI(data) {
  return axios.patch("/user/nickname", { nickname: data });
}
function logInAPI(data) {
  return axios.post("/user/login", data);
}
function logOutAPI(data) {
  return axios.post("/user/logout", data);
}

function* loadMyInfo(action) {
  try {
    const result = yield call(loadMyInfoAPI, action.data);
    yield put({
      // put이 액션을 dispatch하는 역할과 빗슷하게 본다
      type: LOAD_MY_INFO_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_MY_INFO_FAILURE,
      error: err.response.data,
    });
  }
}
function* loadUser(action) {
  try {
    const result = yield call(loadUserAPI, action.data);
    yield put({
      // put이 액션을 dispatch하는 역할과 빗슷하게 본다
      type: LOAD_USER_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_USER_FAILURE,
      error: err.response.data,
    });
  }
}
function* loadUsers(action) {
  try {
    const result = yield call(loadUsersAPI, action.data);
    yield put({
      // put이 액션을 dispatch하는 역할과 빗슷하게 본다
      type: LOAD_USERS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_USERS_FAILURE,
      error: err.response.data,
    });
  }
}
function* logIn(action) {
  try {
    const result = yield call(logInAPI, action.data);
    yield put({
      // put이 액션을 dispatch하는 역할과 빗슷하게 본다
      type: LOG_IN_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOG_IN_FAILURE,
      error: err.response.data,
    });
  }
}
function* logOut(action) {
  try {
    yield call(logOutAPI, action.data);
    yield put({
      // put이 액션을 dispatch하는 역할과 빗슷하게 본다
      type: LOG_OUT_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: LOG_OUT_FAILURE,
      error: err.response.data,
    });
  }
}
function* signUp(action) {
  try {
    yield call(SignUpAPI, action.data);
    yield put({
      // put이 액션을 dispatch하는 역할과 빗슷하게 본다
      type: SIGN_UP_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: SIGN_UP_FAILURE,
      error: err.response.data,
    });
  }
}
function* changeNickName(action) {
  try {
    const result = yield call(ChangeNickNameAPI, action.data);
    yield put({
      // put이 액션을 dispatch하는 역할과 빗슷하게 본다
      type: CHANGE_NICKNAME_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: CHANGE_NICKNAME_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchLogin() {
  yield takeLatest(LOG_IN_REQUEST, logIn);
}
function* watchLogOut() {
  yield takeLatest(LOG_OUT_REQUEST, logOut);
}
function* watchSignUp() {
  yield takeLatest(SIGN_UP_REQUEST, signUp);
}
function* watchLoadMyInfo() {
  yield takeLatest(LOAD_MY_INFO_REQUEST, loadMyInfo);
}
function* watchChangenickName() {
  yield takeLatest(CHANGE_NICKNAME_REQUEST, changeNickName);
}
function* watchLoadUserInfo() {
  yield takeLatest(LOAD_USER_REQUEST, loadUser);
}
function* watchLoadUsersInfo() {
  yield takeLatest(LOAD_USERS_REQUEST, loadUsers);
}

export default function* userSaga() {
  yield all([
    fork(watchLogin),
    fork(watchLogOut),
    fork(watchSignUp),
    fork(watchLoadMyInfo),
    fork(watchLoadUserInfo),
    fork(watchLoadUsersInfo),
    fork(watchChangenickName),
  ]);
}
