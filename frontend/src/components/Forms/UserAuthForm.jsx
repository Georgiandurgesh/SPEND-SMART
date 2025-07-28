import { Avatar } from "@nextui-org/react";
import { Link } from "react-router-dom";
import avatar from "../../assets/avatar.webp";
import PropTypes from "prop-types";

const UserAuthForm = ({
  title,
  imageSrc,
  imageTitle,
  alt,
  form,
  footer,
  footerLink,
  footerLinkPath,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col lg:flex-row items-center justify-center min-h-[70vh] animate-fade-in">
      {/* Left: Illustration */}
      <div className="hidden lg:flex flex-col justify-center items-center w-1/2 h-full bg-gradient-to-br from-primary/10 to-secondary/10 rounded-l-3xl p-8">
        <h4 className="text-3xl xl:text-4xl text-primary font-bold mb-6 animate-fade-in">
          {imageTitle}
        </h4>
        <img src={imageSrc} alt={alt} className="w-80 rounded-2xl shadow-lg" />
      </div>
      {/* Right: Form */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 h-full bg-white/80 dark:bg-background/80 rounded-3xl p-8 shadow-xl relative">
        <Avatar
          src={avatar}
          name="Avatar"
          className="w-20 h-20 sm:w-24 sm:h-24 text-lg absolute -top-12 left-1/2 -translate-x-1/2 shadow-lg border-4 border-primary"
          isBordered
          color="secondary"
          showFallback
        />
        <h3 className="text-2xl md:text-3xl xl:text-4xl font-bold text-primary mb-6 mt-12 text-center">
          {title}
        </h3>
        <div className="w-full max-w-md flex flex-col justify-center items-center gap-4">
          {form}
        </div>
        {footer && (
          <span className="font-calSans text-base text-center mt-6 text-gray-700">
            <span className="block sm:inline">{footer}</span>
            <Link to={footerLinkPath} className="ml-1 text-primary font-semibold hover:underline">
              {footerLink}
            </Link>
          </span>
        )}
      </div>
    </div>
  );
};

UserAuthForm.propTypes = {
  title: PropTypes.string,
  imageSrc: PropTypes.string,
  imageTitle: PropTypes.string,
  alt: PropTypes.string,
  form: PropTypes.node.isRequired,
  footer: PropTypes.node,
  footerLink: PropTypes.string,
  footerLinkPath: PropTypes.string,
};

export default UserAuthForm;
