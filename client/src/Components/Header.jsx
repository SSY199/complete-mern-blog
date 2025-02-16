import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/userTheme.js";
import { signoutSuccess } from "../redux/user/userSlice.js";
import { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from 'react-icons/hi'; 
import { AiOutlineSearch } from "react-icons/ai";

function Header() {
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSignOutModal, setShowSignOutModal] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
 
    navigate(`/search?searchTerm=${searchTerm}`);
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch(`/api/user/signout`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Navbar className="dark:border-gray-700 bg-purple-600 text-white border-b border-gray-300">
      <Link to={"/"} className="ml-10">
        <h1 className="self-center whitespace-nowrap text-xl sm:text-2xl font-bold dark:text-white">
          <span className="px-2 py-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 rounded-lg text-black">DEV</span>NINJAS
        </h1>
      </Link>
      <form className="flex items-center" onSubmit={handleSearchSubmit}>
        <TextInput
          type="text"
          className="hidden lg:inline"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          rightIcon={AiOutlineSearch}
        />
        <Button className='w-12 h-10 lg:hidden' color='gray' pill type="submit">
          <AiOutlineSearch />
        </Button>
      </form>
      <div className="flex items-center space-x-4 md:order-2">
        <Button className="w-12 h-10 hidden sm:inline" color='gray' pill onClick={() => dispatch(toggleTheme())}>
          {theme === 'dark' ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser ? (
          <Dropdown arrowIcon={false} inline label={
            <Avatar alt="user" img={currentUser.profilePicture} rounded className="mr-10" />
          }>
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.username}</span>
              <span className="block text-sm font-medium truncate">{currentUser.email}</span>
            </Dropdown.Header>
            <Link to={'/dashboard?tab=profile'}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider></Dropdown.Divider>
            <Dropdown.Item onClick={() => setShowSignOutModal(true)}>Sign-Out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to='/signin'>
            <Button gradientDuoTone="purpleToBlue" outline>
              Sign-In
            </Button>
          </Link>
        )}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <div className="flex flex-col md:flex-row md:space-x-4">
          <Navbar.Link active={path === '/'} as={'div'}>
            <Link to='/' className="px-3 py-2 rounded-md text-sm font-medium">Home</Link>
          </Navbar.Link>
          <Navbar.Link active={path === '/about'} as={'div'}>
            <Link to='/about' className="px-3 py-2 rounded-md text-sm font-medium">About</Link>
          </Navbar.Link>
          <Navbar.Link active={path === '/projects'} as={'div'}>
            <Link to='/projects' className="px-3 py-2 rounded-md text-sm font-medium">Projects</Link>
          </Navbar.Link>
        </div>
      </Navbar.Collapse>

      <Modal show={showSignOutModal} onClose={() => setShowSignOutModal(false)} popup size='md'>
        <Modal.Header>
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="h-14 w-14 text-gray-500 dark:text-gray-300 mb-4 mx-auto"></HiOutlineExclamationCircle>
              <h3 className="mb-5 text-lg text-gray-600 dark:text-gray-400">Are you sure you want to sign out?</h3>
              <div className="flex justify-center gap-6">
                <Button color='failure' onClick={handleSignOut}>Yes, I am sure</Button>
                <Button color='gray' onClick={() => setShowSignOutModal(false)}>Cancel</Button>
              </div>
            </div>
          </Modal.Body>
        </Modal.Header>
      </Modal>
    </Navbar>
  );
}

export default Header;