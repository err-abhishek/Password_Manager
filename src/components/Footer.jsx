import React from "react";

export default function Footer() {
  return (
    <footer className="bg-slate-800 flex flex-col justify-center items-center text-white gap-2 py-4 fixed bottom-0 w-full">
      <div className="logo font-bold text-2xl text-white">
        <span className="text-green-700"> &lt;</span>
        <span>Pass</span>
        <span className="text-green-700">OP/&gt;</span>
      </div>
      <div className="font-semibold">Created By Abhishek</div>
    </footer>
  );
}
