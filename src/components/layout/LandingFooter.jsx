import { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const LandingFooter = () => {
    const footerRef = useRef(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        const ctx = gsap.context(() => {
            gsap.set('.footer-stagger', { y: '105%' });
            gsap.to('.footer-stagger', {
                y: '0%',
                duration: 0.9,
                ease: 'power4.out',
                stagger: 0.08,
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                },
            });
        }, footerRef);
        return () => ctx.revert();
    }, []);

    return (
        <footer ref={footerRef} className="landing-footer">
            <div className="landing-footer__top">
                <div className="landing-footer__brand-col">
                    <div className="landing-footer__logo">
                        <div className="overflow-hidden"><span className="footer-stagger block">SWEAT</span></div>
                        <div className="overflow-hidden"><span className="footer-stagger block">ZONE</span></div>
                    </div>
                    <p className="landing-footer__tagline">
                        <span className="overflow-hidden block"><span className="footer-stagger block">Train hard. Live strong.</span></span>
                        <span className="overflow-hidden block"><span className="footer-stagger block">Your fitness, our mission.</span></span>
                    </p>
                    <div className="landing-footer__socials overflow-hidden">
                        <span className="footer-stagger flex gap-3">
                            <a href="/" aria-label="Facebook" className="landing-footer__social">
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M13.9 8.4V6.8c0-.7.5-.8.8-.8h2V3h-2.8c-3.1 0-3.8 2.3-3.8 3.9v1.5H8v3h2.1V21h3.8v-9.6h2.6l.3-3h-2.9z" />
                                </svg>
                            </a>
                            <a href="/" aria-label="Instagram" className="landing-footer__social">
                                <svg viewBox="0 0 24 24" aria-hidden="true">
                                    <rect x="4" y="4" width="16" height="16" rx="4" />
                                    <circle cx="12" cy="12" r="3.4" />
                                    <circle cx="17.3" cy="6.8" r="1.2" />
                                </svg>
                            </a>
                        </span>
                    </div>
                </div>

                <div className="landing-footer__links-col">
                    <h4 className="landing-footer__col-title">
                        <div className="overflow-hidden"><span className="footer-stagger block">NAVIGATE</span></div>
                    </h4>
                    <ul className="landing-footer__list">
                        <li><div className="overflow-hidden"><Link to="/" className="landing-footer__link footer-stagger block">Home</Link></div></li>
                        <li><div className="overflow-hidden"><Link to="/services" className="landing-footer__link footer-stagger block">Services</Link></div></li>
                        <li><div className="overflow-hidden"><a href="#" className="landing-footer__link footer-stagger block">Classes</a></div></li>
                        <li><div className="overflow-hidden"><Link to="/login" className="landing-footer__link footer-stagger block">Member Login</Link></div></li>
                    </ul>
                </div>

                <div className="landing-footer__contact-col">
                    <h4 className="landing-footer__col-title">
                        <div className="overflow-hidden"><span className="footer-stagger block">CONTACT</span></div>
                    </h4>
                    <ul className="landing-footer__list">
                        <li>
                            <div className="overflow-hidden">
                                <a href="tel:9844126052" className="landing-footer__link footer-stagger block">9844126052</a>
                            </div>
                        </li>
                        <li>
                            <div className="overflow-hidden">
                                <a href="mailto:nandumohith@gmail.com" className="landing-footer__link footer-stagger block">nandumohith@gmail.com</a>
                            </div>
                        </li>
                        <li>
                            <div className="overflow-hidden">
                                <a
                                    href="https://www.google.com/maps/dir/?api=1&destination=80,+Sri+Sri+Sri+Shivakumara+Swamiji+Rd,+Kereguddadahalli,+Chikkabanavara,+Bengaluru"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="landing-footer__link footer-stagger block"
                                >
                                    80, Sri Sri Sri Shivakumara Swamiji Rd,<br />
                                    Chikkabanavara, Bengaluru
                                </a>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="landing-footer__hours-col">
                    <h4 className="landing-footer__col-title">
                        <div className="overflow-hidden"><span className="footer-stagger block">HOURS</span></div>
                    </h4>
                    <ul className="landing-footer__list">
                        <li className="landing-footer__hours-row">
                            <div className="overflow-hidden"><span className="landing-footer__hours-label footer-stagger block">Morning</span></div>
                            <div className="overflow-hidden"><span className="landing-footer__hours-time footer-stagger block">05:30 – 11:30</span></div>
                        </li>
                        <li className="landing-footer__hours-row">
                            <div className="overflow-hidden"><span className="landing-footer__hours-label footer-stagger block">Evening</span></div>
                            <div className="overflow-hidden"><span className="landing-footer__hours-time footer-stagger block">17:00 – 21:30</span></div>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="landing-footer__bottom">
                <div className="overflow-hidden"><span className="landing-footer__copy footer-stagger block">&copy; {new Date().getFullYear()} Sweat Zone. All rights reserved.</span></div>
                <div className="overflow-hidden"><span className="landing-footer__made footer-stagger block">Built for champions.</span></div>
            </div>
        </footer>
    );
};

export default LandingFooter;
