import React, {useState} from 'react'
import {Link} from 'react-router-dom'

function Navbar() {
    const [click, setClick] = useState(false)
    const click_Event = () => setClick(!click)
    const closeMobileMenu = () => setClick(false)
    return (
    <>
        <nav className='navbar'>
            <div className='navbar-container'>
                <Link to="/" className="navbar-logo">
                    TestSite <i className='fab fa-typo3' />
                </Link>
                <div className='menu-icon' onClick={click_Event}>
                    <i className={click ? 'fas fa-times': 'fas fa-bars'} />    
                </div>
                <ul className={click ? 'nav-menu active': 'nav-menu'}>
                    <li className='nav-item'>
                        <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                        Home
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to='/layout' className='nav-links' onClick={closeMobileMenu}>
                        Layout
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to='/contacts' className='nav-links' onClick={closeMobileMenu}>
                        Contacts
                        </Link>
                    </li>
                
                </ul>    
            </div>
        </nav>
    </>
  )
}

export default Navbar