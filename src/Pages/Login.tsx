import { Sparkles } from "lucide-react";
import { IUser, loginProps } from "../Types/components.types";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import React, { useState } from "react";
import { toast } from "../components/use-toaster";
import axios, { AxiosError } from "axios";
import { useZStore } from "../provider";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Oauth from "../components/Oauth";

const Login = ({
  title,
  description,
  isPopup = false,
  fallback = "/",
}: loginProps) => {
  const { setUser } = useZStore();
  const router = useNavigate();
  const [state, setState] = useState({
    loading: false,
    error: "",
  });
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const loginWithPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { username, password } = formData;
    try {
      if (!(username && password)) {
        return toast({
          title: "Error 404",
          description: "Provide username and password",
          variant: "destructive",
        });
      }

      if (username.length <= 3 || password.length <= 6) {
        return toast({
          title: "Error 400",
          description: "Invalid username or password",
          variant: "destructive",
        });
      }

      setState({ ...state, loading: false }); //Start Loading
      const params = `?username=${username}&password=${password}`;
      const res = await axios.get(
        `${import.meta.env.VITE_QUIZLY_API_HOST}/api/v1/auth/${params}`
      );

      const new_user: IUser = {
        ...res.data.data,
      };

      setUser(new_user);
      Cookies.set("access_token", res.data.access_token);
      setState({ ...state, loading: false });

      router(fallback);
    } catch (error: AxiosError | any) {
      console.error(error);
      toast({
        title: "ERROR " + error.response.status,
        description:
          error.response.data.message ||
          error.response.data.detail ||
          "Something went wrong...",
        variant: "destructive",
      });
      setState({
        ...state,
        error:
          error.response.data.message ||
          error.response.data.detail ||
          "Something went wrong...",
        loading: false,
      });
    }
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-col">
        <Sparkles className="text-green-500" size={30} />
        <h1 className="text-2xl md:text-3xl">{title}</h1>
        <p className="text-gray-400 dark:text-gray-300">{description}</p>
      </div>
      <form
        onSubmit={loginWithPassword}
        className="flex w-full flex-col gap-2"
        action=""
      >
        <Input
          name="username"
          onChange={handleChange}
          className="w-full"
          placeholder="Username"
        />
        <Input
          name="password"
          type="password"
          onChange={handleChange}
          className="w-full"
          placeholder="Password"
        />
        {state.error.toLowerCase() === "incorrect password" && (
          <Link
            to={"/auth/forget-password"}
            className="underline w-full flex items-end justify-end"
          >
            Forget password?
          </Link>
        )}
        <Button
          type="submit"
          className="w-full bg-green-400 hover:bg-green-500 dark:bg-green-500 dark:hover:bg-green-600 disabled:bg-green-700 "
        >
          Login
        </Button>
      </form>
      <div className="w-full flex gap-1 items-center">
        <p
          className={`text-gray-400 w-[30%] dark:text-gray-300 ${
            isPopup && "text-center"
          }`}
        >
          Or Continue with
        </p>{" "}
        {!isPopup && <div className="w-[70%] h-[1.5px] bg-gray-400" />}
      </div>
      <Oauth />
      <Link
        to={"/auth/signup"}
        className="flex items-center justify-center w-full mt-3"
      >
        Dont have an account?{" "}
        <p className="underline text-green-500">Sign Up</p>
      </Link>
    </div>
  );
};

export default Login;
