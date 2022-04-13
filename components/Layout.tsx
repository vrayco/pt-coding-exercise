import { useRouter } from "next/router";
import { HomeIcon, UsersIcon, LogoutIcon } from "@heroicons/react/outline";
import Link from "next/link";
import useRequireAuth from "hooks/useRequireAuth";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { signOut } from "redux/authSlice";

type Props = {
  children: JSX.Element;
};

const Layout = ({ children }: Props): JSX.Element => {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  useRequireAuth();

  const navigation = [
    {
      name: "Dashboard",
      pathname: "/dashboard",
      icon: HomeIcon,
    },
    {
      name: "Settings",
      pathname: "/dashboard/settings",
      icon: UsersIcon,
    },
  ];

  const onHandleLogout = () => {
    if (user) {
      dispatch(signOut());
    }
  };

  const isCurrentPathname = (pathname: string): boolean =>
    router.pathname === pathname;

  const getTitleFromPathname = (): string => {
    const item = navigation.find((item) => item.pathname === router.pathname);
    return item?.name ?? "";
  };

  return (
    <>
      <div>
        {/* Static sidebar for desktop */}
        <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
            <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
              <div className="flex flex-shrink-0 items-center px-4"></div>
              <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
                {navigation.map((item) => (
                  <Link href={item.pathname} key={item.name}>
                    <a
                      className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                        isCurrentPathname(item.pathname)
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <item.icon
                        className={`mr-3 h-6 w-6 flex-shrink-0 ${
                          isCurrentPathname(item.pathname)
                            ? "text-gray-500"
                            : "text-gray-400 group-hover:text-gray-500"
                        }`}
                        aria-hidden="true"
                      />
                      {item.name}
                    </a>
                  </Link>
                ))}
                <a
                  onClick={onHandleLogout}
                  className="group flex cursor-pointer items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <LogoutIcon
                    className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  Logout
                </a>
              </nav>
            </div>
            <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
              <a href="#" className="group block w-full flex-shrink-0">
                <div className="flex items-center">
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                      {user?.name}
                    </p>
                    <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                      View profile
                    </p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col md:pl-64">
          <main className="flex-1">
            <div className="py-6">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">
                  {getTitleFromPathname()}
                </h1>
              </div>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
                <div className="py-4">{children}</div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default Layout;
