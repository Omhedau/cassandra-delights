import React, { useEffect, useRef, useState } from "react";
import { MdMoreVert } from "react-icons/md";
import TextField from "@mui/material/TextField";
import axios from "axios";

const Comment = ({ comment, fetchComments, userData }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("auth")) || ""
  );

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(comment.content);
    setIsDropdownOpen(false);
  };

  const handleSaveEdit = async () => {
    const content = editContent;
    const commentId = comment._id;

    try {
      const response = await axios.put(
        `${window.location.origin}/api/v1/comment`,
        { content, commentId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("calling the handleSaveEdit", response.data.comment);
      if (response.status === 200) {
        console.log("Comment updated successfully:", response.data.comment);
        fetchComments();
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }

    setIsEditing(false);
    setIsDropdownOpen(false);
  };

  const handleDelete = async () => {
    const commentId = comment._id;
    try {
      const response = await axios.delete(
        `${window.location.origin}/api/v1/comment/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Comment deleted successfully");
        fetchComments();
      } else {
        console.error("Failed to delete comment:", response.data.error);
      }
    } catch (error) {
      console.error("Error deleting comment:", error.message);
    }
  };

  // logic of handling outside close menu ------------------------------------------ |||||| ------------------------------------
  let menuRef = useRef();

  useEffect(() => {
    let handler =  (event) => {
      if (!menuRef.current.contains(event.target)){
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown",handler);

    return () => {
      document.removeEventListener("mousedown",handler)
    }
  });

  // ---------------------------------------------------------------- ||||| ---------------------------------------------------

  return (
    <div
      key={comment._id}
      className="bg-[#FFF3EF] border-l-4 border-pink-300 rounded-md  p-4  mb-2"
    >
      {isEditing ? (
        <div className="">
          <TextField
            label="Edit comment"
            variant="standard"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            fullWidth
            autoFocus
          />
          <div className="mt-1">
            <button
              className="bg-gray-300 text-gray-800 px-4 py-1 rounded-lg hover:bg-gray-400"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 ml-2"
              onClick={handleSaveEdit}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between">
          <div>
            <p className="text-gray-700">{comment.content}</p>
            <p className="text-sm text-gray-500 mt-2">
              Posted by {comment.user.name} on{" "}
              {new Date(comment.createdAt).toLocaleString()}
            </p>
          </div>
          {comment.user._id === userData.id && (
            <div ref={menuRef} className="relative">
              <MdMoreVert
                className="cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              />
              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute mt-1 w-24 bg-white shadow-lg rounded-lg">
                  <button
                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 w-full text-left"
                    onClick={handleEdit}
                  >
                    Edit
                  </button>
                  <button
                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 w-full text-left"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Comment;
