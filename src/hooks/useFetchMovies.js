import { useState, useEffect, useCallback } from "react";
import axios from "axios";

function useFetchMovies(page, genres, changeInGenre, setChangeInGenre) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [list, setList] = useState([]);

    const sendQuery = useCallback(async () => {
        try {
            if (changeInGenre) setList([]);
            await setLoading(true);
            await setError(false);
            const res = await axios.get(
                `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_genres=${genres}`
            );
            await setList((prev) => [
                ...new Set([...prev, ...res.data.results.map((d) => d)])
            ]);
            setLoading(false);
            setChangeInGenre(false);
        } catch (err) {
            setError(err);
        }
    }, [page, genres]);

    useEffect(() => {
        sendQuery();
    }, [sendQuery, page]);

    return { loading, error, list };
}

export default useFetchMovies;