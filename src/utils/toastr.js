import { toast } from "vue3-toastify";
import 'vue3-toastify/dist/index.css';

export const toastr = {
    success(message) {
        toast.success(message, {
            theme: "colored",
            dangerouslyHTMLString: true,
            autoClose: 3000,
            hideProgressBar: false,
            position: "bottom-right",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        });
    },
    error(message) {
        toast.error(message, {
            theme: "colored",
            dangerouslyHTMLString: true,
            autoClose: 3000,
            hideProgressBar: false,
            position: "bottom-right",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        });
    },
    warning(message) {
        toast.warning(message, {
            theme: "colored",
            dangerouslyHTMLString: true,
            autoClose: 3000,
            hideProgressBar: false,
            position: "bottom-right",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        });
    },
    info(message) {
        toast.info(message, {
            theme: "colored",
            dangerouslyHTMLString: true,
            autoClose: 3000,
            hideProgressBar: false,
            position: "bottom-right",
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        });
    },
};
