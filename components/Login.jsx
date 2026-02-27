import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; // Import database lookup
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase'; // Import db

function Login({ setRole }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // 1. Authenticate with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Fetch the user's document to get their REAL role
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role; // This will be 'admin', 'student', or 'guest'

        // 3. Sync State and LocalStorage so App.jsx knows the role
        setRole(userRole);
        localStorage.setItem('userRole', userRole);

        // 4. Redirect to the correct page based on the database
        navigate(`/${userRole}`); 
      } else {
        setError("Account details not found in database.");
      }
    } catch (err) {
      setError("Invalid email or password.");
      console.error(err.message);
    }
  };

  return (
    <div className="register-container">
      <div className="form-wrapper">
        <h1 className="form-title">Welcome back!🔍</h1>
        <form className="login-form-container" onSubmit={handleLogin}>
          {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
          <div className="input-group">
            <input type="email" className="input-field full-width" placeholder="Email" required 
                   value={email} onChange={(e) => setEmail(e.target.value)} />
            <input type="password" className="input-field full-width" placeholder="Password" required 
                   value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="signup-btn login-btn-wide">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;