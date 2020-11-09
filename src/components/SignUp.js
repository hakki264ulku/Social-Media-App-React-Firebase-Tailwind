import React, { useEffect, useState } from 'react'
import tw from 'twin.macro'
import 'twin.macro'
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


import NavBar from './NavBar'
import { signUp } from '../Services/AuthServices'
import firebase from '../firebase'


function SignUp(props) {

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function (user) {
            if(user) {
                props.history.push('/')
            } else return
        });
    }, [])

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [username, setUsername] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (password !== passwordConfirm) {
            alert('Passwords do not match!')
            return
        }

        if (!username) {
            alert('Please enter your username')
            return
        }

        setIsLoading(true)

        try {
            await signUp(email, password, username)
            setIsLoading(false)
            props.history.push('/')
        } catch (e) {
            alert(e.message)
        }
    }

    return (
        <Container>
            <NavBar />
            <FormContainer>
                <Form onSubmit={async (e) => await handleSubmit(e)}>
                    <Label>Email</Label>
                    <Input type='email' placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Label>Password</Label>
                    <Input type='password' placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Label>Confirm Password</Label>
                    <Input type='password' placeholder='confirm password' value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
                    <Label>Username</Label>
                    <Input type='text' placeholder='username' value={username} onChange={(e) => setUsername(e.target.value)} />

                    {!isLoading && <Button>Sign Up</Button>}
                    {isLoading && <Button disabled><FontAwesomeIcon icon={faSpinner} pulse /></Button>}

                </Form>
            </FormContainer>
        </Container>
    );
}

const Container = tw.div`w-screen h-screen bg-gray-200 font-sans`

const FormContainer = tw.div`w-screen justify-center items-center flex mt-8 sm:mt-12`
const Form = tw.form`flex flex-col justify-center items-center bg-white shadow-lg rounded-md p-4 sm:p-8 w-4/5 sm:w-1/4`
const Label = tw.label`font-bold text-gray-900 text-lg mb-2`
const Button = tw.button`p-2 sm:px-4 sm:py-3 font-bold text-white text-lg bg-teal-400 hover:bg-teal-500
focus:outline-none hover:cursor-pointer border-none rounded-lg`
const Input = tw.input`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight mb-4 focus:outline-none focus:shadow-outline`

export default SignUp;
