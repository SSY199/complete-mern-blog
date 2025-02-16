import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function UpdatePost() {
  const { currentUser } = useSelector((state) => state.user);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const { postId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/post/getposts?postId=${postId}`);
        const data = await res.json();
        if (!res.ok) {
          setPublishError(data.message);
          return;
        }
        setFormData(data.posts[0]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPost();
  }, [postId]);

  const handleUploadImage = async (e) => {
    try {
      const selectedFile = e.target.files[0];
      if (!selectedFile) {
        setImageUploadError('Please select an image');
        return;
      }

      setImageUploadError(null);
      setImageUploadProgress(0);

      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedFile);
      uploadFormData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: uploadFormData }
      );

      if (!response.ok) throw new Error('Failed to upload image');

      const data = await response.json();
      const transformedImageUrl = data.secure_url.replace('/upload/', '/upload/c_fill,g_auto,h_300,w_300/');
      setFormData((prev) => ({
        ...prev,
        image: transformedImageUrl,
      }));
      setImageUploadProgress(null);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setImageUploadError('Failed to upload image');
      setImageUploadProgress(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/post/updatepost/${formData._id}/${currentUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        setPublishError(`Failed to update post: ${errorText}`);
        return;
      }

      const data = await res.json();
      navigate(`/post/${data.slug}`);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setPublishError('An unexpected error occurred');
    }
  };

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Update Post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput
            type='text'
            placeholder='Title'
            required
            id='title'
            className='flex-1'
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            value={formData.title || ''}
          />
          <Select
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            value={formData.category || ''}
          >
            <option value='uncategorized'>Select a category</option>
            <option value='programming'>Programming</option>
            <option value='politics'>Politics</option>
            <option value='finance'>Finance</option>
            <option value='sports'>Sports</option>
            <option value='entertainment'>Entertainment</option>
            <option value='health'>Health</option>
            <option value='science'>Science</option>
            <option value='other'>Other</option>
          </Select>
        </div>

        <div className='flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3'>
          <FileInput type='file' accept='image/*' onChange={handleUploadImage} />
          <TextInput
            type='text'
            placeholder='Caption'
            className='flex-1'
            onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
            value={formData.caption || ''}
          />
          <Button type='button' gradientDuoTone='purpleToBlue' size='sm' outline disabled={imageUploadProgress !== null}>
            {imageUploadProgress !== null ? (
              <div className='w-16 h-16'>
                <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
              </div>
            ) : (
              'Upload image'
            )}
          </Button>
        </div>

        {imageUploadError && <div className='text-red-500 text-sm'>{imageUploadError}</div>}

        {formData.image && (
          <div className='relative group'>
            <img 
              src={formData.image}
              alt='Uploaded'
              className='w-full aspect-video object-cover mb-4 rounded-lg'
            />
            <button
              type='button'
              className='absolute top-2 right-2 bg-red-500/90 text-white rounded-full p-2'
              onClick={() => setFormData(prev => ({ ...prev, image: null }))}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        <ReactQuill
          theme='snow'
          value={formData.content || ''}
          placeholder='Write your post here...'
          className='h-72 mb-12 dark:text-white'
          required
          onChange={(value) => setFormData({ ...formData, content: value })}
        />
        <Button type='submit' gradientDuoTone='purpleToPink' size='lg' className='w-full'>
          Update Post
        </Button>
        {publishError && <Alert className='mt-5' color='failure'>{publishError}</Alert>}
      </form>
    </div>
  );
}

export default UpdatePost;