// ==========================================
// Order of Da Vinci - Main JavaScript
// ==========================================

document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
        });
    });

    // Smooth scroll for navigation links (handles pure #hash anchors on same page)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Ignore bare "#" links (used as placeholders)
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
            // If target doesn't exist on this page, let the browser navigate normally
        });
    });

    // Active nav link — page-level + scroll-based
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Determine the active page link from the current filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    function setPageActiveLink() {
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            // Match by filename; treat empty/root as index.html
            const linkPage = href.split('/').pop().split('#')[0] || 'index.html';
            if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    // Set on load
    setPageActiveLink();

    // On index.html, also update active link while scrolling through sections
    window.addEventListener('scroll', function() {
        if (sections.length === 0) return;
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        if (current) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        } else {
            // No scroll section matched — restore page-level active
            setPageActiveLink();
        }
    });

    // Member filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const memberCards = document.querySelectorAll('.member-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active from all
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            memberCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Scroll reveal animation
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = function() {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Check on load

    // Shared lightbox builder (used by gallery items and achievement images)
    const openImageLightbox = (src, alt, caption) => {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="${src}" alt="${alt}">
                ${caption ? `<p>${caption}</p>` : ''}
                <button class="lightbox-close" aria-label="Close">&times;</button>
            </div>
        `;

        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.25s ease;
        `;

        const lightboxContent = lightbox.querySelector('.lightbox-content');
        lightboxContent.style.cssText = `
            position: relative;
            max-width: 90%;
            max-height: 90%;
        `;

        const lightboxImg = lightbox.querySelector('img');
        lightboxImg.style.cssText = `
            max-width: 100%;
            max-height: 80vh;
            object-fit: contain;
            border-radius: 8px;
        `;

        const lightboxText = lightbox.querySelector('p');
        if (lightboxText) {
            lightboxText.style.cssText = `
                color: #fff;
                text-align: center;
                margin-top: 15px;
                font-size: 1.1rem;
            `;
        }

        const closeBtn = lightbox.querySelector('.lightbox-close');
        closeBtn.style.cssText = `
            position: absolute;
            top: -40px;
            right: 0;
            background: none;
            border: none;
            color: #fff;
            font-size: 2rem;
            cursor: pointer;
        `;

        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(() => { lightbox.style.opacity = '1'; });

        const closeLightbox = () => {
            lightbox.style.opacity = '0';
            setTimeout(() => lightbox.remove(), 200);
            document.body.style.overflow = '';
            document.removeEventListener('keydown', escapeClose);
        };

        function escapeClose(e) {
            if (e.key === 'Escape') closeLightbox();
        }

        lightbox.addEventListener('click', closeLightbox);
        lightboxContent.addEventListener('click', (e) => e.stopPropagation());
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeLightbox();
        });
        document.addEventListener('keydown', escapeClose);
    };

    // Gallery lightbox (simple)
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            if (!img) return;
            const overlayEl = this.querySelector('.gallery-overlay span');
            const overlayText = overlayEl ? overlayEl.textContent : img.alt;
            openImageLightbox(img.src, img.alt, overlayText);
        });
    });

    // Achievement / recognition / training card image lightbox
    const achievementImages = document.querySelectorAll('.achievement-card .card-img, .achievement-card .achievement-img, .training-program-image .card-img');

    achievementImages.forEach(img => {
        img.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.achievement-card, .training-program-image');
            const heading = card ? card.closest('section').querySelector('h2, h3, h4') : null;
            openImageLightbox(this.src, this.alt, heading ? heading.textContent : this.alt);
        });
    });

    // Event card image lightbox
    const eventImages = document.querySelectorAll('.event-card img');

    eventImages.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.event-card');
            const heading = card ? card.querySelector('h3') : null;
            openImageLightbox(this.src, this.alt, heading ? heading.textContent : this.alt);
        });
    });

    // Services feature image lightbox (home & services pages)
    const servicesFeatureImages = document.querySelectorAll('.services-feature-image img');

    servicesFeatureImages.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', function(e) {
            e.stopPropagation();
            openImageLightbox(this.src, this.alt, this.alt);
        });
    });

    // Subject dropdown — auto-fills the Subject field, which stays editable
    const subjectType  = document.getElementById('subjectType');
    const subjectField = document.getElementById('subject');
    if (subjectType && subjectField) {
        subjectType.addEventListener('change', function() {
            if (this.value === 'Other') {
                subjectField.value = '';
            } else {
                subjectField.value = this.value;
            }
            subjectField.focus();
        });
    }

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields.');
                return;
            }
            
            // Show success message (in real app, send to server)
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }

    // Preloader
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        });
    }

    // ==========================================
    // Position Slideshow
    // ==========================================

    const membersData = [
        {
            position: "Founding Master",
            category: "founder",
            members: [
                { name: "Louie Jay Torralba", image: "Photos/Louie%20Jay%20Torralba,%20Founder,%20Founding%20Grand%20Master.jpg", bio: "Founder of the Order of Da Vinci, providing visionary leadership and direction.", fullBio: "Mr. Louie Jay Torralba, Graduated in Agusan del Sur State College of Agriculture and Technology with Bachelor of Arts in English Language and Currently Taking Master of Arts in Education in Applied Linguistics. He served as a Supreme Student Government President both during High School and College Days and an Active Leaders of various organization. His passion for service extends beyond leadership as Enriornmental Advocate, a Disaster Risk Reduction Volunteer, and a firm believer in Education and Community Empowerment. " }
            ]
        },
        {
            position: "Grand Masters",
            category: "grandmaster",
            members: [
                { name: "Christian Jay B. Gumapac", image: "Photos/Christian%20Jay%20B.%20Gumapac,%20Founding%20Grand%20Master.jpg", bio: "Guiding the order with dedication and a passion for interdisciplinary excellence.", fullBio: "Mr. Christian Jay B. Gumapac, Currently Taking up Bachelor of Science in Agricultural and Biosystems Engineering  at Agusan del Sur State College of Agriculture and Technology, Bunawan, Agusan del Sur. He is an Active Youth Leader of Barangay Hawilian, Esperanza, Agusan del Sur as Sanguniang Kabataan Chairman. He is also the Former President of Kab-ot Youth Organization and Former Vice President of ASSCAT Supreme Student Government Main Campus. Lastly He is a champion of Student Leadership, Accountability, Transparency and Volunteerism." },
                { name: "Ian Albert S. Dela Pena", image: "Photos/Ian%20Albert%20S.%20Dela%20Pena,%20Founding%20Grand%20Master.jpg", bio: "Committed to fostering innovation and service within the Da Vinci community.", fullBio: "Mr. Ian Albert S. Dela Peña, Graduated Bachelor of Science in Civil Engineering at ASSCAT. He is a Former ASSCAT Supreme Student Government President 2021-2022, Former Caraga Federation of Tertiary Student Leaders Vice President, Delegate of Ayala Young Leaders Congress 2022, Delegate of MasterPEACE V, Delegate of the National Sectoral Council of the National Anti-Poverty Commission Youth and Student Sector and Delegate of National Youth Parliament for Region 10 and Caraga. One of the Bagani Outstanding Agsurnon Youth Awardee 2022 and One of the Top 25 of Outstanding Student Leaders of the Philippines 2024." },
                { name: "Z-rabih M. Maturan", image: "Photos/9d954659-7186-4875-a880-3da9565ab429.jpg", bio: "Dedicated to upholding the values and mission of the order through exemplary leadership.", fullBio: "Mr. Z-Rabih M. Maturan, a 26-year-old resident of Purok 13, Sitio Tagbayog, Awao, Santa Josefa, Agusan del Sur, was born on October 15, 1999. He earned a Bachelor of Science in Psychology from Caraga State University, where he developed a strong understanding of human behavior, communication, and interpersonal relationships. His academic background has shaped his ability to interact effectively with others and adapt to different situations. He practices a situational leadership style, emphasizing flexibility and responsiveness to challenges. Z-Rabih possesses key skills in leadership, public speaking, communication, project management, and teamwork, enabling him to contribute positively in group settings. Although his community involvement is limited, he recognizes its importance and is willing to participate in future initiatives. Aspiring to become a Grand Master of the Order of Da Vinci, he aims to promote unity, inclusivity, and excellence while contributing to the growth and development of the organization and its members." },
                { name: "Emmanuel tambong Monte Jr.", image: "Photos/900db16f-ab04-4dd1-ae4a-9f956ef44679.jpg", bio: "Active member contributing to the order's vision and goals.", fullBio: "Mr. Emanuel Tambong Monte Jr. was born on May 18, 2001, in P-5 Magsaysay, Prosperidad, Agusan del Sur, where he also currently resides. He is a fourth-year student of Bachelor of Science in Agriculture major in Animal Science. Emanuel is recognized for his dedication, perseverance, and passion for learning, which have guided him throughout his academic journey. He has earned distinctions with honors during his studies, reflecting his commitment to excellence both in academics and personal growth.Beyond the classroom, Emanuel enjoys engaging in various hobbies such as basketball, running, and drawing, which showcase his balance between physical discipline and artistic creativity. His enthusiasm, hardworking nature, and well-rounded character highlight his potential as a future professional and an inspiring individual in his community. When Emanuel joined Kab-ot Youth Organization (KYO) and the Order of Da Vinci (ODV), he discovered a deeper understanding of leadership and brotherhood. These organizations, known for their advocacy and humanitarian initiatives, became the platform where he cultivated both his character and sense of purpose. From a young leader in his hometown to a servant-hearted student in his college community, Emanuel Monte Jr. stands as an inspiring reminder that true leadership begins with the willingness to serve — and that the spirit of volunteerism knows no boundaries." }
            ]
        },
        {
            position: "President",
            category: "officer",
            members: [
                { name: "Julianne Tristan Dequiña", image: "Photos/Julianne%20Tristan%20Dequiña,%20President.jpg", bio: "Leading the Order with vision, dedication, and a commitment to excellence.", fullBio: "Julianne Tristan Encarnacion Dequiña was born on July 13, 2006, in Veruela, Agusan del Sur. He is currently pursuing a Bachelor of Science in Information Technology (BSIT), aiming to build a career in the ever-evolving world of digital technology and innovation. A proud graduate of Veruela National High School, Julianne completed the Humanities and Social Sciences (HUMSS) strand With Honors, showcasing his academic diligence and well-rounded capabilities. He also received the Leonardo Da Vinci Excellence Award through his Outstanding performance in the Order of Da Vinci. In his free time, he enjoys jogging, walking, and hiking, activities that reflect his active lifestyle and appreciation for the outdoors." },
            ]
        },

        {
            position: "Vice President",
            category: "officer",
            members: [
                { name: "Regie N. Tandoc", image: "Photos/Regie%20N.%20Tandoc,%20Vice%20President.jpg", bio: "Supporting the President in strategic planning and organizational growth.", fullBio: "Regie N. Tandoc was born on March 15, 2006, in San Francisco, Agusan del Sur, where he currently resides in Purok 2, Bayugan 2. He is pursuing a Bachelor of Science in Civil Engineering (BSCE), reflecting his interest in design, construction, and infrastructure development. A graduate of Agusan del Sur National High School, Regie completed the General Academic Strand (GAS) and was recognized With Honors for his academic performance. In addition to his studies, he enjoys playing basketball and reading books, hobbies that balance both physical activity and intellectual growth." }
            ]
        },

        {
            position: "Secretary",
            category: "officer",
            members: [
                { name: "Jhon Dave Cadiog,", image: "Photos/Jhon%20Dave%20Cadiog,%20Secretary%20.jpg", bio: "Managing communications and maintaining organizational records.", fullBio: "Jhon Dave Cadiog was born on March 15, 2006, in San Francisco, Agusan del Sur. He currently resides in Purok 2, Bayugan 2, and is pursuing a Bachelor of Science in Civil Engineering (BSCE). Jhon Dave is a proud graduate of Agusan del Sur National High School, where he completed the General Academic Strand (GAS) and was recognized With Honors for his academic performance. In his free time, he enjoys playing basketball and reading books, hobbies that balance both physical activity and intellectual growth." }
            ]
        },
        {
            position: "Treasurer",
            category: "officer",
            members: [
                { name: "Christian Jay P. Eupena", image: "Photos/Christian%20Jay%20P.%20Eupena,%20Treasurer.jpg", bio: "Managing financial records and ensuring fiscal responsibility.", fullBio: "Christian Jay P. Eupeña was born on November 15, 2006, in San Francisco, Agusan del Sur. He currently resides in Purok 2, Bayugan 2, and is pursuing a Bachelor of Science in Civil Engineering (BSCE). Christian is a proud graduate of Agusan del Sur National High School, where he completed the General Academic Strand (GAS) and was recognized With Honors for his academic performance. In his free time, he enjoys playing basketball and reading books, hobbies that balance both physical activity and intellectual growth." }
            ]
        },
        {
            position: "Auditor",
            category: "officer",
            members: [
                { name: "Jhon Mark S. Pacional", image: "Photos/Jhon%20Mark%20S.%20Pacional,%20Auditor.jpg", bio: "Overseeing financial audits and ensuring compliance.", fullBio: "Jhon Mark S. Pacional was born on March 15, 2006, in San Francisco, Agusan del Sur. He currently resides in Purok 2, Bayugan 2, and is pursuing a Bachelor of Science in Civil Engineering (BSCE). Jhon Mark is a proud graduate of Agusan del Sur National High School, where he completed the General Academic Strand (GAS) and was recognized With Honors for his academic performance. In his free time, he enjoys playing basketball and reading books, hobbies that balance both physical activity and intellectual growth." }
            ]
        },
        {
            position: "Training & Membership Coordinators",
            category: "coordinator",
            members: [
                 { name: "Zieff Aaron Encluna", image: "Photos/Zeiff.jpg", bio: "Organizing trainings and managing membership processes.", fullBio: "Zieff Aaron Hadlocon Encluna was born on February 19, 2006, in Quezon City, National Capital Region. He currently resides in Purok 2, Bayugan 2, San Francisco, Agusan del Sur, and is pursuing a Bachelor of Science in Civil Engineering (BSCE)—a field that matches his passion for design, precision, and problem-solving. Zieff is a proud graduate of Agusan del Sur National High School, where he completed the General Academic Strand (GAS) and was consistently recognized With Honors from Grade 7 to Grade 12, reflecting his strong academic performance and discipline. Beyond his studies, he enjoys playing basketball and reading books, hobbies that balance both physical activity and intellectual growth." },
                { name: "Cyrill Jade B. Batobalane", image: "Photos/Cyrill%20Jade%20B.%20Batobalani,%20Training%20and%20Membership%20Coordinator.jpg", bio: "Organizing trainings and managing membership processes.", fullBio: "Cyrill Jade Bahian Batobalane was born on July 9, 2006, in Veruela, Agusan del Sur, where he also currently resides in Poblacion. He is taking up a Bachelor of Science in Agroforestry, inspired by his interest in sustainable agriculture and environmental conservation. A proud graduate of Veruela National High School, Cyrill completed the Humanities and Social Sciences (HUMSS) strand and was recognized as a Leadership Awardee, reflecting his dedication to service and responsibility as a student leader. In his free time, he enjoys photography, basketball, and badminton, balancing creativity, athleticism, and active engagement in his personal life." },
                { name: "Jumarie R. Pastor", image: "Photos/Jumarie%20R.%20Pastor,%20Training%20and%20Membership%20Coordinator.jpg", bio: "Facilitating member engagement and professional development.", fullBio: "Jumarie Ramos Pastor was born on May 3, 2004, and resides in P-2 Hubang, San Francisco, Agusan del Sur. He is currently taking up a Bachelor of Science in Civil Engineering (BSCE), combining his technical background with a passion for building and innovation. A graduate of Agusan del Sur National High School, Jumarie finished senior high school under the Technical-Vocational-Livelihood (TVL) strand With High Honors. He is also a National Certificate II (NC II) holder in RAC Servicing (DOMRAC), showcasing his hands-on skills in refrigeration and air-conditioning systems. Jumarie enjoys basketball, mobile games, and playing the guitar. He is also known for his practical skills in cleaning and repairing household appliances, reflecting both his resourcefulness and technical aptitude." }
            ]
        },
        {
            position: "Peace Relation Coordinator",
            category: "coordinator",
            members: [
                { name: "Laurence Villaluna", image: "Photos/laurence%20Villaluna,%20Peace%20Relation%20Coordinator.jpg", bio: "Promoting peace initiatives and collaborative outreach programs.", fullBio: "Laurence Menendez Villaluna was born on October 20, 2006, in San Andres, Bunawan, Agusan del Sur, and currently lives in Mambalili, Bunawan, Agusan del Sur. He is pursuing a Bachelor of Science in Civil Engineering, reflecting his strong interest in engineering and innovation. Laurence graduated from Father Saturnino Urios College of Trento, Inc., where he completed his senior high school under the Science, Technology, Engineering, and Mathematics (STEM) strand With Honors, highlighting his academic excellence and determination. In his free time, he enjoys playing basketball, demonstrating both his love for sports and teamwork." }
            ]
        },
        {
            position: "Relation Coordinator",
            category: "coordinator",
            members: [
                { name: "Aian James G. Perez", image: "Photos/Aian%20James%20G.%20Perez,%20Relation%20Coordinator.jpg", bio: "Building strong relationships with partners and the community.", fullBio: "Aian James Gohitia Perez was born on October 3, 2006, in P-10 Del Monte, Talacogon, Agusan del Sur, where he also currently resides. He is pursuing a Bachelor of Science in Civil Engineering (BSCE), reflecting his passion for structure, design, and innovation. He is a consistent achiever graduated With Honors from Del Monte National High School and received accolades such as the School Choir Award and 1st Place in Science Month’s Scientist Kaloka Like & Talent Competition. He further distinguished himself by earning multiple awards in College, including the Academic Excellence Award, Civic Engagement Award, Leadership Award, Exemplary Award, and Outstanding Volunteer Award. In his free time, Aian enjoys playing outdoor games, drawing, and dancing, showcasing his vibrant personality and versatile talents both inside and outside the classroom." }
            ]
        },
        {
            position: "Organizational Coordinator",
            category: "coordinator",
            members: [
                { name: "Grysther Kieth Ibarra", image: "Photos/Grysther%20Kieth%20Ibarra,%20Organizational%20Coordinator.jpg", bio: "Ensuring smooth internal operations and event coordination.", fullBio: "Grayster Keith Remerata Ibarra was born on February 20, 2006, in Butuan City and currently resides in Purok 7, Del Monte, Talacogon, Agusan del Sur. He is pursuing a Bachelor of Science in Civil Engineering, aiming to build a future in structural design and engineering innovation. He graduated With Honor from Del Monte National High School, where he took the Science, Technology, Engineering, and Mathematics (STEM) strand—demonstrating academic strength and a passion for technical subjects. In his free time, Grayster enjoys playing online games and basketball, balancing mental focus with physical activity." }
            ]
        },
        {
            position: "Members",
            category: "member",
            members: [
                { name: "Charles Benedic Dator", image: "Photos/Charles%20Benedic%20Dator,%20Member.jpg", bio: "Active contributor to community projects and organizational events.", fullBio: "Charles Benedict Caayon Dator was born on April 27, 2006, in Ormoc City, Leyte, and currently resides in Cecilia, San Luis, Agusan del Sur. He is taking up a Bachelor of Science in Civil Engineering (BSCE), driven by his interest in building and design. A graduate of Zillovia National High School, Charles completed the Generaal Academic Strand (GAS) and earned recognition With Honor. He is also known for his excellence in performance and personality, having been crowned Mr. ZNHS 2023 and awarded Best Actor in Oral Communication the same year. In addition to his academic and extracurricular achievements, Charles enjoys joining pageants and singing, showcasing his confidence, charisma, and creative flair." },
                { name: "Prince Jimenez", image: "Photos/Prince%20Jimenez,%20Member.jpg", bio: "Engaged member supporting the order's mission of service.", fullBio: "Prince Animo Jimenez was born on July 30, 2006, in Cabadbaran City and currently resides in Purok 1, San Andres, Bunawan, Agusan del Sur. He is pursuing a Bachelor of Science in Civil Engineering, motivated by a strong interest in design, construction, and infrastructure development. Prince is a graduate of Bunawan National High School, where he completed the Accountancy, Business, and Management (ABM) strand and earned recognition With Honors for his academic excellence. Outside his studies, he is passionate about music and enjoys playing both the guitar and the piano, demonstrating creativity and discipline in both academics and the arts." },
                { name: "Jemar Morgado", image: "Photos/Jemar%20Morgado,%20Member.jpg", bio: "Dedicated to growth and collaboration within the Da Vinci community.", fullBio: "Jemar Guzon Morgado was born on September 11, 2006, in Maasin, Leyte, and currently resides in Purok 1, Azpetia, Prosperidad, Agusan del Sur. He is pursuing a Bachelor of Science in Civil Engineering (BSCE), inspired by a passion for structural design and technical innovation. Jemar graduated With Honors from Azpetia National High School, under the General Academic Strand (GAS)—a testament to his dedication and academic discipline. Outside academics, he enjoys playing sports and playing the guitar, showcasing his energy, creativity, and love for music and physical activity." },
                { name: "Reyzlie Arnaldo", image: "Photos/Reyzlie%20Arnaldo,%20Member.jpg", bio: "Committed to excellence and active participation in order activities.", fullBio: "Reyzlie Dominic Danieles Arnaldo was born on August 7, 2006, at Elisa R. Ochoa Memorial and Maternity General Hospital (EROMMGH) in Butuan City. He currently resides in Purok 3, Guadalupe, Esperanza, Agusan del Sur, and is enrolled in the Bachelor of Science in Civil Engineering (BSCE) program—pursuing his aspirations in the field of infrastructure and development. He is a graduate of Noli National High School, where he completed the Humanities and Social Sciences (HUMSS) strand and was recognized With Honors for his academic performance and dedication. Reyzlie is known for his strength in active listening and communication skills, which are essential traits for both leadership and teamwork in his field of study." },
                { name: "Zenmar Borres", image: "Photos/Zenmar%20Borres.jpg", bio: "Passionate member contributing to the order's vision and goals.", fullBio: "Zenmar Moril Borres was born on November 15, 2005, in Bislig City and currently resides at #3B Mambalili, Bunawan, Agusan del Sur. He is pursuing a Bachelor of Science in Civil Engineering, reflecting his strong foundation in mathematics and engineering principles. A consistent honor student from Grade 7 to Grade 12, Zenmar graduated from De La Salle John Bosco College under the Science, Technology, Engineering, and Mathematics (STEM) strand. His academic journey showcases dedication, discipline, and excellence. Outside of academics, Zenmar enjoys playing badminton that complements his active lifestyle and determination." },
                { name: "Ramil Paciano Atog", image: "Photos/86bbf800-b183-4a69-bb7c-6044e57be0f6.jpg", bio: "Enthusiastic member actively involved in order initiatives and projects.", fullBio: "Ramil Paciano Atog was born on June 23, 2006, in Manay, Mati, Davao Oriental, and currently resides in Prk. 15A Durian, Bayugan 3, Rosario, Agusan del Sur. He is a student of Bachelor of Secondary Education major in Science, known for his academic dedication and artistic talents. He is a consistent achiever, having earned multiple distinctions such as Mr. PHSFI 2023, Best in Research, Best in Performing Arts, Leadership Awardee, Artist of the Year, and With Honor recognition during his senior high school years at Philsaga High School Foundation Incorporated (PHSFI). He is a dynamic and adaptable individual with a passion for badminton, digital editing, and creative pursuits. His strengths in leadership and adaptability reflect his potential as both an educator and a community role model." },
                { name: "Lord Daven Heinz Begot A. Parcon", image: "Photos/583f5957-495e-4295-810c-d1e31ee9eb57.jpg", bio: "Dedicated member actively participating in order activities and initiatives.", fullBio: "LORD DAVEN HEINZ BEGOTA PARCON was born on July 6, 2004, in Sto. Tomas, Loreto, Agusan del Sur. He is currently pursuing Bachelor in Industrial Technology major in Electrical Technology (BINDTECH-ELX 3A) and resides in Purok 5, Sto. Tomas, Loreto, Agusan del Sur." }
            ]
        }
    ];

    class PositionSlideshow {
        constructor(container, data) {
            this.container = container;
            this.data = data;
            this.members = data.members;
            this.currentIndex = 0;
            this.interval = null;
            this.isPaused = false;
            this.transitionDuration = 800; // ms
            this.slideDuration = 4000; // ms

            this.imagesContainer = container.querySelector('.slideshow-images');
            this.nameEl = container.querySelector('.member-name');
            this.bioEl = container.querySelector('.member-description');
            this.dotsContainer = container.querySelector('.slideshow-dots');
            this.prevBtn = container.querySelector('.slideshow-nav.prev');
            this.nextBtn = container.querySelector('.slideshow-nav.next');

            this.init();
        }

        init() {
            // Build image elements and dots
            this.members.forEach((member, index) => {
                const img = document.createElement('img');
                img.src = member.image;
                img.alt = member.name;
                img.dataset.index = index;
                if (index === 0) img.classList.add('active');
                this.imagesContainer.appendChild(img);

                const dot = document.createElement('button');
                dot.setAttribute('aria-label', `View ${member.name}`);
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.goTo(index);
                });
                this.dotsContainer.appendChild(dot);
            });

            // Set initial text
            this.updateText();

            // Start auto-rotation if multiple members
            if (this.members.length > 1) {
                this.start();

                // Hover to pause
                this.container.addEventListener('mouseenter', () => this.pause());
                this.container.addEventListener('mouseleave', () => this.start());

                // Navigation buttons
                if (this.prevBtn) {
                    this.prevBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.prev();
                    });
                }
                if (this.nextBtn) {
                    this.nextBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.next();
                    });
                }
            }

            // Click image to open lightbox
            this.imagesContainer.addEventListener('click', () => {
                openLightbox(this.members[this.currentIndex], this.data.position);
            });

            // Click member name to open description lightbox
            if (this.nameEl) {
                this.nameEl.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openLightbox(this.members[this.currentIndex], this.data.position);
                });
            }

            // Click "Learn More →" link inside the bio to open the full profile lightbox
            if (this.bioEl) {
                this.bioEl.addEventListener('click', (e) => {
                    const learnMore = e.target.closest('.learn-more-btn');
                    if (!learnMore) return;
                    e.preventDefault();
                    e.stopPropagation();
                    openLightbox(this.members[this.currentIndex], this.data.position);
                });
            }
        }

        updateText() {
            const member = this.members[this.currentIndex];

    this.nameEl.style.opacity = '0';
    this.bioEl.style.opacity = '0';

    setTimeout(() => {
        this.nameEl.textContent = member.name;

        // ADD LEARN MORE BUTTON
        this.bioEl.innerHTML = `
            ${member.bio}
            <br><br>
            <a href="#" class="learn-more-btn" data-member="${member.name}">
                Learn More →
            </a>
        `;

        this.nameEl.style.opacity = '1';
        this.bioEl.style.opacity = '1';
    }, this.transitionDuration / 2);
}

        goTo(index) {
            if (index === this.currentIndex) return;

            const images = this.imagesContainer.querySelectorAll('img');
            const dots = this.dotsContainer.querySelectorAll('button');

            images[this.currentIndex].classList.remove('active');
            dots[this.currentIndex].classList.remove('active');

            this.currentIndex = index;

            images[this.currentIndex].classList.add('active');
            dots[this.currentIndex].classList.add('active');

            this.updateText();
        }

        next() {
            const nextIndex = (this.currentIndex + 1) % this.members.length;
            this.goTo(nextIndex);
        }

        prev() {
            const prevIndex = (this.currentIndex - 1 + this.members.length) % this.members.length;
            this.goTo(prevIndex);
        }

        start() {
            if (this.interval) clearInterval(this.interval);
            this.interval = setInterval(() => this.next(), this.slideDuration);
            this.isPaused = false;
            const indicator = this.container.querySelector('.pause-indicator');
            if (indicator) indicator.textContent = '▶';
        }

        pause() {
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }
            this.isPaused = true;
            const indicator = this.container.querySelector('.pause-indicator');
            if (indicator) indicator.textContent = 'II';
        }
    }

    // Lightbox functionality
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxName = document.getElementById('lightboxName');
    const lightboxRole = document.getElementById('lightboxRole');
    const lightboxBio = document.getElementById('lightboxBio');
    const lightboxClose = document.getElementById('lightboxClose');

    function openLightbox(member, position) {
        if (!lightboxModal) return;
        lightboxImage.src = member.image;
        lightboxImage.alt = member.name;
        lightboxName.textContent = member.name;
        lightboxRole.textContent = position;
        lightboxBio.textContent = member.fullBio || member.bio;
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightboxModal) return;
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    if (lightboxModal) {
        lightboxModal.addEventListener('click', (e) => {
            if (e.target === lightboxModal) closeLightbox();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });


// Homepage Featured Members Carousel
    function initHomepageCarousel() {
        const track = document.getElementById('membersTrack');
        
        if (!track) return;
        
        // Get ALL members in hierarchy order
        const featuredMembers = membersData.flatMap(pos => pos.members);
        
        let currentIndex = 0;
        const cardsPerView = window.innerWidth > 768 ? 3 : window.innerWidth > 480 ? 2 : 1;
        let autoScroll = null;
        
        function renderCarousel() {
            track.innerHTML = '';
            
            featuredMembers.forEach((member, index) => {
                const card = document.createElement('div');
                card.className = 'carousel-member-card';
                card.dataset.member = JSON.stringify(member);
                card.innerHTML = `
                    <div class="carousel-image-wrapper">
                        <img src="${member.image}" alt="${member.name}" loading="lazy" style="object-position: center top;">
                        <div class="member-hover-overlay">
                            <h4>${member.name}</h4>
                            <span class="role">${membersData.find(pos => pos.members.some(m => m.name === member.name)).position}</span>
                            <p>${member.bio}</p>
                        </div>
                    </div>
                `;
                track.appendChild(card);
            });
            
            updateCarousel();
            startAutoScroll();
        }
        
        function updateCarousel() {
            const cardWidth = track.children[0]?.offsetWidth + 20 || 0;
            track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        }
        
        function nextSlide() {
            const maxIndex = Math.max(0, featuredMembers.length - cardsPerView);
            currentIndex = (currentIndex + 1) % (maxIndex + 1);
            updateCarousel();
        }
        
        function startAutoScroll() {
            if (autoScroll) clearInterval(autoScroll);
            autoScroll = setInterval(nextSlide, 2500);
        }
        
        // Pause only on specific card hover
        // Continuous soft movement - pause ONLY direct card hover
        let isPaused = false;
        
        track.addEventListener('mouseenter', (e) => {
            const card = e.target.closest('.carousel-member-card');
            if (card && autoScroll) {
                clearInterval(autoScroll);
                isPaused = true;
            }
        }, true);
        
        document.addEventListener('mousemove', (e) => {
            if (isPaused) {
                const card = e.target.closest('.carousel-member-card');
                if (!card) {
                    startAutoScroll();
                    isPaused = false;
                }
            }
        }, true);
        
        // Responsive
        window.addEventListener('resize', () => {
            currentIndex = 0;
            updateCarousel();
        });
        
        renderCarousel();
    }

// Initialize homepage carousel if on homepage
if (document.getElementById('membersTrack')) {
    initHomepageCarousel();
}

// ==========================================
// Members Page — Category Carousel
// ==========================================
(function initMembersCarousel() {
    const track    = document.getElementById('mcTrack');
    const dotsWrap = document.getElementById('mcDots');
    const prevBtn  = document.getElementById('mcPrev');
    const nextBtn  = document.getElementById('mcNext');
    const tabs     = document.querySelectorAll('.mc-tab');

    if (!track) return;

    // Batch lookup helper
    const PIONEER_BATCH = ['Ramil Paciano Atog','Christian Jay P. Eupena','Regie N. Tandoc',
        'Aian James G. Perez','Jay-ar Torralba','John Mark P. Segovia','Jumarie R. Pastor',
        'Laurence Villaluna','Julianne Tristan Dequiña', 'Jhon Mark S. Pacional'];
    const SECOND_BATCH  = ['Jemar Morgado','Prince Jimenez','Cyrill Jade B. Batobalane',
        'Reyzlie Arnaldo','Zenmar Borres','Charles Benedic Dator','Jhon Dave Cadiog',
        'Zieff Aaron Encluna','Grysther Kieth Ibarra'];

   function normalizeName(name) {
    return name
        .toLowerCase()
        .replace(/[.,]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

function getBatch(name) {
    const normalized = normalizeName(name);

    if (PIONEER_BATCH.some(n => normalizeName(n) === normalized)) {
        return 'ODV Pioneers Batch';
    }

    if (SECOND_BATCH.some(n => normalizeName(n) === normalized)) {
        return 'ODV 2nd Batch';
    }

    return '';
}

    // Merge all coordinator sub-groups into Officers
    const categoryMap = {
        founder:     { label: 'Founding Master', members: [] },
        grandmaster: { label: 'Grand Masters',   members: [] },
        officer:     { label: 'Officers',         members: [] },
        member:      { label: 'Members',          members: [] }
    };

    membersData.forEach(group => {
        const cat = (group.category === 'coordinator') ? 'officer' : group.category;
        if (categoryMap[cat]) {
            group.members.forEach(m => {
                categoryMap[cat].members.push({ ...m, position: group.position });
            });
        }
    });

    let currentCat   = 'founder';
    let currentIndex = 0;
    let autoTimer    = null;
    const CARDS_VISIBLE = () => window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;

    // ── Build cards for active category ──
    function buildCards(cat) {
        track.innerHTML = '';
        dotsWrap.innerHTML = '';
        currentIndex = 0;

        const members = categoryMap[cat].members;

        members.forEach((member, i) => {
            const card = document.createElement('div');
            card.className = 'mc-card';
            card.innerHTML = `
                <div class="mc-card-photo">
                    <img src="${member.image}" alt="${member.name}" loading="lazy">
                </div>
                <div class="mc-card-body">
                    <p class="mc-card-position">${member.position}</p>
                    <h3 class="mc-card-name">${member.name}</h3>
                    <button class="mc-learn-btn" aria-label="Learn more about ${member.name}">
                        Learn More <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            `;
            card.querySelector('.mc-learn-btn').addEventListener('click', () => openMemberModal(member));
            track.appendChild(card);
        });

        // Dots — one per page
        const pages = Math.ceil(members.length / CARDS_VISIBLE());
        for (let p = 0; p < pages; p++) {
            const dot = document.createElement('button');
            dot.className = 'mc-dot' + (p === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Go to page ' + (p + 1));
            dot.addEventListener('click', () => goTo(p * CARDS_VISIBLE()));
            dotsWrap.appendChild(dot);
        }

        updatePosition(false);
        resetAuto();
    }

    // ── Move carousel ──
    function updatePosition(animate = true) {
        const cards  = track.querySelectorAll('.mc-card');
        if (!cards.length) return;
        const cardW  = cards[0].offsetWidth + 24; // gap
        track.style.transition = animate ? 'transform 0.45s cubic-bezier(0.4,0,0.2,1)' : 'none';
        track.style.transform  = `translateX(-${currentIndex * cardW}px)`;
        updateDots();
        updateArrows();
    }

    function updateDots() {
        const dots = dotsWrap.querySelectorAll('.mc-dot');
        const page = Math.floor(currentIndex / CARDS_VISIBLE());
        dots.forEach((d, i) => d.classList.toggle('active', i === page));
    }

    function updateArrows() {
        const members = categoryMap[currentCat].members;
        const maxIdx  = Math.max(0, members.length - CARDS_VISIBLE());
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= maxIdx;
    }

    function goTo(idx) {
        const members = categoryMap[currentCat].members;
        const maxIdx  = Math.max(0, members.length - CARDS_VISIBLE());
        currentIndex  = Math.max(0, Math.min(idx, maxIdx));
        updatePosition();
    }

    function next() {
        const members = categoryMap[currentCat].members;
        const maxIdx  = Math.max(0, members.length - CARDS_VISIBLE());
        if (currentIndex < maxIdx) {
            goTo(currentIndex + 1);
        } else {
            goTo(0); // loop
        }
    }

    function resetAuto() {
        if (autoTimer) clearInterval(autoTimer);
        autoTimer = setInterval(next, 3500);
    }

    // Pause on hover
    track.addEventListener('mouseenter', () => clearInterval(autoTimer));
    track.addEventListener('mouseleave', resetAuto);

    // Arrow buttons
    prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
    nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            currentCat = this.dataset.cat;
            buildCards(currentCat);
        });
    });

    // Responsive resize
    window.addEventListener('resize', () => {
        currentIndex = 0;
        buildCards(currentCat);
    });

    // ── Member profile modal ──
    const modal      = document.getElementById('lightboxModal');
    const modalImg   = document.getElementById('lightboxImage');
    const modalName  = document.getElementById('lightboxName');
    const modalRole  = document.getElementById('lightboxRole');
    const modalBatch = document.getElementById('lightboxBatch');
    const modalBio   = document.getElementById('lightboxBio');
    const modalClose = document.getElementById('lightboxClose');

    function openMemberModal(member) {
        if (!modal) return;
        modalImg.src        = member.image;
        modalImg.alt        = member.name;
        modalName.textContent  = member.name;
        modalRole.textContent  = member.position;
        const batch = getBatch(member.name);
        modalBatch.textContent = batch;
        modalBatch.style.display = batch ? 'inline-block' : 'none';
        modalBio.textContent   = member.fullBio || member.bio;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    // Initial render
    buildCards(currentCat);
})();

});



// ==========================================
// SDG Projects — Data-Driven Rendering
// ==========================================
(function() {

    // -------------------------------------------------------
    // SDG PROJECT DATA
    // To add a new project: copy one object below and fill in
    // sdg, title, description, and image fields.
    // Image paths are relative to index.html (e.g. "SDG/48.jpg")
    // -------------------------------------------------------
    const sdgProjects = [
        {
            sdg: ["SDG 3", "SDG 6", "SDG 17"],
            title: "Banyo Bayanihan",
            description: "A community initiative that improves sanitation facilities and promotes proper hygiene practices to support public health and clean living environments.",
            image: "SDG/48.jpg"
        },
        {
            sdg: ["SDG 11", "SDG 12", "SDG 13", "SDG 15"],
            title: "Lunhaw Kong Kinaiyahan",
            description: "An environmental conservation project focused on tree planting, waste reduction, and raising awareness about protecting natural resources.",
            image: "SDG/49.jpg"
        },
        {
            sdg: ["SDG 9", "SDG 17"],
            title: "Limpyo sa Kaugmaon",
            description: "A clean-up and waste management campaign that encourages community participation in maintaining a cleaner and more sustainable environment.",
            image: "SDG/50.jpg"
        },
        {
            sdg: ["SDG 3", "SDG 6"],
            title: "Iwas Sakit, Presyong Sulit",
            description: "A health-awareness project that provides information on disease prevention, proper hygiene, and affordable health practices for the community.",
            image: "SDG/51.jpg"
        },
        {
            sdg: ["SDG 2", "SDG 17"],
            title: "Senior Powers: Abtik nga Serbisyu para sa mga Katigulangan Project",
            description: "A community outreach program dedicated to supporting senior citizens through accessible services, health assistance, social engagement activities, and programs that promote their well-being and quality of life.",
            image: "SDG/52.jpg"
        },
        {
            sdg: ["SDG 2", "SDG 3", "SDG 4"],
            title: "Batang Da Vinci: Nourishing Young Minds with Food, Knowledge, and Wellness",
            description: "A child-centered outreach program that promotes proper nutrition, quality education, and healthy lifestyles by providing food assistance, learning opportunities, and wellness activities for young learners.",
            image: "SDG/53.jpg"
        },
        {
            sdg: ["SDG 3", "SDG 13"],
            title: "Silid Luntian: Integrating Air-Purifying Plants for a Healthier Learning Environment",
            description: "A sustainability project that incorporates air-purifying plants into learning spaces to improve indoor air quality, promote student well-being, and encourage environmental awareness.",
            image: "SDG/54.jpg"
        },
        {
            sdg: ["SDG 8", "SDG 17"],
            title: "Alay Kay Manong",
            description: "A community outreach project that honors and supports drivers by providing assistance, appreciation activities, and programs that promote their welfare, safety, and well-being.",
            image: "SDG/55.jpg"
        },
        {
            sdg: ["SDG 3", "SDG 4", "SDG 11", "SDG 17"],
            title: "ODV in Action: A Symposium on Basic Life Support and Basic First Aid",
            description: "A community education program that equips participants with essential knowledge and practical skills in basic life support and first aid, promoting emergency preparedness and community safety.",
            image: "SDG/56.jpg"
        },
        {
            sdg: ["SDG 4", "SDG 10", "SDG 16"],
            title: "Voices of Allies",
            description: "A campaign that promotes inclusivity, equality, and respect for diversity by empowering individuals to become advocates for social change.",
            image: "SDG/57.jpg"
        },
        {
            sdg: ["SDG 3"],
            title: "ODV Basketball Summer League",
            description: "A sports development program that promotes physical fitness, teamwork, discipline, and community engagement through organized basketball activities during the summer season.",
            image: "SDG/58.jpg"
        },
        {
            sdg: ["SDG 2", "SDG 3", "SDG 17"],
            title: "Project Bowlful of Care",
            description: "Project Bowlful of Care provides free champorado and arroz caldo to promote nutrition, health, and community support through volunteer-driven outreach programs.",
            image: "SDG/59.jpg"
        },
        {
            // Added — Phase 6 (SDG 17 photo set provided by ODV)
            sdg: ["SDG 17"],
            title: "Partnership",
            description: "",
            images: [
        "img/sdg17-partnership/AGSUR FUTURE  2025 (1).jpg",
        "img/sdg17-partnership/AGSUR FUTURE  2025 (2).jpg",
        "img/sdg17-partnership/AGSUR FUTURE  2025 (3).jpg",
        "img/sdg17-partnership/AGSUR FUTURE  2025 (4).jpg",
        "img/sdg17-partnership/AGSUR FUTURE  2025 (5).jpg",
        "img/sdg17-partnership/BLOODLETTING 2025 (10).jpg",
        "img/sdg17-partnership/BLOODLETTING 2025 (11).jpg",
        "img/sdg17-partnership/BLOODLETTING 2025 (12).jpg",
        "img/sdg17-partnership/BLOODLETTING 2025 (13).jpg",
        "img/sdg17-partnership/BLOODLETTING 2025 (14).jpg",
        "img/sdg17-partnership/BLOODLETTING 2025 (15).jpg",
        "img/sdg17-partnership/BLOODLETTING 2025 (16).jpg",
        "img/sdg17-partnership/BLOODLETTING 2025 (17).jpg",
        "img/sdg17-partnership/BLOODLETTING 2025 (4).jpg",
        "img/sdg17-partnership/BLOODLETTING 2025 (5).jpg",
        "img/sdg17-partnership/BLOODLETTING 2025 (6).jpg",
        "img/sdg17-partnership/BLOODLETTING 2025 (7).jpg",
        "img/sdg17-partnership/BLOODLETTING 2025 (8).jpg",
        "img/sdg17-partnership/BLOODLETTING 2025 (9).jpg",
        "img/sdg17-partnership/BLOODLETTING 2026 (1).jpg",
        "img/sdg17-partnership/BLOODLETTING 2026 (2).jpg",
        "img/sdg17-partnership/BLOODLETTING 2026 (3).jpg",
        "img/sdg17-partnership/COMMUNITY TOUR GUIDE TRAINING 2025 (1).jpg",
        "img/sdg17-partnership/COMMUNITY TOUR GUIDE TRAINING 2025 (2).jpg",
        "img/sdg17-partnership/COMMUNITY TOUR GUIDE TRAINING 2025 (3).jpg",
        "img/sdg17-partnership/COMMUNITY TOUR GUIDE TRAINING 2025 (4).jpg",
        "img/sdg17-partnership/COMMUNITY TOUR GUIDE TRAINING 2025 (5).jpg",
        "img/sdg17-partnership/COMMUNITY TOUR GUIDE TRAINING 2025 (6).jpg",
        "img/sdg17-partnership/COMMUNITY TOUR GUIDE TRAINING 2025 (7).jpg",
        "img/sdg17-partnership/COMMUNITY TOUR GUIDE TRAINING 2025 (8).jpg",
        "img/sdg17-partnership/FLOOD ACTION 2026 (1).jpg",
        "img/sdg17-partnership/FLOOD ACTION 2026 (2).jpg",
        "img/sdg17-partnership/FLOOD ACTION 2026 (3).jpg",
        "img/sdg17-partnership/FLOOD ACTION 2026 (4).jpg",
        "img/sdg17-partnership/LEADERSHIP TRAINING 2025 (1).jpg",
        "img/sdg17-partnership/LEADERSHIP TRAINING 2025 (10).jpg",
        "img/sdg17-partnership/LEADERSHIP TRAINING 2025 (11).jpg",
        "img/sdg17-partnership/LEADERSHIP TRAINING 2025 (12).jpg",
        "img/sdg17-partnership/LEADERSHIP TRAINING 2025 (2).jpg",
        "img/sdg17-partnership/LEADERSHIP TRAINING 2025 (3).jpg",
        "img/sdg17-partnership/LEADERSHIP TRAINING 2025 (4).jpg",
        "img/sdg17-partnership/LEADERSHIP TRAINING 2025 (5).jpg",
        "img/sdg17-partnership/LEADERSHIP TRAINING 2025 (6).jpg",
        "img/sdg17-partnership/LEADERSHIP TRAINING 2025 (7).jpg",
        "img/sdg17-partnership/LEADERSHIP TRAINING 2025 (8).jpg",
        "img/sdg17-partnership/LEADERSHIP TRAINING 2025 (9).jpg",
        "img/sdg17-partnership/LIGO NG KABATAAN 2025(1).jpg",
        "img/sdg17-partnership/LIGO NG KABATAAN 2025(2).jpg",
        "img/sdg17-partnership/LIGO NG KABATAAN 2025(3).jpg",
        "img/sdg17-partnership/LIGO NG KABATAAN 2025(4).jpg",
        "img/sdg17-partnership/LIGO NG KABATAAN 2025(5).jpg",
        "img/sdg17-partnership/LIGO NG KABATAAN 2025(6).jpg",
        "img/sdg17-partnership/LIGO NG KABATAAN 2025(7).jpg",
        "img/sdg17-partnership/PARTNERSHIP 2026 (1).jpg",
        "img/sdg17-partnership/PARTNERSHIP 2026 (10).jpg",
        "img/sdg17-partnership/PARTNERSHIP 2026 (11).jpg",
        "img/sdg17-partnership/PARTNERSHIP 2026 (2).jpg",
        "img/sdg17-partnership/PARTNERSHIP 2026 (3).jpg",
        "img/sdg17-partnership/PARTNERSHIP 2026 (4).jpg",
        "img/sdg17-partnership/PARTNERSHIP 2026 (5).jpg",
        "img/sdg17-partnership/PARTNERSHIP 2026 (6).jpg",
        "img/sdg17-partnership/PARTNERSHIP 2026 (7).jpg",
        "img/sdg17-partnership/PARTNERSHIP 2026 (8).jpg",
        "img/sdg17-partnership/PARTNERSHIP 2026 (9).jpg",
        "img/sdg17-partnership/SDG 2025 (1).jpg",
        "img/sdg17-partnership/SDG 2025 (10).jpg",
        "img/sdg17-partnership/SDG 2025 (2).jpg",
        "img/sdg17-partnership/SDG 2025 (3).jpg",
        "img/sdg17-partnership/SDG 2025 (4).jpg",
        "img/sdg17-partnership/SDG 2025 (5).jpg",
        "img/sdg17-partnership/SDG 2025 (6).jpg",
        "img/sdg17-partnership/SDG 2025 (7).jpg",
        "img/sdg17-partnership/SDG 2025 (8).jpg",
        "img/sdg17-partnership/SDG 2025 (9).jpg",
        "img/sdg17-partnership/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS 2025 (1).jpg",
        "img/sdg17-partnership/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS 2025 (10).jpg",
        "img/sdg17-partnership/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS 2025 (11).jpg",
        "img/sdg17-partnership/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS 2025 (12).jpg",
        "img/sdg17-partnership/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS 2025 (13).jpg",
        "img/sdg17-partnership/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS 2025 (14).jpg",
        "img/sdg17-partnership/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS 2025 (15).jpg",
        "img/sdg17-partnership/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS 2025 (2).jpg",
        "img/sdg17-partnership/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS 2025 (3).jpg",
        "img/sdg17-partnership/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS 2025 (4).jpg",
        "img/sdg17-partnership/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS 2025 (5).jpg",
        "img/sdg17-partnership/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS 2025 (6).jpg",
        "img/sdg17-partnership/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS 2025 (7).jpg",
        "img/sdg17-partnership/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS 2025 (8).jpg",
        "img/sdg17-partnership/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS 2025 (9).jpg"
            ]
        }
    ];

    // -------------------------------------------------------
    // LIGHTBOX STATE — flat list of every image currently visible
    // in the grid (across all cards/carousels in the active filter),
    // so Prev/Next can browse the whole category without closing.
    // -------------------------------------------------------
    let lightboxImages = [];
    let lightboxIdx    = 0;

    // -------------------------------------------------------
    // RENDER ENGINE
    // -------------------------------------------------------
    function renderCards(filter) {
        const grid      = document.getElementById('sdgGrid');
        const noResults = document.getElementById('sdgNoResults');
        if (!grid) return;

        // Remove existing cards (keep the no-results paragraph)
        grid.querySelectorAll('.sdg-card').forEach(c => c.remove());

        const filtered = filter === 'all'
            ? sdgProjects
            : sdgProjects.filter(p => p.sdg.includes(filter));

        if (filtered.length === 0) {
            noResults.style.display = 'block';
            return;
        }
        noResults.style.display = 'none';

        // Reset the flat image list for this filtered view
        lightboxImages = [];

        filtered.forEach((project, idx) => {
            const card = document.createElement('div');
            card.className = 'sdg-card';
            card.dataset.sdg = project.sdg.join(', ');

            const hasCarousel = Array.isArray(project.images) && project.images.length > 1;
            const firstImage  = hasCarousel ? project.images[0] : project.image;
            const sdgLabel    = filter !== 'all' ? filter : project.sdg[0];

            // Record this card's images in the flat lightbox list
            const lbStart = lightboxImages.length;
            if (hasCarousel) {
                project.images.forEach(src => lightboxImages.push({ src, title: project.title, sdg: sdgLabel }));
            } else {
                lightboxImages.push({ src: project.image, title: project.title, sdg: sdgLabel });
            }

            card.innerHTML = `
                <div class="sdg-card-image${hasCarousel ? ' sdg-card-carousel' : ''}" data-img="${firstImage}" data-title="${project.title}" data-index="0" data-lb-start="${lbStart}" tabindex="0" role="button" aria-label="View full image of ${project.title}">
                    <img src="${firstImage}" alt="${project.title}" loading="lazy">
                    <div class="sdg-image-overlay">
                        <i class="fas fa-expand-alt"></i>
                    </div>
                    ${hasCarousel ? `
                    <button class="sdg-carousel-btn sdg-carousel-prev" aria-label="Previous photo"><i class="fas fa-chevron-left"></i></button>
                    <button class="sdg-carousel-btn sdg-carousel-next" aria-label="Next photo"><i class="fas fa-chevron-right"></i></button>
                    <span class="sdg-carousel-counter">1 / ${project.images.length}</span>
                    ` : ''}
                </div>
                <div class="sdg-card-body">
                    <span class="sdg-badge">${project.sdg.join(' &middot; ')}</span>
                    <h3 class="sdg-card-title">${project.title}</h3>
                    ${project.description ? `<p class="sdg-card-desc">${project.description}</p>` : ''}
                </div>
            `;

            // Carousel image-cycling (only for multi-image projects)
            if (hasCarousel) {
                const imgWrap = card.querySelector('.sdg-card-image');
                const imgEl   = imgWrap.querySelector('img');
                const counter = imgWrap.querySelector('.sdg-carousel-counter');

                const showImage = (i) => {
                    const total = project.images.length;
                    const next  = (i + total) % total;
                    imgWrap.dataset.index = next;
                    imgWrap.dataset.img   = project.images[next];
                    imgEl.style.opacity = 0;
                    setTimeout(() => {
                        imgEl.src = project.images[next];
                        imgEl.style.opacity = 1;
                    }, 150);
                    counter.textContent = `${next + 1} / ${total}`;
                };

                imgWrap.querySelector('.sdg-carousel-prev').addEventListener('click', (e) => {
                    e.stopPropagation();
                    showImage(parseInt(imgWrap.dataset.index, 10) - 1);
                });
                imgWrap.querySelector('.sdg-carousel-next').addEventListener('click', (e) => {
                    e.stopPropagation();
                    showImage(parseInt(imgWrap.dataset.index, 10) + 1);
                });
            }

            // Append before no-results node
            grid.insertBefore(card, noResults);
        });

        // Bind image click → lightbox
        grid.querySelectorAll('.sdg-card-image').forEach(imgWrap => {
            const open = () => openLightbox(parseInt(imgWrap.dataset.lbStart, 10) + parseInt(imgWrap.dataset.index, 10));
            imgWrap.addEventListener('click', open);
            imgWrap.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') open(); });
        });
    }

    // -------------------------------------------------------
    // LIGHTBOX
    // -------------------------------------------------------
    function openLightbox(idx) {
        const lb     = document.getElementById('sdgLightbox');
        const img    = document.getElementById('sdgLightboxImg');
        const title  = document.getElementById('sdgLightboxTitle');
        const counter = document.getElementById('sdgLightboxCounter');
        if (!lb || lightboxImages.length === 0) return;

        lightboxIdx = (idx + lightboxImages.length) % lightboxImages.length;
        const entry = lightboxImages[lightboxIdx];
        img.src   = entry.src;
        img.alt   = entry.title;
        title.textContent   = entry.sdg + ' – ' + entry.title;
        counter.textContent = 'Image ' + (lightboxIdx + 1) + ' of ' + lightboxImages.length;

        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function lbGoTo(idx) {
        const img     = document.getElementById('sdgLightboxImg');
        const title   = document.getElementById('sdgLightboxTitle');
        const counter = document.getElementById('sdgLightboxCounter');
        if (lightboxImages.length === 0) return;

        lightboxIdx = (idx + lightboxImages.length) % lightboxImages.length;
        const entry = lightboxImages[lightboxIdx];

        // Smooth crossfade between images (matches the in-card carousel pattern)
        img.style.opacity = 0;
        setTimeout(() => {
            img.src = entry.src;
            img.alt = entry.title;
            img.style.opacity = 1;
        }, 150);

        title.textContent   = entry.sdg + ' – ' + entry.title;
        counter.textContent = 'Image ' + (lightboxIdx + 1) + ' of ' + lightboxImages.length;
    }

    function closeLightbox() {
        const lb = document.getElementById('sdgLightbox');
        if (!lb) return;
        lb.classList.remove('open');
        document.body.style.overflow = '';
    }

    // -------------------------------------------------------
    // INIT — called from DOMContentLoaded below
    // -------------------------------------------------------
    function initSDG() {
        // Only run if the SDG section exists on this page
        if (!document.getElementById('sdgGrid')) return;

        // Initial render — all projects
        renderCards('all');

        const filterBtns = Array.from(document.querySelectorAll('.sdg-filter-btn'));

        function activateFilterBtn(btn) {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderCards(btn.dataset.filter);
            const current = document.getElementById('sdgCatCurrent');
            if (current) current.textContent = btn.textContent;
        }

        // Filter button interactions
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                activateFilterBtn(this);
            });
        });

        // Prev / Next category stepper — cycles through SDG 1–17
        // (skips the "All Projects" tab; reuses the same filter buttons/render path)
        const prevBtn = document.getElementById('sdgCatPrev');
        const nextBtn = document.getElementById('sdgCatNext');
        if (prevBtn && nextBtn) {
            const categoryBtns = filterBtns.filter(b => b.dataset.filter !== 'all');

            function step(direction) {
                const activeBtn = filterBtns.find(b => b.classList.contains('active'));
                let idx = categoryBtns.indexOf(activeBtn);
                if (idx === -1) idx = direction > 0 ? -1 : 0; // from "All" → SDG 1 (next) or SDG 17 (prev)
                idx = (idx + direction + categoryBtns.length) % categoryBtns.length;
                activateFilterBtn(categoryBtns[idx]);
                categoryBtns[idx].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }

            prevBtn.addEventListener('click', () => step(-1));
            nextBtn.addEventListener('click', () => step(1));
        }

        // Lightbox close button
        const closeBtn = document.getElementById('sdgLightboxClose');
        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

        // Prev / Next navigation within the lightbox
        const lbPrevBtn = document.getElementById('sdgLbPrev');
        const lbNextBtn = document.getElementById('sdgLbNext');
        if (lbPrevBtn) lbPrevBtn.addEventListener('click', () => lbGoTo(lightboxIdx - 1));
        if (lbNextBtn) lbNextBtn.addEventListener('click', () => lbGoTo(lightboxIdx + 1));

        // Close on backdrop click
        const lb = document.getElementById('sdgLightbox');
        if (lb) {
            lb.addEventListener('click', function(e) {
                if (e.target === lb) closeLightbox();
            });
        }

        // Keyboard: ← Previous, → Next, Esc Close
        document.addEventListener('keydown', function(e) {
            if (!lb || !lb.classList.contains('open')) return;
            if (e.key === 'Escape')     closeLightbox();
            if (e.key === 'ArrowLeft')  lbGoTo(lightboxIdx - 1);
            if (e.key === 'ArrowRight') lbGoTo(lightboxIdx + 1);
        });

        // Swipe gestures (mobile)
        if (lb) {
            let touchStartX = 0;
            lb.addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].clientX;
            }, { passive: true });
            lb.addEventListener('touchend', function(e) {
                const dx = e.changedTouches[0].clientX - touchStartX;
                if (Math.abs(dx) < 50) return; // ignore taps/small movements
                if (dx < 0) lbGoTo(lightboxIdx + 1); // swipe left → next
                else        lbGoTo(lightboxIdx - 1); // swipe right → prev
            }, { passive: true });
        }
    }

    // Expose initSDG so the main DOMContentLoaded block can call it safely
    window._initSDG = initSDG;

})();

// Call SDG init from within the guaranteed-ready context
document.addEventListener('DOMContentLoaded', function() {
    if (typeof window._initSDG === 'function') {
        window._initSDG();
    }
});

// ==========================================
// Training Timeline Slider
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const slider   = document.getElementById('trainingSlider');
    if (!slider) return;

    const slides   = slider.querySelectorAll('.training-slide');
    const dots     = slider.querySelectorAll('.training-dot');
    const counter  = document.getElementById('trainingCounter');
    const prevBtn  = document.getElementById('trainingPrev');
    const nextBtn  = document.getElementById('trainingNext');
    const total    = slides.length;
    let current    = 0;
    let autoTimer  = null;
    const DELAY    = 4000;

    function goTo(index) {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = (index + total) % total;
        slides[current].classList.add('active');
        dots[current].classList.add('active');
        counter.textContent = (current + 1) + ' / ' + total;
    }

    function startAuto() {
        autoTimer = setInterval(function() { goTo(current + 1); }, DELAY);
    }

    function stopAuto() {
        clearInterval(autoTimer);
    }

    prevBtn.addEventListener('click', function() { stopAuto(); goTo(current - 1); startAuto(); });
    nextBtn.addEventListener('click', function() { stopAuto(); goTo(current + 1); startAuto(); });

    dots.forEach(function(dot) {
        dot.addEventListener('click', function() {
            stopAuto();
            goTo(parseInt(this.dataset.index));
            startAuto();
        });
    });

    // Pause autoplay on hover
    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);

    // Keyboard support
    slider.setAttribute('tabindex', '0');
    slider.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft')  { stopAuto(); goTo(current - 1); startAuto(); }
        if (e.key === 'ArrowRight') { stopAuto(); goTo(current + 1); startAuto(); }
    });

    // Hook into existing lightbox if available
    slides.forEach(function(slide) {
        const img = slide.querySelector('img');
        if (img) {
            img.addEventListener('click', function() {
                if (typeof openLightbox === 'function') {
                    openLightbox(img.src, img.alt);
                }
            });
        }
    });

    startAuto();
});

// ==========================================
// About Page — History Image Slider (auto-fade, no controls)
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.history-slider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.history-slide');
    if (slides.length < 2) return;

    let current = 0;
    const DELAY = 4500;

    setInterval(function() {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
    }, DELAY);
});

// ==========================================
// Events — Year Picker & Carousel (Phase 2)
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('evYearPicker')) return;

    // ------------------------------------------------------------------
    // DATA: all events keyed by year
    // Classification: Inside Campus | Outside Campus
    // Images listed in natural sort order (n) per event
    // ------------------------------------------------------------------
    var BASE = 'img/events/past/';

    function imgs(name, count, ext) {
        // Handles filenames like "EVENT NAME (1).jpg" or "EVENT NAME(1).jpg"
        var arr = [];
        for (var i = 1; i <= count; i++) {
            arr.push(BASE + name + i + (ext || '.jpg'));
        }
        return arr;
    }

    var EVENTS = {
        '2025': [
            {
                name: '25 Hours Common Module',
                label: 'Inside Campus',
                type: 'inside',
                images: [
                    BASE + '25HOURS COMMON MODULE 2025(1).jpg',
                    BASE + '25HOURS COMMON MODULE 2025(2).jpg',
                    BASE + '25HOURS COMMON MODULE 2025(3).jpg',
                    BASE + '25HOURS COMMON MODULE 2025(4).jpg',
                    BASE + '25HOURS COMMON MODULE 2025(5).jpg',
                    BASE + '25HOURS COMMON MODULE 2025(6).jpg'
                ]
            },
            {
                name: '30th Pahimugso 2025',
                label: 'Inside Campus',
                type: 'inside',
                images: (function() {
                    var a = [];
                    for (var i = 1; i <= 31; i++) a.push(BASE + '30TH PAHIMUGSO 2025 (' + i + ').jpg');
                    return a;
                }())
            },
            {
                name: 'Pagsangka 2025',
                label: 'Outside Campus',
                type: 'outside',
                images: (function() {
                    var a = [];
                    for (var i = 1; i <= 13; i++) a.push(BASE + 'PAGSANGKA 2025 (' + i + ').jpg');
                    return a;
                }())
            },
            {
                name: 'Panag Ila-Ila',
                label: 'Outside Campus',
                type: 'outside',
                images: [ BASE + 'PANAG ILA-ILA.jpg' ]
            },
            {
                name: 'Pasidungog 2025',
                label: 'Outside Campus',
                type: 'outside',
                images: (function() {
                    var a = [];
                    for (var i = 1; i <= 36; i++) a.push(BASE + 'PASIDUNGOG 2025 (' + i + ').jpg');
                    return a;
                }())
            },
            {
                name: 'Training Team Completion Ceremony',
                label: 'Outside Campus',
                type: 'outside',
                images: [
                    BASE + 'TRAINING TEAM COMPLATION CEREMONY 2025 (1).jpg',
                    BASE + 'TRAINING TEAM COMPLATION CEREMONY 2025 (2).jpg',
                    BASE + 'TRAINING TEAM COMPLATION CEREMONY 2025 (3).jpg',
                    BASE + 'TRAINING TEAM COMPLATION CEREMONY 2025 (4).jpg'
                ]
            },
            {
                name: 'Valentines 2025',
                label: 'Inside Campus',
                type: 'inside',
                images: [
                    BASE + 'VALENTINES 2025 (1).jpg',
                    BASE + 'VALENTINES 2025 (2).jpg'
                ]
            }
        ],
        '2026': [
            {
                name: '31st Pahimugso 2026',
                label: 'Inside Campus',
                type: 'inside',
                images: (function() {
                    var a = [];
                    for (var i = 1; i <= 14; i++) a.push(BASE + '31ST PAHIMUGSO  2026 (' + i + ').jpg');
                    return a;
                }())
            },
            {
                name: 'SDG Camp 2026',
                label: 'Inside Campus',
                type: 'inside',
                images: (function() {
                    var a = [];
                    for (var i = 17; i <= 33; i++) a.push(BASE + 'SDG CAMP 2026 (' + i + ').jpg');
                    return a;
                }())
            },
            {
                name: 'Valentine 2026',
                label: 'Inside Campus',
                type: 'inside',
                images: (function() {
                    var a = [];
                    for (var i = 1; i <= 5; i++) a.push(BASE + 'VALENTINE 2026 (' + i + ').jpg');
                    return a;
                }())
            }
        ]
    };

    // ------------------------------------------------------------------
    // DOM refs
    // ------------------------------------------------------------------
    var yearPicker  = document.getElementById('evYearPicker');
    var browser     = document.getElementById('evBrowser');
    var tabsEl      = document.getElementById('evTabs');
    var stage       = document.getElementById('evStage');
    var prevBtn     = document.getElementById('evPrev');
    var nextBtn     = document.getElementById('evNext');
    var metaEl      = document.getElementById('evMeta');
    var counterEl   = document.getElementById('evCounter');
    var dotsEl      = document.getElementById('evDots');
    var lightbox    = document.getElementById('evLightbox');
    var lbImg       = document.getElementById('evLightboxImg');
    var lbCaption   = document.getElementById('evLightboxCaption');
    var lbClose     = document.getElementById('evLightboxClose');
    var lbPrev      = document.getElementById('evLbPrev');
    var lbNext      = document.getElementById('evLbNext');

    var activeYear  = null;
    var activeEvent = null;
    var currentIdx  = 0;
    var autoTimer   = null;
    var DELAY       = 4500;

    // ------------------------------------------------------------------
    // Carousel helpers
    // ------------------------------------------------------------------
    function buildDots(total) {
        dotsEl.innerHTML = '';
        // Only render dots if 20 or fewer (too many dots = visual clutter)
        if (total > 20) return;
        for (var i = 0; i < total; i++) {
            var d = document.createElement('span');
            d.className = 'ev-dot' + (i === 0 ? ' active' : '');
            d.dataset.index = i;
            (function(idx) {
                d.addEventListener('click', function() { stopAuto(); showSlide(idx); startAuto(); });
            }(i));
            dotsEl.appendChild(d);
        }
    }

    function updateDots(idx) {
        var dots = dotsEl.querySelectorAll('.ev-dot');
        dots.forEach(function(d, i) { d.classList.toggle('active', i === idx); });
    }

    function showSlide(idx) {
        var images = activeEvent.images;
        currentIdx = (idx + images.length) % images.length;

        var img = document.createElement('img');
        img.src  = images[currentIdx];
        img.alt  = activeEvent.name + ' — photo ' + (currentIdx + 1);
        img.addEventListener('click', function() { openLightbox(currentIdx); });

        stage.innerHTML = '';
        stage.appendChild(img);

        counterEl.textContent = (currentIdx + 1) + ' / ' + images.length;
        updateDots(currentIdx);
    }

    function loadEvent(ev) {
        activeEvent = ev;
        currentIdx  = 0;

        // Update meta bar
        var badgeClass = ev.type === 'inside' ? 'ev-badge-inside' : 'ev-badge-outside';
        metaEl.innerHTML =
            '<span class="ev-meta-name">' + ev.name + '</span>' +
            '<span class="ev-badge ' + badgeClass + '">' +
            (ev.type === 'inside'
                ? '<i class="fas fa-building" style="margin-right:5px;font-size:0.7rem;"></i>'
                : '<i class="fas fa-tree" style="margin-right:5px;font-size:0.7rem;"></i>') +
            ev.label + '</span>';

        buildDots(ev.images.length);
        showSlide(0);
        stopAuto();
        startAuto();
    }

    function buildTabs(year) {
        tabsEl.innerHTML = '';
        var events = EVENTS[year];
        events.forEach(function(ev, i) {
            var btn = document.createElement('button');
            btn.className = 'ev-tab-btn' + (i === 0 ? ' active' : '');
            btn.textContent = ev.name;
            btn.addEventListener('click', function() {
                tabsEl.querySelectorAll('.ev-tab-btn').forEach(function(b) { b.classList.remove('active'); });
                btn.classList.add('active');
                loadEvent(ev);
            });
            tabsEl.appendChild(btn);
        });
        loadEvent(events[0]);
    }

    function startAuto() {
        autoTimer = setInterval(function() { showSlide(currentIdx + 1); }, DELAY);
    }

    function stopAuto() { clearInterval(autoTimer); }

    // ------------------------------------------------------------------
    // Prev / Next
    // ------------------------------------------------------------------
    prevBtn.addEventListener('click', function() { stopAuto(); showSlide(currentIdx - 1); startAuto(); });
    nextBtn.addEventListener('click', function() { stopAuto(); showSlide(currentIdx + 1); startAuto(); });

    // Pause on hover
    var carousel = document.getElementById('evCarousel');
    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);

    // Keyboard
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft')  { stopAuto(); showSlide(currentIdx - 1); startAuto(); }
        if (e.key === 'ArrowRight') { stopAuto(); showSlide(currentIdx + 1); startAuto(); }
    });

    // ------------------------------------------------------------------
    // Year picker
    // ------------------------------------------------------------------
    yearPicker.querySelectorAll('.ev-year-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var year = btn.dataset.year;
            if (activeYear === year) return;
            activeYear = year;
            yearPicker.querySelectorAll('.ev-year-btn').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            browser.style.display = 'block';
            buildTabs(year);
        });
    });

    // ------------------------------------------------------------------
    // Lightbox
    // ------------------------------------------------------------------
    function openLightbox(idx) {
        currentIdx = (idx + activeEvent.images.length) % activeEvent.images.length;
        lbImg.src  = activeEvent.images[currentIdx];
        lbImg.alt  = activeEvent.name + ' — photo ' + (currentIdx + 1);
        lbCaption.textContent = activeEvent.name + '  ·  ' + activeEvent.label +
                                '  ·  ' + (currentIdx + 1) + ' / ' + activeEvent.images.length;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    function lbGoTo(idx) {
        currentIdx = (idx + activeEvent.images.length) % activeEvent.images.length;
        lbImg.src  = activeEvent.images[currentIdx];
        lbImg.alt  = activeEvent.name + ' — photo ' + (currentIdx + 1);
        lbCaption.textContent = activeEvent.name + '  ·  ' + activeEvent.label +
                                '  ·  ' + (currentIdx + 1) + ' / ' + activeEvent.images.length;
        updateDots(currentIdx);
        counterEl.textContent = (currentIdx + 1) + ' / ' + activeEvent.images.length;
    }

    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', function() { lbGoTo(currentIdx - 1); });
    lbNext.addEventListener('click', function() { lbGoTo(currentIdx + 1); });
    lightbox.addEventListener('click', function(e) { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape')     closeLightbox();
        if (e.key === 'ArrowLeft')  lbGoTo(currentIdx - 1);
        if (e.key === 'ArrowRight') lbGoTo(currentIdx + 1);
    });
});

// ==========================================
// Gallery — Year Picker & Carousel (Phase 5)
// Mirrors the Events year-picker/carousel pattern (no sub-tabs;
// gallery browses by year only). Crimson accent class (gal-accent-wrap)
// distinguishes it visually from the gold Events page.
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
    if (!document.getElementById('galYearPicker')) return;

    var BASE = 'img/gallery/';

    function imgs(name, start, end, ext) {
        var arr = [];
        for (var i = start; i <= end; i++) {
            arr.push(BASE + name + i + (ext || '.jpg'));
        }
        return arr;
    }

    var GALLERY = {
        '2025': []
            .concat(imgs('2ND BATCH 2025 (', 1, 80, ').jpg'))
            .concat(imgs('3RD BATCH SESSIONS 2025 (', 1, 56, ').jpg'))
            .concat(imgs('25HOURS COMMON MODULE 2025(', 1, 6, ').jpg'))
            .concat(imgs('30TH PAHIMUGSO 2025 (', 1, 31, ').jpg'))
            .concat(imgs('2025 (', 1, 21, ').jpg'))
            .concat(imgs('AGSUR FUTURE  2025 SDG 17 (', 1, 89, ').jpg'))
            .concat(imgs('PAGSANGKA 2025 (', 1, 13, ').jpg'))
            .concat([BASE + 'PANAG ILA-ILA.jpg'])
            .concat(imgs('PASIDUNGOG 2025 (', 1, 36, ').jpg'))
            .concat(imgs('TRAINING TEAM COMPLATION CEREMONY 2025 (', 1, 4, ').jpg'))
            .concat(imgs('VALENTINES 2025 (', 1, 2, ').jpg')),
        '2026': []
            .concat(imgs('31ST PAHIMUGSO  2026 (', 1, 14, ').jpg'))
            .concat(imgs('SDG CAMP 2026 (', 17, 33, ').jpg'))
            .concat(imgs('VALENTINE 2026 (', 1, 5, ').jpg'))
            .concat(imgs('4TH BATCH 2026(', 1, 30, ').jpg'))
            .concat(imgs('4TH BATCH 2026(', 41, 51, ').jpg'))
    };

    // ------------------------------------------------------------------
    // DOM refs
    // ------------------------------------------------------------------
    var yearPicker  = document.getElementById('galYearPicker');
    var browser     = document.getElementById('galBrowser');
    var stage       = document.getElementById('galStage');
    var prevBtn     = document.getElementById('galPrev');
    var nextBtn     = document.getElementById('galNext');
    var metaEl      = document.getElementById('galMeta');
    var counterEl   = document.getElementById('galCounter');
    var dotsEl      = document.getElementById('galDots');
    var lightbox    = document.getElementById('galLightbox');
    var lbImg       = document.getElementById('galLightboxImg');
    var lbCaption   = document.getElementById('galLightboxCaption');
    var lbClose     = document.getElementById('galLightboxClose');
    var lbPrev      = document.getElementById('galLbPrev');
    var lbNext      = document.getElementById('galLbNext');

    var activeYear   = null;
    var activeImages = [];
    var currentIdx   = 0;
    var autoTimer    = null;
    var DELAY        = 4500;

    // ------------------------------------------------------------------
    // Carousel helpers
    // ------------------------------------------------------------------
    function buildDots(total) {
        dotsEl.innerHTML = '';
        if (total > 20) return; // too many dots = clutter
        for (var i = 0; i < total; i++) {
            var d = document.createElement('span');
            d.className = 'ev-dot' + (i === 0 ? ' active' : '');
            d.dataset.index = i;
            (function(idx) {
                d.addEventListener('click', function() { stopAuto(); showSlide(idx); startAuto(); });
            }(i));
            dotsEl.appendChild(d);
        }
    }

    function updateDots(idx) {
        var dots = dotsEl.querySelectorAll('.ev-dot');
        dots.forEach(function(d, i) { d.classList.toggle('active', i === idx); });
    }

    function showSlide(idx) {
        currentIdx = (idx + activeImages.length) % activeImages.length;

        var img = document.createElement('img');
        img.loading = 'lazy';
        img.src = activeImages[currentIdx];
        img.alt = 'Order of Da Vinci Gallery ' + activeYear + ' — photo ' + (currentIdx + 1);
        img.addEventListener('click', function() { openLightbox(currentIdx); });

        stage.innerHTML = '';
        stage.appendChild(img);

        counterEl.textContent = (currentIdx + 1) + ' / ' + activeImages.length;
        updateDots(currentIdx);
    }

    function loadYear(year) {
        activeYear   = year;
        activeImages = GALLERY[year];
        currentIdx   = 0;

        metaEl.innerHTML = '<span class="ev-meta-name">Order of Da Vinci Gallery — ' + year + '</span>';

        buildDots(activeImages.length);
        showSlide(0);
        stopAuto();
        startAuto();
    }

    function startAuto() {
        autoTimer = setInterval(function() { showSlide(currentIdx + 1); }, DELAY);
    }

    function stopAuto() { clearInterval(autoTimer); }

    // ------------------------------------------------------------------
    // Prev / Next
    // ------------------------------------------------------------------
    prevBtn.addEventListener('click', function() { stopAuto(); showSlide(currentIdx - 1); startAuto(); });
    nextBtn.addEventListener('click', function() { stopAuto(); showSlide(currentIdx + 1); startAuto(); });

    // Pause on hover
    var carousel = document.getElementById('galCarousel');
    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);

    // Keyboard
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft')  { stopAuto(); showSlide(currentIdx - 1); startAuto(); }
        if (e.key === 'ArrowRight') { stopAuto(); showSlide(currentIdx + 1); startAuto(); }
    });

    // ------------------------------------------------------------------
    // Year picker
    // ------------------------------------------------------------------
    yearPicker.querySelectorAll('.ev-year-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var year = btn.dataset.year;
            if (activeYear === year) return;
            yearPicker.querySelectorAll('.ev-year-btn').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            browser.style.display = 'block';
            loadYear(year);
        });
    });

    // ------------------------------------------------------------------
    // Lightbox
    // ------------------------------------------------------------------
    function openLightbox(idx) {
        currentIdx = (idx + activeImages.length) % activeImages.length;
        lbImg.src  = activeImages[currentIdx];
        lbImg.alt  = 'Order of Da Vinci Gallery ' + activeYear + ' — photo ' + (currentIdx + 1);
        lbCaption.textContent = activeYear + '  ·  ' + (currentIdx + 1) + ' / ' + activeImages.length;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    function lbGoTo(idx) {
        currentIdx = (idx + activeImages.length) % activeImages.length;
        lbImg.src  = activeImages[currentIdx];
        lbImg.alt  = 'Order of Da Vinci Gallery ' + activeYear + ' — photo ' + (currentIdx + 1);
        lbCaption.textContent = activeYear + '  ·  ' + (currentIdx + 1) + ' / ' + activeImages.length;
        updateDots(currentIdx);
        counterEl.textContent = (currentIdx + 1) + ' / ' + activeImages.length;
    }

    lbClose.addEventListener('click', closeLightbox);
    lbPrev.addEventListener('click', function() { lbGoTo(currentIdx - 1); });
    lbNext.addEventListener('click', function() { lbGoTo(currentIdx + 1); });
    lightbox.addEventListener('click', function(e) { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape')     closeLightbox();
        if (e.key === 'ArrowLeft')  lbGoTo(currentIdx - 1);
        if (e.key === 'ArrowRight') lbGoTo(currentIdx + 1);
    });
});
