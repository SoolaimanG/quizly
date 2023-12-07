import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../DialogModal";
import { File, Upload } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Button } from "../Button";
import {
  imageProperties,
  image_uploader_props,
} from "../../Types/components.types";
import { Input } from "../Input";
import { useState } from "react";

const ImageUploader = ({
  button,
  images,
  url,
  setImages,
  setUrl,
}: image_uploader_props) => {
  const [states, setStates] = useState({
    loading: false,
    success: false,
    error: false,
  });

  //const upload_images = async () => {
  //
  //}

  return (
    <Dialog>
      <DialogTrigger>{button}</DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-center text-lg">
          Add image to your writeup
        </DialogTitle>
        <div className="w-full h-[10rem] group border-[2px] flex flex-col gap-1 items-center justify-center border-dashed border-gray-400 hover:border-green-500 delay-75 cursor-pointer hover:bg-green-100 rounded-md">
          <span className=" relative">
            <File size={40} />
            <span className=" absolute group-hover:bg-green-500 group-hover:text-white delay-75 bottom-0 right-0 p-1 rounded-full bg-black text-white">
              <Upload size={10} />
            </span>
          </span>
          <DialogDescription className="flex items-center gap-1">
            Drag and drop file here or{" "}
            <Button className="p-0" variant={"link"}>
              Choose file
            </Button>
          </DialogDescription>
        </div>
        <p className="text-center">Or</p>
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Use URL instead..."
        />
        <div className="flex items-center justify-between">
          <DialogDescription>
            Supported format: <span>{imageProperties.supportedFiles}</span>
          </DialogDescription>
          <DialogDescription>
            Maximum Size: <span>{imageProperties.maxFileSize}</span>
          </DialogDescription>
        </div>
        <DialogFooter className="flex gap-2">
          <DialogClose className="border rounded-md border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
            Cancel
          </DialogClose>
          <Button
            className="bg-green-200 w-full flex gap-1 text-green-500 hover:bg-green-600 hover:text-white"
            //size={"lg"}
            onClick={() => {}}
          >
            {states.loading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Add Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploader;
