'use client'
import { useState } from "react";
import PropTypes from "prop-types";
import { Eye, EyeClosed } from "lucide-react";

const ResetPasswordModal = ({ isOpen, onClose, onSave }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPass, setNewPass] = useState(true);
  const [showPass, setShowPass] = useState(true);
  const [error, setError] = useState("");

  const handleSave = () => {
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    // Validate that new password and confirmation match
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirmation do not match");
      return;
    }

    onSave({ oldPassword, newPassword });
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    onClose();
  };

  if (!isOpen) return null; // Ensure modal is only rendered when open

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-96 space-y-3">
        <h2 className="text-xl font-semibold">Reset Password</h2>
        {/* Display error message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <label htmlFor="oldPassword" className="block">
            Old Password
          </label>
          <input
            id="oldPassword"
            type="password"
            className="w-full p-2 border border-gray-300 rounded mt-2"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>

        <div className="relative">
          <label htmlFor="newPassword" className="block">
            New Password
          </label>
          <input
            id="newPassword"
            max={6}
            type={showPass ? "password" : "text"}
            className="w-full p-2 border border-gray-300 rounded mt-2"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute top-10 right-2"
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? <EyeClosed /> : <Eye />}
          </button>
        </div>

        <div className="relative">
          <label htmlFor="confirmPassword" className="block">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            max={6}
            type={newPass ? "password" : "text"}
            className="w-full p-2 border border-gray-300 rounded mt-2"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="button"
            className="absolute top-10 right-2"
            onClick={() => setNewPass(!newPass)}
          >
            {newPass ? <EyeClosed /> : <Eye />}
          </button>
        </div>

        <div className="mt-4 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

ResetPasswordModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default ResetPasswordModal;
