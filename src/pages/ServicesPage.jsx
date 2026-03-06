import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LandingNav from '../components/layout/LandingNav';
import LandingFooter from '../components/layout/LandingFooter';

const services = [
    {
        id: '01',
        name: 'PERSONAL TRAINING',
        tag: 'EXCLUSIVE',
        desc: 'One-on-one sessions with our certified trainers. Every program is built around your body, your goals, and your schedule — no guesswork, just results.',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=900&q=80',
    },
    {
        id: '02',
        name: 'GROUP FITNESS',
        tag: 'ALL MEMBERS',
        desc: 'High-energy classes for every level — Zumba, CrossFit, HIIT and more. When you train together, you push harder.',
        image: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?auto=format&fit=crop&w=900&q=80',
    },
    {
        id: '03',
        name: 'STRENGTH & CONDITIONING',
        tag: 'EXCLUSIVE',
        desc: 'Free weights, barbells, cables — everything you need to build real power. Expert guidance to keep your form sharp and your progress steady.',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=900&q=80',
    },
    {
        id: '04',
        name: 'CARDIO ZONE',
        tag: 'ALL MEMBERS',
        desc: 'Dedicated treadmills, bikes, and rowing machines. Chase endurance, burn calories, and feel the difference a focused cardio session makes.',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80',
    },
];

const ServicesPage = () => {
    const pageRef = useRef(null);
    const listRef = useRef(null);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            // Hero reveal
            gsap.set('.svc-stagger', { y: '105%' });
            gsap.to('.svc-stagger', {
                y: '0%',
                duration: 1,
                ease: 'power4.out',
                stagger: 0.18,
            });

            // Each service row on scroll
            gsap.utils.toArray('.services-item').forEach((item) => {
                gsap.from(item, {
                    y: 60,
                    opacity: 0,
                    duration: 0.85,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 82%',
                        toggleActions: 'play none none reverse',
                    },
                });
            });

            // CTA reveal
            gsap.set('.svc-cta-reveal', { y: '105%' });
            gsap.to('.svc-cta-reveal', {
                y: '0%',
                duration: 1,
                ease: 'power4.out',
                stagger: 0.15,
                scrollTrigger: {
                    trigger: '.services-cta',
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

            {/* Hero */}
            <section className="services-hero">
                <div className="services-hero__inner">
                    <h1 className="services-hero__title">
                        <div className="overflow-hidden">
                            <span className="svc-stagger block">OUR</span>
                        </div>
                        <div className="overflow-hidden">
                            <span className="svc-stagger block services-hero__accent">SERVICES</span>
                        </div>
                    </h1>
                    <div className="services-hero__rule" />
                    <p className="services-hero__sub">
                        <span className="overflow-hidden block">
                            <span className="svc-stagger block">Four programs. Zero compromises. One goal — your transformation.</span>
                        </span>
                    </p>
                </div>
            </section>

            {/* Services List */}
            <section ref={listRef} className="services-list">
                {services.map((service) => (
                    <article key={service.id} className="services-item">
                        <span className="services-item__num" aria-hidden="true">{service.id}</span>
                        <div className="services-item__content">
                            <span className="services-item__tag">{service.tag}</span>
                            <h2 className="services-item__name">{service.name}</h2>
                            <p className="services-item__desc">{service.desc}</p>
                        </div>
                        <div className="services-item__img-wrap">
                            <img
                                src={service.image}
                                alt={service.name}
                                className="services-item__img"
                                loading="lazy"
                            />
                        </div>
                    </article>
                ))}
            </section>

            {/* CTA */}
            <section className="services-cta">
                <div className="services-cta__inner">
                    <div className="overflow-hidden">
                        <h2 className="services-cta__title svc-cta-reveal">READY TO<br /><span className="services-cta__accent">START?</span></h2>
                    </div>
                    <div className="overflow-hidden">
                        <Link to="/login" className="services-cta__btn svc-cta-reveal">JOIN TODAY</Link>
                    </div>
                </div>
            </section>

            <LandingFooter />
        </div>
    );
};

export default ServicesPage;
