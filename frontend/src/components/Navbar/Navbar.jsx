import React from 'react'
import './Navbar.css'

const Navbar = () => {
  return (
    <>
    <nav className="navbar">
      <div className="navbar__logo">Новостной портал</div>
      <div className="navbar__links">
        <a href="/register" className="navbar__link">Регистрация</a>
        <a href="/login" className="navbar__link">Вхoд</a>
      </div>
    </nav>
    </>
  )
}

export default Navbar