'use client';

import axios from 'axios';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { useCallback, useState } from "react";
import {
    FieldValues,
    SubmitHandler,
    useForm
} from 'react-hook-form';
import useLoginModal from '@/app/hooks/useLoginModal';
import useRegisterModal from '@/app/hooks/useRegisterModal';
import Modal from './Modal';
import Heading from '../Heading';
import Input from '../inputs/Input';
import toast from 'react-hot-toast';
import Button from '../Button';
import { signIn } from 'next-auth/react';



const RegisterModal = () => {

    const registerModal = useRegisterModal();
    const loginModal = useLoginModal();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState:{
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues:{
            name:'',
            email:'',
            password:''

        }
    });

    //for move Register to Login
    const toggle = useCallback(()=>{
        registerModal.onClose();
        loginModal.onOpen();
    },[loginModal, registerModal]);

    const onSubmit : SubmitHandler<FieldValues>=(data)=>{
        setIsLoading(true);
        
        axios.post('/api/register',data)
        .then(()=>{
            toast.success("Registerd Successfully");
            registerModal.onClose();
            loginModal.onOpen();
        })
        .catch((error)=>{
            //use of toast
            toast.error("Something Went Wrong");
        })
        .finally(()=>{
            setIsLoading(false);
        })
    }

    // body content of register page
    const bodyContent = (
        <div className='flex flex-col gap-4'>
            <Heading 
                title='Welcome to StayHub'
                subtitle='Create your account'
            />
            <Input 
                id='email'
                label='Email'
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <Input 
                id='name'
                label='Name'
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
            <Input 
                id='password'
                type='password'
                label='Password'
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
        </div>
    );

    const footerContent = (
        <div className='flex flex-col gap-4 mt-3'>
            <hr />
            <Button
                outline
                label="Continue With Google"
                icon={FcGoogle}
                onClick={() => signIn('google')} 
            />
            <Button
                outline
                label="Continue With Github"
                icon={AiFillGithub}
                onClick={() => signIn('github')} 
            />
            <div className='
                text-neutral-500
                text-center
                mt-4
                font-light
            '>
                <div className='justify-center flex flex-row items-center gap-2'>
                    <div>
                        Already Have An Account?
                    </div>
                    <div 
                    onClick={toggle}
                    className='
                        text-neutral-800
                        cursor-pointer
                        hover:underline
                    '>
                        Log in
                    </div>
                </div>
            </div>
        </div>
    )
    
    return (
        <Modal
            disabled={isLoading}
            isOpen={registerModal.isOpen}
            title="Register"
            actionLabel="Continue"
            onClose={registerModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
     );
}
 
export default RegisterModal; 