import { css, cx } from "@linaria/core";
import { SidebarHeader } from "./SidbarHeader";
import { SidebarLinks } from "./SidbarLinks";
import { useAuth } from "./AuthContext";
import { createSignal } from "solid-js";

const sidebarBase = css`
  background-color: #0c0c1d;
  color: white;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 10px;
  justify-content: space-between;
  transition: width 0.3s ease;
  overflow: hidden;
`;

const sidebarExpanded = css`
  width: 250px;
`;

const sidebarCollapsed = css`
  width: 80px;
`;

const userAvatar = css` 
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #555;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
`;

export const Sidebar = () => {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = createSignal(false);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed())
  };

  return (
    <div class={cx(sidebarBase, sidebarExpanded, isCollapsed() && sidebarCollapsed)}>
      <div>
        <SidebarHeader toggle={handleToggle} collapsed={isCollapsed} />
        <SidebarLinks isCollapsed={isCollapsed} />
      </div>
      <div class={userAvatar}>
        {user()?.email.charAt(0).toUpperCase()}
      </div>
    </div>
  );
};
