import React from "react";
import ThemeButton from "./ThemeButton";

const Header = () => {
  return (
    <header className="relative mx-auto flex items-center justify-between pb-7 pt-10 sm:pt-20">
      <h1 className="text-[1.7rem] font-bold tracking-[0.43rem] text-white sm:text-4xl">
        TODO
      </h1>
      <ThemeButton />
    </header>
  );
};

export default Header;
