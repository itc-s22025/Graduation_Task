"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/app/context/AuthProvider";

const withAuth = (WrappedComponent) => {
  // eslint-disable-next-line react/display-name
  return (props) => {
    const { currentUser, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !currentUser) {
        router.replace("/");
      }
    }, [currentUser, loading, router]);

    if (loading) {
      return <p>Loading...</p>;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
