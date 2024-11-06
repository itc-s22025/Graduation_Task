import LeftBar from "@/components/leftbar_for_home";
import RightBar from "@/components/rightbar_for_home";
import "../styles/MainLayout.css";
import withAuth from "@/components/withAuth"; // withAuthのインポート

function MainLayout({ children }) {
  return (
    <div className="left_and_right_bars">
      <LeftBar className="leftBar" />
      <div>
        <main>{children}</main>
      </div>
      <RightBar className="rightBar" />
    </div>
  );
}

export default withAuth(MainLayout); // MainLayoutをwithAuthでラップ
