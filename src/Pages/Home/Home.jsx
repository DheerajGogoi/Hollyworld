import './Home.scss'
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Box, Container, Grid, GridItem, SimpleGrid, Spinner, Text, useMediaQuery } from '@chakra-ui/react';
import { ColorModeSwitcher } from '../../ColorModeSwitcher';
import Header from '../../components/Header';
import MovieCard from '../../components/MovieCard';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import useFetchTrending from '../../hooks/useFetchTrending';

export default function Home() {
    const [isLoading, setIsLoading] = useState(false);
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [page, setPage] = useState(1);

    const [isLessMore840] = useMediaQuery('(min-width: 840px)');
    const [isLessThan490] = useMediaQuery('(max-width: 490px)');

    const history = useHistory();
    const { loading, error, list } = useFetchTrending(page);
    const loader = useRef(null);

    const handleObserver = useCallback((entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
            setPage((prev) => prev + 1);
        }
    }, []);

    useEffect(() => {
        const option = {
            root: null,
            rootMargin: "20px",
            threshold: 0
        };
        const observer = new IntersectionObserver(handleObserver, option);
        if (loader.current) observer.observe(loader.current);
    }, [handleObserver]);

    if(isLoading) return <Spinner
        thickness='4px'
        speed='0.65s'
        emptyColor='gray.200'
        color='#38B2AC'
        size='xl'
    />

    return (
        <Box textAlign='center'>
            <Header />
            <Box
                className='trending-box'
                p={isLessThan490 ? 5 : 8}
                display='inline-block'
            >
                <Text fontSize={28} textAlign='left'>Trending Today</Text>

                <Box
                    className='tending-movies-container'
                    marginTop={5}
                >
                    <SimpleGrid columns={[2, null, isLessMore840 ? 4 : 3, null, 6]} gap={8}>
                        {
                            list && list.map(movie => <MovieCard movie={movie} />)
                        }
                    </SimpleGrid>
                </Box>

                {loading && <Spinner
                    thickness='4px'
                    speed='0.65s'
                    emptyColor='gray.200'
                    color='#38B2AC'
                    size='xl'
                />}
                {error && <p>Error!</p>}
                <div ref={loader} />

            </Box>
        </Box>
    )
}
