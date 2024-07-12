import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/Firebase';

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [password, showPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleSignin = async () => {
        try {
            let userData = ''
            if (formData?.email && formData?.password) {
                userData = await signInWithEmailAndPassword(auth, formData?.email, formData?.password);
                console.log(userData?.user?.emailVerified, 'hello user data')
                if (userData?.user?.emailVerified) {
                    console.log(userData?.user)
                    dispatch({
                        type: 'userData', payload: {
                            name: userData?.user?.displayName, email: userData?.user?.email, id: userData?.user?.uid
                        }
                    })
                    navigate('/')
                    toast.success('Logged in successfully')
                } else {
                    toast.error('User not verified please check your email')
                }
            }
        } catch (err) {
            console.log(err)
            toast.error('invalid username/password')
        }
    }

    const handleChange = (e, type) => {
        setFormData((prev) => ({ ...prev, [type]: e.target.value }))
    }

    return (
        <div className="container-fluid">
            <div className="row justify-content-center">
                <div className="col-12 col-md-5 col-lg-6 col-xl-4 px-lg-6 my-5 align-self-center">
                    <h1 className="display-4 text-center mb-3">Sign in</h1>
                    <p className="text-body-secondary text-center mb-5">
                        Free access to our <Link to={'/'}>dashboard</Link>.
                    </p>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="form-group">
                            <label className="form-label m-0">Email Address<b className='text-danger'>*</b></label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="name@address.com"
                                value={formData?.email}
                                required
                                onChange={(e) => handleChange(e, 'email')}
                            />
                        </div>
                        <div className="form-group">
                            <div className="row">
                                <div className="col">
                                    <label className="form-label m-0">Password<b className='text-danger'>*</b></label>
                                </div>
                            </div>
                            <div className="input-group input-group-merge">
                                <input
                                    className="form-control"
                                    type={`${password ? 'text' : 'password'}`}
                                    placeholder="Enter your password"
                                    value={formData?.password}
                                    required
                                    onChange={(e) => handleChange(e, 'password')}
                                />
                                <span className="input-group-text">
                                    <i className={`${password ? 'fe fe-eye-off' : 'fe fe-eye'} cursor-pointer`} onClick={() => showPassword(!password)} />
                                </span>
                            </div>
                        </div>
                        <button className="btn btn-lg w-100 btn-primary mb-3" onClick={() => handleSignin()}>
                            Sign in
                        </button>
                        <p className="text-center">
                            <small className="text-body-secondary text-center">
                                Don't have an account yet?{" "}
                                <Link to={'/signup'}>
                                    Sign up
                                </Link>
                                .
                            </small>
                        </p>
                    </form>
                </div>
                <div className="col-12 col-md-7 col-lg-6 col-xl-8 d-none d-lg-block">
                    <div
                        className="bg-cover h-100 min-vh-100 mt-n1 me-n3"
                        style={{
                            backgroundImage: "url(/img/auth-side-cover.jpg)"
                        }}
                    />
                </div>
            </div>
        </div>

    )
}

export default Login