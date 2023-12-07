import { Bell, LineChart, MessageCircle, Send } from "lucide-react";
import { Variants, motion, useInView } from "framer-motion";
import { useRef } from "react";

const featuresList = [
  {
    title: "Assessment, Quizzes and Tests",
    icon: <MessageCircle size={80} />,
    style: "md:col-span-2",
    note: "Quizly simplifies educators' tasks by automating the recording of student results in the online gradebook, streamlining progress tracking and grading efficiency. Educators can generate detailed performance reports for insights into student learning outcomes and areas for improvement. This facilitates personalized feedback, creating a tailored learning experience and encouraging continuous improvement. With a data-driven approach, educators make informed decisions about teaching methods, fostering a responsive and adaptive teaching environment. Quizly also promotes parental involvement through shared performance reports, fostering transparency and collaborative support for students.",
  },
  {
    title: "One-On-One Chat With Teacher",
    icon: <Send size={80} />,
    style: "md:row-span-2",
    note: "Quizly enhances the learning experience with personalized support through one-on-one chat sessions with teachers, fostering a direct line of communication for students seeking assistance and guidance. The platform facilitates seamless interaction by allowing educators to easily launch live assignments, quizzes, and tests. This integration ensures that results are promptly recorded in the online gradebook, simplifying the grading process and providing timely feedback to students. The combination of real-time communication and automatic result tracking creates an efficient and supportive environment, promoting effective collaboration between students and teachers. This interactive approach contributes to a dynamic and engaging learning atmosphere, ultimately enhancing the overall educational journey on Quizly.",
  },
  {
    title: "Analytics on Classroom and Students",
    icon: <LineChart size={80} />,
    style: "",
    note: "Access detailed analytics on classroom performance and student progrseamlessly managing live assignments, quizzes, and tests with auto result entry into the online gradebook. Streamline assessment procesgain valuable insights, and optimize teaching strategies effortlessly Quizly.",
  },
  {
    title: "Real-time Notifications",
    icon: <Bell size={80} />,
    style: "",
    note: "Receive instant notifications for crucial updates, announcements, and platform activities, ensuring timely awareness. Tailor your notification preferences to optimize communication and engagement, staying connected and informed on Quizly.",
  },
];

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.5,
      delayChildren: 0.5,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.35 } },
};

const Features = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  const isInView = useInView(ref, { once: true });
  return (
    <div className="md:max-w-6xl p-2 mt-5 h-fit m-auto">
      <h1 className="text-center text-3xl ">
        Main Features of <span className="text-green-500">Quizly</span>
      </h1>
      <p className="text-gray-400 w-[80%] m-auto dark:text-gray-300 text-center">
        Discover few out of many features quizly offer its users
      </p>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
        variants={container}
        className="mt-5 px w-full m-auto md:w-full grid md:grid-rows-2 md:grid-cols-3 gap-4"
      >
        {featuresList.map((feature, i) => (
          <motion.div
            key={i}
            variants={item}
            className={`${feature.style} w-full hover:bg-green-400 hover:text-white delay-75 ease-linear transition-all overflow-hidden cursor-pointer relative bg-green-50 dark:bg-green-800 dark:hover:bg-green-50 dark:hover:text-green-800 rounded-md md:p-4 p-2`}
          >
            <span className="absolute top-0 right-0 -mr-3 -mt-5 opacity-20">
              {feature.icon}
            </span>
            <h1 className="text-2xl underline">{feature.title}</h1>
            <p className="mt-2">{feature.note}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Features;
