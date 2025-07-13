import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import React from "react";

const NavAuth = async () => {
  const { userId } = await auth();

  return !userId ? (
    <>
      <SignInButton mode="modal">
        <button className="text-xl font-medium xl:font-semibold text-left xl:py-2 hover:cursor-pointer">
          Sign In 
        </button>
      </SignInButton>
      <SignUpButton mode="modal">
        <button className="text-xl font-medium xl:font-semibold text-left xl:py-2 hover:cursor-pointer">
          Sign Up
        </button>
      </SignUpButton>
    </>
  ) : (
    <>
      <SignOutButton>
        <button className="text-xl font-medium xl:font-semibold text-left xl:py-2 hover:cursor-pointer">
          Sign Out
        </button>
      </SignOutButton>
      <UserButton />
    </>
  );
};

export default NavAuth;
