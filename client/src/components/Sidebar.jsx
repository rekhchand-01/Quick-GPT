import React, { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { assets } from '../assets/assets'

const Sidebar = () => {

  const {chats, setSelectedChat, theme, setTheme, user} = useAppContext()
  const [search, setSearch] = useState('')

  return (
  <div className="flex flex-col h-screen min-w-72 p-5 border-r border-[#80609F]/30 backdrop-blur-3xl transition-all duration-500 max-md:absolute left-0 z-[1]">
    
    {/* Logo */}
    <img
      src={theme === 'dark' ? assets.logo_full : assets.logo_full_dark}
      alt="logo"
      className="w-full max-w-48"
    />

    {/* New Chat Button */}
    <button className="flex justify-center items-center w-full py-2 mt-10 text-white bg-gradient-to-r from-[#A456F7] to-[#3D81F7] text-sm rounded-md cursor-pointer">
      <span className="mr-2 text-xl">+</span>
      New Chat
    </button>

  </div>
);

}

export default Sidebar
