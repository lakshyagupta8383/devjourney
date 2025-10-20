"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { Loader2, UserCircle, Save } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    photoURL: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          setProfile({
            name: snap.data().name || "",
            email: snap.data().email || user.email,
            bio: snap.data().bio || "",
            photoURL: snap.data().photoURL || user.photoURL || "",
          });
        } else {
          // Create a new Firestore user doc if not exists
          await setDoc(userRef, {
            uid: user.uid,
            name: user.displayName || "",
            email: user.email,
            photoURL: user.photoURL || "",
            createdAt: new Date(),
          });
          setProfile({
            name: user.displayName || "",
            email: user.email,
            bio: "",
            photoURL: user.photoURL || "",
          });
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSuccess("");

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        name: profile.name,
        bio: profile.bio,
        photoURL: profile.photoURL,
        updatedAt: new Date(),
      });
      setSuccess("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      setSuccess("❌ Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin w-6 h-6 text-blue-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 text-blue-900 py-12 px-6">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg border border-blue-200 p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
            <UserCircle className="w-6 h-6 text-blue-600" /> Your Profile
          </h1>
        </div>

        {/* Profile Photo */}
        

        {/* Profile Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">
              User Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full border border-blue-300 rounded-md px-4 py-2 focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">
              Email (read-only)
            </label>
            <input
              type="email"
              value={profile.email}
              readOnly
              className="w-full border border-gray-200 bg-gray-50 rounded-md px-4 py-2 text-gray-600 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-700 mb-1">
              Bio
            </label>
            <textarea
              rows={3}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full border border-blue-300 rounded-md px-4 py-2 focus:ring focus:ring-blue-200 resize-none"
              placeholder="Tell us something about yourself..."
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full mt-6 bg-blue-600 text-white rounded-md py-2 flex items-center justify-center gap-2 hover:bg-blue-700 transition disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Save Profile
            </>
          )}
        </button>

        {success && (
          <p
            className={`mt-4 text-center text-sm font-medium ${
              success.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {success}
          </p>
        )}
      </div>
    </div>
  );
}
