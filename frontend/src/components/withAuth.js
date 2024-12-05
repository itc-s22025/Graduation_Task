// components/withAuth.js
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/app/context/AuthProvider";
import LoadingPage from "@/components/loadingPage";

const withAuth = (WrappedComponent) => {
  // eslint-disable-next-line react/display-name
  return (props) => {
    const { currentUser, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !currentUser) {
        // 認証が完了し、ユーザが存在しない場合はリダイレクト
        router.replace("/");
      }
    }, [currentUser, loading, router]);

    // ローディング中、またはユーザーが存在しない場合はコンテンツを表示しない
    if (loading || !currentUser) {
      return(
        <LoadingPage/>
      )
    }

    // 認証が成功した場合のみコンポーネントを表示
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
