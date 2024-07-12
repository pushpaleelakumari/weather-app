import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/Firebase';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signOut } from 'firebase/auth';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

function Signup() {
    const navigate = useNavigate();
    const [password, showPassword] = useState(false)
    const [confirmPassword, showConfirmPassword] = useState(false)
    const [spinner, showSpinner] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirm_password: '',
        city: ''
    });

    const handleChange = (e, type) => {
        setFormData((prev) => ({ ...prev, [type]: e.target.value }));
    };

    const handleSignup = async () => {
        try {
            showSpinner(true)
            if (formData.email && formData.name && formData.password) {
                if (formData.password === formData.confirm_password) {
                    const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                    const user = userCredential.user;

                    // Update the profile to set the display name
                    await updateProfile(user, {
                        displayName: formData.name,
                        photoURL: formData.city
                    });

                    // Send email verification
                    await sendEmailVerification(user);
                    await signOut(auth)
                    toast.success('User created successfully. Please verify your email.');
                    navigate('/login');
                    showSpinner(false)
                } else {
                    toast.error('Password and confirm password must be the same');
                    showSpinner(false)
                }
            }
        } catch (err) {
            console.error(err);
            toast.error(err.message.includes('email-already-in-use') ? 'email already exist' : '');
            showSpinner(false)
        }
    };

    return (
        <div className="container-fluid">
            <div className="row justify-content-center">
                <div className="col-12 col-md-5 col-lg-6 col-xl-4 px-lg-6 my-5 align-self-center">
                    <h1 className="display-4 text-center mb-3">Sign up</h1>
                    <p className="text-body-secondary text-center mb-5">
                        Free access to our <Link to={'/'}>dashboard</Link>.
                    </p>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <div className="form-group">
                            <label className="form-label m-0">Name<b className='text-danger'>*</b></label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="eg: John"
                                required
                                value={formData.name}
                                onChange={(e) => handleChange(e, 'name')}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label m-0">City<b className='text-danger'>*</b></label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="eg: John"
                                required
                                value={formData.city}
                                onChange={(e) => handleChange(e, 'city')}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label m-0">Email Address<b className='text-danger'>*</b></label>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="name@address.com"
                                required
                                value={formData.email}
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
                                    required
                                    value={formData.password}
                                    onChange={(e) => handleChange(e, 'password')}
                                />
                                <span className="input-group-text">
                                    <i className={`${password ? 'fe fe-eye-off' : 'fe fe-eye'} cursor-pointer`} onClick={() => showPassword(!password)} />
                                </span>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="row">
                                <div className="col">
                                    <label className="form-label m-0">Confirm password<b className='text-danger'>*</b></label>
                                </div>
                            </div>
                            <div className="input-group input-group-merge">
                                <input
                                    className="form-control"
                                    type={`${confirmPassword ? 'text' : 'password'}`}
                                    placeholder="Enter your password"
                                    required
                                    value={formData.confirm_password}
                                    onChange={(e) => handleChange(e, 'confirm_password')}
                                />
                                <span className="input-group-text">
                                    <i className={`${confirmPassword ? 'fe fe-eye-off' : 'fe fe-eye'} cursor-pointer`} onClick={() => showConfirmPassword(!confirmPassword)} />
                                </span>
                            </div>
                        </div>
                        <Spinner show={spinner}>
                            <button className="btn btn-lg w-100 btn-primary mb-3" onClick={handleSignup}>
                                Sign up
                            </button>
                        </Spinner>
                        <p className="text-center">
                            <small className="text-body-secondary text-center">
                                Already have an account?{" "}
                                <Link to={'/login'}>
                                    Login
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
    );
}

export default Signup;
