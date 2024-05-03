import { FC, useEffect, useState } from "react";
import { Button } from "../../components/Button";
import { content } from "../Onboarding";
import { toast } from "../../components/use-toaster";
import {
  IStudent,
  ITeacher,
  app_config,
  subjects,
} from "../../Types/components.types";
import { useZStore } from "../../provider";
import { useQuery } from "@tanstack/react-query";
import PageLoader from "../../components/Loaders/PageLoader";
import { useAuthentication } from "../../Hooks";
import { SelectCategory } from "../../components/App/SelectCategory";
import {
  getStudentDetails,
  getTutorDetails,
  setUserSubjectPrefrence,
} from "../../Functions/APIqueries";
import { useNavigate } from "react-router-dom";
import { Description } from "../../components/App/Description";

export const SelectCategoryComp: FC<{}> = () => {
  const { setTutorOnboardingModal, user } = useZStore();
  const { isAuthenticated } = useAuthentication();
  const navigate = useNavigate();

  const tutorDetails = useQuery<{ data: ITeacher; message: string }>({
    queryKey: ["tutor"],
    queryFn: getTutorDetails,
    enabled: isAuthenticated && Boolean(user) && user?.account_type === "T",
  });

  const studentDetails = useQuery<{ data: IStudent }>({
    queryKey: ["student"],
    queryFn: getStudentDetails,
    enabled: isAuthenticated && Boolean(user) && user?.account_type === "S",
  });

  const [favourites, setFavorites] = useState<subjects[]>([]);

  useEffect(() => {
    if (!tutorDetails.data && !studentDetails.data) {
      return;
    }

    const { data: a } = tutorDetails;
    const { data: b } = studentDetails;

    const specializations = a?.data.specializations.map(
      (specialization) => specialization.body
    );
    const favourites = b?.data.favourites.map((favourite) => favourite.body);

    setFavorites(favourites || specializations || []);

    return () => setFavorites([]);
  }, [tutorDetails.data, studentDetails.data]);

  if (tutorDetails.isLoading || studentDetails.isLoading)
    return <PageLoader text="Loading Categories" size={80} />;

  const completeSignUp = async () => {
    try {
      await setUserSubjectPrefrence(favourites);
      const tutorAccountInComplete =
        user?.account_type === "T" &&
        !tutorDetails.data?.data?.address &&
        !tutorDetails.data?.data?.educational_level &&
        !tutorDetails.data?.data?.phone_num &&
        !tutorDetails.data?.data?.whatsapp_link;
      user?.account_type === "T" && tutorAccountInComplete
        ? setTutorOnboardingModal(true)
        : navigate(app_config.explore_page);
      toast({
        title: "Success",
        description: "Your subject prefrences has been changed.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex flex-col">
        <h1 className="text-xl text-green-500">{content.fourthView}</h1>
        <Description text={content.fourthDesc} />
      </div>
      <SelectCategory
        className="mt-3"
        categories={favourites}
        setCategories={setFavorites}
      />
      <Button
        onClick={completeSignUp}
        variant="base"
        className="w-full h-[3rem] mt-3"
      >
        Complete
      </Button>
    </div>
  );
};
