import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/Firebase';
import Spinner from '../components/spinner';

function Dashboard() {
    const dispatch = useDispatch();
    const user = useSelector((store) => store?.user_data);
    const [search, setSearch] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [weatherbg, setWeatherBg] = useState(null);
    const [spinner, showSpinner] = useState(false);

    const handleGetFavrots = useCallback(async () => {
        try {
            if (user?.id) {
                const q = query(collection(db, 'favorites'), where('userId', '==', user.id));
                const querySnapshot = await getDocs(q);
                const favoriteList = [];
                querySnapshot.forEach((doc) => {
                    favoriteList.push(doc.data());
                });
                dispatch({ type: 'favorites', payload: favoriteList });
            } else {
                dispatch({ type: 'favorites', payload: '' });
            }
        } catch (error) {
            console.error('Error fetching favorites:', error);
            toast.error('Failed to fetch favorites');
        }
    }, [user?.id, dispatch]);

    const handleSearch = useCallback(async () => {
        console.log(search, 'hello search');
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(search || user?.cityName)}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
            );

            if (response.status === 200 && response.data) {
                toast.success('Got the current weather data');
                setWeatherData(response.data);
                showSpinner(false);
            } else {
                toast.error('Failed to fetch weather data');
                showSpinner(false);
            }
        } catch (err) {
            console.error('Error fetching weather data:', err);
            toast.error('Please provide a valid city name');
            showSpinner(false);
        }
    }, [search, user?.cityName]);

    useEffect(() => {
        handleGetFavrots();
    }, [handleGetFavrots]);

    useEffect(() => {
        showSpinner(true);
        setTimeout(() => {
            if (user?.cityName) handleSearch();
            else showSpinner(false);
        }, 1000);
    }, [user]);

    useEffect(() => {
        let flag = 0;
        if (weatherData?.weather.length > 0) {
            if (weatherData?.weather[0]?.main.includes('cloud') && !weatherData?.weather[0]?.main.includes('overcast')) {
                setWeatherBg('/img/Clear.jpg');
                flag = 1;
            }
            if (weatherData?.weather[0]?.main.includes('haze')) {
                setWeatherBg('/img/fog.png');
                flag = 1;
            }
            if (weatherData?.weather[0]?.main.includes('overcast')) {
                setWeatherBg('/img/Rainy');
                flag = 1;
            }
            if (flag === 0) {
                setWeatherBg('/img/Clear.jpg');
            }
        }
    }, [weatherData]);

    const handleAddToFav = async () => {
        try {
            if (user) {
                // Prepare data to store in Firestore
                const favData = {
                    userId: user.id,
                    cityName: weatherData.name,
                    country: weatherData.sys.country,
                    timestamp: new Date().toISOString(),
                };

                // Add favorite to Firestore collection
                await addDoc(collection(db, 'favorites'), favData);
                setTimeout(() => {
                    toast.success('Added to favorites successfully');
                }, 500);
            } else {
                toast('Please login to add to favorites', {
                    icon: '⚠️',
                });
            }
        } catch (err) {
            console.error('Error adding to favorites:', err);
            toast.error('Failed to add to favorites');
        }
    };

    return (
        <Spinner show={spinner}>
            <div
                className="d-flex flex-column justify-content-center"
                style={{
                    height: '100vh',
                    backgroundImage: weatherbg
                        ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),url(${weatherbg})`
                        : `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${'/img/nature.jpg'})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
                key={weatherbg}
            >
                <div className="container">
                    <div className="text-center py-4 row align-items-center">
                        <div className="col-md-10">
                            <input
                                type="text"
                                onChange={(e) => setSearch(e.target.value)}
                                className={`form-control ${weatherbg ? 'bg-light text-dark' : 'text-white'} shadow`}
                                placeholder="Enter city name"
                                style={{ background: !weatherbg ? 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3))' : '' }}
                            />
                        </div>
                        <div className="col pt-md-0 pt-3">
                            <button
                                className="py-2 px-0 btn text-center text-light"
                                onClick={handleSearch}
                                style={{ background: 'linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3))' }}
                            >
                                <b className="px-5">Search</b>
                            </button>
                        </div>
                    </div>
                    {weatherData && (
                        <section>
                            <div className="row">
                                <div className="col-md-6">
                                    <div
                                        className="border p-3 rounded"
                                        style={{
                                            background: 'rgba(225,225,225,0.18)',
                                            boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)',
                                            backdropFilter: 'blur(3px)',
                                        }}
                                    >
                                        <div>
                                            <h1 className="text-light pb-2 m-0">
                                                {weatherData?.weather[0]?.main.includes('cloud') &&
                                                    !weatherData?.weather[0]?.main.includes('overcast')
                                                    ? '🌤️ '
                                                    : weatherData?.weather[0]?.main.includes('haze')
                                                        ? '😶‍🌫️ '
                                                        : weatherData?.weather[0]?.main.includes('overcast')
                                                            ? '⛈️ '
                                                            : '🌤️ '}
                                                {(weatherData.main.temp - 273.15).toFixed(2)}°
                                            </h1>
                                            <h1 className="text-light pb-2 m-0">🍃 {weatherData?.wind?.speed} m/s</h1>
                                            <h1 className="m-0 text-light pb-2">🌈 {weatherData?.main?.humidity} %</h1>
                                            <h2 className="p-0 m-0 text-light">
                                                <img src="/img/location.png" height={30} width={35} alt="location" />{' '}
                                                {weatherData?.name}, {weatherData?.sys?.country}
                                            </h2>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 pt-md-0 pt-3">
                                    <iframe
                                        title="weather-map"
                                        frameBorder="0"
                                        className="rounded h-100 w-100"
                                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${weatherData.coord.lon - 0.05},${weatherData.coord.lat - 0.05
                                            },${weatherData.coord.lon + 0.05},${weatherData.coord.lat + 0.05
                                            }&layer=mapnik&marker=${weatherData.coord.lat},${weatherData.coord.lon}`}
                                        allowFullScreen
                                        style={{ boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)' }}
                                    ></iframe>
                                </div>
                                <div className="text-center mt-3">
                                    <button className="btn btn-primary" onClick={handleAddToFav}>
                                        Add to favorites
                                    </button>
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </Spinner>
    );
}

export default Dashboard;
