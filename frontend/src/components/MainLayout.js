import LeftBar from "@/components/leftbar_for_home";
import RightBar from "@/components/rightbar_for_home";
import "../styles/MainLayout.css"
import Header from "@/components/header";

export default function MainLayout({ children }) {
  return (
    <div className="left_and_right_bars">
      <LeftBar/>
        <div>
            <main>{children}</main>
        </div>
      <RightBar/>
    </div>
  );
}
