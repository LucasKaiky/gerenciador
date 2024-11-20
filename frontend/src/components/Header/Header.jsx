import React from 'react';
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const { token, logout } = useAuth();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleLogoutClick = () => {
        logout();
        navigate('/login');
    };

    const handleProfileClick = () => {
        navigate('/perfil');
    };

    return (
        <header className="header">
            <h1>Task Manager</h1>
            {token ? (
                <div className="user-info">
                    <img
                        src={user?.profile?.profile_image || '/default-profile.png'}
                        alt="Profile"
                        className="profile-image"
                        onClick={handleProfileClick}
                        style={{ cursor: 'pointer' }}
                    />
                    <span onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
                        {user?.username}
                    </span>
                    <button onClick={handleLogoutClick}>Logout</button>
                </div>
            ) : (
                <button onClick={handleLoginClick}>Login</button>
            )}
        </header>
    );
};

export default Header;
