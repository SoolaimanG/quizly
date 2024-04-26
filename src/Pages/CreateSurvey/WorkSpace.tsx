import queryString from "query-string";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NameSurvey } from "./NameSurvey";
import { Navbar } from "./Navbar";
import { useSurveyWorkSpace, useZStore } from "../../provider";
import { NavLinks } from "./NavLinks";
import { Button } from "../../components/Button";
import { ManageAccount } from "../../components/App/ManageAccount";
import {
  AlertCircleIcon,
  ChevronLeft,
  EyeIcon,
  MenuIcon,
  PlusIcon,
  SettingsIcon,
  Trash2Icon,
} from "lucide-react";
import Hint from "../../components/Hint";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/Popover";
import { AddContents, DeleteBlock, OpenAddBlocksModal } from "./AddContents";
import { MySpace } from "./MySpace";
import { WorkSpaceSettings } from "./WorkSpaceSettings";
import { ContentTools } from "./ContentTools";
import { useQuery } from "@tanstack/react-query";
import PageLoader from "../../components/Loaders/PageLoader";
import Error from "../Comps/Error";
import { errorMessageForToast } from "../../Functions";
import { AxiosError } from "axios";
import { SurveyWorkSpace } from "../../Functions/surveyApis";
import { useEffect } from "react";
import {
  ICustomLogicConditions,
  ISurvey,
  ISurveyBlocks,
  ISurveyDesign,
  ISurveySettings,
} from "../../Types/survey.types";
import { useText } from "../../Hooks/text";
import { useDocumentTitle } from "@uidotdev/usehooks";
import { app_config } from "../../Types/components.types";
import { AutoSaveUI } from "../../components/App/AutoSaveUI";
import useKeyboardShortcut from "use-keyboard-shortcut";
import { Drawer, DrawerContent } from "../../components/Drawer";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "../../components/Card";
import { Alert, AlertDescription, AlertTitle } from "../../components/Alert";
import { Block } from "./Block";
import { BlockNotFound } from "./BlockNotFound";
import { IntegrateApps } from "../IntegratedApps";
import { PublishBtn } from "../../components/App/PublishBtn";
import { SurveyNotFound } from "./SurveyNotFound";
import { SurveyPublishSuccess } from "./SurveyPublishSuccess";
import { ShareSurvey } from "./ShareSurvey";

const WorkSpace = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { truncateWord } = useText();
  const { user } = useZStore();
  const {
    survey: s,
    setSurvey,
    setSurveyBlocks,
    auto_save_ui_props,
    openBlockDialog,
    setAutoSaveUiProps,
    setOpenBlockDialog,
    setSurveyDesign,
    setSurveySettings,
    survey_blocks,
    addAllLogics,
  } = useSurveyWorkSpace();

  // This is to open the block with shortcut.
  useKeyboardShortcut(["Control", "/"], () =>
    setOpenBlockDialog(!openBlockDialog)
  );

  const survey = new SurveyWorkSpace(s?.id ?? "");
  const qs = queryString.parse(location.search, { parseBooleans: true }) as {
    id: string;
    block: string;
    connect?: boolean;
    opend: boolean;
  };

  const { setOpenSettings, openSettings } = useZStore();

  const smallDeviceTools = [
    {
      id: 1,
      display_text: "Back",
      onClick: () => navigate(app_config.survey_workspace + `?id=${qs.id}`),
      icon: <ChevronLeft size={17} />,
      variant: "ghost",
    },
    {
      id: 1,
      display_text: "Set Rules",
      onClick: () => setOpenSettings(true),
      icon: <SettingsIcon size={17} />,
      variant: "base",
    },
  ];

  const { isLoading, data, error, refetch } = useQuery<{
    data: {
      survey_details: ISurvey;
      blocks: ISurveyBlocks[];
      design: ISurveyDesign;
      setting: ISurveySettings;
      logics: ICustomLogicConditions[];
    };
  }>({
    queryKey: ["survey", qs.id],
    queryFn: () => survey.get_survey_details(qs?.id, user?.id || ""),
    enabled: Boolean(user?.id),
  });

  useDocumentTitle("Workspace" + " | " + data?.data.survey_details.name);

  const errorMessage = errorMessageForToast(
    error as AxiosError<{ message: string }>
  );

  useEffect(() => {
    if (!data) return;
    const {
      data: { survey_details, blocks, design, setting, logics },
    } = data;
    setSurvey(survey_details);
    setSurveyBlocks(blocks);
    setSurveyDesign(design);
    setSurveySettings(setting);
    addAllLogics(logics);
  }, [data]);

  // This will handle the removal of the toast
  useEffect(() => {
    if (!auto_save_ui_props.is_visible) return;

    const timer = setTimeout(() => {
      setAutoSaveUiProps({
        ...auto_save_ui_props,
        is_visible: false,
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, [auto_save_ui_props.is_visible]);

  const handleCloseDialog = () => {
    navigate(`?id=${qs.id}&opend=false`);
  };

  const handleCloseNotification = () => {
    setAutoSaveUiProps({
      is_visible: false,
      message: "",
      status: "failed",
    });
  };

  if (isLoading)
    return (
      <PageLoader size={80} text="Please wait ...." className="h-screen" />
    );

  if (
    errorMessage.toLowerCase() ===
    "No surveys matches the given query.".toLowerCase()
  )
    return <SurveyNotFound />;

  if (error)
    return (
      <Error
        retry_function={refetch}
        className="h-screen"
        errorMessage={errorMessage}
      />
    );

  return (
    <div className="bg-gray-50 dark:bg-slate-900 pt-10 overflow-hidden h-screen w-screen relative">
      {/* ------------MODALS----------- */}
      <SurveyPublishSuccess />
      <IntegrateApps />
      <ShareSurvey />

      {/* This will be use to open settings on mobile devices */}
      <Drawer open={openSettings} onOpenChange={setOpenSettings}>
        <DrawerContent className="w-full h-[30rem]">
          <WorkSpaceSettings width="100%" />
        </DrawerContent>
      </Drawer>

      {/* This is a notifier for any changes in the survey */}
      <AutoSaveUI
        cancelRequest={handleCloseNotification}
        className="absolute md:bottom-4 hidden md:flex w-full  items-center justify-center"
      />
      <AutoSaveUI
        cancelRequest={handleCloseNotification}
        className="absolute top-4 flex md:hidden w-full  items-center justify-center"
      />
      <Navbar
        title={truncateWord(s?.name, 10) ?? ""}
        className="border-b-[1.3px] border-solid dark:border-slate-700 border-gray-200"
        middleContent={<NavLinks className="hidden md:flex" />}
        lastContent={
          <div className="flex items-center gap-2">
            <div className="md:hidden block">
              <Popover>
                <PopoverTrigger>
                  <Button variant="secondary" size="icon">
                    <MenuIcon size={17} />
                  </Button>
                  <PopoverContent>
                    <NavLinks
                      className="flex-col items-start justify-start"
                      itemClassName="hover:dark:bg-slate-700 hover:bg-gray-300 transition-all ease-linear w-full p-1 rounded-md"
                    />
                    <Button
                      onClick={() => setOpenSettings(true)}
                      variant="ghost"
                      className="mt-2 text-muted-foreground hover:dark:bg-slate-700 hover:bg-gray-300 font-normal h-fit text-lg flex items-start justify-start transition-all ease-linear w-full p-1 rounded-md"
                    >
                      Settings
                    </Button>
                  </PopoverContent>
                </PopoverTrigger>
              </Popover>
            </div>
            <PublishBtn extraChildren={<></>} note="" publishComplete>
              <Hint
                element={<Button variant="base">Publish</Button>}
                content="Make live"
              />
            </PublishBtn>
            <Hint
              element={
                <Button asChild variant="secondary" size="icon">
                  <Link to={app_config.preview_survey + s?.id}>
                    <EyeIcon size={17} />
                  </Link>
                </Button>
              }
              content="Preview your progress"
            />
            <ManageAccount />
          </div>
        }
      />
      <div className="absolute">
        <NameSurvey
          open={qs.opend}
          setOpen={handleCloseDialog}
          children={<></>}
        />
      </div>
      {/* This are component on desktop devices */}
      <div className="w-full h-full flex pt-8 md:pt-0">
        <AddContents className="pt-[2.7rem] overflow-y-auto hidden md:block" />
        <MySpace className="md:block hidden p-3" />
        <WorkSpaceSettings className="h-full pt-[2.7rem] hidden md:block" />

        {/* Mobile Add Content */}
        <div className="w-full flex h-full pb-20 md:hidden overflow-auto flex-col gap-3 p-2">
          {!!survey_blocks?.length ? (
            !qs.block ? (
              survey_blocks?.map((block) => {
                const sub_block = {
                  Choices: block.choices,
                  Date: block.date,
                  DropDown: block.dropdown,
                  Email: block.email,
                  EndScreen: block.end_screen,
                  LongText: block.long_text,
                  Number: block.number,
                  PhoneNumber: block.phone_number,
                  PictureChoice: block.picture_choice,
                  QuestionGroup: "",
                  Rating: block.ratings,
                  RedirectToURL: block.redirect_with_url,
                  ShortText: block.short_text,
                  Time: "",
                  Website: block.website,
                  WelcomeScreen: block.welcome_screen,
                  YesNo: block.yes_no,
                }[block.block_type] as { id: number | string };
                return (
                  <Card key={block.id} className=" px-0">
                    <CardContent className="p-3 flex h-fit gap-2">
                      <ContentTools
                        className="size-10 p-2 flex items-center justify-center"
                        toolType={block.block_type}
                        hideName
                      />
                      <div className="flex flex-col gap-2">
                        <CardTitle>{block.block_type}</CardTitle>
                        <CardDescription>
                          {block.block_type === "WelcomeScreen"
                            ? block.welcome_screen.message
                            : block.block_type === "EndScreen"
                            ? block.end_screen.message
                            : block.question}
                        </CardDescription>
                        <Alert variant="destructive">
                          <AlertCircleIcon />
                          <AlertTitle>Warning</AlertTitle>
                          <AlertDescription>
                            Heads up! This experience is optimized for desktop.
                            You might encounter limitations on mobile.
                          </AlertDescription>
                        </Alert>
                        <div className="flex items-center gap-3">
                          <Button
                            className="w-full"
                            size="sm"
                            variant="base"
                            asChild
                          >
                            <Link
                              to={
                                app_config.survey_workspace +
                                `?block=${block.id}&id=${qs.id}`
                              }
                            >
                              View Block
                            </Link>
                          </Button>
                          <DeleteBlock
                            shouldNavigate={false}
                            id={sub_block.id as string}
                            blockType={block.block_type}
                          >
                            <Hint
                              element={
                                <Button size="sm" variant="destructive">
                                  <Trash2Icon size={17} />
                                </Button>
                              }
                              content="Delete"
                            />
                          </DeleteBlock>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="w-full h-full flex flex-col gap-4">
                {/* Tools available here */}
                <div className="flex items-center gap-3">
                  {smallDeviceTools.map((smt) => (
                    <Button
                      className="flex items-center gap-2"
                      size="sm"
                      onClick={smt.onClick}
                      key={smt.id}
                      variant={smt.variant as "base"}
                    >
                      {smt.icon}
                      {smt.display_text}
                    </Button>
                  ))}
                </div>
                <Block mode="DEVELOPMENT" />
              </div>
            )
          ) : (
            <BlockNotFound
              title="Currently, there are no blocks available."
              message="To personalize your workspace and unlock all available features, we recommend adding blocks and switching to the desktop experience."
              className="h-full w-full flex justify-center flex-col"
            />
          )}
        </div>
      </div>

      {/* Plus sign to show when on mobile + */}
      <OpenAddBlocksModal className="md:hidden block absolute bottom-2 right-2">
        <Hint
          element={
            <Button size="icon" variant="base">
              <PlusIcon />
            </Button>
          }
          content="Tab to add blocks"
        />
      </OpenAddBlocksModal>
    </div>
  );
};

export default WorkSpace;
