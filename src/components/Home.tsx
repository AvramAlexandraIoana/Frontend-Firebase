//create a home with a button to go to the login page
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <>
            <h1>Home</h1>
            <Link to="/login">Login</Link>
        </>
    );
}

export default Home;
