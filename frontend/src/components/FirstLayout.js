import LeftBarBeforeHome from "@/components/leftbar_before_home";
import "@/styles/FirstLayout.css"

export default function MainLayout({ children }) {
  return (
    <div className="flex">
      <LeftBarBeforeHome/>
        <main>{children}</main>
    </div>
  );
}