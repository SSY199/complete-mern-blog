import { Table, Modal, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashComments() {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`/api/comment/getcomments`, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        } else {
          console.log('Error fetching comments:', data.message);
        }
      } catch (error) {
        console.log('Error:', error);
      }
    };
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser._id, currentUser.isAdmin, currentUser.token]);

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(`/api/comment/getcomments?startIndex=${startIndex}`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setComments([...comments, ...data.comments]);
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      } else {
        console.log('Error fetching more comments:', data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteComment = async () => {
    setShowModal(false);
    try {
      const response = await fetch(`/api/comment/deleteComment/${commentIdToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        console.log(data.message);
      } else {
        setComments(comments.filter(comment => comment._id !== commentIdToDelete));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-800 dark:scrollbar-thumb-slate-600">
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>No. of Likes</Table.HeadCell>
              <Table.HeadCell>PostId</Table.HeadCell>
              <Table.HeadCell>UserId</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {comments.map((comment) => (
                <Table.Row key={comment._id} className="border-white bg-slate-50 hover:bg-purple-400 dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <span className="font-medium text-gray-950 dark:text-gray-50">{comment.content}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="font-medium text-gray-950 dark:text-gray-50">{comment.numberOfLikes}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="font-medium text-gray-950 dark:text-gray-50">{comment.postId}</span>
                  </Table.Cell>
                  <Table.Cell>
                     <span className="font-medium text-gray-950 dark:text-gray-50">{comment.userId}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <button className="text-red-500 font-medium hover:underline cursor-pointer" onClick={() => {
                      setShowModal(true);
                      setCommentIdToDelete(comment._id);
                    }}>Delete</button>
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
        <p>You have no comments yet.</p>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-500 dark:text-gray-300 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-600 dark:text-gray-400">Are you sure you want to delete this comment?</h3>
            <div className="flex justify-center gap-6">
              <Button color="failure" onClick={handleDeleteComment}>Yes, I am sure</Button>
              <Button color="gray" onClick={() => setShowModal(false)}>Cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}