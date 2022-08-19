import { Box, Image, Text, useMediaQuery } from '@chakra-ui/react';
import React from 'react';
import { img_unavailable, poster_url } from '../Utils';

export default function TvCard({ tv, tvOnOpen, setCurrentTv, fetchTvDetails }) {
    const [isLessThan490] = useMediaQuery('(max-width: 490px)');

    const tvOnClick = () => {
        tvOnOpen();
        setCurrentTv(tv);
        fetchTvDetails(tv.id);
    }
    return (
        <Box width={isLessThan490 ? 160 : 200}  cursor='pointer' _hover={{ opacity: '0.9' }} onClick={tvOnClick}>
            <Image src={tv.poster_path ? `${poster_url}${tv.poster_path}` : img_unavailable} alt='image' borderRadius='md' />
            <Text textAlign='center' mt='2'>{tv.name}</Text>
        </Box>
    )
}

// 
