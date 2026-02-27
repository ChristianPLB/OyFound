import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useRef, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { db, storage } from '../firebase';

// Fix for Leaflet Icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const TOLEDO_BOUNDS = [[10.2500, 123.5000], [10.5000, 123.8000]];

function ReportItem() {
    const [itemStatus, setItemStatus] = useState('Lost');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [location, setLocation] = useState(null); 

    const [formData, setFormData] = useState({
        itemName: '',
        landmark: '',
        date: '',
        time: '',
        description: ''
    });

    const fileInputRef = useRef(null);

    function LocationMarker() {
        useMapEvents({
            click(e) {
                setLocation(e.latlng);
                setFormData(prev => ({ 
                    ...prev, 
                    landmark: `Toledo: ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}` 
                }));
            },
        });
        return location === null ? null : <Marker position={location}></Marker>;
    }

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!location) {
            alert("Please pin the location on the map!");
            return;
        }

        setIsUploading(true); // START LOADING
        
        try {
            let imageUrl = "";

            // 1. Storage Upload
            if (selectedFile) {
                const storageRef = ref(storage, `reports/${Date.now()}_${selectedFile.name}`);
                const uploadResult = await uploadBytes(storageRef, selectedFile);
                imageUrl = await getDownloadURL(uploadResult.ref);
            }

            // 2. Firestore Upload
            await addDoc(collection(db, "reports"), {
                ...formData,
                status: itemStatus,
                imageUrl: imageUrl,
                location: { lat: location.lat, lng: location.lng },
                timestamp: new Date()
            });

            alert("Report Published successfully!");
            
            // 3. Reset everything
            setFormData({ itemName: '', landmark: '', date: '', time: '', description: '' });
            setLocation(null);
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";

        } catch (error) {
            console.error("Submission Error:", error);
            alert(`Error: ${error.message}. Check your Firebase permissions.`);
        } finally {
            setIsUploading(false); // STOP LOADING regardless of success or fail
        }
    };

    return (
        <div className="report-item-wrapper">
            <form className={`report-item-form ${isUploading ? 'form-faded' : ''}`} onSubmit={handleSubmit}>
                
                {/* Visual Feedback for Loading */}
                {isUploading && (
                    <div className="loading-overlay">
                        <div className="spinner"></div>
                        <p>Uploading to OyFound...</p>
                    </div>
                )}

                <div className="form-section-text">
                    <div className="input-block">
                        <label>Item Name</label>
                        <input type="text" id="itemName" value={formData.itemName} onChange={handleInputChange} required disabled={isUploading}/>
                    </div>
                    <div className="input-block">
                        <label>Landmark</label>
                        <input type="text" id="landmark" value={formData.landmark} onChange={handleInputChange} required disabled={isUploading}/>
                    </div>
                </div>

                <div className="map-locator-container" style={{ height: '350px', marginBottom: '20px', position: 'relative' }}>
                    <MapContainer center={[10.3776, 123.6358]} zoom={13} maxBounds={TOLEDO_BOUNDS} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <LocationMarker />
                    </MapContainer>
                </div>

                <div className="form-section-meta inline-controls">
                    <div className="input-block-small">
                        <label>Date</label>
                        <input type="date" id="date" value={formData.date} onChange={handleInputChange} required disabled={isUploading}/>
                    </div>
                    <div className="status-selector">
                        <button type="button" className={`toggle-btn ${itemStatus === 'Lost' ? 'selected' : ''}`} onClick={() => setItemStatus('Lost')} disabled={isUploading}>Lost</button>
                        <button type="button" className={`toggle-btn ${itemStatus === 'Found' ? 'selected' : ''}`} onClick={() => setItemStatus('Found')} disabled={isUploading}>Found</button>
                    </div>
                </div>

                <div className="form-section-main flex-grid">
                    <div className="input-block description-box">
                        <label>Description</label>
                        <textarea id="description" rows="4" value={formData.description} onChange={handleInputChange} disabled={isUploading}></textarea>
                    </div>
                    <div className="input-block">
                        <label>Image</label>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" disabled={isUploading}/>
                    </div>
                </div>

                <button type="submit" className="final-report-btn" disabled={isUploading}>
                    {isUploading ? "Uploading..." : "Publish Report"}
                </button>
            </form>
        </div>
    );
}

export default ReportItem;