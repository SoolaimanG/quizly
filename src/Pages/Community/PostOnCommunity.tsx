import { FC, useEffect, useState, useTransition } from "react";
import { Button } from "../../components/Button";
import { Textarea } from "../../components/TextArea";
import ImageUploader from "../../components/App/ImageUploader";
import { Loader2, PlusIcon, UploadCloud, XCircle } from "lucide-react";
import { combo_box_type, uploaderProps } from "../../Types/components.types";
import { Combobox } from "../../components/ComboBox";
import { Switch } from "../../components/Switch";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CommunityApiCalls, getRelatedQuiz } from "../../Functions/APIqueries";
import { useDebounce } from "@uidotdev/usehooks";
import { useAuthentication, useMethods } from "../../Hooks";
import { useCommunityStore, useZStore } from "../../provider";
import { toast } from "../../components/use-toaster";
import { errorMessageForToast } from "../../Functions";
import { AxiosError } from "axios";
import { ImageCarosel } from "../../components/App/ImageCarosel";
import { cn } from "../../lib/utils";
import { Description } from "../../components/App/Description";

export const PostOnCommunity: FC<{
  id: string;
  images?: string[];
  quiz_id?: string;
  caption?: string;
  editable?: boolean;
}> = ({
  id: community_id,
  images = [],
  caption: propCaption = "",
  editable = true,
  quiz_id: propQuiz_id = "",
}) => {
  // ----------->States<------------
  const [imageData, setImageData] = useState<uploaderProps>({
    files: [],
    previewUrl: images ?? [],
  });
  const [enableComboBox, setEnableComboBox] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [quiz_id, setQuiz] = useState("");
  const [boxData, setBoxData] = useState<combo_box_type[]>([]);
  const [caption, setCaption] = useState(propCaption);

  // ------------>Hooks<--------------
  const query = useQueryClient();
  const { isAuthenticated } = useAuthentication();
  const { login_required } = useMethods();
  const { user } = useZStore();
  const { editCommunityData, setEditCommunity } = useCommunityStore();
  const debounceKeyword = useDebounce(keyword, 800);
  const [isPending, startTransition] = useTransition();
  const { isLoading, data } = useQuery<{
    data: {
      quiz__id: string;
      quiz__title: string;
      id: string;
      title: string;
    }[];
  }>({
    queryKey: ["related_quizzes", debounceKeyword],
    queryFn: () => getRelatedQuiz(keyword),
    enabled: !enableComboBox && isAuthenticated,
  });
  useEffect(() => {
    // If there is a quiz associate with this post from the props
    if (propQuiz_id) {
      setEnableComboBox(!true);
      // Find the quiz related to the ID passed!
      const quiz = data?.data.find((q) =>
        user?.account_type === "T"
          ? q.id === propQuiz_id
          : q.quiz__id === propQuiz_id
      );
      const quizName =
        user?.account_type === "T" ? quiz?.title : quiz?.quiz__title;
      quizName && setQuiz(quizName);
    }

    if (!data?.data) return;

    const transformed_data: combo_box_type[] = data.data.map((d) => ({
      value: user?.account_type !== "T" ? d.quiz__title : d.title,
      label: user?.account_type !== "T" ? d.quiz__title : d.title,
    }));
    setBoxData(transformed_data);
  }, [data, propQuiz_id]);

  // This for when the component is in edit more
  useEffect(() => {
    if (!editable) return;

    const quiz = data?.data.find((q) => {
      return user?.account_type === "T"
        ? q?.title?.toLowerCase() === quiz_id.toLowerCase()
        : q?.quiz__title?.toLowerCase() === quiz_id.toLowerCase();
    });
    const quizID = user?.account_type === "T" ? quiz?.id : quiz?.quiz__id;

    // check if the image still exist in the previewurl []
    imageData.previewUrl?.find((url) => url);

    setEditCommunity({
      ...editCommunityData,
      quiz_id: quizID ?? "",
      caption,
      files: imageData.files,
      previewUrl: imageData.previewUrl,
    });
  }, [editable, quiz_id, imageData, caption]);

  const community = new CommunityApiCalls(community_id);

  const clearInput = () => {
    setImageData({
      files: [],
      previewUrl: [],
    });
    setCaption("");
    setKeyword("");
    setQuiz("");
  };

  // to remove image from the list
  const removeImage = (index: number) => {
    setImageData({
      ...imageData,
      files: imageData.files?.filter((_, position) => position !== index),
      previewUrl: imageData.previewUrl?.filter(
        (_, position) => position !== index
      ),
    });

    if (!editable) return;
    const img_to_be_removed = imageData?.previewUrl?.[index] ?? "";
    const removeImages = [
      ...new Set([img_to_be_removed, ...editCommunityData.remove_images]),
    ];

    if (!img_to_be_removed.startsWith("http://127.0.0.1:8000/")) return;

    // @ts-ignore
    setEditCommunity({
      ...editCommunityData,
      remove_image_len: removeImages.length,
      remove_images: removeImages,
    });
  };

  const handlePost = async () => {
    if (!caption)
      return toast({
        title: "Missing Parameter",
        description: "Write about something and try again",
        variant: "destructive",
      });

    const check = login_required();
    if (!check) return;

    // Get the ID of the quiz selected
    const id = data?.data.find(
      user?.account_type === "S"
        ? (d) => d.quiz__title.toLowerCase() === quiz_id.toLowerCase()
        : (d) => d.title.toLowerCase() === quiz_id.toLowerCase()
    );

    try {
      await community.addAPost({
        images: imageData.files,
        caption,
        quiz_id: user?.account_type === "S" ? id?.quiz__id : id?.id,
      });
      clearInput();
      query.invalidateQueries({
        queryKey: ["community_details", community_id],
        exact: true,
      });
      toast({
        title: "Post Added",
        description: "Your post has been sent successfully",
      });
      // If post is successfull show success modal
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

  const imageUploaderButton = (
    <div className="w-full border border-dashed transition-all ease-linear hover:border-green-500 flex flex-col gap-1 items-center justify-center rounded-md h-[5.5rem]">
      <UploadCloud />
      <Description className="text-lg" text="Click to add images" />
    </div>
  );

  return (
    <div className="w-full flex pb-12 flex-col gap-4">
      {/* This is the header */}
      {!editable && (
        <header className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-green-400"> Add a new post</h1>
            <Description text="Please fill in the details of your post" />
          </div>
          <Button
            onClick={() =>
              startTransition(() => {
                handlePost();
              })
            }
            className="flex items-center gap-1"
            variant="base"
          >
            {isPending ? <Loader2 className=" animate-spin" /> : <PlusIcon />}{" "}
            Post
          </Button>
        </header>
      )}
      {/* Body */}

      <section className="w-full flex flex-col gap-3">
        {!!imageData.previewUrl?.length && (
          <ImageCarosel
            swiperClassName={editable ? "md:w-full w-[93%]" : "w-full"}
            onElementClick={removeImage}
            element={
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 right-1 w-7 h-7 rounded-full"
              >
                <XCircle className="text-red-500" />
              </Button>
            }
            slidePerView={imageData.previewUrl.length > 1 ? 2 : 1}
            imageClassName="w-full h-[14rem]"
            className={cn("w-[200px] relative", editable && "w-full")}
            images={imageData.previewUrl}
          />
        )}

        <ImageUploader
          data={imageData}
          filesToAccept={[".jpeg", ".png", ".avif", ".jpg"]}
          setData={setImageData}
          button={imageUploaderButton}
        />

        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={10}
          placeholder="What's on your mind?"
          className="w-full resize-none"
        />
        <div className="flex flex-col gap-1">
          <h1>Include A Quiz</h1>
          <div className="w-full flex items-center gap-2">
            <Combobox
              search={keyword}
              setSearch={setKeyword}
              disabled={enableComboBox}
              className="w-full"
              popoverClassName="md:w-[400px] w-[250px]"
              data={boxData}
              value={quiz_id}
              setValue={setQuiz}
              title="Select quiz"
              isLoading={isLoading}
            />
            <Switch
              checked={!enableComboBox}
              onCheckedChange={() => setEnableComboBox((prev) => !prev)}
            />
          </div>
        </div>
      </section>
    </div>
  );
};
