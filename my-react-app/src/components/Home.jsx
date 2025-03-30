import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const navigate = useNavigate();

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
                       Track your investments 
                    </p>
                    <Link to="/signup" className="cta-button">
                        Get Started
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="features-grid">
                    <div className="feature-card" onClick={() => navigate('/dashboard')}>
                        <h3 className="feature-title">Track Investments</h3>
                        <p className="feature-description">
                            Keep track of your favorite investments and their activities 
                        </p>
                    </div>
                        <div className="feature-card" onClick={() => navigate('/about')}>
                        <h3 className="feature-title">Learn More</h3>
                        <p className="feature-description">
                            Discover fascinating facts about your different investments
                        </p>
                    </div>
                    <div className="feature-card" onClick={() => navigate('/contact')}>
                        <h3 className="feature-title">Contact Us</h3>
                        <p className="feature-description">
                            Contact us for more information

                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
