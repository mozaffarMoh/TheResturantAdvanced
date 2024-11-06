import { useState } from "react";
import { usePathname } from "next/navigation";
import axios from 'axios'

const usePost = (endPoint: string, body: any): any => {
    const pathname = usePathname();
    const langCurrent = pathname?.slice(1, 3) || 'en';
    const headers = {
        'Content-Type': 'application/json',
        'Accept-Language': langCurrent || 'en', // Set the Accept-Language header
    }
    const [data, setData] = useState<any>([]);
    const [fullData, setFullData] = useState<any>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const handlePost = () => {
        setSuccessMessage("");
        setErrorMessage("")
        setSuccess(false);
        setLoading(true);
        axios
            .post(endPoint, body, { headers })
            .then((res: any) => {
                setSuccess(true);
                setLoading(false);
                setData(res.data?.data);
                setFullData(res.data)
                setSuccessMessage(res.data?.message)
                setTimeout(() => {
                    setSuccessMessage("")
                }, 3000);
            })
            .catch((err: any) => {
                setLoading(false);
                console.log(err);

                setFullData(err.response?.data)
                setErrorMessage(err.response?.data?.message)
                setTimeout(() => {
                    setFullData([])
                    setErrorMessage("")
                }, 3000);
            })
    };

    return [data, loading, handlePost, success, successMessage, errorMessage, setData, fullData];
};

export default usePost;
