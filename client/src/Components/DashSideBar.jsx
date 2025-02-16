/* eslint-disable react/no-unescaped-entities */
import { Sidebar, Modal, Button } from "flowbite-react";
import {
  HiAnnotation,
  HiArrowSmRight,
  HiChartPie,
  HiDocumentText,
  HiOutlineUserGroup,
  HiUser,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { signoutSuccess } from "../redux/User/userSlice.js";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

function DashSidebar() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  const [showSignOutModal, setShowSignOutModal] = useState(false); // State for modal visibility
  const { currentUser } = useSelector((state) => state.user);

  const handleSignOut = async () => {
    try {
      const res = await fetch(`/api/user/signout`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setShowSignOutModal(false); // Close the modal after signing out
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <>
      <Sidebar className="md:w-56 shadow-2xl bg-gray-100 dark:bg-gray-800">
        <Sidebar.Items>
          <Sidebar.ItemGroup className="flex flex-col gap-1">
            {currentUser.isAdmin && (
              <Link to="/dashboard?tab=dash">
                <Sidebar.Item
                  active={tab === "dash" || !tab}
                  icon={HiChartPie}
                  as="div"
                >
                  Overview
                </Sidebar.Item>
              </Link>
            )}
            <Sidebar.Item
              as={Link}
              to="/dashboard?tab=profile"
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor="dark"
            >
              Profile
            </Sidebar.Item>
            {currentUser.isAdmin && (
              <Link to="/dashboard?tab=posts">
                <Sidebar.Item
                  active={tab === "posts"}
                  icon={HiDocumentText}
                  as="div"
                >
                  Posts
                </Sidebar.Item>
              </Link>
            )}
            {currentUser.isAdmin && (
              <>
                <Link to="/dashboard?tab=users">
                  <Sidebar.Item
                    active={tab === "users"}
                    icon={HiOutlineUserGroup}
                    as="div"
                  >
                    Users
                  </Sidebar.Item>
                </Link>
                <Link to="/dashboard?tab=comments">
                  <Sidebar.Item
                    active={tab === "comments"}
                    icon={HiAnnotation}
                    as="div"
                  >
                    Comments
                  </Sidebar.Item>
                </Link>
              </>
            )}
            <Sidebar.Item
              icon={HiArrowSmRight}
              className="cursor-pointer"
              onClick={() => setShowSignOutModal(true)} // Open the modal
            >
              Sign Out
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>

      {/* Sign Out Confirmation Modal */}
      <Modal
        show={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-500 dark:text-gray-300 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-600 dark:text-gray-400">
              Are you sure you want to sign out?
            </h3>
            <div className="flex justify-center gap-6">
              <Button color="failure" onClick={handleSignOut}>
                
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowSignOutModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default DashSidebar;