'use client';

import { signIn } from 'next-auth/react';
import axios from 'axios';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { useCallback, useReducer, useState } from "react";
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
import { useRouter } from 'next/navigation';


const LoginModal = () => {

    const router = useRouter();
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
            email:'',
            password:''

        }
    });

    const onSubmit : SubmitHandler<FieldValues>=(data)=>{
        setIsLoading(true);
        
        signIn('credentials', {
            ...data,
            redirect: false,
        })
        .then((callback) => {
            setIsLoading(false);

            if(callback?.ok){
                toast.success("Logged in successfully");
                router.refresh();
                loginModal.onClose();
            }

            if(callback?.error){
                toast.error(callback.error);
            }
        })
    }

    //for move login to Register
    const toggle = useCallback(()=>{
        loginModal.onClose();
        registerModal.onOpen();
    },[loginModal, registerModal]);

    // body content of login page
    const bodyContent = (
        <div className='flex flex-col gap-4'>
            <Heading 
                title='Welcome, Back'
                subtitle='Login To Your Account'
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
    
    //footer of login page
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
                        First Time Using StayHub ?
                    </div>
                    <div 
                    onClick={toggle}
                    className='
                        text-neutral-800
                        cursor-pointer
                        hover:underline
                    '>
                        create an account
                    </div>
                </div>
            </div>
        </div>
    )
    
    return (
        <Modal
            disabled={isLoading}
            isOpen={loginModal.isOpen}
            title="Login"
            actionLabel="Continue"
            onClose={loginModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
     );
}
 
export default LoginModal; 