import React from 'react';
import { reviews } from '../data/reviewsData';

const Reviews = () => {
    return (
        <section id="reviews" className="reviews section">
            <div className="container">
                <h2 className="section-title">Customer Reviews</h2>
                <div className="reviews-grid">
                    {reviews.map((review) => (
                        <div key={review.id} className="review-card">
                            <div className="review-header">
                                <div className="reviewer-info">
                                    <h4>{review.name}</h4>
                                    <span className="location">{review.location}</span>
                                </div>
                                <div className="rating">
                                    {"★".repeat(review.rating)}
                                </div>
                            </div>
                            <p className="comment">"{review.comment}"</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Reviews;
