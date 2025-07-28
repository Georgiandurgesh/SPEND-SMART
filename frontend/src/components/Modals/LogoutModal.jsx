import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import { useLogoutMutation } from "../../features/api/apiSlices/userApiSlice";
import { closeModal } from "../../features/logoutModal/logoutModalSlice";
import { resetCredentials } from "../../features/authenticate/authSlice";
import { updateLoader } from "../../features/loader/loaderSlice";
import { Logout } from "../../utils/Icons";

// Clear any cached data in localStorage
const clearAppData = () => {
  // Clear any cached API data
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('api/')) {
      localStorage.removeItem(key);
    }
  });
};

const LogoutModal = () => {
  const isOpen = useSelector((state) => state.logoutModal.isOpen);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logout, { isLoading }] = useLogoutMutation();

  const handleLogout = async (e) => {
    if (e) {
      e.preventDefault();
    }

    try {
      dispatch(updateLoader(40));
      
      // Clear user data from Redux
      dispatch(resetCredentials());
      
      // Clear any cached data
      clearAppData();
      
      // Call the logout API
      try {
        await logout().unwrap();
      } catch (apiError) {
        // Even if logout API fails, we still want to proceed with local cleanup
        console.log('Logout API error (proceeding with cleanup):', apiError);
      }
      
      // Close the modal and navigate
      dispatch(closeModal());
      navigate("/");
      
      dispatch(updateLoader(80));
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error('Logout error:', error);
      toast.error(error?.data?.error || "An error occurred during logout");
    } finally {
      dispatch(updateLoader(100));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => dispatch(closeModal())}
      placement="center"
      backdrop="blur"
    >
      <ModalContent>
        <>
          <ModalHeader>
            <h4 className="text-2xl text-error tracking-relaxed">
              Logout Confirmation ?
            </h4>
          </ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to log out? Logging out will end your
              current session and you will need to sign in again to access your
              account.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="flat"
              onPress={() => dispatch(closeModal())}
              className="text-base"
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onClick={handleLogout}
              endContent={<Logout />}
              isLoading={isLoading}
              className="text-base"
            >
              Logout
            </Button>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
};

export default LogoutModal;
