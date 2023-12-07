import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import ProfileOne from "../../assets/profile_one.png";
import ProfileTwo from "../../assets/profile_two.png";
import ProfileThree from "../../assets/profile_three.png";
import { Button } from "../../components/Button";
import { AnimatePresence, motion, useInView } from "framer-motion";
import Rating from "../../components/App/Rating";
import { useEffect, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/AlertModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/Tooltip";
import { Textarea } from "../../components/TextArea";

const dummyData = [
  {
    name: "SoolaimanG",
    rating: 2,
    userType: "Student",
    review_body:
      "The 'Reviews' section showcases authentic testimonials and feedback Quizly users, offering valuable insights into their experiensatisfaction, and perspectives on the platform's effectivenuser-friendliness, and impact on their learning or teaching endeavors.",
    profileImage: ProfileOne,
  },
  {
    name: "Nazman",
    rating: 4,
    userType: "Teacher",
    review_body:
      "The 'Reviews' section showcases authentic testimonials and feedback from Quusers, offering valuable insights into their experiences, satisfaction,perspectives on the platform's effectiveness, user-friendliness, and impact on their learning or teaching endeavors.",
    profileImage: ProfileTwo,
  },
  {
    name: "Elon Musk",
    rating: 3,
    userType: "Teacher",
    review_body:
      "The 'Reviews' section showcases authentic testimonials and feedback from Quizlyusers, offering valuable insights into their experiences, satisfaction, andperspectives on the platform's effectiveness, user-friendliness, and impact ontheir learning or teaching endeavors.",
    profileImage: ProfileThree,
  },
];

const Reviews = () => {
  const [currReview, setCurrReview] = useState(0);
  const [rating, setRating] = useState(1);
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(ref, { once: true });

  const childRef = useRef<HTMLDivElement | null>(null);
  const childRefisInView = useInView(childRef, { once: true });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrReview((prev) => {
        if (prev >= dummyData.length - 1) {
          return 0;
        } else {
          return prev + 1;
        }
      });
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  const addReview = (
    <AlertDialog>
      <AlertDialogTrigger>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant={"ghost"} size={"icon"}>
                <MessageCircle />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Review</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add Comment</AlertDialogTitle>
          <AlertDialogDescription>
            Add your own review or comment about QUIZLY
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form className="flex flex-col gap-2" action="">
          <Textarea />
          <Rating rating={rating} setRating={setRating} />
        </form>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
          <AlertDialogAction className="bg-green-400 text-green-700 dark:bg-green-800 hover:bg-green-500 dark:text-white">
            Add
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  const reviewList = (
    <motion.div
      animate={
        isInView ? { opacity: 1, transition: { delay: 1 } } : { opacity: 0 }
      }
      ref={ref}
      className="w-full md:w-[80%] relative flex flex-col gap-5 p-3 text-slate-600 m-auto md:h-[20rem] md:mt-10 h-fit bg-white rounded-md"
    >
      <div className="absolute top-0 right-0 mt-3 mr-3">{addReview}</div>
      <div className="flex items-center gap-2">
        <div className="w-[6rem] h-[6rem] overflow-hidden bg-green-300 rounded-full">
          <AnimatePresence mode="wait">
            <motion.img
              key={dummyData[currReview].name}
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 5 }}
              transition={{ delay: 0.15 }}
              exit={{ opacity: 0, y: -5 }}
              className="p-1 mt-[2.5px]"
              src={dummyData[currReview].profileImage}
              alt="user_profile"
            />
          </AnimatePresence>
        </div>
        <motion.div className="flex flex-col">
          <AnimatePresence mode="wait">
            <motion.h1
              key={dummyData[currReview].name}
              animate={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 5 }}
              transition={{ delay: 0.15 }}
              exit={{ opacity: 0, x: -5 }}
            >
              {dummyData[currReview].name}
            </motion.h1>
          </AnimatePresence>
          <Rating rating={dummyData[currReview].rating} />
        </motion.div>
      </div>
      <AnimatePresence mode="wait">
        <motion.p
          key={dummyData[currReview].name}
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 5 }}
          transition={{ delay: 0.15 }}
          exit={{ opacity: 0, y: -5 }}
        >
          {dummyData[currReview].review_body}
        </motion.p>
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <motion.i
          key={dummyData[currReview].name}
          animate={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: -5 }}
          transition={{ delay: 0.15 }}
          exit={{ opacity: 0, x: 5 }}
          className="text-green-500 font-semibold"
        >
          {" "}
          {dummyData[currReview].userType}
        </motion.i>
      </AnimatePresence>
      <div className=" absolute flex items-center gap-2 bottom-0 right-0 mb-2 mr-2">
        <Button
          onClick={() =>
            setCurrReview((prev) =>
              prev >= dummyData.length - 1 ? 0 : prev + 1
            )
          }
          variant={"secondary"}
          size={"icon"}
          className="bg-green-200 text-green-500 dark:bg-green-600 dark:text-green-400"
        >
          <ChevronLeft />
        </Button>
        <Button
          onClick={() =>
            setCurrReview((prev) =>
              prev <= 0 ? dummyData.length - 1 : prev - 1
            )
          }
          variant={"secondary"}
          size={"icon"}
          className="bg-green-200 text-green-500 dark:bg-green-600 dark:text-green-400"
        >
          <ChevronRight />
        </Button>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      id="reviews"
      className="bg-green-50 p-2 h-fit md:h-screen dark:bg-green-800 mt-5"
    >
      <div className="flex flex-col gap-4 md:max-w-6xl m-auto">
        <motion.div
          ref={childRef}
          animate={
            childRefisInView
              ? { x: 0, opacity: 1, transition: { delay: 0.8 } }
              : { x: -100, opacity: 0 }
          }
          className="flex flex-col gap-1"
        >
          <h1 className="w-full text-center text-xl md:text-3xl">
            What <span className="text-green-500">Students</span> And{" "}
            <span className="text-green-500">Teachers</span> Says...
          </h1>
          <p className="text-center text-lg w-[80%] md:w-1/2 m-auto">
            Explore authentic testimonials in our Reviews section, offering
            valuable insights into the impact and user experience of Quizly.
          </p>
        </motion.div>
        {reviewList}
      </div>
    </motion.div>
  );
};

export default Reviews;
