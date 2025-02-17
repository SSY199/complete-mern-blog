import { Button, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CallToAction from "./CallToAction";
import CommentSection from "./CommentSection";
import PostCard from "./PostCard";

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [post, setPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recentPosts, setRecentPosts] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await response.json();
        if (!response.ok) {
          setShowError(true);
          setLoading(false);
          return;
        }
        setPost(data.posts[0]);
        setLoading(false);
      } catch {
        setShowError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const response = await fetch("/api/post/getposts?limit=3");
        const data = await response.json();
        if (response.ok) {
          setRecentPosts(data.posts.slice(0, 3));
        }
      };
      fetchRecentPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (showError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600 text-lg">Error loading post. Please try again later.</p>
      </div>
    );
  }

  return (
    <main className="p-3 flex flex-col max-w-8xl mx-auto min-h-screen">
      {/* Post Title */}
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post && post.title}
      </h1>
      <Link to={`/search?category=${post && post.category}`} className="self-center mt-5">
        <Button color="gray" pill size="xs">
          {post && post.category}
        </Button>
      </Link>

      {/* Post Image Section with Hover and Modal */}
      <div className="relative mt-10 group">
        <img
          src={post && post.image}
          alt={post && post.title}
          className="max-h-[600px] max-w-4xl object-cover justify-center items-center mx-auto w-full rounded-lg shadow-lg cursor-pointer transition-transform transform group-hover:scale-105"
          onClick={() => setIsModalOpen(true)} // Open modal on image click
        />
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 transition-all duration-300"
            onClick={() => setIsModalOpen(false)}
          >
            <img
              src={post?.image}
              alt={post?.title}
              className="max-w-full max-h-full rounded-lg shadow-lg object-contain"
            />
          </div>
        )}
      </div>

      {/* Post Metadata (Date and Read Time) */}
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {post && (post.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>

      {/* Post Content */}
      <div className="p-3 max-w-2xl mx-auto w-full post-content">
        <div dangerouslySetInnerHTML={{ __html: post && post.content }} />
      </div>

      {/* Call to Action */}
      <div className="max-w-4xl mx-auto w-full my-10">
        <CallToAction />
      </div>

      {/* Comment Section */}
      <CommentSection postId={post._id} />

      {/* Recent Posts Section */}
      <div className="flex flex-col justify-center items-center mb-5 mt-20">
        <h1 className="text-xl mt-5">Recent articles</h1>
        <div className="flex flex-wrap gap-5 max-w-8xl mt-5 justify-center">
          {recentPosts &&
            recentPosts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
        </div>
      </div>
    </main>
  );
}
