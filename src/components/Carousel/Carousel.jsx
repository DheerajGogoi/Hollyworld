import './Carousel.scss';
import { Box, Button, Flex, HStack, Image, Text, useMediaQuery, Link } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react';
import { StarIcon } from '@chakra-ui/icons';
import { poster_carousel } from '../../Utils';
import { RiThumbUpFill } from "react-icons/ri";
import { AiFillYoutube } from "react-icons/ai";
import black_bg from '../../img/black_bg.png';
import axios from 'axios';

export default function Carousel() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = () => {
            setLoading(true);
            axios.get(`https://api.themoviedb.org/3/trending/all/day?api_key=${process.env.REACT_APP_API_KEY}&page=1`)
            .then((result) => {
                result = result.data;
                console.log('this is the result', result);
                setData(result);
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                setLoading(false);
            })
        }
        fetchData();
    }, [])

    if(loading) return <h1>Loading....</h1>

    return (
        <Box>
            <div id="carouselExampleCaptions" className="carousel slide carousel-container" data-bs-ride="false">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src={black_bg} className="d-block w-100 carousel-img" alt="..." style={{
                            opacity: '0.1',
                            margin: 'auto',
                        }} />
                        <div className="carousel-caption d-none d-md-block carousel-content">
                            <Box>
                                <Flex direction='row' gap='5'>
                                    <Box alignSelf='center'>
                                        <Text color='#d1d5db'>2 months ago</Text>
                                        <Text mt='6' fontWeight='bolder' fontSize='3rem'>
                                            {!loading && data && data?.results[0]?.name}
                                        </Text>
                                        <HStack gap='6' mt='6'>
                                            <Text alignSelf='center'>
                                                <StarIcon color='yellow' mr='2' /> {!loading && data && data?.results[0]?.vote_average}
                                            </Text>
                                            <Text alignSelf='center' background='white' p='2px' borderRadius='full'></Text>
                                            <Text>
                                                <RiThumbUpFill color='red' style={{ display: 'inline-block', marginRight: '10px' }} /> {!loading && data && data?.results[0]?.vote_count}
                                            </Text>
                                            <Text alignSelf='center' background='white' p='2px' borderRadius='full'></Text>
                                            <Text>
                                                {data?.results[0]?.original_language}
                                            </Text>
                                        </HStack>
                                        <Text mt='6'>
                                            {data?.results[0]?.overview}
                                        </Text>

                                        <Link href={`https://www.youtube.com/results?search_query=${data?.results[0]?.name}`} isExternal _hover={{ textDecoration: 'none' }}>
                                            <Button colorScheme='red' mt='6'>
                                                <AiFillYoutube color='white' fontSize='2rem' style={{ marginRight: '10px' }} />Watch Trailer
                                            </Button>
                                        </Link>
                                    </Box>
                                    <Box alignSelf='center'>
                                        <Image src={poster_carousel + 'iRV0IB5xQeOymuGGUBarTecQVAl.jpg'} alt='Poster image' borderRadius='lg' />
                                    </Box>
                                </Flex>
                            </Box>
                        </div>
                    </div>
                    {!loading && data && data?.results?.map((media, index) =>  index !== 0 && <CarouselItem media={media} key={index} />)}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </Box>
    )
}

const CarouselItem = ({ media }) => {
    return(
        <div className="carousel-item">
            <img src={black_bg} className="d-block w-100 carousel-img" alt="..." style={{
                opacity: '0.1',
                margin: 'auto',
            }} />
            <div className="carousel-caption d-none d-md-block carousel-content">
                <Box>
                    <Flex direction='row' gap='5'>
                        <Box alignSelf='center'>
                            <Text color='#d1d5db'>2 months ago</Text>
                            <Text mt='6' fontWeight='bolder' fontSize='3rem'>Where the Crawdads Sing</Text>
                            <HStack gap='6' mt='6'>
                                <Text alignSelf='center'>
                                    <StarIcon color='yellow' mr='2' /> 7.6
                                </Text>
                                <Text alignSelf='center' background='white' p='2px' borderRadius='full'></Text>
                                <Text>
                                    <RiThumbUpFill color='red' style={{ display: 'inline-block', marginRight: '10px' }} /> 7.6
                                </Text>
                                <Text alignSelf='center' background='white' p='2px' borderRadius='full'></Text>
                                <Text>
                                    English
                                </Text>
                            </HStack>
                            <Text mt='6'>
                                {media.overview}
                            </Text>

                            <Link href={`https://www.youtube.com`} isExternal _hover={{ textDecoration: 'none' }}>
                                <Button colorScheme='red' mt='6'>
                                    <AiFillYoutube color='white' fontSize='2rem' style={{ marginRight: '10px' }} />Watch Trailer
                                </Button>
                            </Link>
                        </Box>
                        <Box alignSelf='center'>
                            <Image src={poster_carousel + 'iRV0IB5xQeOymuGGUBarTecQVAl.jpg'} alt='Poster image' borderRadius='lg' />
                        </Box>
                    </Flex>
                </Box>
            </div>
        </div>
    );
}