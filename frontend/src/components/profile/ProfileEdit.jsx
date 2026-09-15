// src/components/profile/ProfileEdit.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/user';
import toast from 'react-hot-toast';
import { FaUser, FaInfoCircle, FaCamera } from 'react-icons/fa';

const ProfileEdit = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    about: user?.about || '',
    profileImage: user?.profileImage || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await userService.update(user._id, formData);
      if (response.success) {
        updateUser(response.data);
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-center">
          <div className="relative">
            {formData.profileImage ? (
              <img src={formData.profileImage} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-whatsapp-green flex items-center justify-center text-white text-4xl">
                {formData.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
            <button type="button" className="absolute bottom-0 right-0 bg-whatsapp-green p-2 rounded-full text-white">
              <FaCamera />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-whatsapp-green focus:border-whatsapp-green"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">About</label>
          <div className="relative">
            <FaInfoCircle className="absolute left-3 top-3 text-gray-400" />
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              rows="3"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-whatsapp-green focus:border-whatsapp-green"
              maxLength="150"
            />
          </div>
          <p className="text-xs text-gray-400 text-right">{formData.about?.length || 0}/150</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-whatsapp-green text-white py-2 rounded-lg hover:bg-whatsapp-dark-green transition disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
};

export default ProfileEdit;