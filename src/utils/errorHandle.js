import { toast } from "react-hot-toast";

const ErrorHandle = (err) => {
    const errData = err?.response?.data;
    for (let key in errData) {
        toast.error(errData[key])
    }
}

export default ErrorHandle;