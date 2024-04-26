import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import '../styles/Forms.css';

const AddSong = ({ onSongAdded }) => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        genre: '',
        description: '',
        image: null,
    });

    // Obtain the navigate function
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: files ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const form = new FormData();
        Object.keys(formData).forEach((key) => {
            form.append(key, formData[key]);
        });

        try {
            await api.post('/api/songs/', form);
            // Notify parent component of the new song
            onSongAdded();
        } catch (error) {
            console.error('Error adding song:', error);
        } finally {
            // Redirect to the admin page after submission, regardless of success or failure
            navigate('/');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="song-form">
            <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="author"
                placeholder="Author"
                value={formData.author}
                onChange={handleChange}
                required
            />
            <input
                type="text"
                name="genre"
                placeholder="Genre"
                value={formData.genre}
                onChange={handleChange}
                required
            />
            <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
            />
            <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
            />
            <button type="submit">Add Song</button>
        </form>
    );
};

export default AddSong;
