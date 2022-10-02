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
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Input,
    IconButton
} from '@chakra-ui/react';
import axios from 'axios';
import { backdrop_url, img_unavailable, poster_url_300 } from '../Utils';
import { AiFillYoutube } from "react-icons/ai";
import useFetchSearch from '../hooks/useFetchSearch';
import MovieCard from '../components/MovieCard';
import TvCard from '../components/TvCard';
import Header from '../components/Header';
import { SearchIcon } from '@chakra-ui/icons'

export default function Search() {
    const { isOpen: mediaIsOpen, onOpen: mediaOnOpen, onClose: mediaOnClose } = useDisclosure()

    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);

    const [isMoreThan840] = useMediaQuery('(min-width: 840px)');
    const [isLessThan490] = useMediaQuery('(max-width: 490px)');
    const [isLessThan550] = useMediaQuery('(max-width: 550px)');
    const [isLessThan850] = useMediaQuery('(max-width: 850px)');

    const [searchText, setSearchText] = useState("a");
    const [query, setQuery] = useState("");
    const [type, setType] = useState('movie');
    const [newSearch, setNewSearch] = useState(false);
    const [baseUrl, setBaseUrl] = useState('');

    const [mediaList, setMediaList] = useState([]);

    const { loading, error, list } = useFetchSearch(page, query, baseUrl, mediaList, setMediaList);
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

    const [currentMedia, setCurrentMedia] = useState(null);
    const [fetchMediaLoading, setFetchMediaLoading] = useState(false);

    const fetchMedia = async (media_type) => {
        if(searchText || query){
            setIsLoading(true);
            setBaseUrl(`https://api.themoviedb.org/3/search/${media_type ? media_type : type}`);
            axios.get(
                `https://api.themoviedb.org/3/search/${media_type ? media_type : type}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US&query=${media_type ? query : searchText}&page=1&include_adult=false`
            )
            .then(response => {
                // console.log(response.config.url);
                response = response.data;
                // console.log('Fetch data', response);
                setMediaList(response.results);
            })
            .catch(e => {
                console.log(e.message);
            }).finally(() => {
                setIsLoading(false);
            })
        }
    };

    const fetchMediaDetails = (id) => {
        setFetchMediaLoading(true);
        axios.get(`https://api.themoviedb.org/3/${type}/${id}?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`)
        .then((response) => {
            response = response.data;
            console.log(response);
            axios.get(`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=en-US`)
                .then((result) => {
                    result = result.data;
                    // console.log({...response, trailer_videos: result.results});
                    setCurrentMedia({...response, trailer_videos: result.results});
                })
                .catch(err => {
                    console.log(err);
                })
                .finally(() => {
                    setFetchMediaLoading(false);
                })
        })
        .catch(error => {
            console.log(error);
        })
    }

    const onSearch = (e) => {
        e.preventDefault();
        // console.log(e.target.value);
        if(searchText){
            setNewSearch(true);
            fetchMedia(); //take media_type to be the current value of "type"
            setQuery(searchText);
            setPage(1);
            setMediaList([]);
        }
    }

    return (
        <Box overflowX='hidden' background='#080808' color='white'>
            <Header />
            <Box
                className='trending-box'
                p={isLessThan490 ? 5 : 8}
                display='inline-block'
                width='100%'
            >
                <form onSubmit={onSearch}>
                    <Flex gap='2'>
                        <Input placeholder='Search Keywords' name='search_media' onChange={(e) => setSearchText(e.target.value)} />
                        <IconButton
                            type='submit'
                            colorScheme='green'
                            bg='#38B2AC'
                            aria-label='Search database'
                            icon={<SearchIcon />}
                        />
                    </Flex>
                </form>
                <Tabs mt='5'>
                    <TabList>
                        <Tab onClick={() => {
                            setType('movie');
                            if(type !== "movie"){
                                setPage(1);
                                setMediaList([]);
                                fetchMedia('movie');
                            } //fetchMedia function is executed again as the tab changed
                        }}>Movies</Tab>
                        <Tab onClick={() => {
                            setType('tv');
                            if(type !== "tv"){
                                setPage(1);
                                setMediaList([]);
                                fetchMedia('tv');
                            } //fetchMedia function is executed again as the tab changed
                        }}>Tv Shows</Tab>
                    </TabList>

                    <TabPanels>
                        {isLoading && <Spinner
                            thickness='4px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='#38B2AC'
                            size='xl'
                            mt={3}
                        />}
                        {!isLoading && <TabPanel>
                            <Text fontSize={28} textAlign='left' mt={2} borderLeft='10px solid red' paddingLeft='10px'>Movies</Text>

                            <Box
                                className='tending-movies-container'
                                marginTop={5}
                            >
                                <SimpleGrid columns={[2, null, isMoreThan840 ? 4 : 3, null, 6]} gap={8}>
                                    {
                                        type === 'movie' && mediaList && mediaList.map((movie, idx) => movie.title && <MovieCard key={idx} movie={movie} movieOnOpen={mediaOnOpen} setCurrentMovie={setCurrentMedia} fetchMovieDetails={fetchMediaDetails} />)
                                    }
                                </SimpleGrid>
                            </Box>
                        </TabPanel>}
                        {!isLoading && <TabPanel>
                            <Text fontSize={28} textAlign='left' mt={2} borderLeft='10px solid red' paddingLeft='10px'>Tv Shows</Text>

                            <Box
                                className='tending-movies-container'
                                marginTop={5}
                            >
                                <SimpleGrid columns={[2, null, isMoreThan840 ? 4 : 3, null, 6]} gap={8}>
                                    {
                                        type === 'tv' && mediaList && mediaList.map((tv, idx) => tv.name && <TvCard key={idx} tv={tv} tvOnOpen={mediaOnOpen} setCurrentTv={setCurrentMedia} fetchTvDetails={fetchMediaDetails} />)
                                    }
                                </SimpleGrid>
                            </Box>
                        </TabPanel>}
                    </TabPanels>
                </Tabs>

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
                    mediaOnClose();
                    setCurrentMedia(null);
                }} isOpen={mediaIsOpen} isCentered>
                    <ModalOverlay />
                    <ModalContent maxWidth='none' width='80%' maxHeight={isLessThan850 ? '95%' : 'auto'} overflowY='scroll'>
                        <ModalHeader></ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                        {fetchMediaLoading && <Spinner
                            thickness='4px'
                            speed='0.65s'
                            emptyColor='gray.200'
                            color='#38B2AC'
                            size='xl'
                        />}
                            {!fetchMediaLoading && <Flex
                                flexDirection={isLessThan550 ? 'column' : 'row'}
                                gap='5'
                            >
                                <Box>
                                    <Image src={`${currentMedia?.poster_path ? isLessThan550 ? backdrop_url : poster_url_300 : img_unavailable}${currentMedia?.poster_path ? !isLessThan550 ? currentMedia?.poster_path : currentMedia?.backdrop_path : ''}`} />
                                </Box>
                                <Box width='100%'>
                                    <Box textAlign='center'>
                                        <Text fontSize='3xl' fontWeight='bold'>{currentMedia?.title || currentMedia?.name}</Text>
                                        <Text fontStyle='italic'>{currentMedia?.tagline}</Text>
                                    </Box>
                                    <Text mt='5'>{currentMedia?.overview}</Text>

                                    <Box mt='3'>
                                        <UnorderedList>
                                            <ListItem><b>Release Date: </b>{currentMedia?.first_air_date || currentMedia?.release_date || "-----"}</ListItem>
                                            <ListItem><b>Genres: </b>{currentMedia?.genres.map((gen, index) => `${gen.name}${index !== currentMedia.genres.length - 1 ? ', ' : ''}`)}</ListItem>
                                            <ListItem><b>Duration: </b>{currentMedia?.runtime} mins</ListItem>
                                            <ListItem><b>Vote: </b>{currentMedia?.vote_average}</ListItem>
                                            {type === 'tv' && <ListItem><b>Status: </b>{currentMedia?.status}</ListItem>}
                                        </UnorderedList>
                                    </Box>

                                    <Box mt='4'>
                                        {currentMedia?.trailer_videos[0] ? <Link href={`https://www.youtube.com/watch?v=${currentMedia?.trailer_videos[0]?.key}`} isExternal _hover={{ textDecoration: 'none' }}>
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