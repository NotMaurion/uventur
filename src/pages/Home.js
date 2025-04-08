import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Rent Adventure Gear from Local Enthusiasts</h1>
          <p>Find and rent outdoor equipment for your next adventure</p>
          <div className="hero-buttons">
            <Link to="/search" className="primary-button">
              Find Gear
            </Link>
            <Link to="/listing/create" className="secondary-button">
              List Your Gear
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>How It Works</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <span role="img" aria-label="Search">🔍</span>
            </div>
            <h3>Find Gear</h3>
            <p>Search for equipment in your area</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <span role="img" aria-label="Calendar">📅</span>
            </div>
            <h3>Book & Pay</h3>
            <p>Secure booking and payment</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <span role="img" aria-label="Target">🎯</span>
            </div>
            <h3>Pick Up</h3>
            <p>Meet the owner and get your gear</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <span role="img" aria-label="Star">⭐</span>
            </div>
            <h3>Review</h3>
            <p>Share your experience</p>
          </div>
        </div>
      </section>

      <section className="categories">
        <h2>Popular Categories</h2>
        <div className="categories-grid">
          <Link to="/search?category=bikes" className="category-card">
            <h3>Bikes</h3>
          </Link>
          <Link to="/search?category=camping" className="category-card">
            <h3>Camping</h3>
          </Link>
          <Link to="/search?category=water-sports" className="category-card">
            <h3>Water Sports</h3>
          </Link>
          <Link to="/search?category=climbing" className="category-card">
            <h3>Climbing</h3>
          </Link>
        </div>
      </section>
    </div>
  );
} 