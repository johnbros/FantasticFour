import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            {/* Hero Section with Decorative Ducks */}
            <section className="hero-section">
                <div className="duck duck-1"></div>
                <div className="duck duck-2"></div>
                <div className="duck duck-3"></div>
                <div className="duck duck-4"></div>
                
                <div className="hero-content">
                    <h1 className="hero-title">Welcome to DuckApp</h1>
                    <p className="hero-subtitle">
                        This is a sample subtitle
                    </p>
                    <Link to="/signup" className="cta-button">
                        Sign Up
                    </Link>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="features-grid">
                    <div className="feature-card">
                        <h3 className="feature-title">Sample</h3>
                        <p className="feature-description">
                          This is a sample feature
                        </p>
                    </div>
                    <div className="feature-card">
                        <h3 className="feature-title">Sample</h3>
                        <p className="feature-description">
                            This is a sample feature
                        </p>
                    </div>
                    <div className="feature-card">
                        <h3 className="feature-title">Sample</h3>
                        <p className="feature-description">
                            This is a sample feature
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
