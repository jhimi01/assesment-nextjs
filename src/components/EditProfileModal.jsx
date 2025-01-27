import { useState } from "react";
import { useCookie } from "../hooks/useCookie";
import PropTypes from "prop-types";
import { Bounce, toast, ToastContainer } from "react-toastify";

const EditProfileModal = ({ isOpen, onClose, userData, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    email: userData.email || "",
    mobileNumber: userData.mobileNumber || "",
    dateOfBirth: userData.dateOfBirth || "",
    gender: userData.gender || "",
    nid: userData.nid || "",
    country: userData.country || "",
    title: userData.title || "",
    address: userData.address || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getCookie } = useCookie({ key: "Token", days: 7 });
  const token = getCookie();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/edit-profile`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Add the token here
          },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        toast.success("updated", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      }
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Something went wrong");
      }

      setLoading(false);
      onSave(formData);
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 w-[90%] md:w-[70%]">
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="flex gap-5">
            {/* First Name */}
            <div className="mb-3 w-1/2">
              <label
                htmlFor="firstName"
                className="block text-sm font-semibold"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2 border border-slate-400"
              />
            </div>

            {/* Last Name */}
            <div className="mb-3 w-1/2">
              <label htmlFor="lastName" className="block text-sm font-semibold">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-2 border border-slate-400"
              />
            </div>
          </div>

          <div className="flex gap-5">
            {/* Email */}
            <div className="mb-3 w-1/2">
              <label htmlFor="email" className="block text-sm font-semibold">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-slate-400"
              />
            </div>

            {/* Mobile Number */}
            <div className="mb-3 w-1/2">
              <label
                htmlFor="mobileNumber"
                className="block text-sm font-semibold"
              >
                Mobile Number
              </label>
              <input
                type="text"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                className="w-full p-2 border border-slate-400"
              />
            </div>
          </div>

          <div className="flex gap-5">
            {/* Date of Birth */}
            <div className="mb-3 w-1/2">
              <label
                htmlFor="dateOfBirth"
                className="block text-sm font-semibold"
              >
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="w-full p-2 border border-slate-400"
              />
            </div>

            {/* Gender */}
            <div className="mb-3 w-1/2">
              <label htmlFor="gender" className="block text-sm font-semibold">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-2 border border-slate-400"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="flex gap-5">
            {/* NID */}
            <div className="mb-3 w-1/2">
              <label htmlFor="nid" className="block text-sm font-semibold">
                NID
              </label>
              <input
                type="text"
                id="nid"
                name="nid"
                value={formData.nid}
                onChange={handleChange}
                className="w-full p-2 border border-slate-400"
              />
            </div>

            {/* Country */}
            <div className="mb-3 w-1/2">
              <label htmlFor="country" className="block text-sm font-semibold">
                Country
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full p-2 border border-slate-400"
              />
            </div>
          </div>

          <div className="flex gap-5">
            {/* Title */}
            <div className="mb-3 w-1/2">
              <label htmlFor="title" className="block text-sm font-semibold">
                Title
              </label>
              <select
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="border-slate-400 focus:outline-none border p-2 w-full"
              >
                <option value="">Select...</option>
                <option value="Fontend Developer">Fontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Mernstack Developer">Mernstack Developer</option>
                <option value="Pernstack Developer">Pernstack Developer</option>
                <option value="Software Developer">Software Developer</option>
                <option value="Web Developer">Web Developer</option>
              </select>
            </div>

            {/* Address */}
            <div className="mb-3 w-1/2">
              <label htmlFor="address" className="block text-sm font-semibold">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border border-slate-400"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
<ToastContainer
  position="top-right"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick={false}
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
  theme="light"
  transition={Bounce}
/>;

EditProfileModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userData: PropTypes.object.isRequired, // Ensure this matches the actual type
  onSave: PropTypes.func.isRequired,
};


export default EditProfileModal;
