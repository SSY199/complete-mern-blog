import { Link } from 'react-router-dom';
import CallToAction from '../Components/CallToAction';
import PostCard from '../Components/PostCard';
import { useEffect, useState } from 'react';

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/post/getPosts');
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);
  return (
    <div>
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto '>
        <h1 className='text-3xl font-bold lg:text-6xl'>Welcome to my Blog</h1>
        <p className='text-gray-300 text-xs sm:text-sm'>
        Welcome to our blog! Here, we share insightful articles, tutorials, and stories on a variety of topics ranging from technology and programming to lifestyle and personal development. Our goal is to provide valuable content that inspires, educates, and entertains our readers. Whether you are a tech enthusiast, a budding developer, or someone looking for inspiration, you will find something of interest here. Stay tuned for regular updates and feel free to join our community by subscribing to our newsletter.
        </p>
        <Link
          to='/search'
          className='text-xs sm:text-sm text-teal-500 font-bold hover:underline'
        >
          View all posts
        </Link>
      </div>
      <div className='p-3 w-[1200px] ml-40 justify-center items-center'>
        <CallToAction />
      </div>

      <div className='max-w-8xl mx-auto p-3 flex flex-col gap-8 py-7 justify-center items-center ml-20'>
        {posts && posts.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
            <div className='flex flex-wrap gap-4'>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link
              to={'/search'}
              className='text-lg text-teal-500 hover:underline text-center'
            >
              View all posts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}