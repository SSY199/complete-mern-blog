//import React from 'react';
import { TextInput } from "flowbite-react";
import { useSelector } from "react-redux";
import { Button } from "flowbite-react";

function DashProfile() {
  const { currentUser } = useSelector((state) => state.user);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4">
        <div className="w-32 h-32 self-center cursor-pointer relative rounded-full overflow-hidden mt-4">
          <img
            src={currentUser.profilePicture}
            alt="profile"
            className="w-full h-full object-cover"
          />
        </div>
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          value={currentUser.username}
          label="Username"
        ></TextInput>
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          label="Email"
          value={currentUser.email}
        ></TextInput>
        <TextInput
          type="password"
          id="password"
          placeholder="password"
        ></TextInput>
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>
      </form>
      <div className="text-red-600 flex justify-between gap-4 mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign-Out</span>
      </div>
    </div>
  );
}

export default DashProfile;
