//import React from 'react'

import { useEffect, useState } from "react";
import OnboardingNav from "../../components/App/OnboardingNav";
import { Button } from "../../components/Button";
import { content } from "../Onboarding";
import { toast } from "../../components/use-toaster";
import { ICategory, IStudent, subjects } from "../../Types/components.types";
import { edit_profile } from "../../Functions";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/DialogModal";
import { Link } from "react-router-dom";
import { useZStore } from "../../provider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import Error from "./Error";
import PageLoader from "../../components/Loaders/PageLoader";

const teacherProfileReasons = [
  "It makes students reach out to you easily.",
  "Showcase your expertise and qualifications.",
  "Gain visibility within the educational community.",
  "Participate in educational initiatives and opportunities.",
  "Connect with other educators for collaboration.",
  "Offer your specialized knowledge to a broader audience.",
];

const subject_categories = async (access_token: string) => {
  const res = await axios.get(
    import.meta.env.VITE_QUIZLY_API_HOST + "/api/v1/subject-categories/",
    {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }
  );

  return res.data;
};

const user_categories = async (access_token: string) => {
  const res = await axios.get(
    import.meta.env.VITE_QUIZLY_API_HOST + "/api/v1/user-categories/",
    {
      headers: {
        Authorization: "Bearer " + access_token,
      },
    }
  );

  return res.data;
};

const FourthView = () => {
  const access_token = Cookies.get("access_token");

  const { isLoading, data, error } = useQuery<"", any, { data: ICategory[] }>({
    queryKey: ["category"],
    queryFn: () => subject_categories(access_token as string),
    retry: 2,
  });
  const user_category = useQuery<
    "",
    any,
    { data: ICategory[]; message: string }
  >({
    queryKey: ["user_categories"],
    queryFn: () => user_categories(access_token as string),
  });

  const [formData, setFormData] = useState<Partial<IStudent>>({
    favourites: [],
  });

  useEffect(() => {
    setFormData({
      favourites:
        user_category.data?.data.flatMap((category) => category.body) || [],
    });
  }, [user_category.data]);

  const { user } = useZStore();
  const [states, setState] = useState({
    start_teacher_onboarding: false,
  });

  if (isLoading && user_category.isLoading) return <PageLoader />;

  if (error) return <Error retry_function={() => user_category.refetch()} />;

  const selection = (subject: subjects) => {
    const find_selected = formData?.favourites?.find((s) => s === subject);

    if (find_selected) {
      return setFormData({
        ...formData,
        favourites: formData?.favourites?.filter((s) => s !== subject),
      });
    }

    if ((formData?.favourites?.length as number) >= 5) {
      return toast({
        title: "Error",
        description: "Maximum selection is five",
        variant: "destructive",
      });
    }

    setFormData({ favourites: [...(formData?.favourites as []), subject] });
  };

  const submit_form = async () => {
    try {
      await edit_profile(formData);
      user?.account_type === "T" &&
        setState({ start_teacher_onboarding: true });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  };

  const teacher_onboarding = (
    <Dialog
      onOpenChange={() =>
        setState({ start_teacher_onboarding: !states.start_teacher_onboarding })
      }
      open={states.start_teacher_onboarding}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are You A Teacher</DialogTitle>
          <DialogDescription>
            We noticed that you a teacher so we reccommend you set up a teacher
            profile.
          </DialogDescription>
        </DialogHeader>
        <ul className="list-decimal ml-5 flex flex-col gap-1">
          {teacherProfileReasons.map((reasons, index) => (
            <li key={index}>{reasons}</li>
          ))}
        </ul>
        <DialogFooter className="flex w-full items-end justify-end gap-2 flex-row">
          <DialogClose>
            <Button variant={"ghost"}>Not Now</Button>
          </DialogClose>
          <Button>
            <Link to={"/"}>{"Let's do it"}</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="w-full">
      {teacher_onboarding}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl text-green-500">{content.fourthView}</h1>
        <p>{content.fourthDesc}</p>
      </div>
      <div className="mt-3 w-full gap-2 gap-y-4 grid grid-cols-2">
        {data?.data?.map((subject, i) => (
          <Button
            onClick={() => selection(subject?.body)}
            size={"lg"}
            className={`w-full ${
              formData?.favourites?.includes(subject?.body) &&
              "bg-green-700 text-white"
            }`}
            key={i}
          >
            {subject.body}
          </Button>
        ))}
      </div>
      <div className="mt-3">
        <OnboardingNav
          func={submit_form}
          tooltip="Finish"
          havePrev
          prevNav="ThirdView"
        />
      </div>
    </div>
  );
};

export default FourthView;
