"use client"

import { useEffect, useState } from "react"

const backgrounds = [
    "/backgrounds/bg1.jpg",
    "/backgrounds/bg2.jpg",
    "/backgrounds/bg3.jpg",
    "/backgrounds/bg4.jpg",
    "/backgrounds/bg5.jpg",
    "/backgrounds/bg6.jpg",
    "/backgrounds/bg7.jpg",
    "/backgrounds/bg8.jpg",
]

export function BackgroundRotator() {
    const [bgImage, setBgImage] = useState("")

    useEffect(() => {
        // Select a random background on client mount
        if (backgrounds.length > 0) {
            const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)]
            setBgImage(randomBg)
        }
    }, [])

    if (!bgImage) return null

    return (
        <div
            className="fixed inset-0 -z-50 h-full w-full bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
            style={{
                backgroundImage: `url(${bgImage})`,
            }}
        >
            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-background/0 backdrop-blur-[0px]" />
        </div>
    )
}
