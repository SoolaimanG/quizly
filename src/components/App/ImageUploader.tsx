import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "../DialogModal";
import { File, Upload, XCircle } from "lucide-react";
import { Button } from "../Button";
import { image_uploader_props } from "../../Types/components.types";
import { Input } from "../Input";
import { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import { toast } from "../use-toaster";
import { Img } from "react-image";
import { Skeleton } from "../Loaders/Skeleton";

const ImageUploader = ({
  button,
  maxSize = 2,
  filesToAccept,
  setData,
  multiples = 1,
  data,
}: image_uploader_props) => {
  const [urlImage, setUrlImage] = useState("");

  useEffect(() => {
    const fileReaders: FileReader[] = [];

    if (!data.files.length) return;

    // Clear the previewUrl before processing new files
    setData({ ...data, previewUrl: [] });

    data.files.map((file) => {
      const reader = new FileReader();
      fileReaders.push(reader);

      reader.onload = (e) => {
        if (!e.target) return;

        const { result } = e.target;

        const findURL = data?.previewUrl?.find((url) => url === result);

        if (!findURL) {
          setData((prevData) => ({
            ...prevData,
            previewUrl: [...data.previewUrl!, result as string],
          }));
        }
      };

      reader.onabort = () => {
        throw new Error("Something went wrong...");
      };

      reader.readAsDataURL(file);
    });

    //);

    return () => {
      fileReaders.forEach((file) => {
        if (file.readyState === 1) {
          file.abort();
        }
      });
    };
  }, [data.files]);

  const removeImage = (index: number) => {
    const currentFile = data.files[index];
    const currentImage = data.previewUrl![index];

    const removeFile = data.files.filter(
      (file) => file.name !== currentFile.name
    );
    const removeImage = data.previewUrl?.filter((url) => url !== currentImage);

    setData({ files: removeFile, previewUrl: removeImage });
  };

  const selectedFiles = (
    <div className="w-full flex flex-wrap gap-2">
      {data.previewUrl?.map((image, i) => (
        <div className="w-[3.5rem] h-[3.5rem] relative" key={i}>
          <button
            onClick={() => removeImage(i)}
            className="w-fit p-[2px] absolute top-0 right-0 -mt-2 -mr-2 bg-red-400 hover:bg-red-500 text-white rounded-full"
          >
            <XCircle size={20} />
          </button>
          <Img
            loader={<Skeleton className="w-full h-full" />}
            className="w-full h-full rounded-md"
            src={image}
            alt={i + ""}
          />
        </div>
      ))}
    </div>
  );

  return (
    <Dialog>
      <DialogTrigger>{button}</DialogTrigger>
      <DialogContent>
        <DialogTitle className="text-center text-lg">Add Image</DialogTitle>

        <Dropzone
          accept={{ "image/*": filesToAccept }}
          maxFiles={multiples}
          maxSize={maxSize * Math.pow(1024, 2)}
          onError={(e) => {
            toast({
              title: "Error",
              description: e.message,
              variant: "destructive",
            });
          }}
          onDropAccepted={(acceptedFiles) => {
            setData({ ...data, files: acceptedFiles });
          }}
        >
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps({ className: "dropzone" })}>
              <input {...getInputProps()} />
              <div
                className={
                  "w-full h-[10rem] group border-[2px] flex flex-col gap-1 items-center justify-center border-dashed border-gray-400 hover:border-green-500 delay-75 cursor-pointer hover:bg-green-100 rounded-md"
                }
              >
                <span className="relative">
                  <File size={40} />
                  <span
                    className={
                      " absolute group-hover:bg-green-500 group-hover:text-white delay-75 bottom-0 right-0 p-1 rounded-full bg-black text-white"
                    }
                  >
                    <Upload size={10} />
                  </span>
                </span>
                <DialogDescription className="flex items-center gap-1">
                  Drag and drop file here or{" "}
                  <Button className="p-0 dark:text-slate-600" variant={"link"}>
                    Choose file
                  </Button>
                </DialogDescription>
              </div>
            </div>
          )}
        </Dropzone>
        <p className="text-center">Or</p>
        <Input
          value={urlImage}
          onChange={(e) => setUrlImage(e.target.value)}
          placeholder="Use URL instead..."
        />
        {!!data?.previewUrl?.length && selectedFiles}
        <div className="flex w-full items-center justify-between">
          <DialogDescription className="w-full flex-col md:flex-row flex md:items-center items-start justify-start">
            Supported format:{" "}
            <span>
              {filesToAccept
                .map((file) => file.replace(".", ""))
                .join(", ")
                .toUpperCase()}
            </span>
          </DialogDescription>
          <DialogDescription className="w-full flex items-end justify-end">
            Maximum Size: <span className="">{maxSize + "MB"}</span>
          </DialogDescription>
        </div>
        <DialogFooter className="flex gap-2">
          <DialogClose className="border rounded-md border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
            Close
          </DialogClose>
          <Button
            variant={"base"}
            className="w-full flex gap-1"
            onClick={() => {
              urlImage &&
                setData({
                  ...data,
                  previewUrl: [...data.previewUrl!, urlImage],
                });
              setUrlImage("");
            }}
          >
            Add Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageUploader;
