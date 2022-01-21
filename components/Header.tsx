import Link from 'next/link'
import React from 'react'

function Header() {
  return (
    <header className="flex justify-between p-5 max-w-7xl mx-auto">
      <div className="flex items-center space-x-5">
        <Link href="/">
          <h1 className="font-bold text-3xl cursor-pointer text-red-700 font-serif">
            Apotheosis
          </h1>
        </Link>
        <div className="hidden md:inline-flex items-center space-x-5">
          <h3>Contact</h3>
          <h3 className="text-white bg-red-700 px-4 py-1 rounded-full">About</h3>
        </div>
      </div>

      <div className="flex items-center space-x-5 text-red-700">
        <h3>Sign In</h3>
      </div>
    </header>
  )
}

export default Header
;<h1>I aman a header</h1>
