import { Box, Text } from '@chakra-ui/react';
import React from 'react';

export default function Header() {
    return (
        <Box
            bg='#38B2AC'
            w='100%'
            p={4}
            color='white'
            textAlign='center'
            className='header-box'
        >
            <Text fontSize={36} fontWeight={500}>MOVIELUX</Text>
            <Text fontStyle='italic'>Find Movies, TV shows and more</Text>
        </Box>
    )
}
