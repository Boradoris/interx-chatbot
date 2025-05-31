import { NavLink } from "react-router-dom";
import Logo from "../ui/logo";

const SideMenu = () => {
  return (
    <aside className="w-[260px] h-full border-r border-gray-200 flex-shrink-0 relative">
      <h2 className="p-6 w-full border-b border-gray-50">
        <NavLink to="/">
          <div className="w-[129px] h-[24px]">
            <Logo />
          </div>
        </NavLink>
      </h2>
    </aside>
  );
};

export default SideMenu;
