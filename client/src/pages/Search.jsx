import { Button, Select, TextInput } from "flowbite-react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../Components/PostCard";
import { FaSearch, FaFilter, FaSync } from "react-icons/fa"; // Import icons

export default function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });

  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(true);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState("");

  useEffect(() => {
    //error(null);
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");

    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData((prevData) => ({
        ...prevData,
        searchTerm: searchTermFromUrl || prevData.searchTerm,
        category: categoryFromUrl || prevData.category,
        sort: sortFromUrl || prevData.sort,
      }));
    }

    const fetchPosts = async () => {
      setLoading(true);
      setError("");
      try {
        urlParams.set("limit", 8);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/post/getposts?${searchQuery}`);
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setShowMore(data.posts.length === 8);
        } else {
          setError(data.message || "Failed to fetch posts.");
        }
      } catch (error) {
        console.log(error);
        setError("An error occurred while fetching posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setSidebarData((prevData) => ({
      ...prevData,
      [id]: value || (id === "sort" ? "desc" : "uncategorized"),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    navigate(`/search?${urlParams.toString()}`);
  };

  const handleResetFilters = () => {
    setSidebarData({
      searchTerm: "",
      sort: "desc",
      category: "uncategorized",
    });
    navigate("/search");
  };

  const handleShowMore = async () => {
    const startIndex = posts.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/post/getposts?${searchQuery}`);
    const data = await res.json();
    if (res.ok) {
      setPosts([...posts, ...data.posts]);
      setShowMore(data.posts.length === 6);
    } else {
      setError(data.message || "Failed to fetch more posts.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      {/* Sidebar */}
      <div className="p-6 border-b border-gray-900 dark:border-slate-50 md:border-r md:min-h-screen rounded-lg bg-gray-50 dark:bg-gray-800">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label htmlFor="searchTerm" className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
              icon={FaSearch}
            />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="whitespace-nowrap font-semibold">
              Sort:
            </label>
            <Select id="sort" value={sidebarData.sort} onChange={handleChange}>
              <option value="desc">Latest</option>
              <option value="asc">Trending</option>
              <option value="title">Top</option>
              <option value="views">Most Views</option>
              <option value="comments">Most Comments</option>
              <option value="likes">Most Likes</option>
              <option value="createdAt">Oldest</option>
              <option value="updatedAt">Recently Updated</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="category" className="whitespace-nowrap font-semibold">
              Category:
            </label>
            <Select id="category" value={sidebarData.category} onChange={handleChange}>
              <option value="uncategorized">Uncategorized</option>
              <option value="technology">Technology</option>
              <option value="politics">Politics</option>
              <option value="sports">Sports</option>
              <option value="entertainment">Entertainment</option>
              <option value="health">Health</option>
              <option value="finance">Finance</option>
              <option value="science">Science</option>
              <option value="world">World</option>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button type="submit" outline gradientDuoTone="purpleToPink" className="flex-1">
              <FaFilter className="mr-2" /> Apply Filters
            </Button>
            <Button type="button" onClick={handleResetFilters} outline gradientDuoTone="pinkToOrange" className="flex-1">
              <FaSync className="mr-2" /> Reset
            </Button>
          </div>
        </form>
      </div>

      {/* Main Content */}
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-600 p-3 mt-5">Posts Result</h1>
        <div className="ml-20 p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          {!loading && posts.length === 0 && (
            <p className="text-lg text-center">No posts found. Try a different search term or category.</p>
          )}
          {loading && (
            <div className="flex justify-center items-center">
              <CircularProgressbar />
            </div>
          )}
          {!loading && posts && posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}

          

        </div>
        {showMore && (
          <div className="flex justify-center items-center mx-auto mb-5">
            <Button onClick={handleShowMore} outline gradientDuoTone="purpleToPink">Show More</Button>
          </div>
        )}
      </div>
    </div>
  );
}