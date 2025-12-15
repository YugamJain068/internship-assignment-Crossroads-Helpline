import './App.css'
import { useDispatch, useSelector } from 'react-redux';
import { addUser, updateUser, deleteUser, resetUserData } from '../store/randomUserSlice';
import { v4 as uuidv4 } from "uuid";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { MdModeEdit } from "react-icons/md";
import { useState } from 'react';

function App() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.UserData);
  const [loading, setloading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({ first: "", last: "", email: "", gender: "", country: "" });

  async function handleAdd() {
    try {
      setloading(true)
      const res = await fetch('https://randomuser.me/api/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const result = await res.json();
      if (res.ok) {
        dispatch(addUser({
          uid: uuidv4(),
          ...result.results[0]
        }));
        console.log(result);
        setloading(false)
      }
      else {
        console.error("api fetch failed", result);
        setloading(false)
      }
    }
    catch (error) {
      console.error("API error:", error);
    }
  }
  function handleDelete(uid) {
    if (users.length === 0) return;
    setloading(true)
    dispatch(deleteUser(uid));
    setloading(false)
  }
  async function handleReset() {
    setloading(true)
    dispatch(resetUserData());
    setloading(false)
  }
  async function handleUpdate() {
    setloading(true)
    if (!selectedUser) return;
    dispatch(
      updateUser({
        uid: selectedUser.uid,
        updatedData: {
          name: {
            ...selectedUser.name,
            first: formData.first,
            last: formData.last,
          },
          gender: formData.gender,
          email: formData.email,
          location: {
            ...selectedUser.location,
            country: formData.country,
          },
        },
      })
    );

    setIsModalOpen(false);
    setSelectedUser(null);
    setloading(false)
  }

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>

          <div className="relative bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Edit User
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                value={formData.first}
                onChange={(e) =>
                  setFormData({ ...formData, first: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                value={formData.last}
                onChange={(e) =>
                  setFormData({ ...formData, last: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="text"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Gender</label>
              <input
                type="text"
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button onClick={() => {
                setIsModalOpen(false);
                setSelectedUser(null);
                setFormData({
                  first: "",
                  last: "",
                  email: "",
                  gender: "",
                  country: "",
                });
              }} className="px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500">
                Cancel
              </button>

              <button onClick={handleUpdate} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-5xl font-bold text-center text-blue-600 mb-10">
          Dashboard
        </h1>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button onClick={handleAdd} className="px-5 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition">
            Add User
          </button>


          <button onClick={handleReset} className="px-5 py-2 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-700 transition">
            Reset
          </button>
        </div>

        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          {loading ? (<div className='flex justify-center w-full h-[50vh] items-center'>
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-[#F99262] border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-4 border-4 border-blue-500 border-b-transparent rounded-full animate-spin-reverse"></div>
            </div>
          </div>
          ) : (<table className="w-full border-collapse">
            <thead className="bg-blue-100">
              <tr>
                <th className="px-4 py-3 text-left">#</th>
                <th className="px-4 py-3 text-left">Image</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Gender</th>
                <th className="px-4 py-3 text-left">Country</th>
                <th className="px-4 py-3 text-left">Edit</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                    No users available
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={user.uid}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">{index + 1}</td>

                    <td className="px-4 py-3">
                      <img src={user.picture.thumbnail} alt="user" className="rounded-full" />
                    </td>

                    <td className="px-4 py-3 font-medium">{user.name.first} {user.name.last}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3 capitalize">{user.gender}</td>
                    <td className="px-4 py-3">{user.location.country}</td>
                    <td className="px-4 py-3">
                      <div className='flex gap-3'>
                        <button onClick={() => {
                          setSelectedUser(user);
                          setFormData({
                            first: user.name.first,
                            last: user.name.last,
                            email: user.email,
                            gender: user.gender,
                            country: user.location.country,
                          });
                          setIsModalOpen(true);
                        }} className="px-5 py-2 rounded-lg bg-yellow-500 text-white font-semibold hover:bg-yellow-600 transition">
                          <MdModeEdit />
                        </button>

                        <button onClick={() => handleDelete(user.uid)} className="px-5 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition">
                          <RiDeleteBin5Fill />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>)
          }
        </div>
      </div>
    </>
  )
}

export default App
