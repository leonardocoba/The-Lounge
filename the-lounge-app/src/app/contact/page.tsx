"use client";

import { useState } from "react";
import Navbar from "../components/NavBar";
import BasicErrorMessage, {
  showBasicErrorMessage,
} from "../components/BasicErrorMessage";

const Contact = () => {
  // getting the name, email, message, and checking if form submission was successful
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false); // set it as false initially

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // this prevents the browser from reloading

    if (!name || !email || !message) {
      // make sure all fields are filled out...
      showBasicErrorMessage("Please fill out all fields to proceed.");
      return;
    }

    // If the form is filled out correctly, set success to true!
    setSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#D8E8D3]">
      <Navbar />
      {/* Bubble container */}
      <div className="relative bg-[#2C3E50] rounded-3xl p-12 mx-auto w-[90%] md:w-4/5 max-w-7xl shadow-lg my-20">
        <div className="flex flex-col items-center justify-center py-20 px-5">
          <h1 className="text-5xl font-bold text-white mb-10">Contact Us</h1>
          <p className="text-lg text-gray-200 text-center max-w-2xl mb-8">
            Have questions or feedback? We'd love to hear from you! Please fill
            out the form below, and we'll get back to you as soon as possible.
          </p>

          {success ? (
            <div className="text-green-500 text-xl mb-4">
              Thank you for your message! We'll get back to you soon.
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-md bg-white p-8 rounded shadow-lg"
            >
              <div className="mb-6">
                <label htmlFor="name" className="block text-gray-600 text-lg mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-600 text-lg mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-600 text-lg mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white text-lg font-semibold py-3 rounded-lg hover:bg-blue-600"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
      <BasicErrorMessage />
    </div>
  );
};

export default Contact;