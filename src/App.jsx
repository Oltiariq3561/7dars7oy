import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addUser, removeUser, editUser } from './store/counterReducer';
import { setTheme } from './store/themeReducer';

function App() {
  const users = useSelector((state) => state.usersData.users);
  const theme = useSelector((state) => state.themeData.theme);
  const dispatch = useDispatch();

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState({ id: null, username: '', email: '', age: '' });

  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const ageRef = useRef(null);

  const handleAddUser = () => {
    setCurrentUser({ id: Date.now(), username: '', email: '', age: '' });
    setEditMode(false);
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setEditMode(true);
    setShowModal(true);
  };

  const handleSaveUser = () => {
    const { username, email, age } = currentUser;
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    const alertMessages = {
      incomplete: "Please fill out all fields",
      invalidEmail: "Invalid email format",
    };

    if (!username) {
      alert(alertMessages.incomplete);
      usernameRef.current.focus();
      return;
    }
    if (!email || !emailRegex.test(email)) {
      alert(alertMessages.invalidEmail);
      emailRef.current.focus();
      return;
    }
    if (!age) {
      alert(alertMessages.incomplete);
      ageRef.current.focus();
      return;
    }

    if (editMode) {
      dispatch(editUser(currentUser));
    } else {
      dispatch(addUser(currentUser));
    }
    setShowModal(false);
  };

  const themeClasses = theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800';
  
  return (
    <div className={`app flex flex-col items-center p-8 ${themeClasses}`}>
      <div className="mb-6 flex gap-4">
        <div className="flex items-center">
          <label className="mr-2 font-semibold">Theme:</label>
          <select
            value={theme}
            onChange={(e) => dispatch(setTheme(e.target.value))}
            className={`border rounded-lg p-2 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleAddUser}
        className="mb-6 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        Add User
      </button>

      <div className="user-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map(user => (
          <div key={user.id} className="user-card p-6 border border-gray-300 rounded-lg shadow-lg transition-transform transform hover:scale-105">
            <h2 className="text-xl font-semibold">{user.username}</h2>
            <p>Email: {user.email}</p>
            <p>Age: {user.age}</p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => handleEditUser(user)}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition"
              >
                Edit
              </button>
              <button
                onClick={() => dispatch(removeUser(user.id))}
                className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center">
          <div className="modal bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">
              {editMode ? 'Edit User' : 'Add User'}
            </h2>
            <input
              type="text"
              placeholder="Username"
              value={currentUser.username}
              onChange={(e) => setCurrentUser({ ...currentUser, username: e.target.value })}
              ref={usernameRef}
              className={`w-full mb-2 p-2 border rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
            />
            <input
              type="email"
              placeholder="Email"
              value={currentUser.email}
              onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
              ref={emailRef}
              className={`w-full mb-2 p-2 border rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
            />
            <input
              type="number"
              placeholder="Age"
              value={currentUser.age}
              onChange={(e) => setCurrentUser({ ...currentUser, age: e.target.value })}
              ref={ageRef}
              className={`w-full mb-2 p-2 border rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
            />
            <button
              onClick={handleSaveUser}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Save
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
