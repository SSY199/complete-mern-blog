import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useNavigate } from 'react-router-dom';

function CreatePost() {
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();

  const handleUploadImage = async (e) => {
    try {
      const selectedFile = e.target.files[0];
      if (!selectedFile) {
        setImageUploadError('Please select an image');
        return;
      }

      setImageUploadError(null);
      setImageUploadProgress(0);

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      //formData.append('transformation', 'w_800,q_auto,f_auto'); // Cloudinary optimizations

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );

      if (!response.ok) throw new Error('Failed to upload image');

      const data = await response.json();
      setFormData((prev) => ({
        ...prev,
        image: data.secure_url,
      }));
      setImageUploadProgress(null);
    } catch {
      setImageUploadError('Failed to upload image');
      setImageUploadProgress(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/post/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        setPublishError(`Failed to publish post: ${errorText}`);
        return;
      }

      const data = await res.json();
      setPublishError(null);
      navigate(`/posts/${data.slug}`);
    } catch (error) {
      setPublishError('An unexpected error occurred');
      console.error(error);
    }
  };

  return (
    <div className='p-3 max-w-3xl mx-auto min-h-screen'>
      <h1 className='text-center text-3xl my-7 font-semibold'>Create a New Post</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 sm:flex-row justify-between'>
          <TextInput
            type='text'
            placeholder='Title'
            required
            id='title'
            className='flex-1'
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <Select
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
          />
          <Button type='button' gradientDuoTone='purpleToBlue' size='sm' outline disabled={imageUploadProgress}>
            {imageUploadProgress ? (
              <div className='w-16 h-16'>
                <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} />
              </div>
            ) : (
              'Upload image'
            )}
          </Button>
        </div>

        {imageUploadError && <div className='text-red-500 text-sm'>{imageUploadError}</div>}

        {/* Display image */}
         
        {formData.image && (
        <div className='relative group'>
          <img 
            src={formData.image}
            alt='Uploaded content'
            className='w-full aspect-video object-cover object-center mb-4 border-gray-200 border-2 rounded-lg shadow-2xl'
            loading='lazy'
            decoding='async'
          />
          <button
            type='button'
            className='absolute top-2 right-2 bg-red-500/90 hover:bg-red-600 text-white rounded-full p-2 transition-all'
            onClick={() => setFormData(prev => ({ ...prev, image: null }))}
            aria-label='Remove image'
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
          placeholder='Write your post here...'
          className='h-72 mb-12 dark:text-white'
          required
          onChange={(value) => setFormData({ ...formData, content: value })}
        />
        <Button type='submit' gradientDuoTone='purpleToPink' size='lg' className='w-full'>
          Publish Post
        </Button>
        {publishError && <Alert className='mt-5' color='failure'>{publishError}</Alert>}
      </form>
    </div>
  );
}

export default CreatePost;