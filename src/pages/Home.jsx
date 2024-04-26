import React, { useState, useEffect } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
// Import necessary styles
import './SongList.css';

const SongList = () => {
    const [songs, setSongs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [genreFilter, setGenreFilter] = useState('');
    const [authorFilter, setAuthorFilter] = useState('');
    const [selectedSong, setSelectedSong] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // States for editing song details
    const [editTitle, setEditTitle] = useState('');
    const [editAuthor, setEditAuthor] = useState('');
    const [editGenre, setEditGenre] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);

    // Fetching the list of songs
    useEffect(() => {
        api.get('/api/songs/')
            .then(response => setSongs(response.data))
            .catch(error => console.error('Error fetching songs:', error));
    }, []);

    // Filtering songs based on the search term and filter options
    const filteredSongs = songs.filter(song =>
        song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        song.description.toLowerCase().includes(searchTerm.toLowerCase())
    ).filter(song =>
        (genreFilter === '' || song.genre === genreFilter) &&
        (authorFilter === '' || song.author === authorFilter)
    );

    // Handle song card click
    const handleSongClick = (song) => {
        setSelectedSong(song);
        // Populate the edit form with the selected song's details
        setEditTitle(song.title);
        setEditAuthor(song.author);
        setEditGenre(song.genre);
        setEditDescription(song.description);
        setShowModal(true);
    };

    // Handle modal close
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedSong(null);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);
    };

    // Handle editing song details
    const handleEditSong = async (event) => {
        event.preventDefault();

        // Create a FormData object to send the form data
        const formData = new FormData();
        formData.append('title', editTitle);
        formData.append('author', editAuthor);
        formData.append('genre', editGenre);
        formData.append('description', editDescription);

        // If a new image was selected, append it to the FormData object
        if (selectedImage) {
            formData.append('image', selectedImage);
        }

        try {
            await api.put(`/api/songs/${selectedSong.id}/`, formData);
            // Refresh the list of songs after editing
            const response = await api.get('/api/songs/');
            setSongs(response.data);
            handleCloseModal(); // Close the modal
        } catch (error) {
            console.error('Error editing song:', error);
        }
    };

    // Handle song deletion
    const handleDeleteSong = async () => {
        if (!selectedSong) {
            return;
        }

        try {
            await api.delete(`/api/songs/${selectedSong.id}/`);
            // Remove the deleted song from the state
            setSongs((prevSongs) => prevSongs.filter((song) => song.id !== selectedSong.id));
            handleCloseModal(); // Close the modal
        } catch (error) {
            console.error('Error deleting song:', error);
        }
    };

    // Define Navbar as a separate function
    function Navbar() {
        return (
            <nav className="navbar">
                <div className="navbar-container">
                    <Link to="/" className="navbar-logo">
                        Music Library
                    </Link>
                    <ul className="nav-menu">
                        <li className="nav-item">
                            <Link to="/logout" className="nav-links">
                                Logout
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/add" className="nav-links">
                                Add Song
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/" className="nav-links">
                                Home
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }

    return (
        <div className="song-list-container">
            <Navbar />
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search songs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>
            <div className="add-song-container">
                <Link to="/add" className="add-song-button">
                    Add Song
                </Link>
            </div>
            <ul className="song-list">
                {filteredSongs.map((song) => (
                    <li key={song.id} className="song-card" onClick={() => handleSongClick(song)}>
                        <img src={song.image} alt={song.title} className="song-image" />
                        <div className="song-details">
                            <h3 className="song-title">{song.title}</h3>
                            <p className="song-author">by {song.author}</p>
                            <p className="song-genre">Genre: {song.genre}</p>
                            <p className="song-description">{song.description}</p>
                        </div>
                    </li>
                ))}
            </ul>

            {showModal && selectedSong && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <h2>Edit Song Details</h2>
                        <form onSubmit={handleEditSong}>
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div class="form-group">
                                <label>Author</label>
                                <input
                                    type="text"
                                    value={editAuthor}
                                    onChange={(e) => setEditAuthor(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Genre</label>
                                <input
                                    type="text"
                                    value={editGenre}
                                    onChange={(e) => setEditGenre(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    required
                                ></textarea>
                            </div>
                            <div className="form-group">
                                <label>Image</label>
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="submit" className="save-button">Save Changes</button>
                                <button type="button" className="delete-button" onClick={handleDeleteSong}>Delete</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SongList;
