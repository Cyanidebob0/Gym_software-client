import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

const LandingNav = () => {
    const menuRef = useRef(null);
    const navRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(navRef.current, {
                y: '-100%',
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
            });
        });
        return () => ctx.revert();
    }, []);

    const openMenu = () => {
        setMenuOpen(true);
        if (!menuRef.current) return;
        gsap.fromTo(menuRef.current, { y: '-100%' }, { y: '0%', duration: 0.9, ease: 'power2.in', overwrite: 'auto' });
        gsap.fromTo('.menu-item', { y: -140, opacity: 0 }, { y: 0, opacity: 1, duration: 0.72, ease: 'power3.out', stagger: 0.11, delay: 0.4, overwrite: 'auto' });
        gsap.fromTo('.skulpt-menu__divider', { y: -140, opacity: 0 }, { y: 0, opacity: 1, duration: 0.72, ease: 'power3.out', stagger: 0.11, delay: 0.4, overwrite: 'auto' });
        gsap.fromTo('.menu-contact', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', delay: 0.5, overwrite: 'auto' });
    };

    const closeMenu = () => {
        if (!menuRef.current) return;
        gsap.to(menuRef.current, { y: '-100%', duration: 0.6, ease: 'power3.inOut', onComplete: () => setMenuOpen(false) });
    };

    return (
        <>
            <nav ref={navRef} className="landing-nav fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 sm:px-6 md:px-12 py-5 md:py-6">
                <Link to="/">
                    <img src="/logo.jpeg" alt="Sweat Zone Unisex Gym" className="landing-nav__logo" />
                </Link>
                <div className="flex items-center gap-3 sm:gap-6">
                    <Link
                        to="/login"
                        className="hidden sm:inline-flex bg-primary hover:bg-primary-dark text-white px-5 md:px-7 py-2.5 md:py-3 rounded-full font-bold text-xs md:text-sm tracking-wider uppercase transition-all duration-300 hover:scale-105"
                    >
                        Get Started
                    </Link>
                    <button
                        onClick={openMenu}
                        className="bg-transparent border-none text-white text-sm sm:text-base font-semibold tracking-wider cursor-pointer hover:text-primary transition-colors duration-300"
                    >
                        Menu
                    </button>
                </div>
            </nav>

            {/* Fullscreen Menu Overlay */}
            <div
                ref={menuRef}
                className="skulpt-menu fixed inset-0 z-[100] text-dark"
                style={{ transform: 'translateY(-100%)' }}
            >
                <div className="skulpt-menu__header">
                    <img src="/logo.jpeg" alt="Sweat Zone Unisex Gym" className="skulpt-menu__logo-img" />
                    <button onClick={closeMenu} className="skulpt-menu__close">
                        <span className="skulpt-menu__close-text">Close</span>
                        <span className="skulpt-menu__close-icon" aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div className="skulpt-menu__grid">
                    <div className="menu-item skulpt-menu__col">
                        <Link to="/services" onClick={closeMenu} className="skulpt-menu__label" data-text="SERVICES">
                            <span>SERVICES</span>
                        </Link>
                    </div>
                    <div className="menu-item skulpt-menu__col skulpt-menu__col--divider">
                        <span className="skulpt-menu__divider" aria-hidden="true" />
                        <Link to="/about" onClick={closeMenu} className="skulpt-menu__label" data-text="ABOUT US">
                            <span>ABOUT US</span>
                        </Link>
                    </div>
                    <div className="menu-item skulpt-menu__col skulpt-menu__col--divider">
                        <span className="skulpt-menu__divider" aria-hidden="true" />
                        <Link to="/contact" onClick={closeMenu} className="skulpt-menu__label" data-text="CONTACT">
                            <span>CONTACT</span>
                        </Link>
                    </div>
                    <div className="menu-contact skulpt-menu__contact skulpt-menu__col--divider">
                        <span className="skulpt-menu__divider" aria-hidden="true" />
                        <a href="mailto:nandumohith@gmail.com" className="skulpt-menu__link">nandumohith@gmail.com</a>
                        <a href="tel:9844126052" className="skulpt-menu__link">9844126052</a>
                        <a href="https://www.google.com/maps/dir/?api=1&destination=80,+Sri+Sri+Sri+Shivakumara+Swamiji+Rd,+Kereguddadahalli,+Chikkabanavara,+Bengaluru" target="_blank" rel="noreferrer" className="skulpt-menu__link">
                            80, Sri Sri Sri Shivakumara Swamiji Rd, Kereguddadahalli, Chikkabanavara, Bengaluru
                        </a>
                        <div className="skulpt-menu__hours">
                            <h3>OPENING HOURS</h3>
                            <p>Morning: 05:30 - 11:30</p>
                            <p>Evening: 17:00 - 21:30</p>
                        </div>
                        <div className="skulpt-menu__socials">
                            <a href="/" aria-label="Facebook" className="skulpt-menu__social">
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M13.9 8.4V6.8c0-.7.5-.8.8-.8h2V3h-2.8c-3.1 0-3.8 2.3-3.8 3.9v1.5H8v3h2.1V21h3.8v-9.6h2.6l.3-3h-2.9z" />
                                </svg>
                            </a>
                            <a href="/" aria-label="Instagram" className="skulpt-menu__social">
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <rect x="4" y="4" width="16" height="16" rx="4" />
                                    <circle cx="12" cy="12" r="3.4" />
                                    <circle cx="17.3" cy="6.8" r="1.2" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LandingNav;
