"use client";

import { useCookie } from "@/hooks/useCookie";
import useLoggedInUser from "@/hooks/useLoggedInUser";
import axios from "axios";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const { refetch } = useLoggedInUser();
  const { getCookie, removeCookie } = useCookie({ key: "Token", days: 7 });
  const token = getCookie();

  const handleLogout = async () => {
    try {
      await axios.delete("/api/login", {
        headers: { Authorization: `Bearer ${token}` },
      });
      removeCookie();
      refetch();
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
    refetch();
  };
  return (
    <div className="flex gap-2">
      <button onClick={handleLogout} className="flex items-center gap-1">
        Logout <LogOut />
      </button>
    </div>
  );
}
