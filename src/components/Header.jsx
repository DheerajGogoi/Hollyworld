import { HamburgerIcon } from '@chakra-ui/icons';
import {
    Box,
    Text,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    IconButton,
    Divider,
    HStack,
    Flex,
    Spacer,
    useMediaQuery
} from '@chakra-ui/react';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaGithub, FaGlobe, FaPlayCircle } from "react-icons/fa";

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLessThan730] = useMediaQuery('(max-width: 730px)')
    return (
        <Box
            w='100%'
            p={4}
            textAlign='center'
            className='header-box'
            position='relative'
            color='white'
        >
            <Flex
                direction='row'
                gap='2'
            >
                <IconButton aria-label='Search database' icon={<FaPlayCircle style={{ fontSize: '1.5rem', color: 'white' }} />} borderRadius='full' background='transparent' _hover={{ background: 'transparent' }} alignSelf='center' />
                <Text fontSize={26} fontWeight={500} color='white' alignSelf='center'>HOLLYWORLD</Text>

                <Spacer />
                
                {isLessThan730 && <MenuDropDown />}

                {!isLessThan730 && <HStack gap='4' mr='4'>
                    <Text cursor='pointer' fontWeight={location.pathname === '/' ? 'bold' : 'normal'} _hover={{ color: '#FF3F3F' }} transition='0.3s ease' onClick={() => navigate('/')}>
                        Home
                    </Text>
                    <Text cursor='pointer' fontWeight={location.pathname === '/movies' ? 'bold' : 'normal'} _hover={{ color: '#FF3F3F' }} transition='0.3s ease' onClick={() => navigate('/movies')}>
                        Movies
                    </Text>
                    <Text cursor='pointer' fontWeight={location.pathname === '/tvshows' ? 'bold' : 'normal'} _hover={{ color: '#FF3F3F' }} transition='0.3s ease' onClick={() => navigate('/tvshows')}>
                        TV Shows
                    </Text>
                    <Text cursor='pointer' fontWeight={location.pathname === '/search' ? 'bold' : 'normal'} _hover={{ color: '#FF3F3F' }} transition='0.3s ease' onClick={() => navigate('/search')}>
                        Search
                    </Text>
                </HStack>}

                {!isLessThan730 && <Box border='1px solid white' p='1' borderRadius='10'>
                    <IconButton aria-label='Search database' icon={<FaGithub style={{ fontSize: '1.5rem', color: 'white' }} />} borderRadius='full' background='transparent' _hover={{ background: 'transparent' }} onClick={() => window.open('https://github.com/DheerajGogoi/Hollyworld.git')} />
                    <IconButton aria-label='Search database' icon={<FaGlobe style={{ fontSize: '1.5rem', color: 'white' }} />} borderRadius='full' background='transparent' _hover={{ background: 'transparent' }} onClick={() => window.open('https://dheerajgogoi.netlify.app')} />
                </Box>}

            </Flex>
        </Box>
    )
}

const MenuDropDown = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Box alignSelf='center'>
            <Menu>
                <MenuButton
                    as={IconButton}
                    aria-label='Options'
                    icon={<HamburgerIcon />}
                    variant='outline'
                    color='white'
                    _hover={{ background: 'transparent' }}
                />
                <MenuList color='black'>
                    <MenuItem fontWeight={location.pathname === '/' ? 'bold' : 'normal'} onClick={() => navigate('/')}>
                        Home
                    </MenuItem>
                    <MenuItem fontWeight={location.pathname === '/movies' ? 'bold' : 'normal'} onClick={() => navigate('/movies')}>
                        Movies
                    </MenuItem>
                    <MenuItem fontWeight={location.pathname === '/tvshows' ? 'bold' : 'normal'} onClick={() => navigate('/tvshows')}>
                        TV Shows
                    </MenuItem>
                    <Divider />
                    <MenuItem fontWeight={location.pathname === '/search' ? 'bold' : 'normal'} onClick={() => navigate('/search')}>
                        Search
                    </MenuItem>
                </MenuList>
            </Menu>
        </Box>
    )
}
