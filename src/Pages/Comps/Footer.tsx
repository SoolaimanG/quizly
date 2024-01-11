import { navbar_links } from "../../lib/utils";
import Logo from "../../components/Logo";
import { myAddress } from "./ContactUs";

const Footer = () => {
  return (
    <div className="md:h-[50vh] h-fit py-2 bg-green-600 text-white">
      <div className="md:max-w-6xl p-2 h-fit justify-normal gap-5 flex flex-col md:flex-row md:justify-between m-auto">
        <div>
          <Logo color />
          <p>Discover endless learning on the largest quiz platform.</p>
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="text-xl">Quick Links</h1>
          {navbar_links.map((nav, i) => (
            <a
              className="hover:text-green-700 transition-all delay-75 text-lg"
              href={nav.path}
              key={i}
            >
              {nav.name}
            </a>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="text-xl">Reach Out</h1>
          <address>{myAddress.address}</address>
          <a href={`mailto:${myAddress.email}`}>Email Us</a>
          <a href={`tel:${myAddress.phoneNumber}`}>Give us a call</a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
