
import { useEffect } from "react";

// Toastprops
type ToastProps = {
    message: string;
    type:  "success" | "error";
    onClose: ()=> void;
  };

  //toast  component to show the messages in a toast notification. 
  //It is dismissible and has different types of notifications ( success, error)
const Toast = ({ message, type, onClose }: ToastProps) => {
  useEffect(() => {
    //sets the toast timer
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    //clear the toast timer
    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  //if type ==  success -> green color else red color
  const styles =
    type === "success"
      ? "position-fixed end-0 top-3 p-3 m-2 me-auto bg-success text-dark rounded toast-body" 
      : "position-fixed end-0 top-3 p-3 m-2 me-auto bg-danger text-light rounded toast-body";

      //return the toast  component with the given props and style.
  return (
    <div className=" toast-container" role="alert">
      <div className={styles} >
        <span>{message}</span>
      </div>
    </div>
  );
};

export default Toast;






