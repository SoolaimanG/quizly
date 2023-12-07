import { Button } from "./Button";
import GoogleIcon from "../assets/GoogleIcon";
import TwitterIcon from "../assets/TwitterIcon";

import { TwitterAuthProvider, User, signInWithPopup } from "firebase/auth";
import { auth } from "../Functions/config";
import { toast } from "./use-toaster";
import { IUser } from "../Types/components.types";

const Oauth = () => {
  const twitterProvider = new TwitterAuthProvider();

  //const signInWithGoogle = async () => {};
  const signInWithTwitter = async () => {
    try {
      const res = await signInWithPopup(auth, twitterProvider);

      const user: User = await res.user;

      const payload: Partial<IUser> = {
        username: user.displayName as string,
        profile_image: user.photoURL as string,
        email: user.email as string,
        email_verified: user.emailVerified,
      };

      console.log(payload);
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Error " + error.status,
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        className="flex items-center gap-1"
        size={"lg"}
        variant={"outline"}
      >
        <GoogleIcon size={"25"} />
        Google
      </Button>
      <Button
        onClick={signInWithTwitter}
        className="flex items-center gap-1"
        size={"lg"}
        variant={"outline"}
      >
        <TwitterIcon size={35} />
        Twitter
      </Button>
    </div>
  );
};

export default Oauth;
