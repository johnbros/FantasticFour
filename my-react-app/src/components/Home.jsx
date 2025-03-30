import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="home-container">
            <div className="animated-bg"></div>
            
            {/* Hero Section with Decorative Ducks */}
            <section className="hero-section">
                <img 
                    src="/duck_monical.png" 
                    alt="Floating Duck 1" 
                    className="floating-duck duck-1"
                />
                <img 
                    src="/duck_water.png" 
                    alt="Floating Duck 2" 
                    className="floating-duck duck-2"
                />
                <img 
                    src="/duck_monical.png" 
                    alt="Floating Duck 3" 
                    className="floating-duck duck-3"
                />
                <img 
                    src="/duck_water.png" 
                    alt="Floating Duck 4" 
                    className="floating-duck duck-4"
                />
                
                <div className={`hero-content ${isVisible ? 'visible' : ''}`}>
                    <div className="title-container">
                        <img 
                            src="/duck_monical.png" 
                            alt="Duck Finance Logo" 
                            className="hero-logo"
                        />
                        <h1 className="hero-title">Welcome to Duck Finance</h1>
                    </div>
                    <p className="hero-subtitle">
                        Your one-stop destination for all things duck-related
                    </p>
                    <Link to="/signup" className="cta-button">
                        Get Started
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="features-grid">
                    <div className="feature-card">
                        <h3 className="feature-title">Track Ducks</h3>
                        <p className="feature-description">
                            Keep track of your favorite ducks and their activities in real-time
                        </p>
                    </div>
                    <div className="feature-card">
                        <h3 className="feature-title">Share Photos</h3>
                        <p className="feature-description">
                            Share your amazing duck photos with our growing community
                        </p>
                    </div>
                    <div className="feature-card">
                        <h3 className="feature-title">Learn More</h3>
                        <p className="feature-description">
                            Discover fascinating facts about different duck species worldwide
                        </p>
                    </div>
                    <div className="feature-card">
                        <h3 className="feature-title">Connect</h3>
                        <p className="feature-description">
                            Join a vibrant community of duck enthusiasts and share experiences
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
