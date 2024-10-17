import LeftBar from "@/components/leftbar_for_home";
import RightBar from "@/components/rightbar_for_home";
import "../styles/MainLayout.css"

export default function MainLayout({ children })  {
  return (
    <div className="left_and_right_bars">
      <LeftBar className="leftBar"/>
        <div>
            {/*<AccountHeader />*/}
            <main>{children}</main>
        </div>
      <RightBar className="rightBar"/>
    </div>
  );
}
import React from 'react';