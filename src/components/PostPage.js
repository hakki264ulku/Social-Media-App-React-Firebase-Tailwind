import React, { useState, useEffect } from 'react'
import tw from 'twin.macro'
import 'twin.macro'

import NavBar from './NavBar'
import { GetPost, getComments } from '../Services/UserServices'

function PostPage(props) {

    const [post, setPost] = useState({})
    const [comments, setComments] = useState([])
    const [date, setDate] = useState('')
    const postId = props.match.params.id

    useEffect(() => {
        async function fetch() {
            try {
                setPost(await GetPost(postId))
                setComments(await getComments(postId))
                setDate(new Date(await post.date).toISOString().split('T')[0])
            } catch (e) {
                console.log(e.message)
            }

        }
        fetch()

    }, [])

    useEffect(() => {
        async function fetch() {
            try {
                let POST
                while (!POST) {
                    POST = await GetPost(postId)
                }
                setPost(POST)

                let COMMENTS
                while (!COMMENTS) {
                    COMMENTS = await getComments(postId)
                }
                setComments(COMMENTS)
                setDate(new Date(POST.date).toISOString().split('T')[0])
            } catch (e) {
                console.log(e.message)
            }

        }
        fetch()

    }, [])

    return (
        <MainContainer>
            <NavBar />
            <PostsContainer>
                <Post>
                    {!post.ownerPhoto && <PostImage src='../avatar.png' alt='default avatar'/>}
                    {post.ownerPhoto && <PostImage src={post.ownerPhoto} />}
                    <PostBody>
                        <PostUsername>{post.ownerName}</PostUsername>
                        <PostDate>{date}</PostDate>
                        <PostText>{post.text}</PostText>
                    </PostBody>
                </Post>

                <H2>Comments</H2>
                
                {comments.map(c=>(
                    <Comment key={c.owner+c.ownerName+c.text}>
                        <PostBody>
                            <PostUsername>{c.ownerName}</PostUsername>
                            <PostText>{c.text}</PostText>
                        </PostBody>
                    </Comment>
                ))}

            </PostsContainer>

        </MainContainer>
    )
}

const MainContainer = tw.div`font-sans`


const PostsContainer = tw.div`w-full sm:w-2/3 p-2 sm:p-4 pt-2`

const Post = tw.div`flex items-start bg-gray-100 shadow-lg mb-2 p-2 rounded-lg`
const PostBody = tw.div`sm:ml-4 sm:p-1 w-full`
const PostUsername = tw.h3`text-lg sm:text-2xl font-bold text-teal-500 mb-1`

const H2 = tw.h2`font-bold text-teal-700 text-xl sm:text-3xl text-center mt-4 mb-3 shadow p-1`

const PostFooter = tw.div`flex items-start sm:justify-between w-full`
const PostDate = tw.p`text-gray-500 text-xs sm:text-base mb-1`
const PostText = tw.p`text-gray-900 text-base sm:text-lg mb-3`
const PostImage = tw.img`rounded-full w-12 h-12 sm:w-16 sm:h-16 object-cover mr-2`

const Comment = tw.div`flex items-start bg-white shadow-lg mb-2 p-2 rounded-lg`

export default PostPage;
