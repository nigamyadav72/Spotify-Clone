"use client"

import LikeButton from '@/components/LikeButton'
import MediaItem from '@/components/MediaItem'
import { useUser } from '@/hooks/useUser'
import { Song } from '@/types'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

interface LikedContentProps{
    songs: Song[]
}

const LikedContent: React.FC<LikedContentProps> = ({
    songs
}) => {
    const router = useRouter()
    const {isLoading, user} = useUser()

    useEffect(() => {
        if(!isLoading && !user){
            router.replace('/')
        }
    },[isLoading, user, router])

    if (songs.length === 0){
        return (
            <div className='flex flex-col gap-y-2 w-full px-6 text-neutral-400'>
                No liked songs.

            </div>
        )
    }
  return (
    <div className='flex flex-col gap-y-2 w-full p-6'>
        {songs.map((song) =>(
            <div 
            key={song.id}
            className='flex items-center gap-x-4 w-full'
            >
                <div className='flex-1'>
                    <MediaItem 
                    onClick={() => {}}
                    data={song}

                    />

                </div>
                    <LikeButton songId={song.id} />

            </div>
        ))}

    </div>
  )
}

export default LikedContent
