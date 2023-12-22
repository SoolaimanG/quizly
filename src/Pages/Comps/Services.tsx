import TeacherImage from "../../assets/TeachersImage.png";
import StudentImage from "../../assets/studentImage.png";
import Student from "../../assets/toolsImages.png";
import { motion, useInView } from "framer-motion";
import { Button } from "../../components/Button";
import SearchQuiz from "../../components/App/SearchQuiz";
import { useRef } from "react";
import Fade from "../../Animations/Fade";
import { useMethods } from "../../Hooks";

const contents = Object.freeze({
  quilyDefination:
    "Quizly is an innovative online learning platform that redefines the educational experience. It serves as a dynamic space where both students and educators can engage in a variety of interactive activities designed to enhance learning outcomes. The platform is characterized by its diverse set of features aimed at making th ,learning process enjoyable, effective, and adaptable to the needs o ,modern learners",
  quizlyTools:
    "Quizly provides a comprehensive suite of interactive tools forteachers and learners, facilitating seamless quiz creation,personalized learning experiences, real-time progress monitoring,and collaborative educational environments to enhance the overalllearning journey.",
});

const Services = () => {
  const { login_required } = useMethods();

  const studentRef = useRef<HTMLDivElement | null>(null);
  const teacherRef = useRef<HTMLDivElement | null>(null);
  const toolsRef = useRef<HTMLDivElement | null>(null);
  const mainSectionRef = useRef<HTMLDivElement | null>(null);

  const studentInview = useInView(studentRef, { once: true });
  const teacherInView = useInView(teacherRef, { once: true });
  const toolsInView = useInView(toolsRef, { once: true });
  const mainSectionInView = useInView(mainSectionRef, { once: true });

  const goto_create_quiz = () => {
    login_required();

    console.log("Auth");
  };

  const studentComp = (
    <motion.div
      ref={studentRef}
      animate={
        studentInview
          ? { opacity: 1, transition: { delay: 1 } }
          : { opacity: 0 }
      }
      id="service"
      className="md:w-1/2 w-[90%] group cursor-pointer relative"
    >
      <motion.img
        className="w-full h-full opacity-100"
        src={StudentImage}
        alt="students-image"
      />
      <div className="w-full flex-col gap-2 flex bg-[rgba(0,0,0,0.35)] items-center justify-center rounded-xl h-full top-0 left-0 absolute">
        <p className="text-xl text-white font-semibold">FOR STUDENT</p>

        <SearchQuiz
          button={
            <Button
              size={"lg"}
              variant={"outline"}
              className="rounded-2xl dark:border-white bg-transparent text-white hover:bg-green-500 hover:text-white"
            >
              Enter/Find Quiz
            </Button>
          }
        />
      </div>
    </motion.div>
  );
  const teacherComp = (
    <motion.div
      ref={teacherRef}
      animate={
        teacherInView
          ? { opacity: 1, transition: { delay: 1.2 } }
          : { opacity: 0 }
      }
      className="w-[90%] md:w-1/2 group cursor-pointer relative"
    >
      <motion.img
        className="w-full h-full"
        src={TeacherImage}
        alt="teacher-image"
      />
      <div className="w-full flex-col gap-2 flex bg-[rgba(0,0,0,0.35)] items-center justify-center rounded-xl h-full top-0 left-0 absolute">
        <p className="text-xl text-white font-semibold">FOR INSTRUCTORS</p>
        <Button
          onClick={goto_create_quiz}
          size={"lg"}
          variant={"outline"}
          className="rounded-2xl dark:border-white bg-transparent text-white hover:bg-green-500 hover:text-white"
        >
          Create quiz
        </Button>
      </div>
    </motion.div>
  );
  return (
    <motion.div ref={mainSectionRef} className="w-full h-fit mt-5">
      <div className="md:max-w-6xl h-full m-auto flex flex-col gap-5">
        <div className="flex items-center flex-col gap-3 justify-center">
          <motion.h1
            animate={
              mainSectionInView
                ? { y: 0, opacity: 1, transition: { delay: 0.7 } }
                : { y: 50, opacity: 0 }
            }
            className="gap-1 flex items-center justify-center w-full text-3xl md:text-4xl"
          >
            What is <span className="text-green-500">Quizly?</span>
          </motion.h1>
          <motion.p
            animate={
              mainSectionInView
                ? { opacity: 1, transition: { delay: 1 } }
                : { opacity: 0 }
            }
            className="md:w-1/2 w-[90%] text-gray-400 dark:text-gray-200 m-auto text-center"
          >
            {contents.quilyDefination}
          </motion.p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-10">
          {teacherComp}
          {studentComp}
        </div>
        <motion.div
          ref={toolsRef}
          className="mt-10 flex flex-col items-center justify-center md:flex-row h-full w-full gap-3"
        >
          <div className="w-full flex flex-col gap-2 h-full md:w-1/2">
            <div className="flex items-center justify-center md:items-start w-full md:justify-start">
              <motion.h1
                animate={
                  toolsInView ? { y: 0, opacity: 1 } : { y: -50, opacity: 0 }
                }
                initial={{ y: -50, opacity: 0 }}
                className="md:w-full m-auto w-[80%] md:text-left text-center text-3xl"
              >
                <span className="text-green-500">Tools</span> for Teachers and
                Learners
              </motion.h1>
            </div>

            <motion.p
              animate={
                toolsInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }
              }
              initial={{ y: 50, opacity: 0 }}
              className="w-[90%] m-auto md:w-full md:text-left text-center"
            >
              {contents.quizlyTools}
            </motion.p>
          </div>
          {toolsInView ? (
            <Fade delay={0.7} className="w-full md:w-1/2 h-auto">
              {" "}
              <img draggable={false} className="" src={Student} alt="student" />
            </Fade>
          ) : (
            <img
              draggable={false}
              className="w-full md:w-1/2 h-auto"
              src={Student}
              alt="student"
            />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Services;
