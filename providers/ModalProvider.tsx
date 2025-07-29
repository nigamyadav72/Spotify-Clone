"use client"

import React from 'react'
import { useState, useEffect } from 'react'
import Modal from '@/components/Modal'
import AuthModal from '@/components/AuthModal'


const ModelProvider = () => {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)

    },[])
    if (!isMounted) {
        return null
    }
  return (
    <>
    <AuthModal />
    </>
  )
}

export default ModelProvider
