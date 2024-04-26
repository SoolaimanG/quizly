import React, { FC, SetStateAction, useEffect, useState } from "react";
import { Description } from "../../Pages/ExplorePage/QuickQuiz";
import { Button } from "../Button";
import { Label } from "../Label";
import { Input } from "../Input";
import { Combobox } from "../ComboBox";
import {
  ITeacher,
  combo_box_type,
  educationalLevel,
  uploaderProps,
} from "../../Types/components.types";
import { cn } from "../../lib/utils";
import ImageUploader from "./ImageUploader";
import { useZStore } from "../../provider";
import { Avatar, AvatarFallback, AvatarImage } from "../Avatar";
import { useText } from "../../Hooks/text";
//
export const EditTutor: FC<{
  className?: string;
  imageUploaderProps: uploaderProps;
  setImageUploaderProps: React.Dispatch<SetStateAction<uploaderProps>>;
  data: Omit<ITeacher, "user" | "rating" | "student" | "quizzes">;
  setData: React.Dispatch<
    SetStateAction<Omit<ITeacher, "user" | "rating" | "student" | "quizzes">>
  >;
}> = ({
  className,
  data,
  imageUploaderProps,
  setImageUploaderProps,
  setData,
}) => {
  const { user } = useZStore();
  const { getFirstLetterAndCapitalize } = useText();
  const __data: combo_box_type<educationalLevel>[] = [
    {
      value: "bachelor",
      label: "Bachelor's degree",
    },
    {
      value: "doctorate",
      label: "Decorate/PhD",
    },
    {
      value: "masters",
      label: "Master's Degree",
    },
  ];
  const [value, setValue] = useState("");
  const [search, setSearch] = useState("");

  const labelClassName = "flex flex-col gap-1 text-[13px]";

  useEffect(() => {
    if (!value) {
      return;
    }

    setData({ ...data, educational_level: value as educationalLevel });
  }, [value]);

  const handleRemoveProfileImage = () => {
    setImageUploaderProps({ ...imageUploaderProps, previewUrl: undefined });
  };

  const userContactInfo = {
    address: "123 Main Street",
    whatsapp: "https://wa.me/00000000000", // Placeholder WhatsApp link
    phoneNumber: "(555) 555-5555", // Placeholder phone number
  };

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <h1 className="text-green-500">Basic Information</h1>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Description text="Profile Photo" />
          <div className="flex items-center gap-2">
            <ImageUploader
              filesToAccept={[".png", ".jpg"]}
              data={imageUploaderProps}
              setData={setImageUploaderProps}
              button={
                <Button className="h-6 w-fit" variant="outline">
                  Change
                </Button>
              }
            />
            <Button
              onClick={handleRemoveProfileImage}
              className="h-6 w-fit"
              variant="outline"
            >
              Remove
            </Button>
          </div>
        </div>
        <Avatar className="w-[3.5rem] h-[3.5rem] cursor-pointer">
          <AvatarFallback>
            {getFirstLetterAndCapitalize(user?.username || "")}
          </AvatarFallback>
          <AvatarImage
            src={imageUploaderProps?.previewUrl?.[0]}
            loading="lazy"
          />
        </Avatar>
      </div>
      <div className="w-full grid md:grid-cols-2 gap-2 grid-cols-1">
        <Label className={labelClassName}>
          Address
          <Input
            placeholder={userContactInfo.address}
            name="address"
            value={data.address}
          />
        </Label>
        <Label className={labelClassName}>
          Phone Number
          <Input
            placeholder={userContactInfo.phoneNumber}
            name="phone_num"
            value={data.phone_num}
          />
        </Label>
        <Label className={labelClassName}>
          WhatsApp Link
          <Input
            placeholder={userContactInfo.whatsapp}
            name="phone_num"
            value={data.whatsapp_link}
          />
        </Label>
      </div>
      <Combobox
        className="mt-2"
        data={__data}
        value={value}
        setSearch={setSearch}
        search={search}
        setValue={setValue}
        popoverClassName="w-[20rem]"
        title="Education Level"
      />
    </div>
  );
};
