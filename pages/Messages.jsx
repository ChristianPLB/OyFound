import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { db } from '../firebase'; // Ensure your firebase.js exports 'db'

function Messages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Reference the messages collection and sort by newest first
        const q = query(collection(db, "messages"), orderBy("timestamp", "desc"));

        // 2. Real-time listener: updates the UI automatically when DB changes
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const messageData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(messageData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching messages: ", error);
            setLoading(false);
        });

        return () => unsubscribe(); // Cleanup listener on unmount
    }, []);

    const deleteMessage = async (id) => {
        if (window.confirm("Are you sure you want to remove this message?")) {
            try {
                // 3. Delete specifically from Firestore
                await deleteDoc(doc(db, "messages", id));
            } catch (error) {
                console.error("Error deleting message: ", error);
                alert("Failed to delete message.");
            }
        }
    };

    if (loading) return <div className="loading-state">Loading Inbox...</div>;

    return (
        <div className="messages-container">
            <header className="messages-header">
                <h1>Admin Inbox</h1>
                <span className="message-count">{messages.length} Total Messages</span>
            </header>

            {messages.length === 0 ? (
                <div className="empty-state">
                    <p>No messages received yet.</p>
                </div>
            ) : (
                <div className="messages-grid">
                    {messages.map((msg) => (
                        <div key={msg.id} className="message-card">
                            <div className="card-header">
                                <h3>{msg.fullName}</h3>
                                {/* Convert Firestore timestamp to readable text */}
                                <span className="message-date">
                                    {msg.timestamp?.toDate().toLocaleString() || 'Just now'}
                                </span>
                            </div>
                            <div className="card-body">
                                <p><strong>Email:</strong> {msg.email}</p>
                                <p><strong>Phone:</strong> {msg.phone}</p>
                                <p className="message-text">"{msg.message}"</p>
                            </div>
                            <div className="card-footer">
                                <button 
                                    className="delete-btn" 
                                    onClick={() => deleteMessage(msg.id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Messages;