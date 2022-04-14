import { useRouter } from "next/router";
import Image from "next/image";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Link from "next/link";
import {
  HomeIcon,
  UsersIcon,
  LogoutIcon,
  MenuIcon,
  XIcon,
} from "@heroicons/react/outline";
import useRequireAuth from "hooks/useRequireAuth";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { signOut } from "redux/authSlice";

type Props = {
  children?: JSX.Element | JSX.Element[];
};

const Layout = ({ children }: Props): JSX.Element => {
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-40 flex md:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <XIcon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </Transition.Child>
                <div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
                  <nav className="mt-5 space-y-1 px-2">
                    {navigation.map((item) => (
                      <Link href={item.pathname} key={item.name}>
                        <a
                          key={item.name}
                          href={item.pathname}
                          className={`group flex items-center rounded-md px-2 py-2 text-base font-medium ${
                            isCurrentPathname(item.pathname)
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          <item.icon
                            className={`mr-4 h-6 w-6 flex-shrink-0 ${
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
                      Sign out
                    </a>
                  </nav>
                </div>
                <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
                  <a href="#" className="group block flex-shrink-0">
                    <div className="flex items-center">
                      <div>
                        <Image
                          className=" h-8 w-8 rounded-full"
                          src={user?.avatarUrl ?? "/default_avatar.png"}
                          alt={user?.name}
                          height={32}
                          width={32}
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">
                          {user?.name}
                        </p>
                        <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </Transition.Child>
            <div className="w-14 flex-shrink-0">
              {/* Force sidebar to shrink to fit close icon */}
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
            <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
              <nav className="mt-5 flex-1 space-y-1 bg-white px-2">
                {navigation.map((item) => (
                  <Link href={item.pathname} key={item.name}>
                    <a
                      key={item.name}
                      href={item.pathname}
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
                  Sign out
                </a>
              </nav>
            </div>
            <div className="flex flex-shrink-0 border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div>
                  <Image
                    className="inline-block h-9 w-9 rounded-full"
                    src={user?.avatarUrl ?? "/default_avatar.png"}
                    alt={user?.name}
                    height={32}
                    width={32}
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {user?.name}
                  </p>
                  <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-1 flex-col md:pl-64">
          <div className="sticky top-0 z-10 bg-white pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden">
            <button
              type="button"
              className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <MenuIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
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
