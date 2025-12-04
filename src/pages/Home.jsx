import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Reviews from '../components/Reviews';
import Contact from '../components/Contact';

const Home = () => {
    return (
        <main>
            <Hero />
            <Services />
            <Reviews />
            <Contact />
        </main>
    );
};

export default Home;
