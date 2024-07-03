import React from 'react';

export default function Navbar() {
  return (
    <nav className="bg-slate-800 text-white">
      <div className="mycontainer flex justify-between items-center px-4 py-5 h-15">
        {/* Logo Section */}
        <div className='logo font-bold text-4xl text-white'>
          <span className='text-green-700'> &lt;</span>
          <span>Pass</span><span className='text-green-700'>OP/&gt;</span>
        </div>
      </div>
    </nav>
  );
}
