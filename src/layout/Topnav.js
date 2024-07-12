import { signOut } from 'firebase/auth';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/Firebase';

function TopNav() {
    const navigate = useNavigate()
    const storeData = useSelector(store => store)
    const dispatch = useDispatch()

    const handleLogout = async () => {
        try {
            await signOut(auth)
            dispatch({ type: 'userData', payload: '' })
            navigate('/')
            window.location.reload()
        } catch (err) {
            console.log(err)
        }
    }

    const handleGetHome = () => {
        navigate('/')
        window.location.reload()
    }

    return (
        <nav className="navbar navbar-dark navbar-expand-lg" id="topnav">
            <div className="container">
                <h2 className='p-0 m-0 shadow-bottom text-white'><span className='cursor-pointer' onClick={() => handleGetHome()} ><span className='fs-1'>🌤️</span> Weather App</span></h2>
                <form className="form-inline me-4 d-none d-lg-flex">
                </form>
                <div className='navbar-user'>
                    {storeData?.user_data ?
                        <div className='d-flex align-items-center gap-2'>
                            <div><Link className='nav-link btn-sm btn btn-outline-light text-light' to={'/favorites'}><span className='mx-3'>Favorites</span></Link> </div>
                            <div className='dropdown'>
                                <div id='sidebarIcon' className='dropdown-toggle' role='button' data-bs-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                                    <div className='avatar avatar-sm avatar-onlines'>
                                        <img src='/img/glob.jpg' className='avatar-img rounded-circle' alt='...' />
                                    </div>
                                </div>
                                <div className='dropdown-menu dropdown-menu-end' aria-labelledby='sidebarIcon'>
                                    <div className="dropdown-item" style={{ 'cursor': 'pointer' }} onClick={() => navigate('/profile')}>Profile</div>
                                    <div className="dropdown-item" style={{ 'cursor': 'pointer' }} onClick={() => handleLogout()}>Logout</div>
                                </div>
                            </div>
                        </div>
                        :
                        <div>
                            <button className='btn btn-primary btn-sm me-3'><Link to='/login' className='nav-link'>Login</Link></button>
                            <button className='btn btn-dark btn-sm'><Link to='/signup' className='nav-link'>Sign up</Link></button>
                        </div>
                    }
                </div>
            </div>
        </nav>
    )
}

export default TopNav
