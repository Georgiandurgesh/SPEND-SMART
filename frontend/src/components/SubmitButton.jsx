import { Button } from "@nextui-org/react";
import PropTypes from "prop-types";

const SubmitButton = ({ isLoading, handleSubmit, isDisabled }) => {
  return (
    <Button
      variant="ghost"
      radius="full"
      isLoading={isLoading}
      isDisabled={isDisabled}
      className="text-secondary hover:text-primary text-2xl w-full mt-8"
      onClick={handleSubmit}
    >
      Submit
    </Button>
  );
};

SubmitButton.propTypes = {
  isLoading: PropTypes.bool,
  handleSubmit: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
};

export default SubmitButton;
