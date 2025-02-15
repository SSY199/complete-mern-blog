import  { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSideBar from '../Components/DashSideBar';
import DashProfile from '../Components/DashProfile';
import DashPost from '../Components/DashPost';
import DashUser from '../Components/DashUser';
import DashComment from '../Components/DashComment';
import DashComp from '../Components/DashComp';

function Dashboard() {
  const [tab, setTab] = useState('profile');
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-15% bg-gray-100 dark:bg-gray-800">
        <DashSideBar />
      </div>
      {/* Main Content */}
      <div className="flex-1 p-4">
        {tab === 'profile' && <DashProfile />}
        {/* Posts */}
        {tab === 'posts' && <DashPost />}
        {/* Users */}
        {tab === 'users' &&  <DashUser />}
        {/* comments */}
        {tab === 'comments' && <DashComment />}
        {/* Dashboard Component */}
        {tab === 'dash' && <DashComp />}
      </div>
    </div>
  );
}

export default Dashboard;