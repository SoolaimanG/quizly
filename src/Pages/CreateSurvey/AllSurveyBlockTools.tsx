import {
  BoxSelectIcon,
  CalendarIcon,
  CheckCheckIcon,
  ChevronDownIcon,
  Clock1,
  Contact2,
  FileQuestion,
  HashIcon,
  ImageIcon,
  Link2Icon,
  MailIcon,
  PhoneIcon,
  ScreenShare,
  ScreenShareOffIcon,
  StarIcon,
  Text,
  TextQuoteIcon,
  WavesIcon,
} from "lucide-react";
import { FC, ReactElement } from "react";
import { Description } from "../../components/App/Description";
import { cn } from "../../lib/utils";

export const HoverTools: FC<{ children: ReactElement; className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "px-3 py-[2px] rounded-md hover:bg-gray-100 cursor-pointer transition-all ease-linear dark:hover:bg-slate-800",
        className
      )}
    >
      {children}
    </div>
  );
};

export const ContactInfo: FC<{
  hideName?: boolean;
  size?: number;
  index: number;
  className?: string;
}> = ({ hideName, size = 20, index = 0, className }) => {
  return (
    <HoverTools
      className={cn(Boolean(index) && "bg-[#3b82f6] text-white", className)}
    >
      <div className="flex items-center gap-1">
        <span>
          <Contact2 size={size} />
        </span>
        {!hideName && <Description text="Contact Info" />}
        {Boolean(index) && (
          <Description text={index + ""} className="text-lg text-white" />
        )}
      </div>
    </HoverTools>
  );
};

export const EmailBlock: FC<{
  hideName?: boolean;
  size?: number;
  index: number;
  className?: string;
}> = ({ hideName, size = 20, index = 0, className }) => {
  return (
    <HoverTools
      className={cn(Boolean(index) && "bg-[#3b82f6] text-white", className)}
    >
      <div className="flex items-center gap-1">
        <span>
          <MailIcon size={size} />
        </span>
        {!hideName && <Description text="Email" />}
        {Boolean(index) && (
          <Description text={index + ""} className="text-lg text-white" />
        )}
      </div>
    </HoverTools>
  );
};

export const PhoneNumberBlock: FC<{
  hideName?: boolean;
  size?: number;
  index: number;
  className?: string;
}> = ({ hideName, size = 20, index = 0, className }) => {
  return (
    <HoverTools
      className={cn(Boolean(index) && "bg-[#3b82f6] text-white", className)}
    >
      <div className="flex items-center gap-1">
        <span>
          <PhoneIcon size={size} />
        </span>
        {!hideName && <Description text="Phone Number" />}
        {Boolean(index) && (
          <Description text={index + ""} className="text-lg text-white" />
        )}
      </div>
    </HoverTools>
  );
};

export const WebsiteBlock: FC<{
  hideName?: boolean;
  size?: number;
  index: number;
  className?: string;
}> = ({ hideName, size = 20, index = 0, className }) => {
  return (
    <HoverTools
      className={cn(Boolean(index) && "bg-[#a4ffb8] text-white", className)}
    >
      <div className="flex items-center gap-1">
        <span>
          <ScreenShare size={size} />
        </span>
        {!hideName && <Description text="Add Website" />}
        {Boolean(index) && (
          <Description text={index + ""} className="text-lg text-white" />
        )}
      </div>
    </HoverTools>
  );
};

export const ChoicesBlock: FC<{
  hideName?: boolean;
  size?: number;
  index: number;
  className?: string;
}> = ({ hideName, size = 20, index = 0, className }) => {
  return (
    <HoverTools
      className={cn(Boolean(index) && "bg-[#a855f7] text-white", className)}
    >
      <div className="flex items-center gap-1">
        <span>
          <CheckCheckIcon size={size} />
        </span>
        {!hideName && <Description text="Choices" />}
        {Boolean(index) && (
          <Description text={index + ""} className="text-lg text-white" />
        )}
      </div>
    </HoverTools>
  );
};

export const DropDownBlock: FC<{
  hideName?: boolean;
  size?: number;
  index: number;
  className?: string;
}> = ({ hideName, size = 20, index = 0, className }) => {
  return (
    <HoverTools
      className={cn(Boolean(index) && "bg-[#a855f7] text-white", className)}
    >
      <div className="flex items-center gap-1">
        <span>
          <ChevronDownIcon size={size} />
        </span>
        {!hideName && <Description text="Drop Down" />}
        {Boolean(index) && (
          <Description text={index + ""} className="text-lg text-white" />
        )}
      </div>
    </HoverTools>
  );
};

export const PictureBlock: FC<{
  hideName?: boolean;
  size?: number;
  index: number;
  className?: string;
}> = ({ hideName, size = 20, index = 0, className }) => {
  return (
    <HoverTools
      className={cn(Boolean(index) && "bg-[#f43f5e] text-white", className)}
    >
      <div className="flex items-center gap-1">
        <span>
          <ImageIcon size={size} />
        </span>
        {!hideName && <Description text="Image/Picture" />}
        {Boolean(index) && (
          <Description text={index + ""} className="text-lg text-white" />
        )}
      </div>
    </HoverTools>
  );
};

export const YesNoBlock: FC<{
  hideName?: boolean;
  size?: number;
  index: number;
  className?: string;
}> = ({ hideName, size = 20, index = 0, className }) => {
  return (
    <HoverTools
      className={cn(Boolean(index) && "bg-[#a855f7] text-white", className)}
    >
      <div className="flex items-center gap-1">
        <span>
          <BoxSelectIcon size={size} />
        </span>
        {!hideName && <Description text="Yes or No" />}
        {Boolean(index) && (
          <Description text={index + ""} className="text-lg text-white" />
        )}
      </div>
    </HoverTools>
  );
};

export const RatingBlock: FC<{
  hideName?: boolean;
  size?: number;
  index: number;
  className?: string;
}> = ({ hideName, size = 20, index = 0, className }) => {
  return (
    <HoverTools
      className={cn(Boolean(index) && "bg-[#a855f7] text-white", className)}
    >
      <div className="flex items-center gap-1">
        <span>
          <StarIcon size={size} />
        </span>
        {!hideName && <Description text="Ratings" />}
        {Boolean(index) && (
          <Description text={index + ""} className="text-lg text-white" />
        )}
      </div>
    </HoverTools>
  );
};
export const LongTextBlock: FC<{
  hideName?: boolean;
  size?: number;
  index: number;
  className?: string;
}> = ({ hideName, size = 20, index = 0, className }) => {
  return (
    <HoverTools
      className={cn(Boolean(index) && "bg-[#3b82f6] text-white", className)}
    >
      <div className="flex items-center gap-1">
        <span>
          <TextQuoteIcon size={size} />
        </span>
        {!hideName && <Description text="Long Text" />}
        {Boolean(index) && (
          <Description text={index + ""} className="text-lg text-white" />
        )}
      </div>
    </HoverTools>
  );
};

export const ShortTextBlock: FC<{
  hideName?: boolean;
  size?: number;
  index: number;
  className?: string;
}> = ({ hideName, size = 20, index = 0, className }) => {
  return (
    <HoverTools
      className={cn(Boolean(index) && "bg-[#3b82f6] text-white", className)}
    >
      <div className="flex items-center gap-1">
        <span>
          <Text size={size} />
        </span>
        {!hideName && <Description text="Short Text" />}
        {Boolean(index) && (
          <Description text={index + ""} className="text-lg text-white" />
        )}
      </div>
    </HoverTools>
  );
};

export const TimeBlock: FC<{
  hideName?: boolean;
  size?: number;
  index: number;
  className?: string;
}> = ({ hideName, size = 20, index = 0, className }) => {
  return (
    <HoverTools
      className={cn(Boolean(index) && "bg-[#eab308] text-white", className)}
    >
      <div className="flex items-center gap-1">
        <span>
          <Clock1 size={size} />
        </span>
        {!hideName && <Description text="Time" />}
        {Boolean(index) && (
          <Description text={index + ""} className="text-lg text-white" />
        )}
      </div>
    </HoverTools>
  );
};
export const DateBlock: FC<{
  hideName?: boolean;
  size?: number;
  index: number;
  className?: string;
}> = ({ hideName, size = 20, index = 0, className }) => {
  return (
    <HoverTools
      className={cn(Boolean(index) && "bg-[#eab308] text-white", className)}
    >
      <div className="flex items-center gap-1">
        <span>
          <CalendarIcon size={size} />
        </span>
        {!hideName && <Description text="Date" />}
        {Boolean(index) && (
          <Description text={index + ""} className="text-lg text-white" />
        )}
      </div>
    </HoverTools>
  );
};
export const NumberBlock: FC<{
  hideName?: boolean;
  size?: number;
  index: number;
  className?: string;
}> = ({ hideName, size = 20, index = 0, className }) => {
  return (
    <HoverTools
      className={cn(Boolean(index) && "bg-[#3b82f6] text-white", className)}
    >
      <div className="flex items-center gap-1">
        <span>
          <HashIcon size={size} />
        </span>
        {!hideName && <Description text="Numbers" />}
        {Boolean(index) && (
          <Description text={index + ""} className="text-lg text-white" />
        )}
      </div>
    </HoverTools>
  );
};
export const QuestionGroupBlock: FC<{
  hideName?: boolean;
  size?: number;
  index: number;
  className?: string;
}> = ({ hideName, size = 20, index = 0, className }) => {
  return (
    <HoverTools
      className={cn(Boolean(index) && "bg-[#f97316] text-white", className)}
    >
      <div className="flex items-center gap-1">
        <span>
          <FileQuestion size={size} />
        </span>
        {!hideName && <Description text="Question Group" />}
        {Boolean(index) && (
          <Description text={index + ""} className="text-lg text-white" />
        )}
      </div>
    </HoverTools>
  );
};
export const EndScreenBlock: FC<{
  hideName?: boolean;
  size?: number;
  index: number;
  className?: string;
}> = ({ hideName, index, size = 20, className }) => {
  return (
    <HoverTools
      className={cn(Boolean(index) && "bg-[#22d3ee] text-white", className)}
    >
      <div className={cn("flex items-center gap-1")}>
        <span>
          <ScreenShareOffIcon size={size} />
        </span>
        {!hideName && <Description text="End Of Screen" />}
        {Boolean(index) && (
          <Description text={index + ""} className="text-lg text-white" />
        )}
      </div>
    </HoverTools>
  );
};
export const WelcomeScreenBlock: FC<{
  hideName?: boolean;
  size?: number;
  index: number;
  className?: string;
}> = ({ hideName, index, size = 20, className }) => {
  return (
    <HoverTools className={cn(Boolean(index) && "bg-[#22d3ee]", className)}>
      <div className={cn("flex items-center gap-1")}>
        <span>
          <WavesIcon size={size} />
        </span>
        {!hideName && <Description text="Welcome Screen" />}

        {Boolean(index) && (
          <Description text={index + ""} className="text-lg text-white" />
        )}
      </div>
    </HoverTools>
  );
};
export const RedirectToURLBlock: FC<{
  hideName?: boolean;
  size?: number;
  index: number;
  className?: string;
}> = ({ hideName, size = 20, index = 0, className }) => {
  return (
    <HoverTools
      className={cn(Boolean(index) && "bg-[#f97316] text-white", className)}
    >
      <div className="flex items-center gap-1">
        <span>
          <Link2Icon size={size} />
        </span>
        {!hideName && <Description text="Redirect with URL" />}
        {Boolean(index) && (
          <Description text={index + ""} className="text-lg text-white" />
        )}
      </div>
    </HoverTools>
  );
};
