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
    HStack
} from '@chakra-ui/react';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaGithub, FaGlobe } from "react-icons/fa";

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    return (
        <Box
            bg='#38B2AC'
            w='100%'
            p={4}
            textAlign='center'
            className='header-box'
            position='relative'
        >
            <Text fontSize={36} fontWeight={500} color='white'>MOVIELUX</Text>
            <Text fontStyle='italic' color='white'>Find Movies, TV shows and more</Text>
            <Box position='absolute' right='20px' top='20px'>
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

            <Box mt='2'>
                <HStack justifyContent='center' gap='1'>
                    <IconButton aria-label='Search database' icon={<FaGithub style={{ fontSize: '1.5rem', color: 'white' }} />} borderRadius='full' background='transparent' _hover={{ background: 'transparent' }} onClick={() => window.open('https://github.com/DheerajGogoi/Movielux.git')} />
                    <IconButton aria-label='Search database' icon={<FaGlobe style={{ fontSize: '1.5rem', color: 'white' }} />} borderRadius='full' background='transparent' _hover={{ background: 'transparent' }} onClick={() => window.open('https://dheerajgogoi.netlify.app')} />
                </HStack>
            </Box>
        </Box>
    )
}
