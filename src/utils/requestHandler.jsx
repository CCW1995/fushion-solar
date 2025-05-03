import { toast } from "react-toastify";
import { FiX } from "react-icons/fi";
import { HiOutlineExclamation, HiOutlineCheckCircle } from "react-icons/hi";

const toastOptions = {
  position: 'bottom-right',
  hideProgressBar: true,
  bodyClassName: 'custom-toast-body',
  closeButton: <FiX className="custom-toast-close" />,
}

export const requestError = (message, title) => {
  toast.dismiss()
  toast(
    <div className={`custom-modal-warning`}>
      <HiOutlineExclamation />
      <div>
        <p>{title || 'Warning!'}</p>
        {message}
      </div>
    </div>
    , { toastId: 'request-toast', className: 'custom-toast-warning', ...toastOptions })
};

export const requestSuccess = (message, title) => {
  toast.dismiss()
  toast(
    <div className="custom-modal-success">
      <HiOutlineCheckCircle />
      <div>
        <p>{title || 'Success'}</p>
        {message}
      </div>
    </div>
    , { toastId: 'request-toast', className: 'custom-toast-success', ...toastOptions })
};
