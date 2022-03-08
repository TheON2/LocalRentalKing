import {useEffect, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
//
import AppLayout from '../components/AppLayout';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import {LOAD_POSTS_REQUEST} from '../reducers/post';
import {LOAD_MY_INFO_REQUEST} from '../reducers/user';

const Home = () => {
  const dispatch = useDispatch();
  const {me} = useSelector((state) => state.user);
  const {mainPosts, hasMorePosts, loadPostsLoading} = useSelector(
    (state) => state.post,
  );
  const viewport = useRef(null);
  const target = useRef(null);

  useEffect(() => {
    const options = {
      root: viewport.current,
      threshold: 0,
    };

    const handleIntersection = (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        if (hasMorePosts && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch({
            type: LOAD_POSTS_REQUEST,
            lastId,
          });
        }
      });
    };

    const io = new IntersectionObserver(handleIntersection, options);

    if (target.current) {
      io.observe(target.current);
    }

    return () => io && io.disconnect();
  }, [viewport, target, loadPostsLoading, hasMorePosts, mainPosts]);

  return (
    <AppLayout ref={viewport}>
      {me && <PostForm/>}
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post}/>
      ))}
      <div ref={hasMorePosts && !loadPostsLoading ? target : undefined}/>
    </AppLayout>
  );
};

export default Home;