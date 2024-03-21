import queryString from "query-string";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NameSurvey } from "./NameSurvey";
import { Navbar } from "./Navbar";
import { useSurveyWorkSpace, useZStore } from "../../provider";
import { NavLinks } from "./NavLinks";
import { Button } from "../../components/Button";
import { ManageAccount } from "../../components/App/ManageAccount";
import { EyeIcon, MenuIcon, PlusIcon } from "lucide-react";
import Hint from "../../components/Hint";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/Popover";
import {
  AddContents,
  ChoicesGroup,
  ContactGroup,
  DateGroup,
  InputGroup,
  MediaGroup,
  OtherGroup,
  ScreenGroup,
} from "./AddContents";
import { MySpace } from "./MySpace";
import { WorkSpaceSettings } from "./WorkSpaceSettings";
import { Sheet, SheetContent, SheetTrigger } from "../../components/Sheet";
import { RecommendedContent } from "./RecommendedContent";
import { ContentTools } from "./ContentTools";
import { useQuery } from "@tanstack/react-query";
import PageLoader from "../../components/Loaders/PageLoader";
import Error from "../Comps/Error";
import { errorMessageForToast, toggle_modes } from "../../Functions";
import { AxiosError } from "axios";
import { SurveyWorkSpace } from "../../Functions/surveyApis";
import { useEffect } from "react";
import { ISurvey, ISurveyBlocks } from "../../Types/survey.types";
import { useText } from "../../Hooks/text";
import { useDocumentTitle, useLocalStorage } from "@uidotdev/usehooks";
import { SunIcon } from "lucide-react";
import { MoonIcon } from "lucide-react";
import { Description } from "../ExplorePage/QuickQuiz";
import { app_config } from "../../Types/components.types";
import { AutoSaveUI } from "../../components/App/AutoSaveUI";
import useKeyboardShortcut from "use-keyboard-shortcut";

const WorkSpace = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { truncateWord } = useText();
  const {
    survey: s,
    setSurvey,
    setSurveyBlocks,
    auto_save_ui_props,
    openBlockDialog,
    setAutoSaveUiProps,
    setOpenBlockDialog,
  } = useSurveyWorkSpace();

  // This is to open the block with shortcut.
  useKeyboardShortcut(["Control", "/"], () =>
    setOpenBlockDialog(!openBlockDialog)
  );

  const survey = new SurveyWorkSpace(s?.id ?? "");
  const qs = queryString.parse(location.search, { parseBooleans: true }) as {
    id: string;
    block: string;
    opend: boolean;
  };

  const { is_darkmode, setIsDarkMode } = useZStore();
  const [theme, saveTheme] = useLocalStorage<"dark" | "light" | null>(
    "theme",
    "dark"
  );

  const { isLoading, data, error, refetch } = useQuery<{
    data: { survey_details: ISurvey; blocks: ISurveyBlocks[] };
  }>({
    queryKey: ["survey", qs.id],
    queryFn: () => survey.get_survey_details(qs.id),
    enabled: Boolean(qs.id),
  });

  useDocumentTitle("Workspace" + " | " + data?.data.survey_details.name);

  const errorMessage = errorMessageForToast(
    error as AxiosError<{ message: string }>
  );

  useEffect(() => {
    if (!data) return;
    const {
      data: { survey_details, blocks },
    } = data;
    setSurvey(survey_details);
    setSurveyBlocks(blocks);
  }, [data]);

  // This will handle the removal of the toast
  useEffect(() => {
    if (!auto_save_ui_props.is_visible) return;

    const timer = setTimeout(() => {
      setAutoSaveUiProps({
        ...auto_save_ui_props,
        is_visible: false,
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [auto_save_ui_props.is_visible]);

  const handleCloseDialog = () => {
    navigate(`?id=${qs.id}&opend=false`);
  };

  if (isLoading)
    return (
      <PageLoader size={80} text="Please wait ...." className="h-screen" />
    );

  if (
    errorMessage.toLowerCase() ===
    "No surveys matches the given query.".toLowerCase()
  )
    return (
      <div>
        <Navbar
          title="404"
          middleContent={<></>}
          lastContent={
            <div className="flex items-center gap-2">
              <Button
                className="rounded-full"
                onClick={() =>
                  toggle_modes({ theme, saveTheme, setIsDarkMode })
                }
                size="icon"
                variant="secondary"
              >
                {is_darkmode ? <SunIcon size={18} /> : <MoonIcon size={18} />}
              </Button>
              <ManageAccount />
            </div>
          }
        />
        <div className="w-full h-screen flex flex-col gap-3 items-center justify-center">
          <h1 className="text-4xl text-center">
            404 - Looks like you are lost.
          </h1>
          <Description text="Maybe this page used to exist or you spelled something wrong." />
          <Description text="Chances are there you spelled something wrong, so you can double check the URL." />
          <Button asChild className="hover:bg-primary " variant="base">
            <Link to={app_config.create_survey + "?list=grid"}>Back Home</Link>
          </Button>
        </div>
      </div>
    );

  if (error)
    return (
      <Error
        retry_function={refetch}
        className="h-screen"
        errorMessage={errorMessage}
      />
    );

  return (
    <div className="bg-gray-50 dark:bg-slate-900 h-screen w-screen relative">
      <AutoSaveUI
        cancelRequest={() => {}}
        className="absolute bottom-4 w-full flex items-center justify-center"
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
                      itemClassName="hover:bg-slate-700 transition-all ease-linear w-full p-1 rounded-md"
                    />
                  </PopoverContent>
                </PopoverTrigger>
              </Popover>
            </div>
            <Hint
              element={<Button variant="base">Publish</Button>}
              content="Make live"
            />
            <Hint
              element={
                <Button variant="secondary" size="icon">
                  <EyeIcon size={17} />
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
      <div className="w-full flex pt-14 md:pt-0 h-full overflow-auto">
        <AddContents className="h-full pt-[4.5rem] hidden md:block" />
        <MySpace className="h-full md:block hidden pt-[4.5rem] p-3" />
        <WorkSpaceSettings className="h-full pt-[4.5rem] hidden md:block" />
        {/* Mobile Add Content */}
      </div>
      {/* Plus sign to show when on mobile + */}
      <Sheet>
        <SheetTrigger className="md:hidden block absolute bottom-2 right-2">
          <Button size="icon" variant="base">
            <PlusIcon />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[90%] h-full">
          <div className="h-full overflow-hidden">
            <RecommendedContent />
            <div className="w-full h-full pt-3 pb-[27rem] flex flex-col gap-4 overflow-auto">
              {/* Input Group */}
              <div className="flex flex-col gap-3">
                <h1 className="text-green-500">Input Tools</h1>
                {InputGroup.map((tool, index) => (
                  <ContentTools key={index} toolType={tool} />
                ))}
              </div>

              {/* Media Group */}
              <div className="flex flex-col gap-3">
                <h1 className="text-green-500">Media Tools</h1>
                {MediaGroup.map((tool, index) => (
                  <ContentTools key={index} toolType={tool} />
                ))}
              </div>

              {/* Choice Group */}
              <div className="flex flex-col gap-3">
                <h1 className="text-green-500">Choice Group</h1>
                {ChoicesGroup.map((tool, index) => (
                  <ContentTools key={index} toolType={tool} />
                ))}
              </div>

              {/* Date Group */}
              <div className="flex flex-col gap-3">
                <h1 className="text-green-500">Date Tools</h1>
                {DateGroup.map((tool, index) => (
                  <ContentTools key={index} toolType={tool} />
                ))}
              </div>

              {/* Screen Group */}
              <div className="flex flex-col gap-3">
                <h1 className="text-green-500">Screens</h1>
                {ScreenGroup.map((tool, index) => (
                  <ContentTools key={index} toolType={tool} />
                ))}
              </div>

              {/* Contact Group */}
              <div className="flex flex-col gap-3">
                <h1 className="text-green-500">Contact Tools</h1>
                {ContactGroup.map((tool, index) => (
                  <ContentTools key={index} toolType={tool} />
                ))}
              </div>

              {/* Other Group */}
              <div className="flex flex-col gap-3">
                <h1 className="text-green-500">Others</h1>
                {OtherGroup.map((tool, index) => (
                  <ContentTools key={index} toolType={tool} />
                ))}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default WorkSpace;
