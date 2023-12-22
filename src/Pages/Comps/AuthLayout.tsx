import { useDocumentTitle, useWindowSize } from "@uidotdev/usehooks";
import { app_config, authLayout } from "../../Types/components.types";
import Login from "../Login";
import ForgetPassword from "../ForgetPassword";
import ConfirmEmail from "../ConfirmEmail";

const AuthViews = {
  Login: {
    element: Login,
    desc: `Login to access your ${app_config.AppName} account, or rest assured, if you don't have one yet, we'll create it for you seamlessly!`,
  },
  ForgetPassword: {
    element: ForgetPassword,
    desc: "",
  },
  ConfirmEmail: {
    element: ConfirmEmail,
    desc: "",
  },
}; //Type of view that can be rendered LoginView | ForgetPassword | ConfirmEmail

const AuthLayout = ({ path }: authLayout) => {
  const CurrentView = AuthViews[path];

  const { width } = useWindowSize(); //Getting the size of the window size
  useDocumentTitle("Auth | " + path); //This titles changes dynamically

  const style: React.CSSProperties = {
    clipPath: "ellipse(82% 40% at 94% 16%)",
    backgroundImage:
      "linear-gradient(to right bottom,#bbf7d0,#b1f6c9,#a8f4c3,#9ef3bc,#94f1b5,#86f3c8,#7cf5db,#78f5eb,#9af5ff,#c7f3ff,#eaf4ff,#f9f9f9)",
    height: "400px",
  };

  return (
    <section className="flex h-screen w-full overflow-hidden">
      <div className="w-full md:w-[40%] z-20 flex h-full items-center p-2">
        <CurrentView.element
          title="Quizly Connection: Login to Learn"
          description={CurrentView.desc}
        />
      </div>
      <div
        style={Number(width) < 770 ? style : undefined}
        className="absolute md:relative md:block auth-gradient w-full md:w-[60%]"
      />
    </section>
  );
};

export default AuthLayout;
