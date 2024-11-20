import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from "../../context/AuthContext";
import './Perfil.css';

const Perfil = () => {
    const { token } = useAuth();
    const [user, setUser] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/user/', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => setUser(response.data))
        .catch(error => console.error("Erro ao carregar perfil:", error));
    }, [token]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setProfileImage(file);
        setPreviewImage(URL.createObjectURL(file));
    };

    const handleImageUpload = () => {
        const formData = new FormData();
        formData.append('profile_image', profileImage);

        axios.put('http://127.0.0.1:8000/api/user/', formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => setUser(response.data))
        .catch(error => console.error("Erro ao atualizar imagem de perfil:", error));
    };

    return (
        <div className="profile-container">
            <h2>Perfil</h2>
            {user && (
                <>
                    <div className="profile-info">
                        <img
                            src={previewImage || user.profile?.profile_image || '/default-profile.png'}
                            alt="Profile"
                            className="profile-image-large"
                        />
                        <span>{user.username}</span>
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                    {profileImage && <button onClick={handleImageUpload}>Atualizar Foto</button>}
                </>
            )}
        </div>
    );
};

export default Perfil;
