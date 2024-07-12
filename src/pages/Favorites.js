import React from 'react';
import { useSelector } from 'react-redux';

function Favorites() {
    const places = useSelector(store => store?.favorites);

    return (
        <section className='bg-dark text-light d-flex align-items-center' style={{ height: '90vh',width:'100%' }}>
            <div className="container">
                <div className='container'>
                    <div className='row align-items-center'>
                        <div className='col-12 col-md-7 col-lg-6'>
                            <h1 className='p-0 m-0'>Your Favorite Places</h1>
                            <div className='card mt-5 p-3' style={{ background: 'rgba(225,225,225,0.18)', boxShadow: ' 0 8px 32px 0 rgba(31,38,135,0.37)', backdropFilter: 'blur(3px)', maxHeight: '70vh', overflowY: 'auto' }}>
                                {places && places.length > 0 ? (
                                    places.map((place, index) => (
                                        <div key={index} className="text-light py-2">
                                            {place.cityName}, {place?.country}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-light">No favorite places added.</p>
                                )}
                            </div>
                        </div>
                        <div className='col-12 col-md-5 col-lg-6 d-none d-lg-flex'>
                            <img src='/img/Tourist-PNG.png' className='img-fluid' alt='profile' data-aos='fade-up' data-aos-delay='100' />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Favorites;
