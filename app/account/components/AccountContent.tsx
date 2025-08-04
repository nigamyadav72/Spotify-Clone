"use client"

import Button from '@/components/Button'
import useSubscribeModal from '@/hooks/useSubscripeModal'
import { useUser } from '@/hooks/useUser'
import { postData } from '@/libs/helpers'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect} from 'react'
import toast from 'react-hot-toast'
import loading from '../loading'

const AccountContent = () => {
    const router = useRouter()
    const subscribeModal = useSubscribeModal()
    const { isLoading, subscription , user } = useUser()
    const [Loading, setLoading] = useState(false)

    useEffect(() => {
        if(!Loading && !user){
            router.replace('/')
        }
    },[isLoading, user, router])

    const redirectToCustomerPortal = async () => {
        setLoading(true)
        try{
            const { url, error } = await postData({
                url: '/api/create-portal-link'
            })
            window.location.assign(url)

        }catch (error){
            if (error ) {
                toast.error((error as Error).message)
            }
        }
        setLoading(false)
    }
  return (
    <div className='mb-7 px-6'>
        {!subscription && (
            <div className='flex flex-col gap-y-4'>
                <p> No active plan.</p>
                <Button 
                onClick={subscribeModal.onOpen} 
                className='w-[300px]'>
                Subscribe
                </Button>
            </div>
        )}
        {subscription && (
            <div className='flex flex-col gap-y-4'>
                <p>
                    You are currently on the <b>{subscription?.prices?.products?.name}</b> plan.
                </p>
                <Button 
                disabled={Loading || isLoading}
                onClick={redirectToCustomerPortal}
                className='w-[300px]'>
                    Open customer portal
                </Button>

            </div>
        )}
      
    </div>
  )
}

export default AccountContent
