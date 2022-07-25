import { Box, Image, Text, useMediaQuery } from '@chakra-ui/react';
import React from 'react';
import { img_unavailable, poster_url } from '../Utils';

export default function MovieCard({ movie }) {
    const [isLessThan490] = useMediaQuery('(max-width: 490px)');
    return (
        <Box width={isLessThan490 ? 160 : 200}>
            <Image src={movie.poster_path ? `${poster_url}${movie.poster_path}` : img_unavailable} alt='image' borderRadius='md' />
            <Text textAlign='center'>{movie.title}</Text>
        </Box>
    )
}

// 
