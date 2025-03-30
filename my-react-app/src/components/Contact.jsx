import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './Contact.css';

const Contact = () => {
    const navigate = useNavigate();
    const [formFirstName, setFormFirstName] = useState('');
    const [formLastName, setFormLastName] = useState('');
    const [formEmail, setFormEmail] = useState('');
    const [formMessage, setFormMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:3000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: formFirstName,
                    lastName: formLastName,
                    email: formEmail,
                    message: formMessage
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send message');
            }

            // Clear form and show success message
            setFormFirstName('');
            setFormLastName('');
            setFormEmail('');
            setFormMessage('');
            alert('Message sent successfully!');
            navigate('/');
        } catch (err) {
            setError(err.message || 'Failed to send message');
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Sending your message...</p>
            </div>
        );
    }

    return (
        <div className="contact-container">
            <div className="contact-left">
                <h1>Get in Touch</h1>
                <p className="contact-description">
                    Have questions about our services? We're here to help! 
                    Send us a message and we'll get back to you as soon as possible.
                </p>
            </div>
            <div className="contact-right">
                <div className="contact-form-container">
                    <h2>Send us a Message</h2>
                    {error && <div className="error-message">{error}</div>}
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-group">
                            <label htmlFor="firstName">First Name</label>
                            <input 
                                type="text" 
                                id="firstName"
                                value={formFirstName}
                                onChange={(e) => setFormFirstName(e.target.value)}
                                required
                                placeholder="Enter your first name"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name</label>
                            <input 
                                type="text" 
                                id="lastName"
                                value={formLastName}
                                onChange={(e) => setFormLastName(e.target.value)}
                                required
                                placeholder="Enter your last name"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input 
                                type="email" 
                                id="email"
                                value={formEmail}
                                onChange={(e) => setFormEmail(e.target.value)}
                                required
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea 
                                id="message"
                                value={formMessage}
                                onChange={(e) => setFormMessage(e.target.value)}
                                required
                                placeholder="Enter your message"
                                rows="5"
                            />
                        </div>
                        <button type="submit" className="submit-button">
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Contact;