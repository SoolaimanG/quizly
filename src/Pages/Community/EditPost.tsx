import { FC, useTransition } from "react";
import { PostOnCommunity } from "./PostOnCommunity";
import queryString from "query-string";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import { CommunityApiCalls } from "../../Functions/APIqueries";
import { useCommunityStore } from "../../provider";
import { toast } from "../../components/use-toaster";
import { errorMessageForToast } from "../../Functions";
import { AxiosError } from "axios";
import { EditIcon, Loader2 } from "lucide-react";
import { app_config } from "../../Types/components.types";
import { Description } from "../../components/App/Description";

export const EditPost: FC<{ id: string }> = ({ id }) => {
  const location = useLocation();
  const navigator = useNavigate();
  const { editCommunityData } = useCommunityStore();
  const [isPending, startTransition] = useTransition();

  const parser = queryString.parse(location.search) as {
    caption: string;
    images?: string[] | string;
    quiz_id: string;
    post_id: string;
  };

  const community = new CommunityApiCalls(id);

  const handleEdit = async () => {
    try {
      const {
        quiz_id,
        remove_images,
        remove_image_len,
        caption: newCaption,
        imagesProps: { files, previewUrl },
      } = editCommunityData;

      // Determine the images to update
      const moreImages =
        previewUrl?.length! > (parser?.images?.length || 0) ? files : [];
      //   console.log({ moreImages });
      const len =
        previewUrl?.filter((url, index) => url !== parser?.images?.[index])
          .length! || 0;

      const payload = {
        quiz_id: quiz_id || "",
        more_images: moreImages,
        post_id: parser.post_id,
        caption: newCaption,
        more_images_len: moreImages.length,
        remove_images,
        remove_image_len,
        images_to_update_len: {
          old_image:
            (Array.isArray(parser.images)
              ? parser.images
              : [parser.images as string]) || [],
          new_image: files,
          len, //Make sure that initial image has been change before updating
        },
      };

      await community.editPost(payload);
      toast({
        title: "Post Edited",
        description: "Your post has been edited and changes have been applied.",
      });
      navigator(app_config.community + id);
    } catch (error) {
      toast({
        title: "Error editing content",
        description: errorMessageForToast(
          error as AxiosError<{ message: string }>
        ),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="w-full flex items-center justify-between">
        <div>
          <h1 className="text-green-500">Edit Post</h1>
          <Description text="Change what you want to edit on your post." />
        </div>
        <Button
          onClick={() =>
            startTransition(() => {
              handleEdit();
            })
          }
          className="flex items-center gap-2"
          variant="base"
        >
          {!isPending ? <EditIcon size={15} /> : <Loader2 size={15} />}
          Edit
        </Button>
      </div>
      <PostOnCommunity
        images={
          Array.isArray(parser.images)
            ? parser.images
            : [parser.images as string]
        }
        quiz_id={parser.quiz_id}
        caption={parser.caption}
        editable
        id={id}
      />
    </div>
  );
};
