import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import './Navbar.css'

function Navbar({orgRef}) {
    const [click, setClick] = useState(false)
    // eslint-disable-next-line
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
    const NavItems = () => {
        return(
            <>
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
                        <Link to='/authenticate' className='nav-links' onClick={closeMobileMenu}>
                        Authenticate
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to='/create' className='nav-links' onClick={closeMobileMenu}>
                        Create
                        </Link>
                    </li>
                    <li className='nav-item'>
                        <Link to='/manage' className='nav-links' onClick={closeMobileMenu}>
                        Manage
                        </Link>
                    </li>
                
                </ul> 
            </>
        )
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
                    Authenticator <i className='fab fa-typo3' />
                </Link>
                <>
                    {
                        orgRef.pkstr==="" || orgRef.pkstr===undefined
                        ?<></>
                        :<NavItems/>
                    }
                </>  
            </div>
        </nav>
    </>
  )
}

export default Navbar