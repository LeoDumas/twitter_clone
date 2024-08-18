import { useState } from "react";
import { usePocketBase } from "../../hooks/usePocketBase";

export default function SettingsPage() {
  const { pb, currentUser } = usePocketBase();
  const [username, setUsername] = useState(currentUser?.username || "");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Function to handle user account update
  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const updates = { username };

      // If an avatar is selected, append it to the updates
      if (avatar) {
        const formData = new FormData();
        formData.append("avatar", avatar);
        // Update the user with FormData for avatar
        await pb.collection("users").update(currentUser?.id, formData);
      }

      // Update the username
      await pb.collection("users").update(currentUser?.id, updates);
      setMessage("Account updated successfully!");
    } catch (error) {
      setMessage("Failed to update account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Combined Update Form */}
      <form onSubmit={handleUpdateAccount} className="mb-6">
        <label className="block mb-2 text-sm font-semibold text-gray-700">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your new username"
          required
        />

        <label className="block mb-2 text-sm font-semibold text-gray-700 mt-4">
          Avatar
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files ? e.target.files[0] : null)}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />

        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Account"}
        </button>
      </form>

      {/* Feedback Message */}
      {message && (
        <p
          className={`text-sm mt-4 ${
            message.includes("successfully") ? "text-green-500" : "text-red-500"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
