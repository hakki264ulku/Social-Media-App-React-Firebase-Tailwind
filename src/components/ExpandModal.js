import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import tw from 'twin.macro'
import 'twin.macro'

import { getComments, GetPosts, GetPost } from '../Services/UserServices'

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement(document.getElementById('root'))

function ExpandModal({ modalOpen = false, closeModal, postId }) {

    const [comments, setComments] = useState([])
    const [post, setPost] = useState({})

    useEffect(() => {

        if (!postId) return
        if (!modalOpen) return

        async function fetch() {
            const POST = await GetPost(postId)
            setPost(POST)
            const COMMENTS = await getComments(postId)
            setComments(COMMENTS)
        }
        fetch()
    }, [modalOpen])


    return (
        <MainContainer>
            <Modal
                isOpen={modalOpen}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <CloseButton onClick={() => closeModal()}>X</CloseButton>

                {comments.length === 0 && <p>There is no comment yet....</p>}

                <Container>

                    {post &&
                        <PostContainer>
                            <PostImage src={post.ownerPhoto} />
                            <PostTextContainer>
                                <PostUserName>{post.ownerName}</PostUserName>
                                <PostText>{post.text}</PostText>
                            </PostTextContainer>
                        </PostContainer>
                    }

                    <Label>Comments of the post</Label>

                    {comments.map(c => (
                        <CommentContainer key={c.owner + c.text}>
                            <CommentUserName>
                                {c.ownerName}
                            </CommentUserName>

                            <CommentText>
                                {c.text}
                            </CommentText>
                        </CommentContainer>
                    ))}
                </Container>
            </Modal>
        </MainContainer>
    );
}

const MainContainer = tw.div`font-sans`
const CloseButton = tw.button`bg-red-400 font-bold text-white border-none px-2 py-1 rounded focus:outline-none font-sans
hover:cursor-pointer hover:bg-red-500`
const Label = tw.label`font-bold text-lg text-gray-900 ml-2 text-center font-sans`

const PostContainer = tw.div`flex items-center bg-teal-200 rounded-lg p-1 shadow mb-2`
const PostImage = tw.img`w-12 h-12 rounded-full `

const PostTextContainer = tw.div`font-sans ml-2 bg-teal-200 shadow rounded p-2 w-5/6`
const PostUserName = tw.h3`font-bold text-teal-700 text-lg mb-1`
const PostText = tw.p`text-gray-800`
const PostDate = tw.p``

const Container = tw.div`m-4 font-sans h-64 overscroll-contain`
const CommentContainer = tw.div`bg-teal-100 p-4 mb-1 rounded-xl mt-2`
const CommentUserName = tw.h3`text-teal-400 text-base sm:text-xl mb-1`
const CommentText = tw.p`text-gray-800 text-xs sm:text-lg`

export default ExpandModal