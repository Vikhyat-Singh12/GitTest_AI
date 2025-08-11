import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function GitHubAuthCallback() {
  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      setToken(token);
      navigate("/");
    } else {
      navigate("/?error=NoToken");
    }
  }, [setToken, navigate]);

  return <p>Authenticating with GitHub...</p>;
}
