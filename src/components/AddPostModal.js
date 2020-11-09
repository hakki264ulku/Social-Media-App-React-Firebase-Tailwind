import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import tw from 'twin.macro'
import 'twin.macro'
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


import {AddPost} from '../Services/UserServices'

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
  },
  
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement(document.getElementById('root'))

function AddPostModal({modalOpen=false, closeModal}){

    const [postText, setPostText] = useState('')
    const [isAdding, setIsAdding] = useState(false)

    const submitHandler = async (e) => {
        e.preventDefault()

        if(!postText) {
            alert('Please enter a post')
            return
        }

        try {
            setIsAdding(true)
            
            await AddPost(postText)
            setPostText('')
            setIsAdding(false)
            closeModal()
            alert('Post is succesfully added!')
        } catch (e) {
            
        }
    }

    return (
      <MainContainer>
        <Modal
          isOpen={modalOpen}
          style={customStyles}
          contentLabel="Example Modal"
        >
        <CloseButton onClick={()=>closeModal()}>X</CloseButton>
        <Label>Add a post and share with the world!</Label>

        <Container>
            <Form onSubmit={async (e) => await submitHandler(e)}>
                <Input placeholder='What do you want to post?' value={postText} onChange={(e)=>setPostText(e.target.value)}/>
                {!isAdding && <Button>Add Post</Button>}
                {isAdding && <Button disabled><FontAwesomeIcon icon={faSpinner} pulse /></Button>}
            </Form>
        </Container>
        </Modal>
      </MainContainer>
    );
}


const MainContainer = tw.div`font-sans`
const CloseButton = tw.button`bg-red-400 font-bold text-white border-none px-2 py-1 rounded focus:outline-none`
const Label = tw.label`font-bold text-lg text-gray-900 ml-2 text-center`


const Container = tw.div`m-4`
const Form = tw.form`flex flex-col`
const Input = tw.textarea`shadow appearance-none border rounded h-24 sm:w-64 w-32
 py-2 px-3 text-gray-700 leading-tight mb-4 focus:outline-none focus:shadow-outline`
const Button = tw.button`p-2 sm:px-4 sm:py-3 font-bold text-white text-base sm:text-lg bg-teal-400 
hover:bg-teal-500 hover:cursor-pointer border-none rounded-lg focus:outline-none`

export default AddPostModal