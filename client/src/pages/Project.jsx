//import React from 'react';
import CallToAction from '../Components/CallToAction';

function Projects() {
  const projects = [
    {
      title: "Project One",
      description: "This is a brief description of Project One. It involves technology X and solves problem Y.",
      link: "/projects/project-one"
    },
    {
      title: "Project Two",
      description: "This is a brief description of Project Two. It involves technology A and solves problem B.",
      link: "/projects/project-two"
    },
    {
      title: "Project Three",
      description: "This is a brief description of Project Three. It involves technology M and solves problem N.",
      link: "/projects/project-three"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-[rgb(16,23,42)] p-5">
      <div className="max-w-6xl mx-auto py-16">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">Our Projects</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Here are some of the projects we have worked on. Each project showcases our expertise and dedication to solving real-world problems.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-2">{project.title}</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{project.description}</p>
              <a href={project.link} className="text-teal-500 font-bold hover:underline">Read More</a>
            </div>
          ))}
        </div>
        <div className="mt-16">
          <CallToAction />
        </div>
      </div>
    </div>
  );
}

export default Projects;