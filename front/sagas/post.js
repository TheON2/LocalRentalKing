import {all, call, fork, put, takeLatest} from 'redux-saga/effects';
import axios from 'axios';
import {
  ADD_COMMENT_FAILURE,
  ADD_COMMENT_REQUEST,
  ADD_COMMENT_SUCCESS,
  ADD_POST_FAILURE,
  ADD_POST_REQUEST,
  ADD_POST_SUCCESS,
  LIKE_POST_FAILURE,
  LIKE_POST_REQUEST,
  LIKE_POST_SUCCESS, LOAD_CHANGE_TAG_FAILURE, LOAD_CHANGE_TAG_REQUEST, LOAD_CHANGE_TAG_SUCCESS,
  LOAD_HASHTAG_POSTS_FAILURE,
  LOAD_HASHTAG_POSTS_REQUEST,
  LOAD_HASHTAG_POSTS_SUCCESS,
  LOAD_LIKED_POSTS_FAILURE,
  LOAD_LIKED_POSTS_REQUEST,
  LOAD_LIKED_POSTS_SUCCESS,
  LOAD_POST_FAILURE,
  LOAD_POST_REQUEST,
  LOAD_POST_SUCCESS,
  LOAD_RELATED_POST_FAILURE,
  LOAD_RELATED_POST_REQUEST,
  LOAD_RELATED_POST_SUCCESS,
  LOAD_RENTAL_POST_FAILURE,
  LOAD_RENTAL_POST_REQUEST,
  LOAD_RENTAL_POST_SUCCESS, LOAD_SEARCH_POSTS_FAILURE, LOAD_SEARCH_POSTS_REQUEST, LOAD_SEARCH_POSTS_SUCCESS,
  LOAD_SPOST_FAILURE,
  LOAD_SPOST_REQUEST,
  LOAD_SPOST_SUCCESS,
  LOAD_USER_POSTS_FAILURE,
  LOAD_USER_POSTS_REQUEST,
  LOAD_USER_POSTS_SUCCESS,
  LOAD_WRITE_POST_FAILURE,
  LOAD_WRITE_POST_REQUEST,
  LOAD_WRITE_POST_SUCCESS,
  MODIFY_POST_FAILURE,
  MODIFY_POST_REQUEST,
  MODIFY_POST_SUCCESS,
  REMOVE_POST_FAILURE,
  REMOVE_POST_REQUEST,
  REMOVE_POST_SUCCESS, SEND_DUMMYPOST_FAILURE, SEND_DUMMYPOST_REQUEST, SEND_DUMMYPOST_SUCCESS,
  UNLIKE_POST_FAILURE,
  UNLIKE_POST_REQUEST,
  UNLIKE_POST_SUCCESS,
  UPLOAD_IMAGES_FAILURE,
  UPLOAD_IMAGES_REQUEST,
  UPLOAD_IMAGES_SUCCESS,
} from '../reducers/post';
import {ADD_POST_TO_ME, REMOVE_POST_OF_ME} from '../reducers/user';

function addPostAPI(data) {
  return axios.post('/post', data); // formdata 전송
}

function* addPost(action) {
  try {
    const result = yield call(addPostAPI, action.data);
    yield put({ // put이 액션을 dispatch하는 역할과 빗슷하게 본다
      type: ADD_POST_SUCCESS,
      data: result.data,
    });
    yield put({
      type: ADD_POST_TO_ME,
      data: result.data.id,
    });
  } catch (err) {
    yield put({
      type: ADD_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function sendDummyPostAPI(data) {
  return axios.post('/post/write', data); // formdata 전송
}

function* sendDummyPost(action) {
  try {
    const result = yield call(sendDummyPostAPI, action.data);
    yield put({ // put이 액션을 dispatch하는 역할과 빗슷하게 본다
      type: SEND_DUMMYPOST_SUCCESS,
      data: result.data,
    });
    yield put({
      type: ADD_POST_TO_ME,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: SEND_DUMMYPOST_FAILURE,
      error: err.response.data,
    });
  }
}

function removePostAPI(data) {
  return axios.delete(`/post/${data}`); // delete는 데이터를 가져갈 수 없다 data는 postId
}

function* removePost(action) {
  try {
    const result = yield call(removePostAPI, action.data);
    yield put({ // put이 액션을 dispatch하는 역할과 빗슷하게 본다
      type: REMOVE_POST_SUCCESS,
      data: result.data,
    });
    yield put({
      type: REMOVE_POST_OF_ME,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: REMOVE_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function loadPostAPI(data, lastId , boardNum, location) {
  console.log(data);
  return axios.get(`/posts/${encodeURIComponent(data)}/post?lastId=${lastId || 0}&boardNum=${boardNum || 0}&location=${encodeURIComponent(location)}`); // api 서버 요청은 /user/:userId/posts
}

function* loadPost(action) {
  try {
    const result = yield call(loadPostAPI, action.data, action.lastId , action.boardNum, action.location);
    yield put({ // put이 액션을 dispatch하는 역할과 비슷하게 본다
      type: LOAD_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function changeTagAPI(data , boardNum) {
  console.log(data);
  return axios.get(`/posts/${encodeURIComponent(data)}/tag?boardNum=${boardNum || 0}`); // api 서버 요청은 /user/:userId/posts
}

function* changeTag(action) {
  try {
    const result = yield call(changeTagAPI, action.data , action.boardNum);
    yield put({ // put이 액션을 dispatch하는 역할과 비슷하게 본다
      type: LOAD_CHANGE_TAG_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_CHANGE_TAG_FAILURE,
      error: err.response.data,
    });
  }
}

function loadSearchPostAPI(select, searchword , location ,boardNum , lastId) {
  return axios.get(`/posts/search?select=${encodeURIComponent(select)}&location=${encodeURIComponent(location)}
  &searchword=${encodeURIComponent(searchword)}&boardNum=${boardNum}&lastId=${lastId||0}`);
}// api 서버 요청은 GET/posts/search/

function* loadSearchPost(action) {
  try {
    const result = yield call(loadSearchPostAPI, action.select, action.searchword , action.location ,action.boardNum, action.lastId);
    yield put({ // put이 액션을 dispatch하는 역할과 비슷하게 본다
      type: LOAD_SEARCH_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_SEARCH_POSTS_FAILURE,
      error: err.response.data,
    });
  }
}

function rentalPostAPI(data, lastId) { // 대상유저 id
  console.log(data);
  return axios.get(`/posts/${(data)}/post?lastId=${lastId || 0}`); // api 서버 요청은 /user/:userId/posts
}

function* rentalPost(action) {
  try {
    const result = yield call(rentalPostAPI, action.data, action.lastId );
    yield put({ // put이 액션을 dispatch하는 역할과 비슷하게 본다
      type: LOAD_RENTAL_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_RENTAL_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function writePostAPI(data, lastId) { // 대상유저 id
  console.log(data);
  return axios.get(`/posts/${(data)}/post?lastId=${lastId || 0}`); // api 서버 요청은 /user/:userId/posts
}

function* writePost(action) {
  try {
    const result = yield call(writePostAPI, action.data, action.lastId );
    yield put({ // put이 액션을 dispatch하는 역할과 비슷하게 본다
      type: LOAD_WRITE_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_WRITE_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function loadSPostAPI(postId,postBoardNum) {
  return axios.get(`/post/singlepost?postId=${postId}&postBoardNum=${postBoardNum}`);
}

function* loadSPost(action) {
  try {
    const result = yield call(loadSPostAPI, action.postId,action.postBoardNum);
    yield put({ // put이 액션을 dispatch하는 역할과 빗슷하게 본다
      type: LOAD_SPOST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_SPOST_FAILURE,
      error: err.response.data,
    });
  }
}

function likePostAPI(data) {
  return axios.patch(`/post/${data}/like`);
}

function* likePost(action) {
  try {
    const result = yield call(likePostAPI, action.data);
    yield put({ // put이 액션을 dispatch하는 역할과 빗슷하게 본다
      type: LIKE_POST_SUCCESS,
      data: result.data, // PostId,UserId
    });
  } catch (err) {
    yield put({
      type: LIKE_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function unlikePostAPI(data) {
  return axios.delete(`/post/${data}/like`);
}

function* unlikePost(action) {
  try {
    const result = yield call(unlikePostAPI, action.data);
    yield put({ // put이 액션을 dispatch하는 역할과 빗슷하게 본다
      type: UNLIKE_POST_SUCCESS,
      data: result.data, // PostId,UserId
    });
  } catch (err) {
    yield put({
      type: UNLIKE_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function addCommentAPI(data) {
  return axios.post(`/post/${data.postId}/comment`, data);
}

function* addComment(action) {
  try {
    const result = yield call(addCommentAPI, action.data);
    yield put({ // put이 액션을 dispatch하는 역할과 비슷하게 본다
      type: ADD_COMMENT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({

      type: ADD_COMMENT_FAILURE,
      error: err.response.data,
    });
  }
}

function uploadImagesAPI(data) {
  return axios.post('/post/images', data); // formdata는 { name: data } 같은 식으로 감싸버리면 json으로 자동 변환되버린다.
}

function* uploadImages(action) {
  try {
    const result = yield call(uploadImagesAPI, action.data);
    yield put({ // put이 액션을 dispatch하는 역할과 비슷하게 본다
      type: UPLOAD_IMAGES_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: UPLOAD_IMAGES_FAILURE,
      error: err.response.data,
    });
  }
}

function loadUserPostsAPI(data, lastId) {
  return axios.get(`/user/${data}/posts?lastId=${lastId || 0}`); // api 서버 요청은 /user/:userId/posts
}

function* loadUserPosts(action) {
  try {
    const result = yield call(loadUserPostsAPI, action.data, action.lastId);
    yield put({ // put이 액션을 dispatch하는 역할과 비슷하게 본다
      type: LOAD_USER_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_USER_POSTS_FAILURE,
      error: err.response.data,
    });
  }
}

function RelatedPostAPI(lastId) {
  return axios.get(`/posts/related?lastId=${lastId || 0}`);
}

function* RelatedPost(action) {
  try {
    const result = yield call(RelatedPostAPI, action.data, action.lastId);
    yield put({ // put이 액션을 dispatch하는 역할과 비슷하게 본다
      type: LOAD_RELATED_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_RELATED_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function loadHashtagPostsAPI(data, lastId) {
  return axios.get(`/hashtag/${encodeURIComponent(data)}?lastId=${lastId || 0}`);
}

function* loadHashtagPosts(action) {
  try {
    const result = yield call(loadHashtagPostsAPI, action.data, action.lastId);
    yield put({ // put이 액션을 dispatch하는 역할과 비슷하게 본다
      type: LOAD_HASHTAG_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_HASHTAG_POSTS_FAILURE,
      error: err.response.data,
    });
  }
}

function loadLikedPostsAPI(data, lastId) {
  return axios.get(`/liked?lastId=${lastId || 0}`);
}

function* loadLikedPosts(action) {
  try {
    const result = yield call(loadLikedPostsAPI, action.data, action.lastId);
    yield put({ // put이 액션을 dispatch하는 역할과 비슷하게 본다
      type: LOAD_LIKED_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_LIKED_POSTS_FAILURE,
      error: err.response.data,
    });
  }
}

function modifyPostAPI(data) {
  return axios.patch(`/post/${data.PostId}`, data);
}

function* modifyPost(action) {
  try {
    const result = yield call(modifyPostAPI, action.data);
    yield put({ // put이 액션을 dispatch하는 역할과 빗슷하게 본다
      type: MODIFY_POST_SUCCESS,
      data: result.data, // PostId,UserId
    });
  } catch (err) {
    yield put({
      type: MODIFY_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchAddPost() {
  yield takeLatest(ADD_POST_REQUEST, addPost);
}

function* watchRemovePost() {
  yield takeLatest(REMOVE_POST_REQUEST, removePost);
}

function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}

function* watchLoadPost() {
  yield takeLatest( LOAD_POST_REQUEST, loadPost);
}

function* watchLikePost() {
  yield takeLatest(LIKE_POST_REQUEST, likePost);
}

function* watchUnLikePost() {
  yield takeLatest(UNLIKE_POST_REQUEST, unlikePost);
}

function* watchUploadImages() {
  yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}

function* watchLoadSPost() {
  yield takeLatest(LOAD_SPOST_REQUEST, loadSPost);
}

function* watchLoadUserPosts() {
  yield takeLatest(LOAD_USER_POSTS_REQUEST, loadUserPosts);
}

function* watchLoadHashtagPosts() {
  yield takeLatest(LOAD_HASHTAG_POSTS_REQUEST, loadHashtagPosts);
}

function* watchModifyPost() {
  yield takeLatest(MODIFY_POST_REQUEST, modifyPost);
}

function* watchLoadRelatedPost() {
  yield takeLatest(LOAD_RELATED_POST_REQUEST, RelatedPost);
}

function* watchLoadLikedtagPosts() {
  yield takeLatest(LOAD_LIKED_POSTS_REQUEST, loadLikedPosts);
}

function* watchLoadRentalPost() {
  yield takeLatest(LOAD_RENTAL_POST_REQUEST, rentalPost);
}

function* watchLoadWritePost() {
  yield takeLatest(LOAD_WRITE_POST_REQUEST, writePost);
}

function* watchLoadSearchPost() {
  yield takeLatest(LOAD_SEARCH_POSTS_REQUEST, loadSearchPost);
}

function* watchSendDummyPost() {
  yield takeLatest(SEND_DUMMYPOST_REQUEST, sendDummyPost);
}

function* watchLoadChangeTag() {
  yield takeLatest(LOAD_CHANGE_TAG_REQUEST, changeTag);
}

export default function* postSaga() {
  yield all([
    fork(watchAddPost),
    fork(watchLoadSPost),
    fork(watchLoadPost),
    fork(watchLoadRelatedPost),
    fork(watchLoadHashtagPosts),
    fork(watchLoadLikedtagPosts),
    fork(watchLoadUserPosts),
    fork(watchLikePost),
    fork(watchUnLikePost),
    fork(watchRemovePost),
    fork(watchModifyPost),
    fork(watchAddComment),
    fork(watchUploadImages),
    fork(watchLoadRentalPost),
    fork(watchLoadWritePost),
    fork(watchLoadSearchPost),
    fork(watchSendDummyPost),
    fork(watchLoadChangeTag),
  ]);
}
