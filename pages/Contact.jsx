import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useState } from 'react';
import { db } from '../firebase'; // Import the db export from your config

function Contact() {
    const [formData, setFormData] = useState({
        fullName: '', phone: '', email: '', address: '', message: ''
    });
    const [isSending, setIsSending] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSending(true);
        
        try {
            // 1. Save directly to Firebase Firestore
            await addDoc(collection(db, "messages"), { 
                ...formData, 
                timestamp: serverTimestamp() // Better than local time for sorting
            });
            
            // 2. Clear local storage for adminMessages if you want to transition fully to cloud
            localStorage.removeItem('adminMessages');
            
            alert("Message sent to Admin via Firebase!");
            setFormData({ fullName: '', phone: '', email: '', address: '', message: '' }); 
        } catch (error) {
            console.error("Error sending message: ", error);
            alert("Failed to send message. Check your connection.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="contact-container">
            <div className="form-card">
                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" value={formData.fullName} required
                                onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>Phone No.</label>
                            <input type="text" value={formData.phone} required
                                onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="text" value={formData.email} required
                                onChange={(e) => setFormData({...formData, email: e.target.value})} />
                        </div>
                    </div>
                    {/* Add Email/Address fields here following the same pattern */}
                    <div className="form-group">
                        <label>Message</label>
                        <textarea rows="5" value={formData.message} required
                            onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea>
                    </div>
                    <div className="form-footer">
                        <button type="submit" className="submit-button" disabled={isSending}>
                            {isSending ? "Sending..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Contact;