import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import LandingNav from '../components/layout/LandingNav';
import LandingFooter from '../components/layout/LandingFooter';

const ContactPage = () => {
    const pageRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set('.contact-stagger', { y: '105%' });
            gsap.to('.contact-stagger', {
                y: '0%',
                duration: 1,
                ease: 'power4.out',
                stagger: 0.15,
            });

            gsap.from('.contact-form', {
                y: 50,
                opacity: 0,
                duration: 0.9,
                ease: 'power3.out',
                delay: 0.4,
            });

            gsap.from('.contact-info__item', {
                y: 30,
                opacity: 0,
                duration: 0.7,
                ease: 'power3.out',
                stagger: 0.12,
                delay: 0.3,
            });
        }, pageRef);

        return () => ctx.revert();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div ref={pageRef} className="w-full bg-dark text-white">
            <LandingNav />

            <section className="contact-page">
                <div className="contact-page__inner">

                    {/* Left — info */}
                    <div className="contact-info">
                        <div className="overflow-hidden">
                            <span className="contact-stagger block contact-info__eyebrow">GET IN TOUCH</span>
                        </div>
                        <h1 className="contact-info__title">
                            <div className="overflow-hidden">
                                <span className="contact-stagger block">LET'S</span>
                            </div>
                            <div className="overflow-hidden">
                                <span className="contact-stagger block contact-info__accent">TALK</span>
                            </div>
                        </h1>

                        <div className="contact-info__list">
                            <div className="contact-info__item">
                                <span className="contact-info__label">PHONE</span>
                                <a href="tel:9844126052" className="contact-info__value contact-info__link">9844126052</a>
                            </div>
                            <div className="contact-info__item">
                                <span className="contact-info__label">EMAIL</span>
                                <a href="mailto:nandumohith@gmail.com" className="contact-info__value contact-info__link">nandumohith@gmail.com</a>
                            </div>
                            <div className="contact-info__item">
                                <span className="contact-info__label">ADDRESS</span>
                                <a
                                    href="https://www.google.com/maps/dir/?api=1&destination=80,+Sri+Sri+Sri+Shivakumara+Swamiji+Rd,+Kereguddadahalli,+Chikkabanavara,+Bengaluru"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="contact-info__value contact-info__link"
                                >
                                    80, Sri Sri Sri Shivakumara Swamiji Rd,<br />
                                    Chikkabanavara, Bengaluru
                                </a>
                            </div>
                            <div className="contact-info__item">
                                <span className="contact-info__label">HOURS</span>
                                <div className="contact-info__value">
                                    <span>Morning — 05:30 to 11:30</span><br />
                                    <span>Evening — 17:00 to 21:30</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right — form */}
                    <form className="contact-form" onSubmit={handleSubmit} noValidate>
                        <div className="contact-form__row">
                            <div className="contact-form__field">
                                <label className="contact-form__label" htmlFor="cf-name">YOUR NAME</label>
                                <input id="cf-name" type="text" className="contact-form__input" placeholder="John Doe" required />
                            </div>
                            <div className="contact-form__field">
                                <label className="contact-form__label" htmlFor="cf-phone">PHONE</label>
                                <input id="cf-phone" type="tel" className="contact-form__input" placeholder="98XXXXXXXX" />
                            </div>
                        </div>
                        <div className="contact-form__field">
                            <label className="contact-form__label" htmlFor="cf-email">EMAIL</label>
                            <input id="cf-email" type="email" className="contact-form__input" placeholder="you@example.com" required />
                        </div>
                        <div className="contact-form__field">
                            <label className="contact-form__label" htmlFor="cf-msg">MESSAGE</label>
                            <textarea id="cf-msg" className="contact-form__textarea" rows={5} placeholder="Tell us your goal or ask a question…" required />
                        </div>
                        <button type="submit" className="contact-form__btn">
                            <span>SEND MESSAGE</span>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </form>
                </div>
            </section>

            <LandingFooter />
        </div>
    );
};

export default ContactPage;
