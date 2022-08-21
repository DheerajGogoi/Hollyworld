import { useState, useEffect, useCallback } from "react";
import axios from "axios";

function useFetchSearch(page, query, baseUrl, mediaList, setMediaList) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [list, setList] = useState([]);

    const sendQuery = useCallback(async () => {
        try {
            if (page > 1 && query){
                await setLoading(true);
                await setError(false);
                const res = await axios.get(
                    `${baseUrl}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&query=${query}&page=${page}&include_adult=false`
                );
                await setMediaList((prev) => [
                    ...new Set([...prev, ...res.data.results.map((d) => d)])
                ]);
            }
            setLoading(false);
        } catch (err) {
            setError(err);
        }
    }, [page, baseUrl]);

    useEffect(() => {
        sendQuery();
    }, [sendQuery, page]);

    return { loading, error, list };
}

export default useFetchSearch;