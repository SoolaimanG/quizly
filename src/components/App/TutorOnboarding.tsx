import { FC, useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../AlertModal";
import { useZStore } from "../../provider";
import { Button } from "../Button";
import { useQuery } from "@tanstack/react-query";
import { ITeacher, uploaderProps } from "../../Types/components.types";
import { editTutorProfile, getTutorDetails } from "../../Functions/APIqueries";
import EmptyState from "./EmptyState";
import PageLoader from "../Loaders/PageLoader";
import { EditTutor } from "./EditTutor";
import { toast } from "../use-toaster";
import { edit_profile, errorMessageForToast } from "../../Functions";
import { AxiosError } from "axios";
import { useWindowSize } from "@uidotdev/usehooks";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../Drawer";

export const TutorOnboarding: FC<{}> = () => {
  const { width } = useWindowSize();
  const { openTutorOnboardingModal, setTutorOnboardingModal, user } =
    useZStore();

  const [imageUploaderProps, setImageUploaderProps] = useState<uploaderProps>({
    files: [],
    previewUrl: [],
  });
  const [tutorData, setTutorData] = useState<
    Omit<ITeacher, "user" | "rating" | "student" | "quizzes">
  >({
    educational_level: "bachelor",
    specializations: [],
    address: "",
    phone_num: "",
    whatsapp_link: "",
  });

  const { data, isLoading, error } = useQuery<{ data: ITeacher }>({
    queryKey: ["tutor"],
    queryFn: getTutorDetails,
    enabled: user?.account_type === "T",
  });

  const saveChanges = async () => {
    try {
      const {
        educational_level,
        specializations,
        address,
        phone_num,
        whatsapp_link,
      } = tutorData;
      const data: Partial<ITeacher> = {
        educational_level,
        specializations,
        address,
        phone_num,
        whatsapp_link,
      };

      await Promise.all([
        edit_profile({ username: user?.username }, imageUploaderProps.files[0]),
        editTutorProfile(data),
      ]);
      toast({
        title: "Success",
        description: "Profile edited successfully, changes applied.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: errorMessageForToast(
          error as AxiosError<{ message: string }>
        ),
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!data?.data) {
      return;
    }

    user?.profile_image &&
      setImageUploaderProps({
        ...imageUploaderProps,
        previewUrl: [user.profile_image],
      });

    const {
      educational_level,
      specializations,
      address,
      phone_num,
      whatsapp_link,
    } = data.data;

    setTutorData({
      educational_level,
      specializations,
      address,
      phone_num,
      whatsapp_link,
    });
  }, [data]);

  const UI = {
    header: {
      title: "Continue Account Creation",
      description:
        "Highlight your qualifications, experience, and teaching style to showcase yourself to potential students.",
    },
    content: (
      <div>
        {isLoading ? (
          <PageLoader size={100} text="Getting Tutor Info" />
        ) : // @ts-ignore
        error ? (
          <EmptyState message="Tutor not found." state="search" />
        ) : (
          <div>
            <hr />
            <EditTutor
              imageUploaderProps={imageUploaderProps}
              setImageUploaderProps={setImageUploaderProps}
              className="mt-2"
              data={tutorData}
              setData={setTutorData}
            />
          </div>
        )}
      </div>
    ),
  };

  return Number(width) > 767 ? (
    <AlertDialog open onOpenChange={(e) => setTutorOnboardingModal(e)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-green-500">
            {UI.header.title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {UI.header.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {/* Content */}

        {UI.content}

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          {!isLoading &&
            //   @ts-ignore
            error?.response?.data?.data?.error !== "not-found" && (
              <Button onClick={saveChanges} asChild variant="base">
                <AlertDialogAction>Save Changes</AlertDialogAction>
              </Button>
            )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ) : (
    <Drawer
      open={openTutorOnboardingModal}
      onOpenChange={(e) => setTutorOnboardingModal(e)}
    >
      <DrawerContent className="p-2">
        <DrawerHeader>
          <DrawerTitle className="text-green-500">
            {UI.header.title}
          </DrawerTitle>
          <DrawerDescription>{UI.header.description}</DrawerDescription>
        </DrawerHeader>
        {UI.content}
        <DrawerFooter>
          <Button asChild variant="outline">
            <DrawerClose>Close</DrawerClose>
          </Button>
          {!isLoading &&
            //   @ts-ignore
            error?.response?.data?.data?.error !== "not-found" && (
              <Button onClick={saveChanges} asChild variant="base">
                <AlertDialogAction>Save Changes</AlertDialogAction>
              </Button>
            )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
