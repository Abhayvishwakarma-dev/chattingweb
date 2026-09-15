// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { initializeSocket } from '../../services/socket';
// import toast from 'react-hot-toast';

// const GoogleSuccess = () => {
//   const navigate = useNavigate();
//   const { setUser } = useAuth();

//   useEffect(() => {
//     const handleGoogleSuccess = async () => {
//       const params = new URLSearchParams(window.location.search);
//       const token = params.get('token');
//       const error = params.get('error');

//       if (error) {
//         toast.error('Google authentication failed');
//         navigate('/login');
//         return;
//       }

//       if (!token) {
//         toast.error('No token received');
//         navigate('/login');
//         return;
//       }

//       try {
//         localStorage.setItem('accessToken', token);
//         initializeSocket(token);

//         // Fetch user data
//         const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         const data = await response.json();

//         if (data.success) {
//           setUser(data.data);
//           toast.success('Google login successful!');
//           navigate('/');
//         } else {
//           throw new Error('Failed to fetch user');
//         }
//       } catch (error) {
//         console.error('Google login error:', error);
//         toast.error('Failed to complete Google login');
//         navigate('/login');
//       }
//     };

//     handleGoogleSuccess();
//   }, [navigate, setUser]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="text-center">
//         <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-whatsapp-green mx-auto"></div>
//         <p className="mt-4 text-gray-600">Completing your login...</p>
//       </div>
//     </div>
//   );
// };

// export default GoogleSuccess;




// src/components/auth/GoogleSuccess.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { initializeSocket } from '../../services/socket';
import toast from 'react-hot-toast';

const GoogleSuccess = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const handleGoogleSuccess = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (!token) {
        toast.error('No token received');
        navigate('/login');
        return;
      }

      try {
        // ✅ Save token
        localStorage.setItem('accessToken', token);
        
        // ✅ Initialize socket IMMEDIATELY
        initializeSocket(token);

        // ✅ Fetch user data
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();

        if (data.success) {
          setUser(data.data);
          toast.success('Google login successful!');
          navigate('/');
        } else {
          throw new Error('Failed to fetch user');
        }
      } catch (error) {
        console.error('Google login error:', error);
        toast.error('Failed to complete login');
        navigate('/login');
      }
    };

    handleGoogleSuccess();
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-whatsapp-green mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing login...</p>
      </div>
    </div>
  );
};

export default GoogleSuccess;