import './Home.scss'
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
    Box,
    Container,
    Grid,
    GridItem,
    SimpleGrid,
    Spinner,
    Text,
    useMediaQuery,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    Image,
    Flex,
    Link,
    HStack,
    List,
    ListItem,
    ListIcon,
    OrderedList,
    UnorderedList,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from '../../ColorModeSwitcher';
import Header from '../../components/Header';
import MovieCard from '../../components/MovieCard';
import axios from 'axios';
import useFetchTrending from '../../hooks/useFetchTrending';
import { backdrop_url, poster_url_300 } from '../../Utils';
import { AiFillYoutube } from "react-icons/ai";
import { FaPlayCircle } from "react-icons/fa";

export default function Home() {
    const { isOpen: movieIsOpen, onOpen: movieOnOpen, onClose: movieOnClose } = useDisclosure()

    const [isLoading, setIsLoading] = useState(false);
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [page, setPage] = useState(1);

    const [isMoreThan840] = useMediaQuery('(min-width: 840px)');
    const [isLessThan490] = useMediaQuery('(max-width: 490px)');
    const [isLessThan550] = useMediaQuery('(max-width: 550px)');
    const [isLessThan850] = useMediaQuery('(max-width: 850px)');

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

    const [currentMovie, setCurrentMovie] = useState(null);
    const [fetchMovieLoading, setFetchMovieLoading] = useState(false);

    const fetchMovieDetails = (id) => {
        setFetchMovieLoading(true);
        axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`)
        .then((response) => {
            response = response.data;
            // console.log(response);
            axios.get(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`)
                .then((result) => {
                    result = result.data;
                    // console.log({...response, trailer_videos: result.results});
                    setCurrentMovie({...response, trailer_videos: result.results});
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => {
                    setFetchMovieLoading(false);
                })
        })
        .catch(error => {
            console.log(error);
        })
    }

    if(isLoading) return <Spinner
        thickness='4px'
        speed='0.65s'
        emptyColor='gray.200'
        color='#38B2AC'
        size='xl'
    />

    return (
        <Box textAlign='center' overflowX='hidden' background='#080808' color='white'>
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
                    <SimpleGrid columns={[2, null, isMoreThan840 ? 4 : 3, null, 6]} gap={8}>
                        {
                            list && list.map(movie => movie.title && <MovieCard movie={movie} movieOnOpen={movieOnOpen} setCurrentMovie={setCurrentMovie} fetchMovieDetails={fetchMovieDetails} />)
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
            <>
                <Modal onClose={() => {
                    movieOnClose();
                    setCurrentMovie(null);
                }} isOpen={movieIsOpen} isCentered>
                    <ModalOverlay />
                    <ModalContent maxWidth='none' width='80%' maxHeight={isLessThan850 ? '95%' : 'auto'}>
                        <ModalHeader></ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                        {fetchMovieLoading && <Spinner
                            thickness='4px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='#38B2AC'
                            size='xl'
                        />}
                            {!fetchMovieLoading && <Flex
                                flexDirection={isLessThan550 ? 'column' : 'row'}
                                gap='5'
                            >
                                <Box>
                                    <Image src={`${isLessThan550 ? backdrop_url : poster_url_300}${!isLessThan550 ? currentMovie?.poster_path : currentMovie?.backdrop_path}`} />
                                </Box>
                                <Box width='100%'>
                                    <Box textAlign='center'>
                                        <Text fontSize='3xl' fontWeight='bold'>{currentMovie?.title}</Text>
                                        <Text fontStyle='italic'>{currentMovie?.tagline}</Text>
                                    </Box>
                                    <Text mt='5'>{currentMovie?.overview}</Text>

                                    <Box mt='3'>
                                        <UnorderedList>
                                            <ListItem><b>Release Date: </b>{currentMovie?.first_air_date || currentMovie?.release_date || "-----"}</ListItem>
                                            <ListItem><b>Genres: </b>{currentMovie?.genres.map((gen, index) => `${gen.name}${index !== currentMovie.genres.length - 1 ? ', ' : ''}`)}</ListItem>
                                            <ListItem><b>Duration: </b>{currentMovie?.runtime} mins</ListItem>
                                            <ListItem><b>Vote: </b>{currentMovie?.vote_average}</ListItem>
                                        </UnorderedList>
                                    </Box>

                                    <Box mt='4'>
                                        {currentMovie?.trailer_videos[0] ? <Link href={`https://www.youtube.com/watch?v=${currentMovie?.trailer_videos[0]?.key}`} isExternal _hover={{ textDecoration: 'none' }}>
                                            <Button colorScheme='red'>
                                                <AiFillYoutube color='white' fontSize='2rem' style={{ marginRight: '10px' }} />Watch Trailer
                                            </Button>
                                        </Link> : <Button colorScheme='red'>
                                            Trailer Not Available
                                        </Button>}
                                    </Box>
                                </Box>
                            </Flex>}
                        </ModalBody>
                        <ModalFooter>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </>
        </Box>
    )
}
