import { useState } from "react";
import axios from "axios";
import { usePathname } from "next/navigation";

const useDelete = (endPoint: string, body: any): any => {
    const pathname = usePathname();
    const langCurrent = pathname?.slice(1, 3) || 'en';
    const headers = {
        'Content-Type': 'application/json',
        'Accept-Language': langCurrent || 'en', // Set the Accept-Language header
    }
    const [data, setData] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const handleDelete = () => {
        setSuccessMessage("");
        setErrorMessage("")
        setSuccess(false);
        setLoading(true);
        axios
            .delete(endPoint, {headers, data: body })
            .then((res: any) => {
                setSuccess(true);
                setLoading(false);
                setData(res.data?.data);
                setSuccessMessage(res.data?.message)
                setTimeout(() => {
                    setSuccessMessage("")
                }, 3000);
            })
            .catch((err: any) => {
                setLoading(false);
                setErrorMessage(err.response?.data?.message)
                console.log(err);

                setTimeout(() => {
                    setErrorMessage("")
                }, 3000);
            })
    };

    return [data, loading, handleDelete, success, successMessage, errorMessage];
};

export default useDelete;
