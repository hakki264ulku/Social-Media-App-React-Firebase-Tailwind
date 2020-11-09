import React, { useState, useEffect } from 'react'
import tw from 'twin.macro'
import 'twin.macro'
import {
    Link
} from 'react-router-dom'
import { faSignOutAlt, faHome, faPlus, faBell, faHeart, faComment, } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Popup from 'reactjs-popup'

import { logout } from '../Services/AuthServices'
import { getNotifications, clearNotifications } from '../Services/UserServices'
import firebase from '../firebase'

function NavBar({ openModal }, props) {

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [notifications, setNotifications] = useState([])

    // Set user login state
    useEffect(() => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                setIsLoggedIn(true)
            } else setIsLoggedIn(false)
        });
    }, [])

    //Get unread notifications
    useEffect(() => {
        async function fetchNotifications() {
            const notifications = await getNotifications()
            if (!notifications) return
            setNotifications(notifications)
        }
        fetchNotifications()
    }, [])

    return (
        <NavContainer>
            {!isLoggedIn &&
                <Group>
                    <Link to='/login'>
                        <NavButton>LOGIN</NavButton>
                    </Link>
                    <Link to='/'>
                        <NavButton>HOME</NavButton>
                    </Link>
                    <Link to='/signUp'>
                        <NavButton>SIGN UP</NavButton>
                    </Link>
                </Group>
            }

            {isLoggedIn &&
                <Group>

                    <Popup trigger={open => (
                        <IconButton onClick={() => openModal()}>
                            <Icon>
                                <FontAwesomeIcon icon={faPlus} />
                            </Icon>
                        </IconButton>
                    )}
                        position="bottom center"
                        closeOnDocumentClick
                        on='hover'
                        arrow={false}
                    >
                        <PopText>Add Post</PopText>
                    </Popup>

                    <Popup trigger={open => (
                        <Link to='/'>
                            <IconButton>
                                <Icon>
                                    <FontAwesomeIcon icon={faHome} />
                                </Icon>
                            </IconButton>
                        </Link>
                    )}
                        position="bottom center"
                        closeOnDocumentClick
                        on='hover'
                        arrow={false}
                    >
                        <PopText>Home</PopText>
                    </Popup>

                    <Popup
                        trigger={open => {

                            if (open) {
                                clearNotifications()
                            }

                            return (
                                <IconButton>
                                    {notifications.length !== 0 && <NotificationAmount>{notifications.length}</NotificationAmount>}
                                    <Icon>
                                        <FontAwesomeIcon icon={faBell} />
                                    </Icon>
                                </IconButton>)

                        }
                        }
                        position="bottom center"
                        on="click"
                        closeOnDocumentClick
                        mouseLeaveDelay={300}
                        mouseEnterDelay={0}
                        contentStyle={{ padding: '0px', border: 'none' }}
                        arrow={false}>

                        <NotContainer>

                            {notifications.length === 0 && <Notification>No new notification yet</Notification>}

                            {notifications.map(n => (
                                <Link to={`/post/${n.postID}`} key={n.liker + n.commenter + n.type}>

                                    <Notification>
                                        <NotIcon>
                                            {n.type === 'like' ? <FontAwesomeIcon icon={faHeart} /> : <FontAwesomeIcon icon={faComment} />}
                                        </NotIcon>
                                        {n.type === 'like' ? `${n.liker}, liked your post` : `${n.commenter}, commented on your post`}
                                    </Notification>
                                </Link>
                            ))}

                        </NotContainer>
                    </Popup>

                    <Popup trigger={open => (
                        <IconButton onClick={async () => await logout()}>
                            <Icon>
                                <FontAwesomeIcon icon={faSignOutAlt} />
                            </Icon>
                        </IconButton>
                    )}
                        position="bottom center"
                        closeOnDocumentClick
                        on='hover'
                        arrow={false}
                    >
                        <PopText>Sign out</PopText>
                    </Popup>


                </Group>
            }

        </NavContainer >
    );
}


const NavContainer = tw.div`w-screen bg-teal-400 font-sans`
const NavButton = tw.button`text-white text-base rounded-2xl sm:mx-1 p-1 sm:p-2
 border-none bg-teal-400 hover:bg-teal-500 sm:text-lg hover:cursor-pointer focus:outline-none`

const Group = tw.div`flex justify-center items-start p-2 sm:p-4`

const IconButton = tw.button`flex flex-col items-center justify-center rounded-3xl text-white bg-teal-400
 hover:bg-teal-500 focus:outline-none border-none p-1 m-2
hover:cursor-pointer`
const Icon = tw.svg`w-8 h-8`
const NotificationAmount = tw.div`bg-red-500 text-xs font-sans rounded-full w-4 text-center`

const PopText = tw.div`bg-gray-700 text-white text-xs border-2 rounded-lg p-1`

const NotContainer = tw.div`flex flex-col rounded bg-teal-600`
const Notification = tw.button`text-white bg-teal-600 hover:bg-teal-700 p-2 rounded
border-none hover:cursor-pointer focus:outline-none items-center justify-center flex`

const NotIcon = tw.div`mr-2`

export default NavBar;
