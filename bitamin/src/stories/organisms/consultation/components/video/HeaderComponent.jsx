import React from 'react'

const HeaderComponent = ({ isPrivate, title }) => {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="flex items-center">
        {isPrivate ? (
          <span className="text-red-500 mr-2">🔒</span>
        ) : (
          <span className="text-green-500 mr-2">🔓</span>
        )}
        <span className="text-lg font-semibold">{title}</span>
      </div>
    </div>
  )
}

export default HeaderComponent
