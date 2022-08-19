import { Box, Image, Text, useMediaQuery } from '@chakra-ui/react';
import React from 'react';
import { img_unavailable, poster_url } from '../Utils';

export default function MovieCard({ movie, movieOnOpen, setCurrentMovie, fetchMovieDetails }) {
    const [isLessThan490] = useMediaQuery('(max-width: 490px)');

    const movieOnClick = () => {
        movieOnOpen();
        setCurrentMovie(movie);
        fetchMovieDetails(movie.id);
    }
    return (
        <Box width={isLessThan490 ? 160 : 200}  cursor='pointer' _hover={{ opacity: '0.9' }} onClick={movieOnClick}>
            <Image src={movie.poster_path ? `${poster_url}${movie.poster_path}` : img_unavailable} alt='image' borderRadius='md' />
            <Text textAlign='center' mt='2'>{movie.title}</Text>
        </Box>
    )
}

// 
