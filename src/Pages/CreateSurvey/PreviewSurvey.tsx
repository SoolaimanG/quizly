import { FC, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SurveyNotFound } from "./SurveyNotFound";
import { useMutation, useQuery } from "@tanstack/react-query";
import { SurveyWorkSpace } from "../../Functions/surveyApis";
import {
  BlockToolProps,
  ICustomLogicConditions,
  ISurvey,
  ISurveyBlocks,
  ISurveyDesign,
  ISurveySettings,
} from "../../Types/survey.types";
import PageLoader from "../../components/Loaders/PageLoader";
import Error from "../Comps/Error";
import {
  createSurveyUserId,
  errorMessageForToast,
  surveyResponseTypes,
} from "../../Functions";
import { AxiosError } from "axios";
import { Navbar } from "./Navbar";
import { useDocumentTitle, useLocalStorage } from "@uidotdev/usehooks";
import Logo from "../../components/Logo";
import { DarkMode } from "../../components/Darkmode";
import { motion, AnimatePresence } from "framer-motion";
import {
  useSurveyNavigation,
  useSurveyWorkSpace,
  useZStore,
} from "../../provider";
import { SurveyNavigation } from "./SurveyNavigation";
import {
  ChoicesBlockStyle,
  DateBlockStyle,
  DropdownBlockStyle,
  EmailBlockStyle,
  EndScreenBlockStyle,
  LongTextBlockStlye,
  NumberBlockStlye,
  PhoneNumberBlockStyle,
  PictureBlockStlye,
  QuestionGroupBlockStyle,
  RatingsBlockStyle,
  RedirectURLBlockStyle,
  ShortTextBlockStlye,
  TimeBlockStyle,
  WebsiteBlockStyle,
  WelcomeScreenBlockStyle,
  YesNoBlockStyle,
  mode,
} from "./AllSurveyBlocks";
import { useGetCurrentBlock } from "../../Hooks/useSurvey";
import { BlockNotFound } from "./BlockNotFound";
import { Card, CardContent } from "../../components/Card";
import { allStyles, backgroundPatterns } from "../../constant";
import { cn } from "../../lib/utils";
import { Badge } from "../../components/Badge";
import { Button } from "../../components/Button";
import { LogOutIcon, Moon, Sun } from "lucide-react";
import { app_config, localStorageKeys } from "../../Types/components.types";
import Hint from "../../components/Hint";
import { Progress } from "../../components/Progress";
import Cookies from "js-cookie";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/DialogModal";
import { toast } from "../../components/use-toaster";

export const PreviewSurvey: FC<{ mode: mode }> = ({ mode }) => {
  const { id } = useParams() as { id: string };
  const b = useGetCurrentBlock();
  const action = new SurveyWorkSpace(id);
  const [responses] = useLocalStorage<surveyResponseTypes[]>(
    localStorageKeys.surveyResponses,
    []
  );
  const userID = Cookies.get("surveyUserId") || "";

  const [isLastBlock, setIsLastBlock] = useState(false);
  const { action: actionType } = useSurveyNavigation();
  const { is_darkmode } = useZStore();
  const {
    setSurveyBlocks,
    setSurveyDesign,
    setSurveySettings,
    setSurvey,
    surveyDesign,
    surveySettings,
    addAllLogics,
  } = useSurveyWorkSpace();
  const [openModal, setOpenModal] = useState(false);
  const { isLoading, data, error, refetch } = useQuery<{
    data: {
      survey_details: ISurvey;
      blocks: ISurveyBlocks[];
      design: ISurveyDesign;
      setting: ISurveySettings;
      logics: ICustomLogicConditions[];
    };
  }>({
    queryKey: ["survey", id],
    queryFn: () => action.get_survey_details(id, createSurveyUserId()),
  });

  const { isPending, isSuccess, mutate } = useMutation({
    mutationKey: [data?.data.survey_details.id],
    mutationFn: () => action.submitSurvey(responses, userID),
    onSuccess: () => {
      setOpenModal(true);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: errorMessageForToast(
          error as AxiosError<{ message: string }>
        ),
        variant: "destructive",
      });
    },
  });

  const backgroundImage = backgroundPatterns.find(
    (bp) => bp.id === surveyDesign?.background_pattern
  );

  const backgroundStyles: React.CSSProperties = {
    backgroundImage: `url(${
      backgroundImage?.id === "Non" ? "" : backgroundImage?.image
    })`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  // Changing the App Title
  useDocumentTitle(
    `${data?.data.survey_details.name} ${mode === "PREVIEW" ? "| Preview" : ""}`
  );

  // console.log({ data });

  useEffect(() => {
    if (!data) {
      return;
    }

    setSurveyBlocks(data.data.blocks);
    setSurveyDesign(data.data.design);
    setSurveySettings(data.data.setting);
    setSurvey(data.data.survey_details);
    addAllLogics(data.data.logics);
  }, [data]);

  const view: Record<BlockToolProps, any> = {
    WelcomeScreen: WelcomeScreenBlockStyle,
    ShortText: ShortTextBlockStlye,
    LongText: LongTextBlockStlye,
    EndScreen: EndScreenBlockStyle,
    Website: WebsiteBlockStyle,
    QuestionGroup: QuestionGroupBlockStyle,
    Number: NumberBlockStlye,
    YesNo: YesNoBlockStyle,
    PhoneNumber: PhoneNumberBlockStyle,
    Choices: ChoicesBlockStyle,
    Email: EmailBlockStyle,
    DropDown: DropdownBlockStyle,
    PictureChoice: PictureBlockStlye,
    Rating: RatingsBlockStyle,
    RedirectToURL: RedirectURLBlockStyle,
    Time: TimeBlockStyle,
    Date: DateBlockStyle,
  };

  const navBarClassName = "backdrop-blur-md w-full border border-b-[1.3px]";

  const View = view[b?.block_type as BlockToolProps] ?? WelcomeScreenBlockStyle;

  if (
    id.length < 10 ||
    error?.message.toLowerCase().split(",").includes("Not Found")
  )
    return <SurveyNotFound />;

  if (!b && mode === "PREVIEW")
    return (
      <div>
        <Navbar
          className={navBarClassName}
          firstContent={<Logo color show_word size="sm" className="w-fit" />}
          middleContent={
            <Badge variant="destructive" className="rounded-sm">
              {"Block Not Found".toUpperCase()}
            </Badge>
          }
          lastContent={
            <div className="flex items-center gap-1">
              <DarkMode>
                <Hint
                  element={
                    <Button
                      variant="ghost"
                      size="icon"
                      className=" rounded-full"
                    >
                      {is_darkmode ? <Sun /> : <Moon />}
                    </Button>
                  }
                  content={is_darkmode ? "Light Mode" : "Dark Mode"}
                />
              </DarkMode>

              <Hint
                element={
                  <Button asChild variant="destructive" size="icon">
                    <Link
                      to={
                        app_config.survey_workspace +
                        `?id=${data?.data?.survey_details?.id}`
                      }
                    >
                      <LogOutIcon size={20} />
                    </Link>
                  </Button>
                }
                content="Exit / Leave"
              />
            </div>
          }
        />
        <BlockNotFound className="h-screen px-3 flex justify-center flex-col" />
      </div>
    );

  if (isLoading)
    return (
      <PageLoader
        size={70}
        text="Getting questions please wait..."
        className="h-screen"
      />
    );

  if (error)
    return (
      <Error
        retry_function={refetch}
        className="h-screen"
        errorMessage={errorMessageForToast(
          error as AxiosError<{ message: string }>
        )}
      />
    );

  return (
    <div className="w-full h-screen relative">
      <Dialog open={openModal} onOpenChange={(e) => setOpenModal(e)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-green-500">Successful</DialogTitle>
            <DialogHeader>
              Thank you for your time and valuable feedback. Your responses have
              been recorded.
            </DialogHeader>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
            <Button asChild variant="base">
              <Link to={app_config.create_survey}>Create Survey</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Navbar
        className={navBarClassName}
        firstContent={<Logo color show_word size="sm" className="w-fit" />}
        middleContent={
          mode === "PREVIEW" ? (
            <Badge variant="warning" className="rounded-sm">
              {"Preview Mode".toUpperCase()}
            </Badge>
          ) : (
            <></>
          )
        }
        lastContent={
          <div className="flex items-center gap-1">
            <DarkMode>
              <Hint
                element={
                  <Button variant="ghost" size="icon" className=" rounded-full">
                    {is_darkmode ? <Sun /> : <Moon />}
                  </Button>
                }
                content={is_darkmode ? "Light Mode" : "Dark Mode"}
              />
            </DarkMode>
            {mode === "PREVIEW" && (
              <Hint
                element={
                  <Button asChild variant="destructive" size="icon">
                    <Link
                      to={
                        app_config.survey_workspace + `?id=${id}&block=${b?.id}`
                      }
                    >
                      <LogOutIcon size={20} />
                    </Link>
                  </Button>
                }
                content="Exit / Leave"
              />
            )}
          </div>
        }
      />
      {surveySettings?.show_progress_bar && (
        <Progress
          bgColor={
            allStyles.dark_background_color[surveyDesign?.button ?? "GREEN"]
          }
          className="mt-16 rounded-none h-1 fixed"
          max={data?.data.blocks.length}
          value={
            (data?.data.blocks.map((block) => block.id).indexOf(b?.id || "") ??
              0) + 1
          }
        />
      )}
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: actionType === "prev" ? -100 : 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: actionType === "next" ? -100 : 100 }}
          key={b?.id}
          className="md:max-w-3xl m-auto flex flex-col gap-1 pt-20 px-3 md:px-0"
        >
          <Card
            style={backgroundStyles}
            className={cn(
              "p-0 w-full h-full overflow-auto",
              allStyles.border_radius[surveyDesign?.border_radius ?? "MEDIUM"],
              allStyles.font_family[surveyDesign?.font_family ?? "SYSTEM"],
              allStyles.background_color[
                surveyDesign?.background_color ?? "WHITE"
              ]
            )}
          >
            <CardContent
              className={cn(
                "p-2 w-full flex items-center  h-[25rem] px-5 overflow-auto",
                allStyles.color[surveyDesign?.color ?? "GREEN"],
                allStyles.font_size[surveyDesign?.font_size ?? "MEDIUM"]
              )}
            >
              {/* <div className="w-full h-full flex gap-2"> */}
              <View mode={"PREVIEW"} />

              {/* </div> */}
            </CardContent>
          </Card>
          <div className="flex items-center gap-1 w-full">
            <SurveyNavigation className="" setIsLastBlock={setIsLastBlock} />
            {isLastBlock && (
              <Button
                onClick={() => mutate()}
                disabled={isPending || isSuccess}
                size="sm"
                className={cn(
                  "w-full rounded-sm",
                  allStyles.button[surveyDesign?.button ?? "GREEN"]
                )}
              >
                Submit
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default PreviewSurvey;
