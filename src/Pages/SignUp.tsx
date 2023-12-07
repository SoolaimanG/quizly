import { Link, useSearchParams } from "react-router-dom";
import { Button } from "../components/Button";
import { Checkbox } from "../components/CheckBox";
import { Input } from "../components/Input";
import { Label } from "../components/Label";
import { useState } from "react";
import Fade from "../Animations/Fade";
import { IUser } from "../Types/components.types";
import { Award, CheckCircle2, User } from "lucide-react";
import axios from "axios";
import { toast } from "../components/use-toaster";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/DialogModal";
import { AnimatePresence, motion } from "framer-motion";
import Oauth from "../components/Oauth";

const content = Object.freeze({
  student_acct_desc: "Participate in quizzes and more",
  teacher_acct_desc: "Create and manage quizzes and more",
  account_created:
    "Account successfully created! Dive into an enhanced learning experience as a student or unlock powerful teaching tools as an educator. Let the journey begin!",
  email_message: "A verification email has been sent to the email you provided",
});

const SignUp = () => {
  const [view, setView] = useSearchParams();
  const [state, setState] = useState({
    loading: false,
    success: false,
  });
  const [formData, setFormData] = useState<
    Pick<
      IUser,
      | "first_name"
      | "last_name"
      | "email"
      | "username"
      | "account_type"
      | "password"
    >
  >({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    account_type: "S",
    password: "",
  });

  const signUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { email, first_name, last_name, password, username, account_type } =
      formData;

    if (
      email &&
      first_name &&
      last_name &&
      password &&
      username &&
      account_type
    ) {
      try {
        setState({ ...state, loading: true });
        await axios.post(
          import.meta.env.VITE_QUIZLY_API_HOST + "/api/v1/auth/",
          {
            ...formData,
          },
          {
            withCredentials: true,
          }
        );

        setState({ ...state, loading: false, success: true });
        setFormData({
          username: "",
          account_type: "S",
          password: "",
          email: "",
          first_name: "",
          last_name: "",
        });
      } catch (error: any) {
        console.error(error);
        toast({
          title: "Error " + error.response.status,
          description:
            error.response.data.message ||
            error.message ||
            "Something went wrong...",
          variant: "destructive",
          duration: 3000,
        });
        setState({ ...state, loading: false });
      }

      return;
    }

    setView(`view=second`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const first_view = (
    <form onSubmit={signUp} className="w-full flex flex-col gap-3" action="">
      <h1 className="text-3xl text-green-600">Sign Up To Use Quizly</h1>
      <div className="w-full flex items-center gap-3">
        <Label className="flex w-full flex-col gap-2" htmlFor="first_name">
          First Name
          <Input
            value={formData.first_name}
            onChange={handleChange}
            name="first_name"
            required
            id="first_name"
            className="w-full h-[3rem] invalid:border-red-500"
            placeholder="John"
          />
        </Label>
        <Label className="flex w-full flex-col gap-2" htmlFor="last_name">
          Last Name
          <Input
            value={formData.last_name}
            name="last_name"
            onChange={handleChange}
            required
            id="last_name"
            className="w-full h-[3rem] invalid:border-red-500"
            placeholder="Doe"
          />
        </Label>
      </div>
      <Label className="w-full flex flex-col gap-2" htmlFor="email">
        Email
        <Input
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          type="email"
          id="email"
          className="w-full h-[3rem] invalid:border-red-500"
          placeholder="Email"
        />
      </Label>
      <Label className="w-full flex flex-col gap-2" htmlFor="password">
        Password
        <Input
          value={formData.password}
          name="password"
          type="password"
          onChange={handleChange}
          required
          id="password"
          className="w-full h-[3rem] invalid:border-red-500"
          placeholder="Password"
        />
      </Label>
      <Button className="bg-green-400 dark:bg-green-500 hover:dark:bg-green-600 hover:bg-green-500 w-full h-[3rem] mt-3">
        Next
      </Button>
    </form>
  );

  const second_view = (
    <form onSubmit={signUp} className="w-full flex flex-col gap-3">
      <h1 className="text-3xl text-green-600">Continue to signup 😉</h1>
      <Label htmlFor="username" className="flex flex-col gap-2">
        Username
        <Input
          required
          id="username"
          onChange={handleChange}
          name="username"
          className="w-full h-[3rem] invalid:border-red-500"
          placeholder="Johndhoe2023"
        />
      </Label>

      <p className="text-lg">Select the type of account you want?</p>
      <div className="flex w-full flex-col gap-3">
        <div
          onClick={() => setFormData({ ...formData, account_type: "S" })}
          className={`w-full ${
            formData.account_type === "S" && "bg-green-500 text-white"
          } overflow-hidden h-fit text-3xl p-3 rounded-md relative hover:bg-green-500 hover:text-white transition-all delay-75 ease-linear border border-green-400 items-start flex flex-col justify-start`}
        >
          <Award
            size={60}
            className="-mt-5 -ml-5 absolute top-0 left-0 opacity-50"
          />
          Student
          <p className="text-base">{content.student_acct_desc}</p>
        </div>
        <div
          onClick={() => setFormData({ ...formData, account_type: "T" })}
          className={`w-full ${
            formData.account_type === "T" && "bg-green-500 text-white"
          } overflow-hidden h-fit border border-green-400 text-3xl p-3 rounded-md hover:bg-green-500 transition-all delay-75 ease-linear hover:text-white flex flex-col items-start relative justify-start`}
        >
          <User
            size={60}
            className="-mt-5 -ml-5 absolute top-0 left-0 opacity-50"
          />
          Teacher
          <p className="text-base">{content.teacher_acct_desc}</p>
        </div>
        <Label className="flex items-center gap-1">
          <Checkbox
            className="data-[state=checked]:bg-green-500 border-green-400"
            required
          />
          Agree with Terms and Conditions
        </Label>
      </div>
      <div className="w-full flex gap-2 items-center justify-end">
        <Button
          onClick={() => setView("view=first")}
          type="button"
          size={"lg"}
          variant={"outline"}
        >
          Go back
        </Button>
        <Button
          disabled={state.loading}
          type="submit"
          className="bg-green-400 disabled:bg-green-700 dark:bg-green-500 hover:dark:bg-green-600 hover:bg-green-500 text-white"
          size={"lg"}
        >
          Signup
        </Button>
      </div>
    </form>
  );

  const success_popup = (
    <Dialog
      onOpenChange={() => setState({ ...state, success: !state.success })}
      open={state.success}
    >
      <DialogContent>
        <DialogHeader className="w-full flex items-center justify-center">
          <CheckCircle2 className="text-green-400" size={70} />
          <DialogTitle className="w-full text-center">
            Account Created
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-lg text-center">
          {content.account_created}
        </DialogDescription>
        <DialogDescription className="mt-2 text-center text-green-400">
          {content.email_message}
        </DialogDescription>
        <DialogFooter className="w-full flex flex-col md:flex-row md:gap-0 gap-3">
          <Button
            className="w-full"
            onClick={() => setState({ ...state, success: false })}
            size={"lg"}
            variant={"outline"}
          >
            Cancel
          </Button>
          <Button className="w-full" size={"lg"}>
            <Link to={"/auth/login"}>Go to login</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <Fade delay={0.4} className="w-full flex gap-3 flex-col">
      <AnimatePresence mode="wait">
        <motion.div
          key={view.get("view")?.toString()}
          animate={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: 5 }}
          transition={{ delay: 0.15 }}
          exit={{ opacity: 0, x: -5 }}
        >
          {view.has("view") && view.get("view") === "second"
            ? second_view
            : first_view}
        </motion.div>
      </AnimatePresence>
      <div className="flex w-full items-center gap-1">
        <div className="w-full h-[1.5px] bg-gray-400 dark:bg-gray-300" />
        <p className="w-full text-center">Or sign up with</p>
        <div className="w-full h-[1.5px] bg-gray-400 dark:bg-gray-300" />
      </div>
      <Oauth />
      {success_popup}
    </Fade>
  );
};

export default SignUp;
