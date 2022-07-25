import { useState, useEffect, useCallback } from "react";
import axios from "axios";

function useFetchTrending(page) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [list, setList] = useState([]);

  const sendQuery = useCallback(async () => {
    try {
        await setLoading(true);
        await setError(false);
        const res = await axios.get(
            `https://api.themoviedb.org/3/trending/all/day?api_key=${process.env.REACT_APP_API_KEY}&page=${page}`
        );
        await setList((prev) => [
            ...new Set([...prev, ...res.data.results.map((d) => d)])
        ]);
        setLoading(false);
    } catch (err) {
        setError(err);
    }
  }, [page]);

    useEffect(() => {
        sendQuery();
    }, [sendQuery, page]);

    return { loading, error, list };
}

export default useFetchTrending;