import { Table, Modal, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashUser() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/user/getusers`, {
          headers: {
            Authorization: `Bearer ${currentUser.token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setUsers(data.users);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        } else {
          console.error('Error fetching users:', data.message);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id, currentUser.isAdmin, currentUser.token]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setUsers([...users, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      } else {
        console.error('Error fetching more users:', data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      const response = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        console.log(data.message);
      } else {
        setUsers(users.filter(user => user._id !== userIdToDelete));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-800 dark:scrollbar-thumb-slate-600">
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date Created</Table.HeadCell>
              <Table.HeadCell>User Image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Role</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {users.map((user) => (
                <Table.Row key={user._id} className="border-white bg-slate-50 hover:bg-purple-400 dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <img src={user.profilePicture} alt={user.username} className="w-10 h-10 object-cover bg-gray-400 rounded-full" />
                  </Table.Cell>
                  <Table.Cell>
                    <span className="font-medium text-gray-950 dark:text-gray-50">{user.username}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="font-medium text-gray-950 dark:text-gray-50">{user.email}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="font-medium">{user.isAdmin ? "Admin" : "User"}</span>
                  </Table.Cell>
                  <Table.Cell>
                    <button className="text-red-500 font-medium hover:underline cursor-pointer" onClick={() => {
                      setShowModal(true);
                      setUserIdToDelete(user._id);
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
        <p>You have no users yet.</p>
      )}
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-500 dark:text-gray-300 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-600 dark:text-gray-400">Are you sure you want to delete this user?</h3>
            <div className="flex justify-center gap-6">
              <Button color="failure" onClick={handleDeleteUser}>Yes, I am sure</Button>
              <Button color="gray" onClick={() => setShowModal(false)}>Cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}