import './Home.scss'
import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, GridItem, SimpleGrid, Spinner, Text, useMediaQuery } from '@chakra-ui/react';
import { ColorModeSwitcher } from '../../ColorModeSwitcher';
import Header from '../../components/Header';
import MovieCard from '../../components/MovieCard';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

export default function Home() {
    const [isLoading, setIsLoading] = useState(false);
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [page, setPage] = useState(1);

    const [isLessMore840] = useMediaQuery('(min-width: 840px)');
    const [isLessThan490] = useMediaQuery('(max-width: 490px)');

    const history = useHistory();

    useEffect(() => {
        const fetch = () => {
            setIsLoading(true);
            axios.get(`https://api.themoviedb.org/3/trending/all/day?api_key=${process.env.REACT_APP_API_KEY}&page=${page}`)
            .then((result) => {
                result = result.data;
                console.log(result);
                setTrendingMovies(result);
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                setIsLoading(false);
            })
        }
        fetch()
    }, []);

    if(isLoading) return <Spinner
        thickness='4px'
        speed='0.65s'
        emptyColor='gray.200'
        color='blue.500'
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
                            trendingMovies.results && trendingMovies.results.map(movie => <MovieCard movie={movie} />)
                        }
                    </SimpleGrid>
                </Box>
            </Box>
        </Box>
    )
}
