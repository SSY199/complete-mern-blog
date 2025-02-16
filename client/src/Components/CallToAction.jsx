//import React from 'react'

import { Button } from "flowbite-react";

export default function CallToAction() {
  return (
    <div className=" flex flex-col sm:flex-row p-3 border border-teal-400 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
      <div className="flex-1 justify-center flex flex-col">
          <h2 className="text-purple-600 text-2xl">
          Want to learn more about DSA???
        </h2>
        <p className="text-gray-500 my-2">
          Discover the world of Data Structures and Algorithms and unlock your passion for programming.
        </p>
        <Button gradientDuoTone="purpleToPink" className="rounded-tl-xl rounded-bl-none rounded-tr-none"><a href="https://www.geeksforgeeks.org/dsa-tutorial-learn-data-structures-and-algorithms/" target="_blank" rel="noopener noreferrer">160 days of DSA</a></Button>
      </div>
        <div className="p-7 flex-1">
          <img src="https://www.shutterstock.com/image-vector/dsa-letter-logo-design-illustration-600nw-2309157673.jpg" className="w-full h-48 object-cover" />
        </div>
    </div>
  )
}
