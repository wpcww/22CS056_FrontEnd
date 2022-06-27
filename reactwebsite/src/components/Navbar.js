import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import './Navbar.css'
import {Button} from './Button';

function Navbar() {
    const [click, setClick] = useState(false)
    const [button, setButton] = useState(false)

    const click_Event = () => setClick(!click)
    const closeMobileMenu = () => setClick(false)
    const showButton = () => {
        if(window.innerWidth <= 960) {
            setButton(false)
        } else{
            setButton(true)
        }
    }
    
    useEffect(() => {
        showButton();
    },[]);
    
    window.addEventListener('resize', showButton)

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
                {button && <Button buttonStyle='btn--outline'>BUT here</Button>}    
            </div>
        </nav>
    </>
  )
}

export default Navbar