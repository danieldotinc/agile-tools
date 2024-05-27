"use client";
import { useState } from 'react';

const PromptName = ({ onNameSubmit }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name) {
      onNameSubmit(name);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded shadow-lg">
        <h2 className="text-2xl mb-4">Enter your name</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full mb-4 border-prominent rounded"
          autoFocus
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
};

export default PromptName;
