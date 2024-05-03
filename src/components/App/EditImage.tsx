import { Dispatch, FC, SetStateAction } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../DialogModal";
import { Img } from "react-image";
import { Label } from "../Label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./TabUi";
import { Description } from "./Description";
import { RotateCcw, RotateCw } from "lucide-react";
import { Button } from "../Button";
import Hint from "../Hint";
import { FlipHorizontal2 } from "lucide-react";
import { FlipVertical2 } from "lucide-react";
import { Slider } from "../Slider";
import { imageEdittingStyles } from "../../Functions";
import { cn } from "../../lib/utils";
import { useComingSoonProps } from "../../provider";

export type imageEditorProps = {
  saturation: number;
  contrast: number;
  brightness: number;
  blur: number;
  pixelate: number;
  hue: number;
  grayscale: number;
  invert: number;
};

export type transformImageProps = {
  rotationIndex: number;
  flipIndex: {
    x: number;
    y: number;
  };
};

export type colorFilterTypes =
  | "saturation"
  | "contrast"
  | "brightness"
  | "blur"
  | "grayscale";

export type typeImageSyles = {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  rotationIndex: number;
  x: number;
  y: number;
  hue: number;
  grayscale: number;
  pixelate: number;
  rotationDeg: number[];
  invert: number;
};

const imageFilters: typeImageSyles[] = [
  {
    saturation: 0,
    contrast: 100,
    hue: 0,
    blur: 0,
    grayscale: 1,
    brightness: 100,
    pixelate: 5,
    invert: 1,
    rotationDeg: [0, 90, 180, 270],
    x: 0,
    y: 0,
    rotationIndex: 0,
  },
  // 2. Vintage Sepia Tone:
  {
    saturation: 0,
    contrast: 100,
    hue: -30,
    blur: 0,
    grayscale: 0,
    brightness: 100,
    invert: 1,
    pixelate: 5,
    rotationDeg: [0, 90, 180, 270],
    x: 0,
    y: 0,
    rotationIndex: 0,
  },
  // 3. Cool Blue Tone:
  {
    saturation: 0.5,
    contrast: 100,
    hue: 210,
    blur: 0,
    grayscale: 0,
    brightness: 100,
    invert: 1,
    pixelate: 5,
    rotationDeg: [0, 90, 180, 270],
    x: 0,
    y: 0,
    rotationIndex: 0,
  },
  // 4. Soft Focus with Warm Hue:
  {
    saturation: 0,
    contrast: 100,
    hue: 30,
    blur: 3,
    grayscale: 0,
    brightness: 100,
    invert: 1,
    pixelate: 5,
    rotationDeg: [0, 90, 180, 270],
    x: 0,
    y: 0,
    rotationIndex: 0,
  },
  // 5. High Saturation with Inverted Colors:
  {
    saturation: 0,
    contrast: 100,
    hue: 0,
    blur: 0,
    grayscale: 0,
    invert: 1,
    pixelate: 5,
    brightness: 100,
    rotationDeg: [0, 90, 180, 270],
    x: 0,
    y: 0,
    rotationIndex: 0,
  },
  // 6. Dreamy Blur with Desaturated Greens:
  {
    saturation: 0,
    contrast: 100,
    hue: 120,
    blur: 5,
    grayscale: 0,
    invert: 1,
    brightness: 100,
    pixelate: 5,
    rotationDeg: [0, 90, 180, 270],
    x: 0,
    y: 0,
    rotationIndex: 0,
  },
  // 7. Pop Art Style with Increased Contrast:
  {
    saturation: 0,
    contrast: 100,
    hue: 0,
    blur: 0,
    grayscale: 0,
    invert: 1,
    brightness: 100,
    pixelate: 5,
    rotationDeg: [0, 90, 180, 270],
    x: 0,
    y: 0,
    rotationIndex: 0,
  },
  // 8. Dramatic Black and White with Slight Blur:
  {
    saturation: 0,
    contrast: 100,
    hue: 0,
    blur: 1,
    grayscale: 1,
    invert: 1,
    brightness: 100,
    pixelate: 5,
    rotationDeg: [0, 90, 180, 270],
    x: 0,
    y: 0,
    rotationIndex: 0,
  },
  // 9. Monochromatic Teal Tone:
  {
    saturation: 0,
    contrast: 100,
    hue: 180,
    blur: 0,
    grayscale: 0,
    invert: 1,
    brightness: 100,
    pixelate: 5,
    rotationDeg: [0, 90, 180, 270],
    x: 0,
    y: 0,
    rotationIndex: 0,
  },
  // 10. Pixelated Retro Look (might require additional libraries)
  {
    saturation: 90,
    contrast: 100,
    hue: 0,
    blur: 0,
    grayscale: 0,
    pixelate: 5,
    invert: 1,
    brightness: 100,
    rotationDeg: [0, 90, 180, 270],
    x: 0,
    y: 0,
    rotationIndex: 0,
  }, // Adjust pixelate value for effect
];

export const EditImage: FC<{
  children: React.ReactNode;
  imageUrl: string;
  colorFilter: imageEditorProps;
  transform: transformImageProps;
  className?: string;
  setColorFilter: Dispatch<SetStateAction<imageEditorProps>>;
  setTransformImage: Dispatch<SetStateAction<transformImageProps>>;
  onApplyChanges: () => void;
}> = ({
  children,
  imageUrl,
  colorFilter,
  transform,
  className,
  setTransformImage,
  setColorFilter,
  onApplyChanges,
}) => {
  const divClassName = "flex items-center justify-between w-full";
  const labelClassName = "flex flex-col gap-3";
  const rotateDeg = [0, 90, 180, 270];

  // All Functions
  const handleSliderChange = (e: colorFilterTypes, value: number) => {
    setColorFilter({ ...colorFilter, [e]: value });
  };
  const handleImageRotation = (type?: "rotateCC" | "rotateC") => {
    if (!type) return;

    const rotateC =
      transform["rotationIndex"] + 1 >= rotateDeg.length
        ? 0
        : transform["rotationIndex"] + 1;
    const rotateCC =
      transform["rotationIndex"] <= 0
        ? rotateDeg.length - 1
        : transform["rotationIndex"] - 1;
    setTransformImage({
      ...transform,
      rotationIndex: type === "rotateC" ? rotateC : rotateCC,
    });
  };
  const handleImageFlip = (direction: "x" | "y") => {
    const currentPosition =
      direction === "x"
        ? transform.flipIndex.x === -1
        : transform.flipIndex.y === -1;

    setTransformImage({
      ...transform,
      flipIndex: {
        ...transform.flipIndex,
        [direction]: currentPosition ? 1 : -1,
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger className={cn("", className)}>{children}</DialogTrigger>
      <DialogContent className="h-[33.5rem] overflow-auto">
        <DialogHeader>
          <DialogTitle>Image Editor</DialogTitle>
          <DialogDescription>
            Transform your images effortlessly with our innovative tools. Crop,
            rotate, and adjust colors to perfection.
          </DialogDescription>
        </DialogHeader>

        <div className="w-full flex md:flex-row flex-col gap-2">
          {/* Preview Here */}
          <div className="md:w-1/3 w-full h-[10rem] p-1 border overflow-auto border-green-200 rounded-md">
            <Img
              style={imageEdittingStyles({
                brightness: colorFilter.brightness,
                contrast: colorFilter.contrast,
                saturation: colorFilter.saturation,
                blur: colorFilter.blur,
                rotationDeg: rotateDeg,
                x: transform.flipIndex.x,
                y: transform.flipIndex.y,
                rotationIndex: transform.rotationIndex,
                pixelate: colorFilter.pixelate,
                hue: colorFilter.hue,
                grayscale: colorFilter.grayscale,
                invert: colorFilter.invert,
              })}
              className="w-full rounded-md h-full"
              src={imageUrl}
            />
          </div>
          <Tabs defaultValue="crop" className="w-full">
            <TabsList>
              <TabsTrigger
                className="data-[state=active]:bg-green-400 data-[state=active]:text-white"
                value="crop"
              >
                Crop
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-green-400 data-[state=active]:text-white"
                value="adjustment"
              >
                Adjustment
              </TabsTrigger>
              <TabsTrigger
                className="data-[state=active]:bg-green-400 data-[state=active]:text-white"
                value="filter"
              >
                Filters
              </TabsTrigger>
            </TabsList>
            <div className="w-full h-[20rem] overflow-auto">
              <TabsContent value="crop">
                <Img src={imageUrl} className="w-full" />
              </TabsContent>
              <TabsContent
                className="w-full flex flex-col overflow-auto"
                value="adjustment"
              >
                <Description
                  className="text-lg text-green-500"
                  text="Transform"
                />
                <div className={divClassName}>
                  <p>Rotate</p>
                  <div className="flex items-center gap-1">
                    <Hint
                      element={
                        <Button
                          onClick={() => handleImageRotation("rotateCC")}
                          size="icon"
                          variant="ghost"
                        >
                          <RotateCcw size={16} />
                        </Button>
                      }
                      content="Rotate Left"
                    />
                    <Hint
                      element={
                        <Button
                          onClick={() => handleImageRotation("rotateC")}
                          size="icon"
                          variant="ghost"
                        >
                          <RotateCw size={16} />
                        </Button>
                      }
                      content="Rotate Right"
                    />
                  </div>
                </div>
                <div className={divClassName}>
                  <p>Flip</p>
                  <div className="flex items-center gap-1">
                    <Hint
                      element={
                        <Button
                          onClick={() => handleImageFlip("x")}
                          size="icon"
                          variant="ghost"
                        >
                          <FlipHorizontal2 size={16} />
                        </Button>
                      }
                      content="Flip to the left"
                    />
                    <Hint
                      element={
                        <Button
                          onClick={() => handleImageFlip("y")}
                          size="icon"
                          variant="ghost"
                        >
                          <FlipVertical2 size={16} />
                        </Button>
                      }
                      content="Flip to the right"
                    />
                  </div>
                </div>
                <hr className="mt-3" />
                <Description text="Color" className="text-lg text-green-500" />
                <div className="flex flex-col gap-3">
                  <Label className={labelClassName}>
                    <div className="flex items-center justify-between w-full">
                      Brightness
                      <Description text={colorFilter.brightness + ""} />
                    </div>
                    <Slider
                      value={[colorFilter.brightness]}
                      onValueChange={(e) =>
                        handleSliderChange("brightness", e[0])
                      }
                      step={1}
                    />
                  </Label>
                  <Label className={labelClassName}>
                    <div className="flex items-center justify-between w-full">
                      Contrast
                      <Description text={colorFilter.contrast + ""} />
                    </div>
                    <Slider
                      value={[colorFilter.contrast]}
                      onValueChange={(e) =>
                        handleSliderChange("contrast", e[0])
                      }
                      step={1}
                    />
                  </Label>
                  <Label className={labelClassName}>
                    <div className="flex items-center justify-between w-full">
                      Saturation
                      <Description text={colorFilter.saturation + ""} />
                    </div>
                    <Slider
                      value={[colorFilter.saturation]}
                      onValueChange={(e) =>
                        handleSliderChange("saturation", e[0])
                      }
                      step={1}
                    />
                  </Label>
                  <Label className={labelClassName}>
                    <div className="flex items-center justify-between w-full">
                      Gray
                      <Description text={colorFilter.grayscale + ""} />
                    </div>
                    <Slider
                      value={[colorFilter.grayscale]}
                      onValueChange={(e) =>
                        handleSliderChange("grayscale", e[0])
                      }
                      step={5}
                    />
                  </Label>
                  <Label className={labelClassName}>
                    <div className="flex items-center justify-between w-full">
                      Blur
                      <Description text={colorFilter.blur + ""} />
                    </div>
                    <Slider
                      value={[colorFilter.blur]}
                      onValueChange={(e) => handleSliderChange("blur", e[0])}
                      step={1}
                    />
                  </Label>
                </div>
              </TabsContent>
              <TabsContent className=" overflow-auto" value="filter">
                <div className="w-full gap-3  grid grid-cols-3">
                  {imageFilters.map((filter, index) => (
                    <ImageFilter
                      key={index}
                      filter={filter}
                      image_url={imageUrl}
                    />
                  ))}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <DialogClose onClick={onApplyChanges} asChild>
            <Button variant="base">Apply Changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const ImageFilter: FC<{ image_url: string; filter: typeImageSyles }> = ({
  image_url,
}) => {
  const { setIsVisible, setDescription, setFeatureName, setJoinWaitList } =
    useComingSoonProps();

  const handleClick = () => {
    setIsVisible(true);
    setDescription(
      "This feature is currently not yet available, it's still under development, while we are developing this feel free to join the wait-list and be among the first people to test this feature. "
    );
    setFeatureName("Add Filter To Image");
    setJoinWaitList(true);
  };

  return (
    <Img
      onClick={handleClick}
      src={image_url}
      className="h-auto cursor-pointer w-full"
    />
  );
};
