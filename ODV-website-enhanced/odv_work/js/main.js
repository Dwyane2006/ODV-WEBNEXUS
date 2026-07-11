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

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');

    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
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

    // Gallery lightbox (simple)
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const overlayText = this.querySelector('.gallery-overlay span').textContent;
            
            // Create lightbox
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <img src="${img.src}" alt="${img.alt}">
                    <p>${overlayText}</p>
                    <button class="lightbox-close">&times;</button>
                </div>
            `;
            
            // Add lightbox styles
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
            lightboxText.style.cssText = `
                color: #fff;
                text-align: center;
                margin-top: 15px;
                font-size: 1.1rem;
            `;
            
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
            
            // Close lightbox
            const closeLightbox = () => {
                lightbox.remove();
                document.body.style.overflow = '';
            };
            
            lightbox.addEventListener('click', closeLightbox);
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeLightbox();
            });
            
            // Close on escape key
            document.addEventListener('keydown', function escapeClose(e) {
                if (e.key === 'Escape') {
                    closeLightbox();
                    document.removeEventListener('keydown', escapeClose);
                }
            });
        });
    });

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

    // Counter animation for stats
    const counters = document.querySelectorAll('.counter');
    
    const animateCounters = function() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const current = parseInt(counter.textContent);
            const increment = target / 100;
            
            if (current < target) {
                counter.textContent = Math.ceil(current + increment);
                setTimeout(animateCounters, 20);
            } else {
                counter.textContent = target;
            }
        });
    };

    // Trigger counters when in view
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        });
        observer.observe(statsSection);
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
                { name: "Louie Jay Torralba", image: "Photos/Louie%20Jay%20Torralba,%20Founder,%20Founding%20Grand%20Master.jpg", bio: "Founder of the Order of Da Vinci, providing visionary leadership and direction.", fullBio: "Louie Jay Bactalan Torralba, born on August 5, 2004, at Northern Mindanao Hospital, is a resident of Purok-8 Simulao, Bunawan Brook, Bunawan, Agusan del Sur. He is pursuing a Bachelor of Science in Civil Engineering, driven by a passion for structural design and construction. A graduate of Asian Skills Academy Foundation Inc., Louie completed his senior high school education with honors and received recognition for his artistic talents with an Outstanding Performance in Musical Arts Award. Beyond academics, Louie is deeply involved in music and sports, enjoying playing the guitar and participating in basketball and billiards. His multifaceted interests reflect a well-rounded personality and a commitment to excellence." }
            ]
        },
        {
            position: "Grand Masters",
            category: "grandmaster",
            members: [
                { name: "Christian Jay B. Gumapac", image: "Photos/Christian%20Jay%20B.%20Gumapac,%20Founding%20Grand%20Master.jpg", bio: "Guiding the order with dedication and a passion for interdisciplinary excellence.", fullBio: "Christian Jay B. Gumapac was born on August 5, 2004, at Northern Mindanao Hospital and currently resides in Purok-8 Simulao, Bunawan Brook, Bunawan, Agusan del Sur. He is pursuing a Bachelor of Science in Civil Engineering, driven by a strong interest in structural design and construction. A graduate of Asian Skills Academy Foundation Inc., Christian completed his senior high school education with honors and was recognized for his artistic talents with an Outstanding Performance in Musical Arts Award. In addition to his academic achievements, Christian is passionate about music and sports, enjoying playing the guitar and engaging in basketball and billiards. His diverse interests reflect a well-rounded personality and a commitment to excellence." },
                { name: "Ian Albert S. Dela Pena", image: "Photos/Ian%20Albert%20S.%20Dela%20Pena,%20Founding%20Grand%20Master.jpg", bio: "Committed to fostering innovation and service within the Da Vinci community.", fullBio: "Ian Albert S. Dela Pena was born on August 5, 2004, at Northern Mindanao Hospital and currently resides in Purok-8 Simulao, Bunawan Brook, Bunawan, Agusan del Sur. He is pursuing a Bachelor of Science in Civil Engineering, driven by a strong interest in structural design and construction. A graduate of Asian Skills Academy Foundation Inc., Ian completed his senior high school education with honors and received recognition for his artistic talents with an Outstanding Performance in Musical Arts Award. Beyond academics, Ian is passionate about music and sports, enjoying playing the guitar and participating in basketball and billiards. His multifaceted interests reflect a well-rounded personality and a commitment to excellence." },
                { name: "Z-rabih M. Maturan", image: "Photos/9d954659-7186-4875-a880-3da9565ab429.jpg", bio: "Dedicated to upholding the values and mission of the order through exemplary leadership.", fullBio: "Z-Rabih M. Maturan, a 26-year-old resident of Purok 13, Sitio Tagbayog, Awao, Santa Josefa, Agusan del Sur, was born on October 15, 1999. He earned a Bachelor of Science in Psychology from Caraga State University, where he developed a strong understanding of human behavior, communication, and interpersonal relationships. His academic background has shaped his ability to interact effectively with others and adapt to different situations." }
            ]
        },
        {
            position: "Officers",
            category: "officer",
            members: [
                { name: "Julianne Tristan Dequiña", image: "Photos/Julianne%20Tristan%20Dequiña,%20President.jpg", bio: "Leading the Order with vision, dedication, and a commitment to excellence.", fullBio: "Julianne Tristan Encarnacion Dequiña was born on July 13, 2006, in Veruela, Agusan del Sur. He is currently pursuing a Bachelor of Science in Information Technology (BSIT), aiming to build a career in the ever-evolving world of digital technology and innovation. A proud graduate of Veruela National High School, Julianne completed the Humanities and Social Sciences (HUMSS) strand With Honors, showcasing his academic diligence and well-rounded capabilities. He also received the Leonardo Da Vinci Excellence Award through his Outstanding performance in the Order of Da Vinci. In his free time, he enjoys jogging, walking, and hiking, activities that reflect his active lifestyle and appreciation for the outdoors." },
                { name: "Regie N. Tandoc", image: "Photos/Regie%20N.%20Tandoc,%20Vice%20President.jpg", bio: "Overseeing strategic initiatives and supporting the order's mission worldwide.", fullBio: "Regie Nudque Tandoc was born on December 8, 2005, in Governor Generoso, Davao Oriental, and currently resides in P-1 Poblacion, Rosario, Agusan del Sur. He is taking up a Bachelor of Science in Civil Engineering, driven by a passion for design, structure, and leadership.Regie has consistently demonstrated excellence both in academics and extracurricular activities. He is a recipient of multiple awards including Student Leader of the Year, With High Honors, Leadership Awardee, Arts Awardee, and Service Awardee in His previous Senior High School which is the Datu Lipus Makapandong National High School. He also received the Leonardo Da Vinci Excellence Award through his Outstanding performance in the Order of Da Vinci. In his spare time, he enjoys playing guitar, basketball, and honing his communication and active listening skills, which further enhance his leadership and collaborative strengths." },
                { name: "Jhon Dave Cadiog", image: "Photos/Jhon%20Dave%20Cadiog,%20Secretary%20.jpg", bio: "Coordinating communications and maintaining organizational records.", fullBio: "John Dave Cordova Cadiog was born on November 28, 2005, at Southern Philippines Medical Center in Davao City. He currently resides in P-7 Cabantao, Rosario, Agusan del Sur, and is pursuing a Bachelor of Science in Agriculture major in Horticulture (BSA-Horticulture)—a field aligned with his passion for plants and nature. He graduated With High Honors from Datu Lipus Makapandong National High School, under the General Academic Strand (GAS), reflecting his strong academic foundation and commitment to excellence. John Dave enjoys photography and planting, hobbies that blend creativity and environmental appreciation—perfectly complementing his chosen field of study." },
                { name: "John Mark P. Segovia", image: "Photos/John%20Mark%20P.%20Segovia,%20Treasurer.jpg", bio: "Managing organizational finances with integrity and transparency.", fullBio: "Jhon Mark Segovia Pacional was born on May 27, 2006, and resides in P-9 Del Monte, Talacogon, Agusan del Sur. He is currently pursuing a Bachelor of Science in Civil Engineering, driven by a keen interest in infrastructure and innovation. A proud graduate of Del Monte National High School, Jhon Mark completed his senior high school With Honors and received several prestigious recognitions in his College Journey including the Civic Engagement Award, Academic Excellence Award, Exemplary Performance Award, Leadership Award, and Outstanding Volunteer Award. These reflect his dedication to both academic achievement and community service. Outside the classroom, he is passionate about basketball and chess, showcasing a balance between physical activity and strategic thinking." },
                { name: "Christian Jay P. Eupena", image: "Photos/Christian%20Jay%20P.%20Eupena,%20Auditor.jpg", bio: "Ensuring accountability and compliance across all operations.", fullBio: "Christian Jay Pitos Eupeña was born on December 12, 2005, in P-7 Poblacion, Sibagat, Agusan del Sur. He is currently residing at P-1A Banahaw Bayugan 3, Rosario, Agusan del Sur. He is currently pursuing a degree in Bachelor of Science in Agriculture major in Animal Science (BSA-AnSci). A proud graduate of Philsaga High School Foundation Incorporated (PHSFI), he completed his senior high school under the General Academic Strand and graduated With Honors.Christian is passionate about sports and entertainment, often spending his free time playing basketball and watching movies. His dedication to both academics and personal interests reflects his well-rounded character and commitment to growth." },
                { name: "Jay-ar Torralba", image: "Photos/Jay-ar%20Torralba,%20Business%20Manager.jpg", bio: "Driving partnerships and sustainable growth for the order.", fullBio: "Jay-ar Bactalan Torralba was born on August 5, 2004, at Northern Mindanao Hospital and is currently residing in Purok-8 Simulao, Bunawan Brook, Bunawan, Agusan del Sur. He is taking up a Bachelor of Science in Civil Engineering, driven by a strong interest in structural design and construction. A graduate of Asian Skills Academy Foundation Inc., Jay-ar completed his senior high school education With Honors, and was also recognized for his talent in the arts with an Outstanding Performance in Musical Arts Award. In addition to his academic accomplishments, Jay-ar is passionate about music and sports. He enjoys playing the guitar, as well as engaging in basketball and billiards, showing a well-rounded personality and creative spirit." }
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
                { name: "Emmanuel tambong Monte Jr.", image: "Photos/900db16f-ab04-4dd1-ae4a-9f956ef44679.jpg", bio: "Active member contributing to the order's vision and goals.", fullBio: "Emanuel Tambong Monte Jr. was born on May 18, 2001, in P-5 Magsaysay, Prosperidad, Agusan del Sur, where he also currently resides. He is a fourth-year student of Bachelor of Science in Agriculture major in Animal Science." },
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
                        <img src="${member.image}" alt="${member.name}" loading="lazy">
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

// Generate position cards for Members page
const positionsGrid = document.getElementById('positionsGrid');
if (positionsGrid) {
    membersData.forEach(data => {
        const isSingle = data.members.length === 1;
        const card = document.createElement('div');
        card.className = `position-card ${isSingle ? 'single-member' : ''}`;
        card.dataset.category = data.category;

        card.innerHTML = `
            <div class="slideshow-wrapper">
                <div class="slideshow-images"></div>
                ${!isSingle ? `
                    <div class="pause-indicator">▶</div>
                    <button class="slideshow-nav prev" aria-label="Previous member"><i class="fas fa-chevron-left"></i></button>
                    <button class="slideshow-nav next" aria-label="Next member"><i class="fas fa-chevron-right"></i></button>
                    <div class="slideshow-overlay">
                        <div class="slideshow-dots"></div>
                    </div>
                ` : '<div class="slideshow-dots" style="display:none;"></div>'}
            </div>
            <div class="slideshow-info">
                <span class="position-title">${data.position}</span>
                <a class="member-name" href="#" data-member-name="${encodeURIComponent(data.position)}" aria-label="View member details">Loading...</a>
                <div class="member-description" aria-live="polite">Loading...</div>
            </div>
        `;

        positionsGrid.appendChild(card);
        new PositionSlideshow(card, data);
    });
}

// Initialize homepage carousel if on homepage
if (document.getElementById('membersTrack')) {
    initHomepageCarousel();
}



    // Members page search and enhanced filtering
    function initMembersPage() {
        const searchInput = document.getElementById('memberSearch');
        const filterBtns = document.querySelectorAll('.filter-btn');
        const memberGroups = document.querySelectorAll('.member-group');
        
        if (!searchInput) return;
        
        let searchTerm = '';
        let activeFilter = 'all';
        
        // Search functionality
        searchInput.addEventListener('input', (e) => {
            searchTerm = e.target.value.toLowerCase().trim();
            filterMembers();
        });
        
        // Filter buttons
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                activeFilter = this.getAttribute('data-filter');
                filterMembers();
            });
        });
        
        function filterMembers() {
            membersData.forEach(data => {
                const matchesSearch = data.members.some(member => 
                    member.name.toLowerCase().includes(searchTerm)
                );
                const matchesFilter = activeFilter === 'all' || data.category === activeFilter;
                
                if (matchesSearch && matchesFilter) {
                    // Show group
                    const group = document.querySelector(`[data-group="${data.category}"]`);
                    if (group) {
                        group.classList.remove('hidden');
                    }
                } else {
                    // Hide group
                    const group = document.querySelector(`[data-group="${data.category}"]`);
                    if (group) {
                        group.classList.add('hidden');
                    }
                }
            });
        }
    }
    
    // Initialize if on members page
    if (document.getElementById('memberSearch')) {
        initMembersPage();
    }
});


