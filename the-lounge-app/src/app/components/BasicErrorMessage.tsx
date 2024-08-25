// src/components/BasicErrorMessage.tsx
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const showBasicErrorMessage = (message: string) => {
  toast.error(message, {
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

const BasicErrorMessage = () => (
  <ToastContainer
    className="top-5 left-1/2 transform -translate-x-1/2"
    toastClassName={() =>
      "bg-white text-black border border-red-500 p-4 rounded shadow-lg"
    }
    bodyClassName={() => "flex items-center"}
    progressClassName="bg-red-500 h-1"
    position="top-center"
  />
);

export default BasicErrorMessage;
