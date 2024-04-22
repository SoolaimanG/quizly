import { AlignRight, X } from "lucide-react";
import { Button } from "../Button";
import ProfilePic from "../../assets/profile_two.png";
import Logo from "../Logo";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "../Sheet";
import { useEffect, useState } from "react";
import { useWindowSize } from "@uidotdev/usehooks";
import { motion } from "framer-motion";
import { DarkMode } from "../Darkmode";
import { Link } from "react-router-dom";
import { useAuthentication } from "../../Hooks";
import { useZStore } from "../../provider";
import { app_config } from "../../Types/components.types";
import { capitalize_first_letter } from "../../Functions";
import { Avatar, AvatarFallback, AvatarImage } from "../Avatar";
import { navbar_links } from "../../lib/utils";

// Navbar component
const Navbar = () => {
  const [current_nav, setCurrent_nav] = useState("#home");
  const [nav_on_top, setNav_on_top] = useState(true);
  const { width } = useWindowSize();
  // const { isAuthenticated } = useMethods();
  const { isAuthenticated } = useAuthentication();
  const { user } = useZStore();

  //console.log({ isLoading, data, error });

  // Effect to handle the scroll event and update the nav_on_top state
  useEffect(() => {
    const handleScroll = () => {
      window.scrollY > 10 ? setNav_on_top(false) : setNav_on_top(true);
    };

    // Adding event listener for scroll
    window.addEventListener("scroll", handleScroll);
    // Calling handleScroll on first render to check if the user is away from the top
    handleScroll();

    // Cleaning up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Rendering the navbar links
  const navbar_link_render = (
    <div className="flex items-center gap-5 md:gap-3 flex-col md:flex-row md:bg-green-50 h-12 p-1 rounded-lg dark:text-green-500">
      {navbar_links.map((navbar, i) => (
        <motion.li
          onClick={() => setCurrent_nav(navbar.path)}
          className={`list-none flex items-center justify-center ${
            current_nav === navbar.path &&
            Number(width) > 770 &&
            "bg-green-400 text-white rounded-md"
          } h-[98%] w-fit px-3 hover:bg-green-400 hover:text-white transition-all ease-linear delay-75 hover:rounded-md`}
          key={i}
        >
          <a href={navbar.path}>{navbar.name}</a>
        </motion.li>
      ))}
    </div>
  );

  // Navbar for desktop screens
  const navbar_on_desktop = (
    <div className="w-full hidden md:flex items-center justify-between">
      <Link to={"/"}>
        <Logo />
      </Link>
      {navbar_link_render}
      <div className="flex items-center gap-2">
        <DarkMode />
        <Link to={isAuthenticated ? "quizly/profile" : app_config.login_page}>
          {!isAuthenticated ? (
            <Button
              className="bg-green-500 text-base hover:bg-green-600 font-semibold dark:text-white"
              size={"lg"}
            >
              Login
            </Button>
          ) : (
            <Avatar>
              <AvatarImage src={user?.profile_image} />
              <AvatarFallback>
                {capitalize_first_letter(user?.username as string)}
              </AvatarFallback>
            </Avatar>
          )}
        </Link>
      </div>
    </div>
  );

  // Navbar for mobile screens
  const navbar_on_mobile = (
    <div className="w-full md:hidden flex items-center justify-between">
      <Link to={app_config.landing_page}>
        {" "}
        <Logo show_word={false} />
      </Link>

      {/* Sheet to show on mobile */}
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline">
            <AlignRight />
          </Button>
        </SheetTrigger>
        <SheetContent className="md:hidden">
          <SheetHeader>
            <Logo />
          </SheetHeader>
          <SheetClose className="absolute right-2 top-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
            <SheetClose>
              <Button size={"icon"}>
                <X size={20} />
              </Button>
            </SheetClose>
          </SheetClose>
          <div className="flex flex-col mt-10 gap-10">
            {navbar_links.map((link, i) => (
              <SheetClose
                className={`text-xl flex items-start justify-start hover:text-green-500 delay-75 ${
                  link.path === current_nav && "text-green-500 font-semibold"
                }`}
                key={i}
              >
                <a href={link.path}> {link.name}</a>
              </SheetClose>
            ))}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <img
                    className="w-[3rem] h-[3rem] bg-green-100 rounded-full"
                    src={(user?.profile_image as string) || ProfilePic}
                    alt="profilePicture"
                  />
                  <p className="text-green-400">
                    {capitalize_first_letter(user?.username as string)}
                  </p>
                </div>
              ) : (
                <Link to={app_config.login_page}>
                  <Button
                    className="bg-green-500 text-base hover:bg-green-600 font-semibold dark:text-white"
                    size={"lg"}
                  >
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div className="flex mt-5 items-center gap-2">
            <DarkMode />
            <p>Toggle between light and dark mode</p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );

  // Render the Navbar component
  return (
    <motion.div
      animate={{ opacity: 1, y: 0, transition: { delay: 0.25 } }}
      initial={{ opacity: 0, y: -30 }}
      className={`border-b w-full z-30 bg-white dark:bg-slate-700 fixed border-slate-200 dark:border-gray-500 ${
        !nav_on_top && "shadow-md"
      }`}
    >
      <nav className="md:max-w-6xl m-auto p-2">
        {navbar_on_desktop}
        {navbar_on_mobile}
      </nav>
    </motion.div>
  );
};

// Export the Navbar component as the default export
export default Navbar;
