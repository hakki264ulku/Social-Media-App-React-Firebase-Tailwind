import React, { useEffect, useState } from 'react'
import 'twin.macro'
import tw from 'twin.macro'
import NavBar from './NavBar'
import { faHeart, faComment, faExpandAlt, faIdBadge } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Popup from 'reactjs-popup'

import firebase from '../firebase'
import {
  GetPosts, likePost, unLikePost, getUserId, isUserAuthenticated, getUserName,
  addProfilePhoto, getUser, likeNotification
} from '../Services/UserServices'
import AddPostModal from './AddPostModal'
import CommentModal from './CommentModal'
import ExpandModal from './ExpandModal'


function HomePage(props) {

  const [posts, setPosts] = useState([])
  const [isPostModalOpen, setIsPostModalOpen] = useState(false)
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false)
  const [isExpandModalOpen, setIsExpandModalOpen] = useState(false)
  const [postId, setPostId] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [ownerOfPost, setOwnerOfPost] = useState('')

  const [uid, setUid] = useState('')
  const [userName, setUserName] = useState('')
  const [userPhoto, setUserPhoto] = useState('')

  async function fetchPosts() {
    const POSTS = await GetPosts()
    setPosts(POSTS)
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  // set authenticated user values
  useEffect(() => {
    async function fetch() {
      try {
        const UID = await getUserId()
        const user = await getUser(UID)

        setUid(UID)
        setUserName(user.userName)

        if (user.url) setUserPhoto(user.url)

      } catch (e) {
        console.log('Probably you are not authenticated')
      }
    }
    fetch()

  }, [])

  // Send user to homepage if authenticated
  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        props.history.push('/')
      } else return
    });
  }, [])

  const openModal = () => setIsPostModalOpen(true)
  const closeModal = () => setIsPostModalOpen(false)

  const openCommentModal = async (postId, ownerName, ownerOfPost) => {

    await isUserAuthenticated(props)

    setPostId(postId)
    setOwnerName(ownerName)
    setIsCommentModalOpen(true)
    setOwnerOfPost(ownerOfPost)
  }
  const closeCommentModal = () => setIsCommentModalOpen(false)

  const openExpandModal = (postId) => {
    setPostId(postId)
    setIsExpandModalOpen(true)
  }
  const closeExpandModal = () => setIsExpandModalOpen(false)

  const handleLike = async (postId, owner) => {
    try {
      await isUserAuthenticated(props)
      await likePost(uid, postId)
      await fetchPosts()
      await likeNotification(uid, owner, userName, postId)
    } catch (e) {
      console.log(e.message)
    }
  }

  const handleUnLike = async (postId) => {
    try {
      await unLikePost(uid, postId)
      await fetchPosts()
    } catch (e) {
      console.log(e.message)
    }
  }

  const hiddenFileInput = React.useRef(null);
  const handlePF = async () => {
    await isUserAuthenticated(props)
    if (hiddenFileInput.current === 'null') return
    hiddenFileInput.current.click()
  }

  const handlePFChange = async (e) => {
    try {
      await isUserAuthenticated(props)

      const fileUploaded = e.target.files[0]
      const photoUrl = await addProfilePhoto(fileUploaded, uid)
      setUserPhoto(photoUrl)

    } catch (e) {
      console.log(e.message)
    }

  }

  return (
    <MainContainer>
      <NavBar openModal={openModal} openExpandModal={openExpandModal} />
      <AddPostModal modalOpen={isPostModalOpen} closeModal={closeModal} />
      <CommentModal modalOpen={isCommentModalOpen} closeModal={closeCommentModal} postId={postId} ownerName={ownerName} ownerOfPost={ownerOfPost} />
      <ExpandModal modalOpen={isExpandModalOpen} closeModal={closeExpandModal} postId={postId} />

      <Container>

        <UserContainer>
          {userPhoto && <UserImage src={userPhoto} />}
          {userPhoto === '' && <UserImage src='./avatar.png' />}
          <UserName>@{userName}</UserName>
          <UserSetPF>
            <input style={{ display: 'none' }} type='file' ref={hiddenFileInput} onChange={handlePFChange} />


            <Popup trigger={open => (
              <PFInput onClick={handlePF}>
                < FontAwesomeIcon icon={faIdBadge} />
              </PFInput>
            )}
              position="bottom center"
              closeOnDocumentClick
              on='hover'
              arrow={false}
            >
              <PopText>Add Profile Photo</PopText>
            </Popup>


          </UserSetPF>
        </UserContainer>

        <PostsContainer>
          {posts.map(p => (

            <Post key={p.owner + p.text}>
              {!p.ownerPhoto && <PostImage src='./avatar.png' />}
              {p.ownerPhoto && <PostImage src={p.ownerPhoto} />}
              <PostBody>
                <PostUsername>{p.ownerName}</PostUsername>
                <PostDate>{new Date(p.date).toISOString().split('T')[0]}</PostDate>
                <PostText>{p.text}</PostText>

                <PostFooter>
                  <PostLikeCommentContainer>
                    <PostLikes>
                      {p.likes.includes(uid) &&
                        <PostUnLike onClick={async () => await handleUnLike(p.postId)}>
                          <FontAwesomeIcon icon={faHeart} />
                        </PostUnLike>}

                      {!p.likes.includes(uid) &&
                        <PostLike onClick={async () => await handleLike(p.postId, p.owner)} >
                          <FontAwesomeIcon icon={faHeart} />
                        </PostLike>}

                      {`${p.likes.length} `}likes
                    </PostLikes>

                    <PostComments>
                      <PostButton onClick={() => openCommentModal(p.postId, userName, p.owner)}>
                        <FontAwesomeIcon icon={faComment} />
                      </PostButton>
                      {`${p.comments.length} `}comments
                    </PostComments>
                  </PostLikeCommentContainer>

                  <PostExpandContainer>
                    <PostExpandButton onClick={() => openExpandModal(p.postId)}>
                      <FontAwesomeIcon icon={faExpandAlt} />
                    </PostExpandButton>
                  </PostExpandContainer>
                </PostFooter>

              </PostBody>
            </Post>
          ))}

        </PostsContainer>

      </Container>
    </MainContainer>
  );
}


// Tailwind styled components
const MainContainer = tw.div`w-screen h-screen bg-teal-100 font-sans`

const Container = tw.div`sm:flex items-start w-screen bg-teal-100 `

const PostsContainer = tw.div`w-full sm:w-2/3 p-1 sm:p-4 pt-2`

const Post = tw.div`flex items-start bg-white shadow-lg mb-2 p-1 sm:p-2 rounded-lg`
const PostBody = tw.div`sm:ml-4 sm:p-1 w-full`
const PostUsername = tw.h3`text-lg sm:text-2xl font-bold text-teal-500 mb-1`

const PostFooter = tw.div`flex items-start sm:justify-between w-full`
const PostDate = tw.p`text-gray-500 text-xs sm:text-base mb-1`
const PostText = tw.p`text-gray-900 text-base sm:text-lg mb-3`
const PostImage = tw.img`rounded-full w-12 h-12 sm:w-16 sm:h-16 object-cover mr-2`

const PostLikeCommentContainer = tw.div`flex`
const PostExpandContainer = tw.div``
const PostExpandButton = tw.button`bg-white text-purple-500 text-lg hover:text-purple-200 border-none rounded focus:outline-none
  hover:cursor-pointer`
const PostLikes = tw.div`text-gray-800 font-sans`
const PostComments = tw.div`sm:ml-4 text-gray-800 font-sans items-center`
const PostLike = tw.button`bg-white text-purple-200 text-lg hover:text-purple-500 border-none rounded focus:outline-none
  hover:cursor-pointer`
const PostUnLike = tw.button`bg-white text-purple-500 text-lg hover:text-purple-200 border-none rounded focus:outline-none
  hover:cursor-pointer`
const PostButton = tw.button`bg-white text-gray-200 text-lg hover:text-gray-400 border-none rounded focus:outline-none
  hover:cursor-pointer`

const UserContainer = tw.div`flex flex-col justify-center items-center bg-white shadow-xl rounded-lg mt-2 w-1/3 sm:w-1/4 p-2 px-4 sm:p-2`
const UserImage = tw.img`sm:w-24 sm:h-24 w-16 h-16 rounded-full mb-4 object-cover`
const UserName = tw.h3`text-teal-400 text-lg sm:text-xl`
const UserSetPF = tw.div`flex justify-end w-full`
const PFInput = tw.button`border-none bg-white p-1 text-2xl text-gray-700 hover:text-gray-800 hover:cursor-pointer focus:outline-none`

const PopText = tw.div`bg-gray-700 text-white text-xs border-2 rounded-lg p-1`

export default HomePage;