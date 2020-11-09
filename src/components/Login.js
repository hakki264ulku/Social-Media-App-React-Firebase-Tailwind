import React, { useState, useEffect } from 'react'
import tw from 'twin.macro'
import 'twin.macro'
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import NavBar from './NavBar'
import {login} from '../Services/AuthServices'
import firebase from '../firebase'

function Login(props) {

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function (user) {
            if(user) {
                props.history.push('/')
            } else return
        });
    }, [])

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const submitHandler = async (e) => {
        e.preventDefault()

        if(!email || !password){
            alert('Password or email cannot be empty!')
            return
        }

        setIsLoading(true)

        try {
            await login(email, password)
            setIsLoading(false)
            props.history.push('/')
        } catch (e) {
            alert(e.message)
            setIsLoading(false)
        }

    }

    return (
        <Container>
            <NavBar />
            <FormContainer>
                <Form onSubmit={async (e) => await submitHandler(e)}>
                    <Label>Email</Label>
                    <Input type='email' placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Label>Password</Label>
                    <Input type='password' placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                    {!isLoading && <Button>Login</Button>}
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
const Button = tw.button`p-2 sm:px-4 sm:py-3 font-bold text-white text-lg bg-teal-400 hover:bg-teal-500 hover:cursor-pointer border-none rounded-lg`
const Input = tw.input`shadow appearance-none border rounded w-full py-2 px-3 text-xs sm:text-lg text-gray-700 leading-tight mb-4 focus:outline-none focus:shadow-outline`

export default Login;
