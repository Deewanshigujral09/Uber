import React, { useContext, useEffect, useState } from "react";
import { CaptainDataContext } from "../context/CaptainContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CaptainProtectWrapper = ({ children }) => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const { captain, setCaptain } = useContext(CaptainDataContext);
    const [isLoading, setIsLoading] = useState(true);

    // ✅ FIX 3: axios moved inside useEffect
    useEffect(() => {
        if (!token) {
            navigate("/captain-login");
            return;
        }

        axios
            .get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                if (response.status === 200) {
                    const data = response.data;
                    setCaptain(data.captain);
                    setIsLoading(false);
                }
            })
            .catch((err) => {
                console.log(err);
                localStorage.removeItem("token");
                navigate("/captain-login");
            });
    }, [token]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
};

// ✅ FIX 4: correct export
export default CaptainProtectWrapper;
