import React, { useState, useEffect } from 'react';
import Popup from 'reactjs-popup'
import tw from 'twin.macro'
import 'twin.macro'
import { faExpandAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { getComments } from '../Services/UserServices'

function ExpandModal({ postId, isOpen, click }) {

    const [comments, setComments] = useState([])

    useEffect(() => {
        if (!postId) {
            console.log("no postId")
            return}
        if (!isOpen) {
            console.log("is open has the problem")
            return
        }

        console.log('expand modal effect')

        async function fetch() {
            const COMMENTS = await getComments(postId)
            setComments(COMMENTS)
        }
        fetch()
    }, [isOpen])

    return (
        <MainContainer>
            <Popup
                trigger={
                    <TriggerButton onClick={()=> click()}>
                        <FontAwesomeIcon icon={faExpandAlt} />
                    </TriggerButton>
                }

                lockScroll
                modal
                closeOnDocumentClick={true}
                closeOnEscape={true}
                offsetY={1}
            >

                {close => {

                    return (
                        <ModalContainer>

                            <Label>Comments of the post</Label>
                            <CloseButton onClick={() => {
                                close()
                            }}
                            >X</CloseButton>

                            {comments.length === 0 && <p>There is no comment yet....</p>}

                            <Container>
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
                        </ModalContainer>)
                }
                }

            </Popup>
        </MainContainer>
    );
}


const MainContainer = tw.div`font-sans`

const ModalContainer = tw.div`bg-teal-700 rounded-lg p-1`
const Label = tw.label`font-bold text-lg text-gray-900 ml-2 text-center font-sans mr-2`

const TriggerButton = tw.button`bg-white text-purple-500 text-lg hover:text-purple-200 border-none rounded focus:outline-none
hover:cursor-pointer`

const CloseButton = tw.button`bg-red-400 font-bold text-white border-none px-2 py-1 rounded focus:outline-none font-sans
hover:cursor-pointer hover:bg-red-500`

const Container = tw.div`flex flex-wrap m-4 font-sans max-h-screen`
const CommentContainer = tw.div`bg-teal-100 p-4 mb-1 rounded-xl w-64 m-1`
const CommentUserName = tw.h3`text-teal-400 text-base sm:text-xl mb-1`
const CommentText = tw.p`text-gray-800 text-xs sm:text-lg`

export default ExpandModal