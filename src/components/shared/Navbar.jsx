"use client";
import { CircleUserRound, Info, LogOut, Search, X } from "lucide-react";
import useLoggedInUser from "../../hooks/useLoggedInUser";
import { usePathname } from "next/navigation";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { useCookie } from "@/hooks/useCookie";

const Navbar = () => {
  const { user } = useLoggedInUser();
  const pathname = usePathname();
  const { getCookie } = useCookie({ key: "Token", days: 7 });
  const token = getCookie();

  return (
    <nav
      className={`${
        pathname === "/" ? " absolute z-10 text-white" : "bg-white text-black"
      } w-full `}
    >
      {/* ads shows */}
      <div
        style={{ boxShadow: "20px 10px 15px rgba(0, 0, 0, 0.10)" }}
        className={`${pathname === "/" ? "block" : "hidden"} bg-white w-full`}
      >
        <div className="wrapper flex items-center justify-between">
          <div className="flex items-center gap-3 ">
            <Info className="text-blue-400" />
            <h3 className="capitalize text-slate-600">
              Flight operation update: Resumption flight to lebanon
            </h3>
          </div>
          <div>
            <X className="text-slate-500" />
          </div>
        </div>
      </div>
      <div className="wrapper shadow-inner">
        <div className="md:flex justify-between items-center ">
          {/* logo */}
          <div className="text-2xl font-bold">
            <Link href="/">
              <h1>logoooo</h1>
            </Link>
          </div>
          {/* main nav links */}
          <div className="flex items-center text-xl">
            <ul className="flex items-center gap-14">
              <li>
                <Link href="/">Explore</Link>
              </li>
              <li>
                <Link href="/">Book</Link>
              </li>
              <li>
                <Link href="/">Experience</Link>
              </li>
              <li>
                <Link href="/">Privilege Club</Link>
              </li>
            </ul>
          </div>
          {/* extra service */}
          <div className="flex items-center gap-10 text-xl">
            <div className="flex items-center gap-5">
              <Link href="/">Help</Link>
              <Search />
            </div>
            {/* login/server */}
            {user &&
            user.loggedInUser &&
            user.loggedInUser.id &&
            user.loggedInUser.token &&
            user.loggedInUser.token === token ? (
              <div className="flex gap-5 items-center">
                <Link href="/profile">
                  <img
                    className="w-12 h-12 rounded-full border-4 border-white"
                    src={
                      user?.userData?.img ||
                      (user?.userData?.gender !== "female"
                        ? "https://static.vecteezy.com/system/resources/previews/032/176/197/non_2x/business-avatar-profile-black-icon-man-of-user-symbol-in-trendy-flat-style-isolated-on-male-profile-people-diverse-face-for-social-network-or-web-vector.jpg"
                        : "https://icons.iconarchive.com/icons/icons8/ios7/512/Users-User-Female-2-icon.png")
                    }
                    alt=""
                  />
                  {/* <CircleUserRound /> */}
                </Link>
                {/* <div className="flex gap-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1"
                  >
                    Logout <LogOut />
                  </button>
                </div> */}
                <LogoutButton />
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <CircleUserRound />
                <div className="flex gap-2">
                  <Link href="/login">Log in</Link>
                  <span>|</span>
                  <Link href="/signup">Sign up</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
