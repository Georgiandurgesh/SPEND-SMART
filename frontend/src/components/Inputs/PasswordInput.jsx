import { useState } from "react";
import { Input } from "@nextui-org/react";
import PropTypes from "prop-types";

import { Password, Eye, EyeOff } from "../../utils/Icons";

const PasswordInput = ({
  value,
  onChange,
  errors,
  label,
  name,
  isInvalid,
  errorMessage,
  placeholder,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = (e) => {
    e.preventDefault();
    setIsVisible(!isVisible);
  };

  return (
    <Input
      type={isVisible ? "text" : "password"}
      label={label ? label : "Password"}
      name={name ? name : "password"}
      value={value}
      onChange={onChange}
      isInvalid={isInvalid ? isInvalid : !!errors?.password}
      errorMessage={errorMessage ? errorMessage : errors?.password}
      placeholder={placeholder ? placeholder : "Enter your password"}
      className="text-primary"
      startContent={<Password />}
      endContent={
        <button onClick={toggleVisibility}>
          {isVisible ? <Eye /> : <EyeOff />}
        </button>
      }
      classNames={{
        errorMessage: "text-error font-calSans",
      }}
    />
  );
};

PasswordInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  label: PropTypes.string,
  name: PropTypes.string,
  isInvalid: PropTypes.bool,
  errorMessage: PropTypes.string,
  placeholder: PropTypes.string,
};

export default PasswordInput;
