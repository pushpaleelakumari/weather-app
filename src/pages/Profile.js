import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { updateProfile } from 'firebase/auth';
import { auth } from '../firebase/Firebase';

function Profile() {
    const user = useSelector(state => state?.user_data);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        id: ''
    });


    // eslint-disable-next-line
    const handleGetData = () => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                id: user.id || ''
            });
        }
    };

    const handleChange = (e, type) => {
        setFormData((prev) => ({ ...prev, [type]: e.target.value }));
    };

    const handleUpdate = async () => {
        if (formData.name.trim() === '') {
            toast.error('Name cannot be empty');
            return;
        }

        try {
            const currentUser = auth.currentUser;
            if (currentUser) {
                await updateProfile(currentUser, { displayName: formData.name });
                toast.success('Profile updated successfully');
                // Optionally, update the local state or Redux store
            } else {
                toast.error('No user is signed in');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        }
    };

    useEffect(() => {
        handleGetData();
    }, [user, handleGetData]);

    return (
        <section className='bg-dark text-light d-flex align-items-center' style={{ height: '90vh', width: '100%' }}>
            <div className="container">
                <div className='container'>
                    <div className='row align-items-center'>
                        <div className='col-12 col-md-7 col-lg-6'>
                            <div className='card mt-5 p-3' style={{ background: 'rgba(225,225,225,0.18)', boxShadow: ' 0 8px 32px 0 rgba(31,38,135,0.37)', backdropFilter: 'blur(3px)' }}>
                                <form onSubmit={(e) => e.preventDefault()}>
                                    <div>
                                        <label className='form-label text-light m-0'>Name*</label>
                                        <input type="text"
                                            className='form-control bg-dark text-white'
                                            value={formData?.name}
                                            onChange={(e) => handleChange(e, 'name')}
                                            placeholder='eg: John'
                                            required
                                        />
                                    </div>
                                    <div className='py-3'>
                                        <label className='form-label text-light m-0'>Email</label>
                                        <input type="text"
                                            className='form-control bg-dark text-white'
                                            value={formData?.email}
                                            readOnly
                                        />
                                    </div>
                                    <div className='pt-3'>
                                        <button className='btn btn-primary px-5' onClick={handleUpdate}>Save</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className='col-12 col-md-5 col-lg-6 d-none d-lg-flex'>
                            <img src='/img/profile.svg' className='img-fluid' alt='profile' data-aos='fade-up' data-aos-delay='100' />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Profile;
