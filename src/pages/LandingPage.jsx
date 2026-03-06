import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LandingNav from '../components/layout/LandingNav';
import LandingFooter from '../components/layout/LandingFooter';

const LandingPage = () => {
    const heroRef = useRef(null);
    const sectionOneRef = useRef(null);
    const videoSectionRef = useRef(null);
    const videoMediaRef = useRef(null);
    const sectionThreeRef = useRef(null);
    const marqueeRef = useRef(null);
    const mobileScrollCleanup = useRef(null);
    const sectionThreeAccentText = 'BEST BENEFITS';
    const [hoveredClass, setHoveredClass] = useState(null);

    const studioClasses = [
        { id: 'personal-training', name: 'PERSONAL TRAINING', category: 'exclusive', goal: 'BUILD STRENGTH', duration: '60 MINS', membership: 'EXCLUSIVE', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&q=80' },
        { id: 'strength-conditioning', name: 'STRENGTH & CONDITIONING', category: 'exclusive', goal: 'GET STRONGER', duration: '45 MINS', membership: 'EXCLUSIVE', image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80' },
        { id: 'cardio-blast', name: 'CARDIO BLAST', category: 'exclusive', goal: 'ENDURANCE', duration: '40 MINS', membership: 'EXCLUSIVE', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80' },
        { id: 'zumba', name: 'ZUMBA', category: 'group', goal: 'FUN & FITNESS', duration: '50 MINS', membership: 'ALL MEMBERS', image: 'https://images.unsplash.com/photo-1524594152303-9fd13543fe6e?auto=format&fit=crop&w=1200&q=80' },
        { id: 'crossfit', name: 'CROSSFIT', category: 'group', goal: 'FULL BODY', duration: '45 MINS', membership: 'ALL MEMBERS', image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=1200&q=80' },
    ];

    const currentImage = hoveredClass
        ? studioClasses.find(c => c.id === hoveredClass)?.image
        : studioClasses[0].image;

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            const isMobile = window.matchMedia('(max-width: 900px)').matches;
            const textParallaxY = isMobile ? 14 : 50;
            const videoParallaxY = isMobile ? -10 : 22;
            const parallaxScrub = isMobile ? 1.35 : true;

            gsap.set('.stagger-line', { y: '100%' });
            gsap.to('.stagger-line', {
                y: '0%',
                duration: 1,
                ease: 'power4.out',
                stagger: 0.2,
            });

            if (sectionOneRef.current) {
                gsap.to('.hero-parallax-text', {
                    yPercent: textParallaxY,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: sectionOneRef.current,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: parallaxScrub,
                        invalidateOnRefresh: true,
                    },
                });
            }

            if (videoSectionRef.current && videoMediaRef.current) {
                gsap.to(videoMediaRef.current, {
                    yPercent: videoParallaxY,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: videoSectionRef.current,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: parallaxScrub,
                        invalidateOnRefresh: true,
                    },
                });
            }

            if (sectionThreeRef.current) {
                gsap.set('.section-three-stagger', { y: '105%' });
                gsap.to('.section-three-stagger', {
                    y: '0%',
                    duration: 1,
                    ease: 'power4.out',
                    stagger: 0.16,
                    scrollTrigger: {
                        trigger: sectionThreeRef.current,
                        start: 'top 62%',
                        toggleActions: 'play none none reverse',
                    },
                });
            }

            if (marqueeRef.current) {
                gsap.to('.marquee-track', {
                    xPercent: -20,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: marqueeRef.current,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1,
                    },
                });
            }

            if (isMobile) {
                const items = gsap.utils.toArray('.studio-section__item');
                const viewportMid = window.innerHeight / 2;

                const updateActive = () => {
                    let closest = null;
                    let closestDist = Infinity;

                    items.forEach((item) => {
                        const rect = item.getBoundingClientRect();
                        const itemMid = rect.top + rect.height / 2;
                        const dist = Math.abs(itemMid - viewportMid);
                        if (dist < closestDist) {
                            closestDist = dist;
                            closest = item;
                        }
                    });

                    items.forEach((item) => {
                        if (item === closest && closestDist < window.innerHeight * 0.3) {
                            item.classList.add('studio-section__item--active');
                        } else {
                            item.classList.remove('studio-section__item--active');
                        }
                    });
                };

                window.addEventListener('scroll', updateActive, { passive: true });
                updateActive();
                mobileScrollCleanup.current = () => window.removeEventListener('scroll', updateActive);
            }

            ScrollTrigger.refresh();
        }, heroRef);

        return () => {
            ctx.revert();
            if (mobileScrollCleanup.current) mobileScrollCleanup.current();
        };
    }, []);

    return (
        <div ref={heroRef} className="w-full bg-dark text-white">
            <LandingNav />

            {/* Hero Section - Full Viewport */}
            <section ref={sectionOneRef} className="landing-hero w-full h-screen md:min-h-screen flex flex-col justify-center px-4 sm:px-6 md:px-12 relative overflow-hidden pt-16 sm:pt-20">
                <div className="landing-hero__bg" aria-hidden="true" />
                <div className="landing-hero__overlay" aria-hidden="true" />
                <div className="landing-hero__content relative z-10 w-full">
                    <div className="hero-parallax-text landing-hero__lead max-w-[760px]">
                        <h1 className="text-[clamp(2.2rem,7.6vw,6.2rem)] font-black leading-[0.9] tracking-tight uppercase italic">
                            <div className="overflow-hidden">
                                <span className="stagger-line block">TRAIN TODAY.</span>
                            </div>
                            <div className="overflow-hidden">
                                <span className="stagger-line block text-primary">GROW TOMORROW.</span>
                            </div>
                        </h1>
                        <Link to="/login" className="landing-hero__cta mt-6 sm:mt-8 inline-flex">
                            <span>GET STARTED</span>
                        </Link>
                    </div>
                    <div className="hero-parallax-text landing-hero__summary pt-6 sm:pt-8 text-[clamp(1rem,1.3vw,1.55rem)] leading-relaxed text-neutral-200">
                        <div className="landing-hero__summary-inner">
                            <div className="overflow-hidden">
                                <span className="stagger-line block">Your ultimate gym management platform.</span>
                            </div>
                            <div className="overflow-hidden">
                                <span className="stagger-line block">Streamline memberships, track attendance,</span>
                            </div>
                            <div className="overflow-hidden">
                                <span className="stagger-line block">manage payments, and grow your fitness</span>
                            </div>
                            <div className="overflow-hidden">
                                <span className="stagger-line block">community - all in one powerful system.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section ref={videoSectionRef} className="w-full h-screen relative overflow-hidden bg-black">
                <video
                    ref={videoMediaRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                >
                    <source
                        src="https://res.cloudinary.com/dkxvt2gwp/video/upload/v1771188775/gym_video_ld9jqe.mp4"
                        type="video/mp4"
                    />
                </video>
                <div className="video-overlay">
                    <div className="video-overlay__content">
                        <h2 className="video-overlay__headline">
                            PUSH YOUR <span className="text-primary">LIMITS</span>
                        </h2>
                        <p className="video-overlay__sub">
                            State-of-the-art equipment. World-class trainers. Your transformation starts here.
                        </p>
                    </div>
                </div>
            </section>

            <section ref={sectionThreeRef} className="landing-section-three relative bg-white text-black overflow-hidden">
                <span className="landing-section-three__curve" aria-hidden="true" />
                <div className="landing-section-three__inner relative z-10">
                    <h2 className="landing-section-three__headline" aria-label="Membership with best benefits">
                        <span className="block overflow-hidden">
                            <span className="landing-section-three__line section-three-stagger">MEMBERSHIP</span>
                        </span>
                        <span className="block overflow-hidden">
                            <span className="landing-section-three__line landing-section-three__line--second section-three-stagger">
                                <span>WITH</span>
                                <span className="landing-section-three__spark" aria-hidden="true">&#10022;</span>
                                <span className="landing-section-three__accent landing-section-three__accent-letters" aria-label="BEST BENEFITS">
                                    {sectionThreeAccentText.split('').map((char, index) => (
                                        <span
                                            key={`accent-char-${index}`}
                                            className="landing-section-three__accent-char-wrap"
                                            style={{ '--accent-index': index }}
                                            aria-hidden="true"
                                        >
                                            <span className="landing-section-three__accent-char-track">
                                                <span className="landing-section-three__accent-char-glyph">{char === ' ' ? '\u00A0' : char}</span>
                                                <span className="landing-section-three__accent-char-glyph">{char === ' ' ? '\u00A0' : char}</span>
                                            </span>
                                        </span>
                                    ))}
                                </span>
                            </span>
                        </span>
                    </h2>
                </div>
            </section>

            <section className="landing-perks bg-white text-black px-4 sm:px-6 md:px-12 pt-0 pb-10 md:pb-14">
                <div className="landing-perks__grid max-w-[1600px] mx-auto">
                    <article className="landing-perks__item">
                        <img
                            src="https://picsum.photos/id/1005/1200/1200"
                            alt="Personal coaching at the gym"
                            className="landing-perks__image"
                            loading="lazy"
                        />
                        <h3 className="landing-perks__title">EXPERIENCED COACHES</h3>
                    </article>

                    <article className="landing-perks__item">
                        <img
                            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80"
                            alt="Gym with equipment"
                            className="landing-perks__image"
                            loading="lazy"
                        />
                        <h3 className="landing-perks__title">BEST EQUIPMENT</h3>
                    </article>

                    <article className="landing-perks__item">
                        <img
                            src="https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1200&q=80"
                            alt="Dedicated cardio section"
                            className="landing-perks__image"
                            loading="lazy"
                        />
                        <h3 className="landing-perks__title">DEDICATED CARDIO ZONE</h3>
                    </article>
                </div>
            </section>

            {/* Scrolling Marquee */}
            <section ref={marqueeRef} className="marquee-section">
                <div className="marquee-track">
                    {[...Array(6)].map((_, i) => (
                        <span key={`marquee-${i}`} className="marquee-text">
                            START FAST. FINISH FASTER.
                        </span>
                    ))}
                </div>
            </section>

            {/* Our Classes Header */}
            <section className="classes-header">
                <div className="classes-header__inner">
                    <h2 className="classes-header__title">WHAT WE<br />PROVIDE</h2>
                    <div className="classes-header__desc">
                        <span className="classes-header__bracket">[</span>
                        <p>Learn how to exercise with proper form in a full-body workout that targets overall flexibility, strength and stability.</p>
                        <span className="classes-header__bracket">]</span>
                    </div>
                </div>
                <div className="classes-header__line" />
            </section>

            {/* Studio Classes Section */}
            <section className="studio-section">
                <div className="studio-section__grid">
                    <div className="studio-section__image">
                        {studioClasses.map((cls) => (
                            <img
                                key={cls.id}
                                src={cls.image}
                                alt={cls.name}
                                loading="lazy"
                                className={`studio-section__img ${(hoveredClass === cls.id || (!hoveredClass && cls.id === 'personal-training')) ? 'studio-section__img--active' : ''}`}
                            />
                        ))}
                    </div>
                    <div className="studio-section__content">
                        <h3 className="studio-section__category-label">EXCLUSIVE STUDIO</h3>
                        <div className="studio-section__list">
                            {studioClasses.filter(c => c.category === 'exclusive').map((cls, i) => (
                                <div key={cls.id}>
                                    <div className="studio-section__item" onMouseEnter={() => setHoveredClass(cls.id)} onMouseLeave={() => setHoveredClass(null)}>
                                        <span className="studio-section__item-name">{cls.name}</span>
                                        <div className="studio-section__item-details">
                                            <div className="studio-section__detail">
                                                <span className="studio-section__detail-label">GOAL</span>
                                                <span className="studio-section__detail-value">{cls.goal}</span>
                                            </div>
                                            <div className="studio-section__detail">
                                                <span className="studio-section__detail-label">DURATION</span>
                                                <span className="studio-section__detail-value">{cls.duration}</span>
                                            </div>
                                            <div className="studio-section__detail">
                                                <span className="studio-section__detail-label">MEMBERSHIP</span>
                                                <span className="studio-section__detail-value">{cls.membership}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {i < studioClasses.filter(c => c.category === 'exclusive').length - 1 && (
                                        <div className="studio-section__divider" />
                                    )}
                                </div>
                            ))}
                        </div>

                        <h3 className="studio-section__category-label studio-section__category-label--second">GROUP FITNESS</h3>
                        <div className="studio-section__list">
                            {studioClasses.filter(c => c.category === 'group').map((cls, i) => (
                                <div key={cls.id}>
                                    <div className="studio-section__item" onMouseEnter={() => setHoveredClass(cls.id)} onMouseLeave={() => setHoveredClass(null)}>
                                        <span className="studio-section__item-name">{cls.name}</span>
                                        <div className="studio-section__item-details">
                                            <div className="studio-section__detail">
                                                <span className="studio-section__detail-label">GOAL</span>
                                                <span className="studio-section__detail-value">{cls.goal}</span>
                                            </div>
                                            <div className="studio-section__detail">
                                                <span className="studio-section__detail-label">DURATION</span>
                                                <span className="studio-section__detail-value">{cls.duration}</span>
                                            </div>
                                            <div className="studio-section__detail">
                                                <span className="studio-section__detail-label">MEMBERSHIP</span>
                                                <span className="studio-section__detail-value">{cls.membership}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {i < studioClasses.filter(c => c.category === 'group').length - 1 && (
                                        <div className="studio-section__divider" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <LandingFooter />
        </div>
    );
};

export default LandingPage;

