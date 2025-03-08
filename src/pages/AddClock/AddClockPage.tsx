import React, {useContext, useState} from 'react';
import axios from 'axios';
import {Navigate, useNavigate} from 'react-router-dom';
import {AuthContext} from "../../context/AuthContext.tsx";
import config from "../../config.ts";

const AddClockPage = () => {
    const [name, setName] = useState('');
    const [jpgUrl, setJpgUrl] = useState('');
    const navigate = useNavigate();

    const {user} = useContext(AuthContext)!;
    if (!user) {
        return <Navigate to="/login"/>;
    }

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const token = localStorage.getItem('token'); // Retrieve stored token
        if (!token) {
            console.error("No token found, user might not be logged in.");
            return;
        }
        let url = jpgUrl;
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = "https://" + url;
        }


        axios.post(`${config.backendURL}/clocks`, {name, jpg_url: url},
            {
                headers: {
                    Authorization: `Bearer ${token}` // Send token in header
                }
            })
            .then(() => {
                navigate('/');
            })
            .catch(error => console.error('Error adding clock:', error));
    };

    return (
        <div className="add-clock-page">
            <h2>Add New Clock</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Clock Name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="jpgUrl">JPG URL</label>
                    <input
                        type="text"
                        id="jpgUrl"
                        value={jpgUrl}
                        onChange={(e) => setJpgUrl(e.target.value)}
                    />
                </div>
                <button type="submit">Add Clock</button>
            </form>
        </div>
    );
};

export default AddClockPage;
