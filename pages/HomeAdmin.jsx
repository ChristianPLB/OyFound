import { Link } from 'react-router-dom';

function HomeAdmin() {
    return (
        <div className="home-admin-container">
            {/* Sidebar Section */}
            <aside className="admin-sidebar">
                <div className="search-container">
                    <input type="text" placeholder="Search items......" className="search-bar" />
                </div>

                <div className="report-section">
                    <h2>Report an Item</h2>
                    <Link to="/report" className="report-btn-link">
                        Report Here
                    </Link>
                    <button className="ai-matches-btn">AI Matches</button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="admin-main-content">
                <header className="content-header">
                    <h1>Recent Report</h1>
                </header>

                <div className="dashboard-widgets">
                    <div className="heatmap-card">
                        <h3>Heat Maps of Lost Items</h3>
                        <div className="map-placeholder">
                            {/* Representative map area from design */}
                            <img 
                                src="https://upload.wikimedia.org/wikipedia/commons/e/e0/Google_Maps_icon_%282020%29.svg" 
                                alt="Map view" 
                                className="map-img" 
                            />
                        </div>
                        <button className="location-btn">Show location</button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default HomeAdmin;