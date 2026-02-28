import React from 'react'
import ReactDOM from 'react-dom/client'
import Lenis from 'lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gsap from 'gsap'
import App from './App.jsx'
import './styles/global.css'

gsap.registerPlugin(ScrollTrigger)

const lenis = new Lenis({
    duration: 0.9,
    smoothWheel: true,
    smoothTouch: false,
    wheelMultiplier: 0.95,
})

lenis.on('scroll', () => {
    ScrollTrigger.update()
})

gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
