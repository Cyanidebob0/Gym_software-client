import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)

// Defer heavy animation libraries — load after first paint
requestIdleCallback?.(() => initSmoothScroll()) ?? setTimeout(initSmoothScroll, 100)

async function initSmoothScroll() {
    const [{ default: gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
        import('lenis'),
    ])

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
}
