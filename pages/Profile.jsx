import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useRef, useState } from 'react';
import { auth } from '../firebase'; // Import auth from your config

function Profile() {
    // 1. Manage State for the logged-in user
    const [profileName, setProfileName] = useState('Loading...');
    const [profileImg, setProfileImg] = useState('https://via.placeholder.com/100');
    const fileInputRef = useRef(null);

    useEffect(() => {
        // Listen for the specific user who logged/signed in
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // Dynamically set name based on Firebase Auth record
                setProfileName(user.displayName || user.email.split('@')[0]);
                if (user.photoURL) setProfileImg(user.photoURL);
            } else {
                setProfileName('Guest User');
            }
        });
        return () => unsubscribe(); 
    }, []);

    // 2. Picture Control Handlers
    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfileImg(imageUrl);
            // In the future, you can add uploadBytes(storageRef, file) here to save to Firebase
        }
    };

    const handleDeletePicture = () => {
        setProfileImg('https://via.placeholder.com/100');
    };

    return (
        <div className="profile-settings-container">
            <div className="profile-section">
                <label className="section-label">Profile picture</label>
                <div className="picture-controls">
                    <div className="profile-avatar">
                        <img src={profileImg} alt="Profile" />
                    </div>
                    <div className="button-group">
                        <button className="btn-change" onClick={handleImageClick}>Change picture</button>
                        <button className="btn-delete" onClick={handleDeletePicture}>Delete picture</button>
                    </div>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageChange} 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                    />
                </div>
            </div>

            <div className="profile-section">
                <label className="section-label">Profile name</label>
                <div className="input-wrapper">
                    <input 
                        type="text" 
                        className="name-input" 
                        value={profileName} 
                        readOnly // Ensures only the authenticated name is shown
                    />
                </div>
            </div>
        </div>
    );
}

export default Profile;