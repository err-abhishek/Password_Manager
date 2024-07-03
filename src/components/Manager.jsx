import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { IoCopy } from "react-icons/io5";
import { FiEdit } from "react-icons/fi";
import { MdDeleteForever } from "react-icons/md";

export default function Manager() {
  const passwordRef = useRef();
  const [showPassword, setshowPassword] = useState(false);
  const [form, setform] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const copytext = (text) => {
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    axios.get('http://localhost:5000/passwords')
      .then(res => {
        setPasswordArray(res.data);
      })
      .catch(error => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  const toggleshowPassword = () => {
    if (showPassword) passwordRef.current.type = "password";
    setshowPassword(!showPassword);
    if (!showPassword) passwordRef.current.type = "text";
  };

  const savePassword = () => {
    if (isEditing) {
      const updatedPassword = { ...form, _id: editId };
      axios.put(`http://localhost:5000/passwords/${editId}`, updatedPassword)
        .then(response => {
          const updatedArray = passwordArray.map(item =>
            item._id === editId ? response.data : item
          );
          setPasswordArray(updatedArray);
          setIsEditing(false);
          setEditId(null);
          setform({ site: "", username: "", password: "" });
        })
        .catch(error => {
          console.error("There was an error updating the data!", error);
        });
    } else {
      axios.post('http://localhost:5000/passwords', form)
        .then(response => {
          console.log(response.data);
          setPasswordArray([...passwordArray, response.data]);
          setform({ site: "", username: "", password: "" }); // Clear form after saving
        })
        .catch(error => {
          console.error("There was an error saving the data!", error);
        });
    }
  };

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const deletePassword = (id) => {
    axios.delete(`http://localhost:5000/passwords/${id}`)
      .then(() => {
        setPasswordArray(passwordArray.filter(item => item._id !== id));
      })
      .catch(error => {
        console.error("There was an error deleting the data!", error);
      });
  };

  const editPassword = (id) => {
    const passwordToEdit = passwordArray.find(item => item._id === id);
    setform(passwordToEdit);
    setIsEditing(true);
    setEditId(id);
  };

  return (
    <div className="absolute inset-0 -z-10 h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]">
      <div className="md:mycontainer bg-slate-400 rounded-xl">
        <h1 className="text-4xl font-bold text-center">
          <span className="text-green-700"> &lt;</span>
          <span>Pass</span>
          <span className="text-green-700">OP/&gt;</span>
        </h1>
        <p className="text-green-900 text-lg text-center font-semibold">
          Your own Password Manager
        </p>
        <div className="flex flex-col p-4 text-black gap-8 items-center">
          <input
            value={form.site}
            onChange={handleChange}
            type="text"
            name="site"
            placeholder="Enter website URL"
            className="border border-green-500 rounded-full p-4 py-1 w-full"
          />
          <div className="flex md:flex-row flex-col w-full justify-between gap-8">
            <input
              value={form.username}
              onChange={handleChange}
              type="text"
              name="username"
              placeholder="Enter UserName"
              className="border border-green-500 rounded-full p-4 py-1 w-full"
            />
            <div className="flex relative">
              <input
                value={form.password}
                ref={passwordRef}
                onChange={handleChange}
                type="password"
                name="password"
                placeholder="Enter Password"
                className="border border-green-500 rounded-full p-4 py-1 w-full"
              />
              {showPassword ? (
                <FaEye
                  className="absolute top-[8px] right-[10px] cursor-pointer"
                  onClick={toggleshowPassword}
                />
              ) : (
                <FaEyeSlash
                  className="absolute top-[8px] right-[10px] cursor-pointer"
                  onClick={toggleshowPassword}
                />
              )}
            </div>
          </div>
          <button
            onClick={savePassword}
            className="flex justify-center items-center bg-green-600 hover:bg-green-500 rounded-full px-6 py-2 w-fit text font-semibold gap-4 border border-green-900"
          >
            {isEditing ? "Update Password" : "Save Password"}
          </button>
        </div>
        <div className="passwords">
          <h2 className="font-bold text-3xl py-4">Your Passwords</h2>
          {passwordArray.length === 0 && <div>No Passwords to show</div>}
          {passwordArray.length !== 0 && (
            <table className="table-auto w-full overflow-hidden rounded-xl">
              <thead className="bg-green-800 text-white">
                <tr>
                  <th className="py-2">Site</th>
                  <th className="py-2">Username</th>
                  <th className="py-2">Password</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody className="bg-green-100">
                {passwordArray.map((item, index) => (
                  <tr key={index}>
                    <td className="py-2 text-center w-32 border border-white">
                      <span className="flex justify-center items-center gap-3">
                        <a
                          href={item.site}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.site}
                        </a>
                        <IoCopy
                          className="cursor-pointer"
                          onClick={() => copytext(item.site)}
                        />
                      </span>
                    </td>
                    <td className="py-2 text-center w-32 border border-white">
                      <span className="flex justify-center items-center gap-3">
                        {item.username}
                        <IoCopy
                          className="cursor-pointer"
                          onClick={() => copytext(item.username)}
                        />
                      </span>
                    </td>
                    <td className="py-2 text-center w-32 border border-white">
                      <span className="flex justify-center items-center gap-3">
                        {item.password}
                        <IoCopy
                          className="cursor-pointer"
                          onClick={() => copytext(item.password)}
                        />
                      </span>
                    </td>
                    <td className="py-2 text-center w-32 border border-white">
                      <span className="flex justify-center items-center gap-3">
                        <FiEdit
                          className="size-6 cursor-pointer"
                          onClick={() => editPassword(item._id)}
                        />
                        <MdDeleteForever
                          className="size-6 cursor-pointer"
                          onClick={() => deletePassword(item._id)}
                        />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
