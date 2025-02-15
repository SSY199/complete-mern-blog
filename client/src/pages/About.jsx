//import React from 'react';

function About() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[rgb(16,23,42)] p-5">
      <div className="max-w-4xl mx-auto py-16">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Welcome to our blog! Here, we share insightful articles, tutorials, and stories on a variety of topics ranging from technology and programming to lifestyle and personal development.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Our mission is to provide valuable content that inspires, educates, and entertains our readers. Whether you are a tech enthusiast, a budding developer, or someone looking for inspiration, you will find something of interest here.
          </p>
          <h2 className="text-3xl font-semibold mb-4">Meet the Team</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            We are a group of passionate individuals who love to share our knowledge and experiences with the world. Our team consists of experienced writers, developers, and content creators who are dedicated to bringing you the best content possible.
          </p>
          <h2 className="text-3xl font-semibold mb-4">Join Our Community</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Stay updated with the latest posts and exclusive content by subscribing to our newsletter. Join our community and be a part of the conversation!
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;