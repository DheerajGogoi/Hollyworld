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
    Wrap,
    WrapItem
} from '@chakra-ui/react';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import Header from '../components/Header';
import axios from 'axios';
import { backdrop_url, poster_url_300 } from '../Utils';
import { AiFillYoutube } from "react-icons/ai";
import useGenre from '../hooks/useGenre';
import { FiMinusCircle } from "react-icons/fi";
import useFetchTvShows from '../hooks/useFetchTvShows';
import TvCard from '../components/TvCard';

export default function TvShows() {
    const { isOpen: tvIsOpen, onOpen: tvOnOpen, onClose: tvOnClose } = useDisclosure()

    const [isLoading, setIsLoading] = useState(false);
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [page, setPage] = useState(1);

    const [isMoreThan840] = useMediaQuery('(min-width: 840px)');
    const [isLessThan490] = useMediaQuery('(max-width: 490px)');
    const [isLessThan550] = useMediaQuery('(max-width: 550px)');
    const [isLessThan850] = useMediaQuery('(max-width: 850px)');

    const [selectedGenres, setSelectedGenres] = useState([]);
    const genres = useGenre(selectedGenres);
    // console.log(genres)
    const [genereList, setGenreList] = useState([]);
    const [changeInGenre, setChangeInGenre] = useState(false);

    const { loading, error, list } = useFetchTvShows(page, genres, changeInGenre, setChangeInGenre);
    // console.log('result', list);
    const loader = useRef(null);

    const handleObserver = useCallback((entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
            setPage((prev) => ++prev);
        }
    }, []);

    useEffect(() => {
        const fetchDets = () => {
            axios.get(`https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`)
            .then(result => {
                result = result.data;
                setGenreList(result.genres);
                // console.log(result.genres);
            })
            .catch(error => {
                console.log(error);
            })
        }
        fetchDets();
    }, [])

    useEffect(() => {
        const option = {
            root: null,
            rootMargin: "20px",
            threshold: 0
        };
        const observer = new IntersectionObserver(handleObserver, option);
        if (loader.current) observer.observe(loader.current);
    }, [handleObserver]);

    const [currentTv, setCurrentTv] = useState(null);
    const [fetchTvLoading, setFetchTvLoading] = useState(false);

    const fetchTvDetails = (id) => {
        setFetchTvLoading(true);
        axios.get(`https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`)
        .then((response) => {
            response = response.data;
            // console.log(response);
            axios.get(`https://api.themoviedb.org/3/tv/${id}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`)
                .then((result) => {
                    result = result.data;
                    // console.log({...response, trailer_videos: result.results});
                    setCurrentTv({...response, trailer_videos: result.results});
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => {
                    setFetchTvLoading(false);
                })
        })
        .catch(error => {
            console.log(error);
        })
    }

    const addGenre = (g) => {
        setGenreList(prev => prev.filter(gen => gen !== g));
        setSelectedGenres(prev => [...prev, g].sort((a,b) => a.name.localeCompare(b.name)));
        setPage(1);
        setChangeInGenre(true);
    }

    const removeGenre = (g) => {
        setSelectedGenres(prev => prev.filter(gen => gen !== g));
        setGenreList(prev => [...prev, g].sort((a,b) => a.name.localeCompare(b.name)));
        setPage(1);
        setChangeInGenre(true);
    }

    if(isLoading) return <Spinner
        thickness='4px'
        speed='0.65s'
        emptyColor='gray.200'
        color='#38B2AC'
        size='xl'
    />

    return (
        <Box textAlign='center' overflowX='hidden'>
            <Header />
            <Box
                className='tv-box'
                p={isLessThan490 ? 5 : 8}
                display='inline-block'
            >
                <Text fontSize={28} textAlign='left'>Tv Shows</Text>

                <Wrap spacing={2}>
                    {
                        selectedGenres.map((g) => <WrapItem>
                            <Button colorScheme='facebook' onClick={() => removeGenre(g)} position='relative'>
                                {g.name}
                                <Box color='black' borderRadius='full' bg='gray.100' p='5px' position='absolute' top='-5px' right='-5px'><FiMinusCircle fontSize='10px' /></Box>
                            </Button>
                        </WrapItem>)
                    }
                    {
                        genereList.map((g) => <WrapItem>
                            <Button colorScheme='green' onClick={() => addGenre(g)}>{g.name}</Button>
                        </WrapItem>)
                    }
                </Wrap>

                <Box
                    className='tending-tv-container'
                    marginTop={5}
                >
                    <SimpleGrid columns={[2, null, isMoreThan840 ? 4 : 3, null, 6]} gap={8}>
                        {
                            list && list.map(tv => tv.name && <TvCard tv={tv} tvOnOpen={tvOnOpen} setCurrentTv={setCurrentTv} fetchTvDetails={fetchTvDetails} />)
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
                    tvOnClose();
                    setCurrentTv(null);
                }} isOpen={tvIsOpen} isCentered>
                    <ModalOverlay />
                    <ModalContent maxWidth='none' width='80%' maxHeight={isLessThan850 ? '95%' : 'auto'}>
                        <ModalHeader></ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                        {fetchTvLoading && <Spinner
                            thickness='4px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='#38B2AC'
                            size='xl'
                        />}
                            {!fetchTvLoading && <Flex
                                flexDirection={isLessThan550 ? 'column' : 'row'}
                                gap='5'
                            >
                                <Box>
                                    <Image src={`${isLessThan550 ? backdrop_url : poster_url_300}${!isLessThan550 ? currentTv?.poster_path : currentTv?.backdrop_path}`} />
                                </Box>
                                <Box width='100%'>
                                    <Box textAlign='center'>
                                        <Text fontSize='3xl' fontWeight='bold'>{currentTv?.name}</Text>
                                        <Text fontStyle='italic'>{currentTv?.tagline}</Text>
                                    </Box>
                                    <Text mt='5'>{currentTv?.overview}</Text>

                                    <Box mt='3'>
                                        <UnorderedList>
                                            <ListItem><b>Release Date: </b>{currentTv?.first_air_date || currentTv?.release_date || "-----"}</ListItem>
                                            <ListItem><b>Genres: </b>{currentTv?.genres.map((gen, index) => `${gen.name}${index !== currentTv.genres.length - 1 ? ', ' : ''}`)}</ListItem>
                                            <ListItem><b>Duration: </b>{currentTv?.runtime} mins</ListItem>
                                            <ListItem><b>Vote: </b>{currentTv?.vote_average}</ListItem>
                                            <ListItem><b>Status: </b>{currentTv?.status}</ListItem>
                                        </UnorderedList>
                                    </Box>

                                    <Box mt='4'>
                                        {currentTv?.trailer_videos[0] ? <Link href={`https://www.youtube.com/watch?v=${currentTv?.trailer_videos[0]?.key}`} isExternal _hover={{ textDecoration: 'none' }}>
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
