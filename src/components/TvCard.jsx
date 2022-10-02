import { StarIcon } from '@chakra-ui/icons';
import { Box, Image, Text, useMediaQuery, Flex, Spacer } from '@chakra-ui/react';
import React from 'react';
import { img_unavailable, poster_url } from '../Utils';

export default function TvCard({ tv, tvOnOpen, setCurrentTv, fetchTvDetails }) {
    const [isLessThan490] = useMediaQuery('(max-width: 490px)');

    const tvOnClick = () => {
        tvOnOpen();
        setCurrentTv(tv);
        fetchTvDetails(tv.id);
    }

    const releaseDurr = (date) => {
        const b = new Date();
        const a = new Date(date);
        const value = Math.ceil((b-a) / (1000 * 60 * 60 * 24));
        var release;
        if(value > 397) {
            release = Math.round(value/365) + ' years ago';
        }
        else if(value > 31) {
            release = Math.round(value/30) + ' months ago';
        } else if(value > 0) {
            release = value + " days ago";
        } else {
            release = 'No released yet'
        }
        return release;
    }
    return (
        <Box width={isLessThan490 ? 160 : 200}  cursor='pointer' _hover={{ opacity: '0.9' }} onClick={tvOnClick}>
            <Image src={tv.poster_path ? `${poster_url}${tv.poster_path}` : img_unavailable} alt='image' borderRadius='md' />
            <Text textAlign='center' mt='2'>{tv.name.length > 20 ? tv.name.substring(0, 20) + '...' : tv.name}</Text>
            <Flex color='#9ca3af' mt='1' direction='row' gap='1'>
                <Text textAlign='center' fontSize='smaller' alignItems='center'>{releaseDurr(tv.first_air_date)}</Text>
                <Spacer />
                <StarIcon fontSize='small' alignItems='center' color='yellow' />
                <Text textAlign='center' fontSize='smaller' alignItems='center'>{Math.round(tv.vote_average * 10) / 10}</Text>
            </Flex>
        </Box>
    )
}

// 
