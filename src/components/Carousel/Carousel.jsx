import './Carousel.scss';
import { Box, Button, Flex, HStack, Image, Text, Link, Spinner } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react';
import { StarIcon } from '@chakra-ui/icons';
import { poster_carousel } from '../../Utils';
import { RiThumbUpFill } from "react-icons/ri";
import { AiFillYoutube } from "react-icons/ai";
import black_bg from '../../img/black_bg.png';
import axios from 'axios';

const releaseDurr = (date) => {
    const b = new Date();
    const a = new Date(date);
    const value = Math.ceil((b-a) / (1000 * 60 * 60 * 24));
    var release;
    if(value > 397) {
        release = Math.round(value/365) + ' years ago';
    }
    else if(value > 31) {
        if(Math.round(value/30) === 1){
            release = Math.round(value/30) + ' month ago';
        } else {
            release = Math.round(value/30) + ' months ago';
        }
    } else if(value > 0) {
        release = value + " days ago";
    } else {
        release = 'No released yet'
    }
    return release;
}

export default function Carousel() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = () => {
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

    if(loading) return "";

    return (
        <Box>
            <div id="carouselExampleCaptions" className="carousel slide carousel-container" data-bs-ride="carousel">
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
                                        <Text color='#d1d5db'>{!loading && releaseDurr(data?.results[0]?.release_date)}</Text>
                                        <Text mt='6' fontWeight='bolder' fontSize='3rem'>
                                            {!loading && data?.results[0]?.title}
                                        </Text>
                                        <HStack gap='6' mt='6'>
                                            <Text alignSelf='center'>
                                                <StarIcon color='yellow' mr='2' /> {!loading && data?.results[0]?.vote_average}
                                            </Text>
                                            <Text alignSelf='center' background='white' p='2px' borderRadius='full'></Text>
                                            <Text>
                                                <RiThumbUpFill color='red' style={{ display: 'inline-block', marginRight: '10px' }} /> {!loading && data?.results[0]?.vote_count}
                                            </Text>
                                            <Text alignSelf='center' background='white' p='2px' borderRadius='full'></Text>
                                            <Text>
                                                {!loading && data?.results[0]?.original_language}
                                            </Text>
                                        </HStack>
                                        <Text mt='6'>
                                            {!loading && data?.results[0]?.overview}
                                        </Text>

                                        <Link href={`https://www.youtube.com/results?search_query=${data.length > 0 && data?.results[0]?.name}`} isExternal _hover={{ textDecoration: 'none' }}>
                                            <Button colorScheme='red' mt='6'>
                                                <AiFillYoutube color='white' fontSize='2rem' style={{ marginRight: '10px' }} />Watch Trailer
                                            </Button>
                                        </Link>
                                    </Box>
                                    <Box alignSelf='center'>
                                        <Image src={poster_carousel + `${!loading && data?.results[0]?.poster_path}`} alt='Poster image' borderRadius='lg' />
                                    </Box>
                                </Flex>
                            </Box>
                        </div>
                    </div>
                    {!loading && data?.results?.map((media, index) =>  index !== 0 && <CarouselItem media={media} key={index} />)}
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
                            <Text color='#d1d5db'>{releaseDurr(media.release_date)}</Text>
                            <Text mt='6' fontWeight='bolder' fontSize='3rem'>
                                {media.title}
                            </Text>
                            <HStack gap='6' mt='6'>
                                <Text alignSelf='center'>
                                    <StarIcon color='yellow' mr='2' /> {media.vote_average}
                                </Text>
                                <Text alignSelf='center' background='white' p='2px' borderRadius='full'></Text>
                                <Text>
                                    <RiThumbUpFill color='red' style={{ display: 'inline-block', marginRight: '10px' }} /> {media.vote_count}
                                </Text>
                                <Text alignSelf='center' background='white' p='2px' borderRadius='full'></Text>
                                <Text>
                                    {media.original_language}
                                </Text>
                            </HStack>
                            <Text mt='6'>
                                {media.overview}
                            </Text>

                            <Link href={`https://www.youtube.com/results?search_query=${media.name}`} isExternal _hover={{ textDecoration: 'none' }}>
                                <Button colorScheme='red' mt='6'>
                                    <AiFillYoutube color='white' fontSize='2rem' style={{ marginRight: '10px' }} />Watch Trailer
                                </Button>
                            </Link>
                        </Box>
                        <Box alignSelf='center'>
                            <Image src={poster_carousel + `${media.poster_path}`} alt='Poster image' borderRadius='lg' />
                        </Box>
                    </Flex>
                </Box>
            </div>
        </div>
    );
}