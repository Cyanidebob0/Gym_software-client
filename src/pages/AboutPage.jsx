import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LandingNav from '../components/layout/LandingNav';
import LandingFooter from '../components/layout/LandingFooter';

const stats = [
    { value: '500+', label: 'ACTIVE MEMBERS' },
    { value: '8+', label: 'YEARS RUNNING' },
    { value: '6', label: 'EXPERT TRAINERS' },
    { value: '2', label: 'DAILY SESSIONS' },
];

const values = [
    {
        num: '01',
        title: 'DISCIPLINE',
        desc: 'Results are built in the hours when it\'s hardest to show up. We build a culture that rewards consistency over motivation.',
    },
    {
        num: '02',
        title: 'COMMUNITY',
        desc: 'Every member matters. From your first session to your hundredth, you train surrounded by people who push each other forward.',
    },
    {
        num: '03',
        title: 'EXCELLENCE',
        desc: 'State-of-the-art equipment, certified coaching, and a space designed for serious training — not shortcuts.',
    },
];


const AboutPage = () => {
    const pageRef = useRef(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            // Hero reveal
            gsap.set('.about-stagger', { y: '105%' });
            gsap.to('.about-stagger', {
                y: '0%',
                duration: 1,
                ease: 'power4.out',
                stagger: 0.18,
            });

            // Stats count-up feel — slide in
            gsap.utils.toArray('.about-stat').forEach((el) => {
                gsap.from(el, {
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse',
                    },
                });
            });

            // Story section
            gsap.set('.about-story-reveal', { y: '105%' });
            gsap.to('.about-story-reveal', {
                y: '0%',
                duration: 1,
                ease: 'power4.out',
                stagger: 0.14,
                scrollTrigger: {
                    trigger: '.about-story',
                    start: 'top 72%',
                    toggleActions: 'play none none reverse',
                },
            });

            // Values rows
            gsap.utils.toArray('.about-value-item').forEach((item) => {
                gsap.from(item, {
                    y: 55,
                    opacity: 0,
                    duration: 0.85,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 83%',
                        toggleActions: 'play none none reverse',
                    },
                });
            });

            // Team cards
            gsap.utils.toArray('.about-team-card').forEach((card, i) => {
                gsap.from(card, {
                    y: 70,
                    opacity: 0,
                    duration: 0.85,
                    ease: 'power3.out',
                    delay: i * 0.1,
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse',
                    },
                });
            });

            // CTA
            gsap.set('.about-cta-reveal', { y: '105%' });
            gsap.to('.about-cta-reveal', {
                y: '0%',
                duration: 1,
                ease: 'power4.out',
                stagger: 0.15,
                scrollTrigger: {
                    trigger: '.about-cta',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                },
            });

            ScrollTrigger.refresh();
        }, pageRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={pageRef} className="w-full bg-dark text-white">
            <LandingNav />

            {/* ── Hero ─────────────────────────────────────────── */}
            <section className="about-hero">
                <div className="about-hero__inner">
                    <h1 className="about-hero__title">
                        <div className="overflow-hidden">
                            <span className="about-stagger block">WHO</span>
                        </div>
                        <div className="overflow-hidden">
                            <span className="about-stagger block about-hero__accent">WE ARE</span>
                        </div>
                    </h1>
                    <div className="about-hero__rule" />
                    <p className="about-hero__sub">
                        <span className="overflow-hidden block">
                            <span className="about-stagger block">
                                A community-first gym built in Chikkabanavara, Bengaluru — where real people come to train hard and leave stronger.
                            </span>
                        </span>
                    </p>
                </div>
            </section>

            {/* ── Stats Bar ────────────────────────────────────── */}
            <section className="about-stats">
                <div className="about-stats__inner">
                    {stats.map((s, i) => (
                        <div key={i} className="about-stat">
                            <span className="about-stat__value">{s.value}</span>
                            <span className="about-stat__label">{s.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Our Story ────────────────────────────────────── */}
            <section className="about-story">
                <div className="about-story__inner">
                    <div className="about-story__label-wrap">
                        <div className="overflow-hidden">
                            <span className="about-story-reveal about-story__eyebrow block">OUR STORY</span>
                        </div>
                    </div>
                    <div className="about-story__content">
                        <div className="about-story__img-wrap">
                            <img
                                src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=900&q=80"
                                alt="Inside Sweat Zone gym"
                                className="about-story__img"
                                loading="lazy"
                            />
                        </div>
                        <div className="about-story__text">
                            <div className="overflow-hidden">
                                <h2 className="about-story-reveal about-story__headline block">
                                    STARTED WITH<br />ONE IDEA.
                                </h2>
                            </div>
                            <div className="overflow-hidden">
                                <p className="about-story-reveal about-story__body block">
                                    Sweat Zone was founded with a single belief — that world-class fitness should be accessible
                                    to everyone in the neighbourhood, not just those who could afford premium clubs across the city.
                                </p>
                            </div>
                            <div className="overflow-hidden">
                                <p className="about-story-reveal about-story__body block">
                                    We started as a small floor with free weights and big ambitions. Over eight years we have grown
                                    into a fully equipped gym offering personal training, group fitness, a dedicated cardio zone,
                                    and strength & conditioning — all under one roof on Sri Sri Sri Shivakumara Swamiji Road.
                                </p>
                            </div>
                            <div className="overflow-hidden">
                                <p className="about-story-reveal about-story__body block">
                                    The machines have upgraded. The coaches have multiplied. The community has grown to over
                                    five hundred members. The mission has never changed.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Values ───────────────────────────────────────── */}
            <section className="about-values">
                <div className="about-values__inner">
                    <div className="about-values__header">
                        <span className="about-values__eyebrow">WHAT DRIVES US</span>
                        <h2 className="about-values__title">OUR<br /><span className="about-values__accent">VALUES</span></h2>
                    </div>
                    <div className="about-values__list">
                        {values.map((v) => (
                            <article key={v.num} className="about-value-item">
                                <span className="about-value-item__num">{v.num}</span>
                                <div className="about-value-item__content">
                                    <h3 className="about-value-item__title">{v.title}</h3>
                                    <p className="about-value-item__desc">{v.desc}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Trainer ──────────────────────────────────────── */}
            <section className="about-team">
                <div className="about-team__inner">
                    <div className="about-team__header">
                        <span className="about-team__eyebrow">THE PERSON BEHIND IT</span>
                        <h2 className="about-team__title">MEET YOUR<br /><span className="about-team__accent">TRAINER</span></h2>
                    </div>
                    <div className="about-trainer">
                        <div className="about-trainer__img-wrap">
                            <img
                                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80"
                                alt="Head Trainer"
                                className="about-trainer__img"
                                loading="lazy"
                            />
                        </div>
                        <div className="about-trainer__body">
                            <span className="about-team-card__role">HEAD TRAINER & FOUNDER</span>
                            <h3 className="about-trainer__name">MOHITH</h3>
                            <div className="about-trainer__rule" />
                            <p className="about-trainer__bio">
                                Certified strength coach with 10+ years of experience. Built Sweat Zone from the ground up
                                to serve Chikkabanavara's fitness community. Whether you're here to lose weight, build muscle,
                                or just stay active — Mohith designs every program around your body and your goals.
                            </p>
                            <ul className="about-trainer__tags">
                                <li>Strength & Conditioning</li>
                                <li>Personal Training</li>
                                <li>Cardio Programming</li>
                                <li>Nutrition Guidance</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA ──────────────────────────────────────────── */}
            <section className="about-cta">
                <div className="about-cta__inner">
                    <div className="overflow-hidden">
                        <h2 className="about-cta__title about-cta-reveal">
                            READY TO<br /><span className="about-cta__accent">JOIN US?</span>
                        </h2>
                    </div>
                    <div className="overflow-hidden">
                        <Link to="/login" className="about-cta__btn about-cta-reveal">BECOME A MEMBER</Link>
                    </div>
                </div>
            </section>

            <LandingFooter />
        </div>
    );
};

export default AboutPage;
