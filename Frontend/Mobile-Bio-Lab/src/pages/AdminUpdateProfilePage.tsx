// src/pages/AdminUpdateProfilePage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserProfile, type UserProfile } from "../services/userprofileservice";
import UserProfileForm from "../components/UserProfileModal";

const AdminUpdateProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      try {
        const userData = await getUserProfile(Number(id));
        console.log("Fetched user:", userData); // ✅ Already a UserProfile
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        alert("Failed to fetch user profile");
        navigate("/adminDashboard/users"); // redirect back to users list
      }
    };

    fetchUser();
  }, [id, navigate]);

  if (!user) return <div>Loading...</div>;

  return <UserProfileForm user={user} onUpdated={() => console.log("Profile updated")} />;
};

export default AdminUpdateProfilePage;
