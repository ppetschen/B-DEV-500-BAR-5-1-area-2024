import React from "react";
import { DASHBOARD_SIDEBAR_LINKS } from "../../page/homepage/navigation";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import { FaPeoplePulling } from "react-icons/fa6";

const linkClasses =
  "flex items-center gap-2 font-light px-3 py-2 hover:bg-neutral-700 hover:no-underline active:bg-neutral-600 rounded-sm text-base";

export default function Sidebar() {
  return (
    <div className="flex flex-col p-3 text-white bg-neutral-900 w-60">
      <div className="flex items-center gap-2 px-1 py-3 ">
        <FaPeoplePulling fontSize={24} />
        <span className="text-lg text-neutral-100">AREA</span>
      </div>

      <div className="flex-1 py-8 flex flex-col gap-0.5">
        {DASHBOARD_SIDEBAR_LINKS.map((item) => (
          <SidebarLinks key={item.key} item={item} />
        ))}
      </div>
    </div>
  );
}

function SidebarLinks({ item }) {
  const { pathname } = useLocation();

  return (
    <Link
      to={item.path}
      className={classNames(
        pathname == item.path
          ? "bg-neutral-700 text-white"
          : "text-neutral-400",
        linkClasses,
      )}
    >
      <span className="text-xl">{item.icon}</span>
      {item.label}
    </Link>
  );
}
