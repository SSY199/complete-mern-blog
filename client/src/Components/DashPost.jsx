import { Table, Modal, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashPost() {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await response.json();
        if (response.ok) {
          setUserPosts(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    if (currentUser.isAdmin) {
      fetchPost();
    }
  }, [currentUser._id, currentUser.isAdmin]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(`/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUserPosts([...userPosts, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeletePost = async () => {
    setShowModal(false);
    try {
      const response = await fetch(`/api/post/deletepost/${postIdToDelete}/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (!response.ok) {
        console.log(data.message);
      } else {
        setUserPosts(userPosts.filter(post => post._id !== postIdToDelete));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell><span>Edit</span></Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {userPosts.map((post) => (
                <Table.Row key={post._id} className="border-white bg-slate-50 hover:bg-purple-400 dark:border-gray-800 dark:bg-gray-900">
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img src={post.image} alt={post.title} className="w-20 h-10 object-cover bg-gray-400" />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link className="font-medium text-gray-950 dark:text-gray-50" to={`/post/${post.slug}`}>{post.title}</Link>
                  </Table.Cell>
                  <Table.Cell>
                    {post.category}
                  </Table.Cell>
                  <Table.Cell>
                    <button className="text-red-700 font-medium hover:underline cursor-pointer" onClick={() => {
                      setShowModal(true);
                      setPostIdToDelete(post._id);
                    }}>Delete</button>
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/update-post/${post._id}`}>
                      <button className="text-teal-500 hover:underline">Edit</button>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore && (
            <div className="flex justify-center mt-5">
              <button
                onClick={handleShowMore}
                className="text-white bg-purple-500 px-4 py-2 rounded-md shadow-sm hover:bg-purple-600"
              >
                Show More
              </button>
            </div>
          )}
        </>
      ) : (
        <p>You have no posts yet. Create a new post by clicking on the Create Post button.</p>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-500 dark:text-gray-300 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-600 dark:text-gray-400">Are you sure you want to delete your Post?</h3>
            <div className="flex justify-center gap-6">
              <Button color="failure" onClick={handleDeletePost}>Yes, I am sure</Button>
              <Button color="gray" onClick={() => setShowModal(false)}>Cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}