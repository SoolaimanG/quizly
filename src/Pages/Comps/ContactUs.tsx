import { Mail, MapPin, PhoneCall } from "lucide-react";
import { Input } from "../../components/Input";
import { Textarea } from "../../components/TextArea";
import { Button } from "../../components/Button";
import { FormEvent, useState } from "react";
import { sendEmailToDeveloper } from "../../Functions";
import { toast } from "../../components/use-toaster";

export const myAddress = Object.freeze({
  note: "I live in Nigeria, Niger State, Bida Local Government",
  phoneNumber: "+2347068214943",
  email: "Suleimaangee@gmail.com",
  address: "Efu madami, Bida Local Government Area, Niger State, ",
});

const ContactUs = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    email: "",
    phoneNumber: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendEmailToDeveloper({ ...formData });
      toast({
        title: "Email Sent",
        description: `Thank you for sending me email 😊`,
      });
    } catch (error: any) {
      toast({
        title: "Error 😢",
        description: error.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const address = (
    <div className="md:w-1/2 w-full flex flex-col gap-2">
      <h1 className="text-xl md:text-3xl">Our Address</h1>
      <p>{myAddress.note}</p>
      <div className="flex items-center gap-2">
        <MapPin size={15} className="text-green-800 dark:text-green-100" />
        <address className="break-words">{myAddress.address}</address>
      </div>
      <div className="flex items-center gap-2">
        <Mail size={15} className="text-green-800 dark:text-green-100" />
        <a href={`mailto:${myAddress.email}`}>{myAddress.email}</a>
      </div>
      <div className="flex items-center gap-2">
        <PhoneCall size={15} className="text-green-800 dark:text-green-100" />
        <a href={`tel:${myAddress.phoneNumber}`}>{myAddress.phoneNumber}</a>
      </div>
    </div>
  );
  const contact_form = (
    <form
      action=""
      onSubmit={(e) => sendMessage(e)}
      className="md:w-1/2 text-slate-700 flex flex-col gap-3 rounded-md p-2 w-full"
    >
      <h1 className="text-xl md:text-2xl dark:text-white">Send a message...</h1>
      <div className="flex md:flex-row flex-col gap-2">
        <Input
          onChange={handleChange}
          name="firstName"
          className="dark:text-white"
          type="text"
          placeholder="First Name"
        />
        <Input
          name="lastName"
          onChange={handleChange}
          className="dark:text-white"
          type="text"
          placeholder="Last Name"
        />
      </div>
      <Input
        name="email"
        onChange={handleChange}
        className="dark:text-white"
        required
        type="email"
        placeholder="Email"
      />
      <Input
        name="phoneNumber"
        onChange={handleChange}
        className="dark:text-white"
        type="text"
        placeholder="Phone Number"
      />
      <Textarea
        onChange={handleChange}
        name="message"
        required
        placeholder="Your Message"
        className="resize-none dark:text-white"
      />
      <Button
        disabled={loading}
        type="submit"
        className="w-full dark:bg-green-700 dark:text-white disabled:dark:bg-green-800 dark:hover:bg-green-800 bg-green-500 disabled:bg-green-800 disabled:text-white hover:bg-green-600"
      >
        Send Message
      </Button>
    </form>
  );

  return (
    <div id="contact-us" className="w-full bg-gray-50 dark:bg-slate-800">
      <div className="md:max-w-6xl p-2 h-fit m-auto">
        <h1 className="text-xl md:text-3xl mt-5 text-center text-green-500">
          Contact Us
        </h1>
        <p className="text-gray-400 dark:text-gray-300 text-center">
          Reach out to us and we will reply you almost instantly
        </p>
        <div className="flex w-full mt-3 items-center flex-col md:flex-row gap-3 rounded-md justify-center m-auto">
          {address}
          {contact_form}
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
