//import React from 'react'

import { useEffect, useState } from "react";
import OnboardingNav from "../../components/App/OnboardingNav";
import { Button } from "../../components/Button";
import { content } from "../Onboarding";
import { toast } from "../../components/use-toaster";
import { ICategory, subjects } from "../../Types/components.types";
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
import PageLoader from "../../components/Loaders/PageLoader";
import { useAuthentication } from "../../Hooks";
import { SelectCategory } from "../../components/App/SelectCategory";

const teacherProfileReasons = [
  "It makes students reach out to you easily.",
  "Showcase your expertise and qualifications.",
  "Gain visibility within the educational community.",
  "Participate in educational initiatives and opportunities.",
  "Connect with other educators for collaboration.",
  "Offer your specialized knowledge to a broader audience.",
];

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
  const isAuthenticated = useAuthentication();

  const { isLoading, data } = useQuery<{ data: ICategory[]; message: string }>({
    queryKey: ["user_categories"],
    queryFn: () => user_categories(access_token as string),
    enabled: isAuthenticated,
  });

  const [favourites, setFavorites] = useState<subjects[]>([]);

  useEffect(() => {
    setFavorites(data?.data.flatMap((category) => category.body) || []);
  }, [data]);

  const { user } = useZStore();
  const [states, setState] = useState({
    start_teacher_onboarding: false,
  });

  if (isLoading) return <PageLoader text="Loading Categories" size={80} />;

  const submit_form = async () => {
    try {
      await edit_profile({ favourites });
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
      <SelectCategory categories={favourites} setCategories={setFavorites} />
      <div className="mt-3">
        <OnboardingNav
          func={submit_form}
          tooltip="Finish"
          havePrev
          prevNav="ThirdView"
        />
        S
      </div>
    </div>
  );
};

export default FourthView;
