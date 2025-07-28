import { useState, useEffect } from "react";
import { object, string } from "yup";
import { toast } from "react-toastify";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import {
  useRegisterMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "../features/api/apiSlices/userApiSlice";
import { setCredentials } from "../features/authenticate/authSlice";
import { updateLoader } from "../features/loader/loaderSlice";

import registerImg from "../assets/register.webp";
import { UserAuthForm, OtpForm } from "../components/Forms";
import validateForm from "../utils/validateForm";
import { UsernameInput, EmailInput, PasswordInput } from "../components/Inputs";
import SubmitButton from "../components/SubmitButton";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [countdown, setCountdown] = useState(
    parseInt(localStorage.getItem("otpCountdown")) || 0
  );

  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: registration, 2: OTP verification

  const validationSchema = object({
    username: string()
      .required("Username is required.")
      .min(3, "Username must be atleast 3 characters long.")
      .max(20, "Username should not be more than 20 characters."),
    email: string().required("Email is required.").email("Invalid Email."),
    password: string()
      .required("Password is required.")
      .min(8, "Password must be atleast 8 characters long."),
  });

  const handleOnChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    validateForm(e.target.name, e.target.value, validationSchema, setErrors);
  };

  const { username, email, password } = formData;
  const [register, { isLoading: registerLoading }] = useRegisterMutation();
  const [sendOtp] = useSendOtpMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      dispatch(updateLoader(40));
      const res = await register(formData).unwrap();
      await dispatch(setCredentials(res.user));
      dispatch(updateLoader(60));
      toast.success("Registered successfully!");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.error || "Unexpected Internal Server Error!");
    } finally {
      dispatch(updateLoader(100));
    }
  };

  const hasErrors = Object.values(errors).some((error) => !!error);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
        localStorage.setItem("otpCountdown", (countdown - 1).toString());
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <section className="w-full h-[90vh] px-6 sm:px-8 md:px-12 flex justify-center items-center">
      <UserAuthForm
        title="Register Now"
        imageTitle="Easy to Use."
        imageSrc={registerImg}
        alt="registration image"
        form={
          <>
            <UsernameInput
              value={username}
              onChange={handleOnChange}
              errors={errors}
            />
            <EmailInput
              value={email}
              onChange={handleOnChange}
              errors={errors}
            />
            <PasswordInput
              value={password}
              onChange={handleOnChange}
              errors={errors}
            />
            <SubmitButton
              isLoading={registerLoading}
              handleSubmit={handleSubmit}
              isDisabled={!email || !password || !username || hasErrors}
            />
          </>
        }
        footer={"Already have an account?"}
        footerLink={"Login"}
        footerLinkPath={"/login"}
      />
    </section>
  );
};

export default Register;
