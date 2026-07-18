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
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Only treat a section as a scroll-spy target if the nav actually links
    // to it via a #hash href. This avoids other in-page anchor IDs (used for
    // deep-linking from other pages, e.g. #achievements, #services) from
    // being mistaken for scroll-spy targets and clearing the active state.
    const navHashIds = Array.from(navLinks)
        .map(link => link.getAttribute('href'))
        .filter(href => href && href.charAt(0) === '#')
        .map(href => href.slice(1));
    const sections = navHashIds.length
        ? Array.from(document.querySelectorAll('section[id]')).filter(section => navHashIds.indexOf(section.id) !== -1)
        : [];

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

    // Achievement / recognition card image lightbox
    const achievementImages = document.querySelectorAll('.achievement-card .card-img, .achievement-card .achievement-img');

    achievementImages.forEach(img => {
        img.addEventListener('click', function(e) {
            e.stopPropagation();
            const card = this.closest('.achievement-card');
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
   // =====================================================
// CONTACT FORM - EMAILJS INTEGRATION
// This replaces the old "alert only" contact form.
// Instead of just showing a success message,
// it sends the message directly to ODV Gmail.
// =====================================================

// Get the Contact Form by its ID
const contactForm = document.getElementById("contactForm");

// Check if the Contact Form exists on the page
if (contactForm) {

    // Listen for the Submit button
    contactForm.addEventListener("submit", function (e) {

        // Prevent the page from refreshing
        e.preventDefault();

        // Optional: Validate all required fields
        const formData = new FormData(this);
        const name = formData.get("name");
        const email = formData.get("email");
        const subject = formData.get("subject");
        const message = formData.get("message");

        if (!name || !email || !subject || !message) {
            alert("Please fill in all fields.");
            return;
        }

        // Send the form to EmailJS
        emailjs.sendForm(

            // Your EmailJS Service ID
            "service_4hjqm5g",

            // Your EmailJS Template ID
            "template_g1pe8oe",

            // Send the current form
            this

        )

        // If the email is sent successfully
        .then(function () {

            alert("Your message has been sent successfully!");

            // Clear all form fields
            contactForm.reset();

        })

        // If sending fails
        .catch(function (error) {

            console.error("EmailJS Error:", error);

            alert("Failed to send your message. Please try again.");

        });

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
            position: "Founding Master / Adviser",
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
                { name: "Ian Albert S. Dela Peña", image: "Photos/Ian%20Albert%20S.%20Dela%20Peña,%20Founding%20Grand%20Master.jpg", bio: "Committed to fostering innovation and service within the Da Vinci community.", fullBio: "Mr. Ian Albert S. Dela Peña, Graduated Bachelor of Science in Civil Engineering at ASSCAT. He is a Former ASSCAT Supreme Student Government President 2021-2022, Former Caraga Federation of Tertiary Student Leaders Vice President, Delegate of Ayala Young Leaders Congress 2022, Delegate of MasterPEACE V, Delegate of the National Sectoral Council of the National Anti-Poverty Commission Youth and Student Sector and Delegate of National Youth Parliament for Region 10 and Caraga. One of the Bagani Outstanding Agsurnon Youth Awardee 2022 and One of the Top 25 of Outstanding Student Leaders of the Philippines 2024." },
                { name: "Z-rabih M. Maturan", image: "Photos/9d954659-7186-4875-a880-3da9565ab429.jpg", bio: "Dedicated to upholding the values and mission of the order through exemplary leadership.", fullBio: "Mr. Z-RABIH MONDEJAR MATURAN was born on October 15, 1999, in Bunawan, Agusan del Sur. He is a graduate of Bachelor of Science in Psychology from Caraga State University and currently resides in Purok 13, Sitio Tagbayog, Awao, Santa Josefa, Agusan del Sur. Throughout his academic journey, he consistently demonstrated excellence, earning distinctions such as Dean’s Lister and multiple awards in leadership, research, communication arts, and athletics. He completed his senior high school at Bunawan National High School under the General Academic Strand, where he served as Supreme Student Government President and received several recognitions including Leadership Awardee, Outstanding Performance in Research and Innovation, and Outstanding Performance in Communication Arts in Filipino. His leadership journey began early as a Boy Scout Member in elementary and Cluster Meet Boy Scout Leader in junior high, later becoming a Volleyball Captain in college. At present, Z-Rabih is actively engaged in community service and volunteerism, serving as a Cooperative Secretary, Indigenous People’s Corporation Secretary, Church Secretary, Local Community Tour Guide, and Alternative Representative to the Municipal Development Council. He is also involved in advocacy work with organizations such as PACT, Save the Children, and as an IP’s Advocate. In his free time, he enjoys playing volleyball, singing, and playing musical instruments. Guided by the belief that “For peace of heart and mind opens the gateway to a meaningful existence,” he continues to lead with purpose, compassion, and integrity." },
                { name: "Emanuel T. Monte Jr.", image: "Photos/900db16f-ab04-4dd1-ae4a-9f956ef44679.jpg", bio: "Active member contributing to the order's vision and goals.", fullBio: "Mr. Emanuel Tambong Monte Jr. was born on May 18, 2001, in P-5 Magsaysay, Prosperidad, Agusan del Sur, where he also currently resides. He is a fourth-year student of Bachelor of Science in Agriculture major in Animal Science. Emanuel is recognized for his dedication, perseverance, and passion for learning, which have guided him throughout his academic journey. He has earned distinctions with honors during his studies, reflecting his commitment to excellence both in academics and personal growth.Beyond the classroom, Emanuel enjoys engaging in various hobbies such as basketball, running, and drawing, which showcase his balance between physical discipline and artistic creativity. His enthusiasm, hardworking nature, and well-rounded character highlight his potential as a future professional and an inspiring individual in his community. When Emanuel joined Kab-ot Youth Organization (KYO) and the Order of Da Vinci (ODV), he discovered a deeper understanding of leadership and brotherhood. These organizations, known for their advocacy and humanitarian initiatives, became the platform where he cultivated both his character and sense of purpose. From a young leader in his hometown to a servant-hearted student in his college community, Emanuel Monte Jr. stands as an inspiring reminder that true leadership begins with the willingness to serve — and that the spirit of volunteerism knows no boundaries." }
            ]
        },
        {
            position: "President",
            category: "officer",
            members: [
                { name: "Julianne Tristan E. Dequiña", image: "Photos/Julianne%20Tristan%20Dequiña,%20President.jpg", bio: "Leading the Order with vision, dedication, and a commitment to excellence.", fullBio: "Julianne Tristan Encarnacion Dequiña was born on July 13, 2006, in Veruela, Agusan del Sur. He is currently pursuing a Bachelor of Science in Information Technology (BSIT), aiming to build a career in the ever-evolving world of digital technology and innovation. A proud graduate of Veruela National High School, Julianne completed the Humanities and Social Sciences (HUMSS) strand With Honors, showcasing his academic diligence and well-rounded capabilities. He also received the Leonardo Da Vinci Excellence Award through his Outstanding performance in the Order of Da Vinci. In his free time, he enjoys jogging, walking, and hiking, activities that reflect his active lifestyle and appreciation for the outdoors." },
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
                { name: "John Dave C. Cadiog", image: "Photos/Jhon%20Dave%20Cadiog,%20Secretary%20.jpg", bio: "Managing communications and maintaining organizational records.", fullBio: "Jhon Dave Cadiog was born on March 15, 2006, in San Francisco, Agusan del Sur. He currently resides in Purok 2, Bayugan 2, and is pursuing a Bachelor of Science in Civil Engineering (BSCE). Jhon Dave is a proud graduate of Agusan del Sur National High School, where he completed the General Academic Strand (GAS) and was recognized With Honors for his academic performance. In his free time, he enjoys playing basketball and reading books, hobbies that balance both physical activity and intellectual growth." }
            ]
        },
        {
            position: "Treasurer",
            category: "officer",
            members: [
                { name: "Christian Jay P. Eupeña", image: "Photos/Christian%20Jay%20P.%20Eupena,%20Treasurer.jpg", bio: "Managing financial records and ensuring fiscal responsibility.", fullBio: "Christian Jay P. Eupeña was born on November 15, 2006, in San Francisco, Agusan del Sur. He currently resides in Purok 2, Bayugan 2, and is pursuing a Bachelor of Science in Civil Engineering (BSCE). Christian is a proud graduate of Agusan del Sur National High School, where he completed the General Academic Strand (GAS) and was recognized With Honors for his academic performance. In his free time, he enjoys playing basketball and reading books, hobbies that balance both physical activity and intellectual growth." }
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
            position: "Business Manager",
            category: "officer",
            members: [
                { name: "Laurence M. Villaluna", image: "Photos/laurence%20Villaluna,%20Peace%20Relation%20Coordinator.jpg", bio: "Promoting peace initiatives and collaborative outreach programs.", fullBio: "Laurence Menendez Villaluna was born on October 20, 2006, in San Andres, Bunawan, Agusan del Sur, and currently lives in Mambalili, Bunawan, Agusan del Sur. He is pursuing a Bachelor of Science in Civil Engineering, reflecting his strong interest in engineering and innovation. Laurence graduated from Father Saturnino Urios College of Trento, Inc., where he completed his senior high school under the Science, Technology, Engineering, and Mathematics (STEM) strand With Honors, highlighting his academic excellence and determination. In his free time, he enjoys playing basketball, demonstrating both his love for sports and teamwork." }
            ]
        },
         {
            position: "Organizational Coordinator",
            category: "coordinator",
            members: [
                { name: "Grayster Keith R. Ibarra", image: "Photos/Grysther%20Kieth%20Ibarra,%20Organizational%20Coordinator.jpg", bio: "Ensuring smooth internal operations and event coordination.", fullBio: "Grayster Keith Remerata Ibarra was born on February 20, 2006, in Butuan City and currently resides in Purok 7, Del Monte, Talacogon, Agusan del Sur. He is pursuing a Bachelor of Science in Civil Engineering, aiming to build a future in structural design and engineering innovation. He graduated With Honor from Del Monte National High School, where he took the Science, Technology, Engineering, and Mathematics (STEM) strand—demonstrating academic strength and a passion for technical subjects. In his free time, Grayster enjoys playing online games and basketball, balancing mental focus with physical activity." }
            ]
        },
        {
            position: "Training & Membership Coordinators",
            category: "coordinator",
            members: [
                 { name: "Zieff Aaron H. Encluna", image: "Photos/Zeiff.jpg", bio: "Organizing trainings and managing membership processes.", fullBio: "Zieff Aaron Hadlocon Encluna was born on February 19, 2006, in Quezon City, National Capital Region. He currently resides in Purok 2, Bayugan 2, San Francisco, Agusan del Sur, and is pursuing a Bachelor of Science in Civil Engineering (BSCE)—a field that matches his passion for design, precision, and problem-solving. Zieff is a proud graduate of Agusan del Sur National High School, where he completed the General Academic Strand (GAS) and was consistently recognized With Honors from Grade 7 to Grade 12, reflecting his strong academic performance and discipline. Beyond his studies, he enjoys playing basketball and reading books, hobbies that balance both physical activity and intellectual growth." },
                { name: "Cyrill Jade B. Batobalane", image: "Photos/Cyrill%20Jade%20B.%20Batobalani,%20Training%20and%20Membership%20Coordinator.jpg", bio: "Organizing trainings and managing membership processes.", fullBio: "Cyrill Jade Bahian Batobalane was born on July 9, 2006, in Veruela, Agusan del Sur, where he also currently resides in Poblacion. He is taking up a Bachelor of Science in Agroforestry, inspired by his interest in sustainable agriculture and environmental conservation. A proud graduate of Veruela National High School, Cyrill completed the Humanities and Social Sciences (HUMSS) strand and was recognized as a Leadership Awardee, reflecting his dedication to service and responsibility as a student leader. In his free time, he enjoys photography, basketball, and badminton, balancing creativity, athleticism, and active engagement in his personal life." },
                { name: "Jumarie R. Pastor", image: "Photos/Jumarie%20R.%20Pastor,%20Training%20and%20Membership%20Coordinator.jpg", bio: "Facilitating member engagement and professional development.", fullBio: "Jumarie Ramos Pastor was born on May 3, 2004, and resides in P-2 Hubang, San Francisco, Agusan del Sur. He is currently taking up a Bachelor of Science in Civil Engineering (BSCE), combining his technical background with a passion for building and innovation. A graduate of Agusan del Sur National High School, Jumarie finished senior high school under the Technical-Vocational-Livelihood (TVL) strand With High Honors. He is also a National Certificate II (NC II) holder in RAC Servicing (DOMRAC), showcasing his hands-on skills in refrigeration and air-conditioning systems. Jumarie enjoys basketball, mobile games, and playing the guitar. He is also known for his practical skills in cleaning and repairing household appliances, reflecting both his resourcefulness and technical aptitude." }
            ]
        },
        {
            position: "Grievance Coordinator",
            category: "coordinator",
            members: [
                { name: "Jay-ar B. Torralba", image: "Photos/Jay-ar%20Torralba,%20Business%20Manager.jpg", bio: "Driving partnerships and sustainable growth for the order.", fullBio: "Jay-ar Bactalan Torralba was born on August 5, 2004, at Northern Mindanao Hospital and currently resides in Purok 8, Simulao, Bunawan Brook, Bunawan, Agusan del Sur. He is currently pursuing a Bachelor of Science in Industrial Technology (BSIT), Major in Automotive Technology, at the University of Southeastern Philippines (USeP) – Obrero Main Campus. He initially commenced his college education at the Agusan del Sur State University (ADSSU), formerly known as the Agusan del Sur State College of Agriculture and Technology (ASSCAT), under the Bachelor of Science in Civil Engineering (BSCE) program before transferring to USeP to continue his academic journey and pursue his passion for industrial technology and automotive systems. Jay-ar is a graduate of Asian Skills Academy Foundation, Inc., where he completed his senior high school education With Honors. He was also recognized for his artistic talent through the Outstanding Performance in Musical Arts Award, reflecting his creativity and dedication beyond academics. Outside the classroom, Jay-ar is passionate about music and sports. He enjoys playing the guitar, basketball, and billiards, activities that showcase his creativity, teamwork, discipline, and well-rounded personality as he prepares for a career in the field of industrial technology." },
            ]
        },
        {
            position: "Relations Coordinator",
            category: "coordinator",
            members: [
                { name: "Aian James G. Perez", image: "Photos/Aian%20James%20G.%20Perez,%20Relation%20Coordinator.jpg", bio: "Building strong relationships with partners and the community.", fullBio: "Aian James Gohitia Perez was born on October 3, 2006, in P-10 Del Monte, Talacogon, Agusan del Sur, where he also currently resides. He is pursuing a Bachelor of Science in Civil Engineering (BSCE), reflecting his passion for structure, design, and innovation. He is a consistent achiever graduated With Honors from Del Monte National High School and received accolades such as the School Choir Award and 1st Place in Science Month’s Scientist Kaloka Like & Talent Competition. He further distinguished himself by earning multiple awards in College, including the Academic Excellence Award, Civic Engagement Award, Leadership Award, Exemplary Award, and Outstanding Volunteer Award. In his free time, Aian enjoys playing outdoor games, drawing, and dancing, showcasing his vibrant personality and versatile talents both inside and outside the classroom." }
            ]
        },
        {
            position: "Master",
            category: "masters",
            members: [
                { name: "Charles Benedict C. Dator", image: "Photos/Charles%20Benedic%20Dator,%20Member.jpg", bio: "Active contributor to community projects and organizational events.", fullBio: "Charles Benedict Caayon Dator was born on April 27, 2006, in Ormoc City, Leyte, and currently resides in Cecilia, San Luis, Agusan del Sur. He is currently pursuing a Bachelor of Science in Civil Engineering (BSCE) at North Eastern Mindanao State University – Main Campus (NEMSU Main Campus). He initially commenced his civil engineering studies at the Agusan del Sur State University (ADSSU), formerly known as the Agusan del Sur State College of Agriculture and Technology (ASSCAT), before transferring to NEMSU to continue his academic journey and further pursue his passion for engineering, innovation, and infrastructure development. Charles is a graduate of Zillovia National High School, where he completed the General Academic Strand (GAS) and graduated With Honors, reflecting his dedication to academic excellence. Beyond academics, Charles has distinguished himself through his outstanding performance and leadership. He was crowned Mr. ZNHS 2023 and received the Best Actor in Oral Communication award in the same year, demonstrating his confidence, stage presence, and exceptional communication skills. He also enjoys participating in pageants and singing, showcasing his charisma, creativity, and passion for self-expression while continuously striving for personal growth and excellence." },
                { name: "Prince A. Jimenez", image: "Photos/Prince%20Jimenez,%20Member.jpg", bio: "Engaged member supporting the order's mission of service.", fullBio: "Prince Animo Jimenez was born on July 30, 2006, in Cabadbaran City and currently resides in Purok 1, San Andres, Bunawan, Agusan del Sur. He is pursuing a Bachelor of Science in Civil Engineering, motivated by a strong interest in design, construction, and infrastructure development. Prince is a graduate of Bunawan National High School, where he completed the Accountancy, Business, and Management (ABM) strand and earned recognition With Honors for his academic excellence. Outside his studies, he is passionate about music and enjoys playing both the guitar and the piano, demonstrating creativity and discipline in both academics and the arts." },
                { name: "Jemar G. Morgado", image: "Photos/Jemar%20Morgado,%20Member.jpg", bio: "Dedicated to growth and collaboration within the Da Vinci community.", fullBio: "Mr. Jemar Guzon Morgado was born on September 11, 2006, in Maasin, Leyte, and currently resides in Purok 1, Azpetia, Prosperidad, Agusan del Sur. He is currently pursuing a Bachelor of Secondary Education (BSEd), Major in Mathematics, at Philippine Normal University – Mindanao Campus in Prosperidad, Agusan del Sur. He initially commenced his college education at the Agusan del Sur State University (ADSSU), formerly known as the Agusan del Sur State College of Agriculture and Technology (ASSCAT), under the Bachelor of Science in Civil Engineering (BSCE) program before transferring to Philippine Normal University to continue his academic journey and pursue his passion for mathematics and education. Jemar is a graduate of Azpetia National High School, where he completed the General Academic Strand (GAS) and graduated With Honors, reflecting his dedication, perseverance, and commitment to academic excellence. Beyond academics, Jemar enjoys playing sports and the guitar, activities that reflect his energetic personality, creativity, and appreciation for teamwork, music, and lifelong learning. These interests continue to shape his well-rounded character as he prepares for a future in the teaching profession." },
                { name: "Reyzlie Dominic D. Arnaldo", image: "Photos/Reyzlie%20Arnaldo,%20Member.jpg", bio: "Committed to excellence and active participation in order activities.", fullBio: "Reyzlie Dominic Danieles Arnaldo was born on August 7, 2006, at Elisa R. Ochoa Memorial and Maternity General Hospital (EROMMGH) in Butuan City. He currently resides in Purok 3, Guadalupe, Esperanza, Agusan del Sur. He is currently pursuing a Bachelor of Science in Civil Engineering (BSCE) at North Eastern Mindanao State University – Main Campus (NEMSU Main Campus). He initially commenced his civil engineering studies at the Agusan del Sur State University (ADSSU), formerly known as the Agusan del Sur State College of Agriculture and Technology (ASSCAT), before transferring to NEMSU to continue his academic journey and pursue his aspirations in the field of infrastructure and sustainable development. Reyzlie is a graduate of Noli National High School, where he completed the Humanities and Social Sciences (HUMSS) strand and graduated With Honors, reflecting his academic excellence, dedication, and perseverance. Known for his strong active listening and effective communication skills, Reyzlie values collaboration, continuous learning, and personal growth. These qualities enable him to work effectively with others and prepare him for the responsibilities and challenges of the engineering profession." },
                { name: "Zenmar M. Borres", image: "Photos/Zenmar%20Borres.jpg", bio: "Passionate member contributing to the order's vision and goals.", fullBio: "Zenmar Moril Borres was born on November 15, 2005, in Bislig City and currently resides at #3B Mambalili, Bunawan, Agusan del Sur. He is currently pursuing a Bachelor of Science in Marine Transportation (BSMT) at Holy Cross of Davao College, Inc. He initially commenced his college education at the Agusan del Sur State University (ADSSU), formerly known as the Agusan del Sur State College of Agriculture and Technology (ASSCAT), under the Bachelor of Science in Civil Engineering (BSCE) program before transferring to Holy Cross of Davao College, Inc. to continue his academic journey in the maritime field and pursue his aspirations in the shipping and maritime industry. Zenmar is a graduate of De La Salle John Bosco College, where he completed the Science, Technology, Engineering, and Mathematics (STEM) strand. A consistent honor student from Grade 7 to Grade 12, his academic journey reflects dedication, discipline, and a commitment to excellence. Beyond academics, Zenmar enjoys playing badminton, a sport that complements his active lifestyle while fostering discipline, perseverance, and teamwork—qualities that continue to guide him in both his personal life and professional aspirations." },
                { name: "Ramil Paciano Atog", image: "Photos/86bbf800-b183-4a69-bb7c-6044e57be0f6.jpg", bio: "Enthusiastic member actively involved in order initiatives and projects.", fullBio: "Ramil Paciano Atog was born on June 23, 2006, in Manay, Mati, Davao Oriental, and currently resides in Prk. 15A Durian, Bayugan 3, Rosario, Agusan del Sur. He is a student of Bachelor of Secondary Education major in Science, known for his academic dedication and artistic talents. He is a consistent achiever, having earned multiple distinctions such as Mr. PHSFI 2023, Best in Research, Best in Performing Arts, Leadership Awardee, Artist of the Year, and With Honor recognition during his senior high school years at Philsaga High School Foundation Incorporated (PHSFI). He is a dynamic and adaptable individual with a passion for badminton, digital editing, and creative pursuits. His strengths in leadership and adaptability reflect his potential as both an educator and a community role model." },
                { name: "Lord Daven Heinz B. Parcon", image: "Photos/583f5957-495e-4295-810c-d1e31ee9eb57.jpg", bio: "Dedicated member actively participating in order activities and initiatives.", fullBio: "LORD DAVEN HEINZ BEGOTA PARCON was born on July 6, 2004, in Sto. Tomas, Loreto, Agusan del Sur. He is currently pursuing Bachelor in Industrial Technology major in Electrical Technology (BINDTECH-ELX 3A) and resides in Purok 5, Sto. Tomas, Loreto, Agusan del Sur. He took the Science, Technology, Engineering, and Mathematics (STEM) strand during his senior high school education. Although he has no listed academic awards, Lord Daven continues to focus on strengthening his technical knowledge and practical skills in his chosen field. In his free time, he enjoys playing online games, which help him develop strategic thinking and focus. Guided by the belief that “Leadership is not about the person, it is about the mindset,” he strives to cultivate a positive attitude, continuous learning, and personal growth in both academics and life." }
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
    const PIONEER_BATCH = ['Ramil Paciano Atog', 'Christian Jay P. Eupeña','Regie N. Tandoc',
        'Aian James G. Perez','Jay-ar B. Torralba','John Mark P. Segovia','Jumarie R. Pastor',
        'Laurence M. Villaluna','Julianne Tristan E. Dequiña', 'Jhon Mark S. Pacional','Prince A. Jimenez',];
    const SECOND_BATCH  = ['Jemar G. Morgado','Cyrill Jade B. Batobalane',
        'Reyzlie Dominic D. Arnaldo','Zenmar M. Borres','Charles Benedict C. Dator','John Dave C. Cadiog',
        'Zieff Aaron H. Encluna','Graysther Keith R. Ibarra',];

   function normalizeName(name) {
    return name
        .toLowerCase()
        .replace(/[.,]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}


function isInBatch(name, batch) {
    const target = normalizeName(name);
    return batch.some(member => normalizeName(member) === target);
}

function getBatch(name) {
    if (isInBatch(name, PIONEER_BATCH)) {
        return "ODV Pioneers Batch";
    }

    if (isInBatch(name, SECOND_BATCH)) {
        return "ODV 2nd Batch";
    }

    return "";
}

    // Merge all coordinator sub-groups into Officers
    const categoryMap = {
        founder:     { label: 'Founding Master',  members: [] },
        grandmaster: { label: 'Grand Masters',    members: [] },
        officer:     { label: 'Officers',         members: [] },
        masters:     { label: 'Masters',          members: [] },
        pioneers:    { label: 'Pioneers',         members: [] },
        batch2:      { label: '2nd Batch',        members: [] }
    };

    membersData.forEach(group => {
        const cat = group.category === 'coordinator' || group.category === 'businessmanager'
        ? 'officer'
        : group.category;
        if (categoryMap[cat]) {
            group.members.forEach(m => {
                // Reuse the same member object for both its base category and its
                // batch category — no duplicate member data is created.
                const withPosition = { ...m, position: group.position };
                categoryMap[cat].members.push(withPosition);

                if (isInBatch(m.name, PIONEER_BATCH)) {
                    categoryMap.pioneers.members.push(withPosition);
                } else if (isInBatch(m.name, SECOND_BATCH)) {
                    categoryMap.batch2.members.push(withPosition);
                }
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
        autoTimer = setInterval(next, 60000); // ~1 minute between auto-advances
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

// Call SDG init directly — this code already runs inside the guaranteed-ready
// DOMContentLoaded context above, so the DOM is ready now (a second, nested
// 'DOMContentLoaded' listener registered from here would never fire).
if (typeof window._initSDG === 'function') {
    window._initSDG();
}

// ==========================================
// Training Program — Fullscreen Gallery
// (same open/navigate/close/keyboard/swipe/loop pattern as the SDG lightbox,
// reusing the shared .ev-lightbox chrome; only runs on trainings.html)
// ==========================================
(function initTrainingGallery() {
    const cover = document.querySelector('.training-program-image .card-img');
    const lb    = document.getElementById('trainingLightbox');
    if (!cover || !lb) return;

    const images = [
        { src: 'img/training-program.jpg', alt: 'ODV Aspirants Training Program overview' },
        { src: 'img/training-program/timeline-1.jpg', alt: 'Aspirants Training Program timeline, page 1' },
        { src: 'img/training-program/timeline-2.jpg', alt: 'Aspirants Training Program timeline, page 2' },
        { src: 'img/training-program/timeline-3.jpg', alt: 'Aspirants Training Program timeline, page 3' },
        { src: 'img/training-program/timeline-4.jpg', alt: 'Aspirants Training Program timeline, page 4' },
        { src: 'img/training-program/timeline-5.jpg', alt: 'Aspirants Training Program timeline, page 5' },
        { src: 'img/training-program/timeline-6.jpg', alt: 'Aspirants Training Program timeline, page 6' }
    ];

    const lbImg     = document.getElementById('trainingLightboxImg');
    const lbTitle   = document.getElementById('trainingLightboxTitle');
    const lbCounter = document.getElementById('trainingLightboxCounter');
    let trainingLbIdx = 0;

    function trainingLbShow(i) {
        trainingLbIdx = (i + images.length) % images.length;
        const entry = images[trainingLbIdx];

        // Smooth crossfade between images (matches the SDG lightbox pattern)
        lbImg.style.opacity = 0;
        setTimeout(() => {
            lbImg.src = entry.src;
            lbImg.alt = entry.alt;
            lbImg.style.opacity = 1;
        }, 150);

        lbTitle.textContent   = entry.alt;
        lbCounter.textContent = 'Image ' + (trainingLbIdx + 1) + ' of ' + images.length;
    }

    function openTrainingLightbox(i) {
        trainingLbIdx = (i + images.length) % images.length;
        const entry = images[trainingLbIdx];
        lbImg.src = entry.src;
        lbImg.alt = entry.alt;
        lbTitle.textContent   = entry.alt;
        lbCounter.textContent = 'Image ' + (trainingLbIdx + 1) + ' of ' + images.length;

        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeTrainingLightbox() {
        lb.classList.remove('open');
        document.body.style.overflow = '';
    }

    // Cover image opens the gallery, starting at image 1 (the cover itself)
    cover.addEventListener('click', function(e) {
        e.stopPropagation();
        openTrainingLightbox(0);
    });

    const closeBtn = document.getElementById('trainingLightboxClose');
    if (closeBtn) closeBtn.addEventListener('click', closeTrainingLightbox);

    const prevBtn = document.getElementById('trainingLbPrev');
    const nextBtn = document.getElementById('trainingLbNext');
    if (prevBtn) prevBtn.addEventListener('click', () => trainingLbShow(trainingLbIdx - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => trainingLbShow(trainingLbIdx + 1));

    // Close on backdrop click
    lb.addEventListener('click', function(e) {
        if (e.target === lb) closeTrainingLightbox();
    });

    // Keyboard: ← Previous, → Next, Esc Close
    document.addEventListener('keydown', function(e) {
        if (!lb.classList.contains('open')) return;
        if (e.key === 'Escape')     closeTrainingLightbox();
        if (e.key === 'ArrowLeft')  trainingLbShow(trainingLbIdx - 1);
        if (e.key === 'ArrowRight') trainingLbShow(trainingLbIdx + 1);
    });

    // Swipe gestures (mobile)
    let trainingTouchStartX = 0;
    lb.addEventListener('touchstart', function(e) {
        trainingTouchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    lb.addEventListener('touchend', function(e) {
        const dx = e.changedTouches[0].clientX - trainingTouchStartX;
        if (Math.abs(dx) < 50) return; // ignore taps/small movements
        if (dx < 0) trainingLbShow(trainingLbIdx + 1); // swipe left → next
        else        trainingLbShow(trainingLbIdx - 1); // swipe right → prev
    }, { passive: true });
})();

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
// Runs as a plain IIFE, not a nested 'DOMContentLoaded' listener — this code
// already executes inside the guaranteed-ready DOMContentLoaded context above,
// so the DOM is ready now (a second, nested 'DOMContentLoaded' listener
// registered from here would never fire — same fix pattern as initSDG above).
(function() {
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
})();

// ==========================================
// Events — Year Picker, Cards & Fullscreen Viewer (Phase 1 rebuild)
// Step 1: choose a year. Step 2: browse event cards for that year.
// Step 3: fullscreen viewer — first page shows full details + Facebook
// link, Previous/Next then browse the remaining photos only (no autoplay).
// ==========================================
(function() {
    if (!document.getElementById('evYearPicker')) return;

    // ------------------------------------------------------------------
    // DATA: all events keyed by year, sourced from the official ODV
    // events archive (titles, dates, venues, Facebook links, descriptions,
    // and photo sets). Each event's first image is its cover photo.
    // ------------------------------------------------------------------
    var EVENTS = {
        '2026': [
            {
                title: "Bloodletting Activity",
                date: "February 11, 2026",
                venue: "Valentina Galido Plaza Memorial Hospital, Bunawan, Agusan del Sur",
                link: "https://www.facebook.com/share/p/18uy8uGRXw/",
                description: "𝐎𝐃𝐕 𝐁𝐥𝐨𝐨𝐝 𝐋𝐞𝐭𝐭𝐢𝐧𝐠 𝐀𝐜𝐭𝐢𝐯𝐢𝐭𝐲 The 𝐎𝐫𝐝𝐞𝐫 𝐨𝐟 𝐃𝐚 𝐕𝐢𝐧𝐜𝐢 participated the Blood Letting Activity last February 11, 2026 at New Pedia Building, Valentina Galido Plaza Memorial Hospital, Bunawan, ADS with a theme \"Give Blood on Hearts Month\" in order for us to achieve our Dreams and Advocacy that a Community that is safe and secured to various health problems. Through this Bloodletting Activity, We prolong and save the lives of every persons that needs our Blood. In support of VGPMH, we stand together to donate blood and save lives, because true leadership is shown through service and compassion. ‎ ‎𝑻𝒓𝒂𝒏𝒔𝒇𝒐𝒓𝒎𝒊𝒏𝒈 𝑴𝒊𝒏𝒅𝒔, 𝑩𝒖𝒊𝒍𝒅𝒊𝒏𝒈 𝑳𝒆𝒂𝒅𝒆𝒓𝒔! ‎ #ODVYORP #LeadershipInAction #ServiceAboveAmbition #BuildingLeaders #OrderOfDaVinci #BrotherlyLove #DonateBloodSaveLives #ODVServes #LeadershipThroughService #GiveBlood #SaveLives",
                images: [
                    "img/events/2026-bloodletting-activity/First Image to Appear, BLOODLETTING ACTIVITY(15).jpg",
                    "img/events/2026-bloodletting-activity/BLOODLETTING ACTIVITY(1).jpg",
                    "img/events/2026-bloodletting-activity/BLOODLETTING ACTIVITY(2).jpg",
                    "img/events/2026-bloodletting-activity/BLOODLETTING ACTIVITY(3).jpg",
                    "img/events/2026-bloodletting-activity/BLOODLETTING ACTIVITY(4).jpg",
                    "img/events/2026-bloodletting-activity/BLOODLETTING ACTIVITY(5).jpg",
                    "img/events/2026-bloodletting-activity/BLOODLETTING ACTIVITY(6).jpg",
                    "img/events/2026-bloodletting-activity/BLOODLETTING ACTIVITY(7).jpg",
                    "img/events/2026-bloodletting-activity/BLOODLETTING ACTIVITY(8).jpg",
                    "img/events/2026-bloodletting-activity/BLOODLETTING ACTIVITY(9).jpg",
                    "img/events/2026-bloodletting-activity/BLOODLETTING ACTIVITY(10).jpg",
                    "img/events/2026-bloodletting-activity/BLOODLETTING ACTIVITY(12).jpg",
                    "img/events/2026-bloodletting-activity/BLOODLETTING ACTIVITY(13).jpg",
                    "img/events/2026-bloodletting-activity/BLOODLETTING ACTIVITY(14).jpg",
                    "img/events/2026-bloodletting-activity/BLOODLETTING ACTIVITY(16).jpg",
                    "img/events/2026-bloodletting-activity/BLOODLETTING ACTIVITY(17).jpg"
                ]
            },
            {
                title: "Valentines Day",
                date: "February 13, 2026",
                venue: "ADSSU Main Campus, Bunawan, Agusan del Sur",
                link: "https://www.facebook.com/share/p/1VdCZS1qGN/",
                description: "𝐒𝐩𝐫𝐞𝐚𝐝𝐢𝐧𝐠 𝐋𝐨𝐯𝐞 𝐁𝐞𝐲𝐨𝐧𝐝 𝐖𝐨𝐫𝐝𝐬 This Valentine’s Season, the brothers of ODV express their deepest appreciation to the incredible Women Faculty and Staff of ASSCAT.  Your strength, dedication, grace, and unwavering commitment inspire us every day. Through this small initiative of giving treats and singing love songs, we honor the women who nurture minds, lead with compassion, and shape futures with excellence. May this simple gesture remind you how valued and celebrated you truly are. Happy Hearts’ Day from your Da Vincian brothers! #ODVInitiative #ValentinesWithPurpose #HonoringWomen #ASSCAT",
                images: [
                    "img/events/2026-valentines-day/First Image to Appear, VALENTINES DAY(10).jpg",
                    "img/events/2026-valentines-day/VALENTINES DAY(1).jpg",
                    "img/events/2026-valentines-day/VALENTINES DAY(2).jpg",
                    "img/events/2026-valentines-day/VALENTINES DAY(3).jpg",
                    "img/events/2026-valentines-day/VALENTINES DAY(4).jpg",
                    "img/events/2026-valentines-day/VALENTINES DAY(5).jpg",
                    "img/events/2026-valentines-day/VALENTINES DAY(6).jpg",
                    "img/events/2026-valentines-day/VALENTINES DAY(7).jpg",
                    "img/events/2026-valentines-day/VALENTINES DAY(8).jpg",
                    "img/events/2026-valentines-day/VALENTINES DAY(9).jpg"
                ]
            },
            {
                title: "Panagila-ila 2026: Welcome and Aspirants Oath Taking Ceremony",
                date: "February 13, 2026",
                venue: "ADSSU Audio Visual Center, Main Campus, Bunawan, Agusan del Sur",
                link: "https://www.facebook.com/share/p/1bKpzkrwSF/",
                description: "𝐏𝐚𝐧𝐚𝐠𝐢𝐥𝐚-𝐢𝐥𝐚 𝟐𝟎𝟐𝟔: Welcome and Aspirants’ Oath Taking Ceremony On February 13, 2026, at ASSCAT AVC Building, Bunawan, Agusan del Sur, the Order of Da Vinci officially welcomed its new Aspirants in the Panagila-ila, a rite of recognition and belonging. The Ceremony was highlighted by the Aspirants’ Oath of Commitment, where they pledged to uphold the ideals of brotherhood, service, and excellence that define the Order. With solemn words and steadfast hearts, they embraced their journey of growth, discipline, and leadership. The Panagila-ila is more than a welcome, it is a covenant. A covenant to honor tradition, to foster unity, and to advance knowledge and transformative action for the good of society. As the voices of the Aspirants echoed their pledge, the hall was filled with an atmosphere of solemnity and hope. The presence of ODV Grand Masters, Masters and Honored Guests stood as living witnesses that the brotherhood continues to grow stronger, ensuring that the legacy of Da Vinci is preserved and passed on. Indeed, this event is not just the start of a new chapter for our Aspirants, but a reminder that every journey begins with a promise, a promise to never walk alone, but to rise together in service, honor, and excellence. To our new Aspirants, welcome to the path of Da Vinci. Your climb has begun, and together, we rise. 𝑻𝒓𝒂𝒏𝒔𝒇𝒐𝒓𝒎𝒊𝒏𝒈 𝑴𝒊𝒏𝒅𝒔, 𝑩𝒖𝒊𝒍𝒅𝒊𝒏𝒈 𝑳𝒆𝒂𝒅𝒆𝒓𝒔! #ODV #PanagilaIla2026 #AspirantsOathTaking #Brotherhood #Excellence #Service #Leadership",
                images: [
                    "img/events/2026-panagila-ila-2026-welcome-and-aspirants-oath-taking-ceremony/First Image to Appear, PANAGILA-ILA 2026 WELCOME AND ASPIRANTS OATH TAKING CEREMONY(15).jpg",
                    "img/events/2026-panagila-ila-2026-welcome-and-aspirants-oath-taking-ceremony/PANAGILA-ILA 2026 WELCOME AND ASPIRANTS OATH TAKING CEREMONY (1).jpg",
                    "img/events/2026-panagila-ila-2026-welcome-and-aspirants-oath-taking-ceremony/PANAGILA-ILA 2026 WELCOME AND ASPIRANTS OATH TAKING CEREMONY(2).jpg",
                    "img/events/2026-panagila-ila-2026-welcome-and-aspirants-oath-taking-ceremony/PANAGILA-ILA 2026 WELCOME AND ASPIRANTS OATH TAKING CEREMONY(3).jpg",
                    "img/events/2026-panagila-ila-2026-welcome-and-aspirants-oath-taking-ceremony/PANAGILA-ILA 2026 WELCOME AND ASPIRANTS OATH TAKING CEREMONY(4).jpg",
                    "img/events/2026-panagila-ila-2026-welcome-and-aspirants-oath-taking-ceremony/PANAGILA-ILA 2026 WELCOME AND ASPIRANTS OATH TAKING CEREMONY(5).jpg",
                    "img/events/2026-panagila-ila-2026-welcome-and-aspirants-oath-taking-ceremony/PANAGILA-ILA 2026 WELCOME AND ASPIRANTS OATH TAKING CEREMONY(6).jpg",
                    "img/events/2026-panagila-ila-2026-welcome-and-aspirants-oath-taking-ceremony/PANAGILA-ILA 2026 WELCOME AND ASPIRANTS OATH TAKING CEREMONY(7).jpg",
                    "img/events/2026-panagila-ila-2026-welcome-and-aspirants-oath-taking-ceremony/PANAGILA-ILA 2026 WELCOME AND ASPIRANTS OATH TAKING CEREMONY(8).jpg",
                    "img/events/2026-panagila-ila-2026-welcome-and-aspirants-oath-taking-ceremony/PANAGILA-ILA 2026 WELCOME AND ASPIRANTS OATH TAKING CEREMONY(9).jpg",
                    "img/events/2026-panagila-ila-2026-welcome-and-aspirants-oath-taking-ceremony/PANAGILA-ILA 2026 WELCOME AND ASPIRANTS OATH TAKING CEREMONY(10).jpg",
                    "img/events/2026-panagila-ila-2026-welcome-and-aspirants-oath-taking-ceremony/PANAGILA-ILA 2026 WELCOME AND ASPIRANTS OATH TAKING CEREMONY(11).jpg",
                    "img/events/2026-panagila-ila-2026-welcome-and-aspirants-oath-taking-ceremony/PANAGILA-ILA 2026 WELCOME AND ASPIRANTS OATH TAKING CEREMONY(12).jpg",
                    "img/events/2026-panagila-ila-2026-welcome-and-aspirants-oath-taking-ceremony/PANAGILA-ILA 2026 WELCOME AND ASPIRANTS OATH TAKING CEREMONY(13).jpg",
                    "img/events/2026-panagila-ila-2026-welcome-and-aspirants-oath-taking-ceremony/PANAGILA-ILA 2026 WELCOME AND ASPIRANTS OATH TAKING CEREMONY(14).jpg",
                    "img/events/2026-panagila-ila-2026-welcome-and-aspirants-oath-taking-ceremony/PANAGILA-ILA 2026 WELCOME AND ASPIRANTS OATH TAKING CEREMONY(16).jpg",
                    "img/events/2026-panagila-ila-2026-welcome-and-aspirants-oath-taking-ceremony/PANAGILA-ILA 2026 WELCOME AND ASPIRANTS OATH TAKING CEREMONY(17).jpg",
                    "img/events/2026-panagila-ila-2026-welcome-and-aspirants-oath-taking-ceremony/PANAGILA-ILA 2026 WELCOME AND ASPIRANTS OATH TAKING CEREMONY(18).jpg",
                    "img/events/2026-panagila-ila-2026-welcome-and-aspirants-oath-taking-ceremony/PANAGILA-ILA 2026 WELCOME AND ASPIRANTS OATH TAKING CEREMONY(19).jpg",
                    "img/events/2026-panagila-ila-2026-welcome-and-aspirants-oath-taking-ceremony/PANAGILA-ILA 2026 WELCOME AND ASPIRANTS OATH TAKING CEREMONY(20).jpg"
                ]
            },
            {
                title: "SDG Camp 2026",
                date: "February 14–15, 2026",
                venue: "ADSSU Main Campus, Bunawan, Agusan del Sur",
                link: "https://www.facebook.com/share/p/1D8Qmh6LDP/",
                description: "𝟐𝟎𝟐𝟔 𝐒𝐮𝐬𝐭𝐚𝐢𝐧𝐚𝐛𝐥𝐞 𝐃𝐞𝐯𝐞𝐥𝐨𝐩𝐦𝐞𝐧𝐭 𝐆𝐨𝐚𝐥𝐬 𝐂𝐚𝐦𝐩 With hearts full of gratitude, the 𝐎𝐫𝐝𝐞𝐫 𝐨𝐟 𝐃𝐚 𝐕𝐢𝐧𝐜𝐢 extends our sincerest appreciation to the Agusan del Sur State College of Agriculture and Technology – National Service Training Program National Service Training Program-ASSCAT for the opportunity to serve and share our advocacy during the 2026 SDG Camp. Being recognized as a Top 20 Finalist for the Most Outstanding Organization for the People 2025 by UN SDSN Youth Philippines under the Sustainable Development Solutions Network is not just an achievement, it is a responsibility we carry with humility and dedication. To the passionate CWTS and LTS students, thank you for your active participation, meaningful engagement, and openness to lead with purpose. Your energy and commitment remind us why we continue to move forward in service. This recognition is not ours alone, it belongs to every partner, volunteer, and young leader who believes that true development begins with character and collective action. From ODV, thank you for trusting us, learning with us, and building a future with us. ‎𝑻𝒓𝒂𝒏𝒔𝒇𝒐𝒓𝒎𝒊𝒏𝒈 𝑴𝒊𝒏𝒅𝒔, 𝑩𝒖𝒊𝒍𝒅𝒊𝒏𝒈 𝑳𝒆𝒂𝒅𝒆𝒓𝒔! #ODV #Gratitude #SDG2026 #YouthInAction #LeadershipWithPurpose",
                images: [
                    "img/events/2026-sdg-camp-2026/First Image to Appear, SDG CAMP 2026 (3).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (1).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (2).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (4).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (5).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (6).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (7).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (8).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (9).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (10).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (11).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (12).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (13).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (14).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (15).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (16).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (17).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (18).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (19).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (20).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (21).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (22).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (23).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (24).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (25).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (26).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (27).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (28).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (29).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (30).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (31).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (32).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (33).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (34).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (35).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (36).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (37).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (38).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (39).jpg",
                    "img/events/2026-sdg-camp-2026/SDG CAMP 2026 (40).jpg"
                ]
            },
            {
                title: "Pagtambayayong 2026: Love in Action",
                date: "February 20, 2026",
                venue: "Bunawan, Agusan del Sur",
                link: "https://www.facebook.com/share/p/1DSmrFARj4/",
                description: "𝗣𝗔𝗚𝗧𝗔𝗠𝗕𝗔𝗬𝗔𝗬𝗢𝗡𝗚 𝟮𝟬𝟮𝟲: 𝗟𝗼𝘃𝗲 𝗶𝗻 𝗔𝗰𝘁𝗶𝗼𝗻 In moments of challenge, the spirit of bayanihan shines brightest. The 𝐎𝐫𝐝𝐞𝐫 𝐨𝐟 𝐃𝐚 𝐕𝐢𝐧𝐜𝐢, in collaboration with ASSCAT-NSTP, the ASSCAT Supreme Student Government (SSG), and various Registered Student Organizations (RSOs), unites to bring aid and hope to fellow students affected by the recent flood last February 20, 2026. Together, we turn compassion into meaningful action—proving that when we stand together, we rise stronger. Let’s show that in 2026, ODV continues to lead with heart, service, and solidarity.",
                images: [
                    "img/events/2026-pagtambayayong-2026-love-in-action/First Image to Appear, PAGTAMBAYAYONG 2026 LOVE IN ACTION (9).jpg",
                    "img/events/2026-pagtambayayong-2026-love-in-action/PAGTAMBAYAYONG 2026 LOVE IN ACTION (1).jpg",
                    "img/events/2026-pagtambayayong-2026-love-in-action/PAGTAMBAYAYONG 2026 LOVE IN ACTION (2).jpg",
                    "img/events/2026-pagtambayayong-2026-love-in-action/PAGTAMBAYAYONG 2026 LOVE IN ACTION (3).jpg",
                    "img/events/2026-pagtambayayong-2026-love-in-action/PAGTAMBAYAYONG 2026 LOVE IN ACTION (4).jpg",
                    "img/events/2026-pagtambayayong-2026-love-in-action/PAGTAMBAYAYONG 2026 LOVE IN ACTION (5).jpg",
                    "img/events/2026-pagtambayayong-2026-love-in-action/PAGTAMBAYAYONG 2026 LOVE IN ACTION (6).jpg",
                    "img/events/2026-pagtambayayong-2026-love-in-action/PAGTAMBAYAYONG 2026 LOVE IN ACTION (7).jpg",
                    "img/events/2026-pagtambayayong-2026-love-in-action/PAGTAMBAYAYONG 2026 LOVE IN ACTION (8).jpg"
                ]
            },
            {
                title: "31st Paghimugso: Faculty and Staff Day",
                date: "February 24, 2026",
                venue: "ADSSU Sports and Socio-Cultural Center",
                link: "https://www.facebook.com/share/p/1KvqETnLkN/",
                description: "𝗢𝗗𝗩 𝗙𝗮𝗰𝗶𝗹𝗶𝘁𝗮𝘁𝗲𝘀 𝗟𝗮𝗿𝗼 𝗻𝗮𝗻𝗴 𝗟𝗮𝗵𝗶 𝗮𝘁 𝗔𝗦𝗦𝗖𝗔𝗧’𝘀 𝟯𝟭𝘀𝘁 𝗣𝗮𝗴𝗵𝗶𝗺𝘂𝗴𝘀𝗼 𝗣𝗮𝗿𝘁 𝟭 In celebration of Agusan del Sur State College of Agriculture and Technology’s 31st Paghimugso, faculty and staff gathered last February 24, 2026 at the Sports and Socio-Cultural Center for a day of camaraderie, creativity, and friendly competition. As part of this meaningful celebration, the Order of Da Vinci (ODV) proudly facilitated the Laro ng Lahi, bringing energy, excitement, and a touch of Filipino tradition to the Faculty and Staff Day. From classic team challenges to laughter-filled relays, the games sparked joy and strengthened the bonds among employees across different offices and colleges. The venue came alive with vibrant team banners, coordinated outfits, cheers, and shared pride. The program opened with dynamic Saludo and Team Yelling performances, followed by the Oath of Amateurism, affirming fairness and sportsmanship. The Mr. and Ms. Faculty and Staff 2026 added flair to the celebration before teams showcased their competitive spirit in various sports and traditional games. Through collaboration with the ASSCAT Non-Teaching Personnel Association (ANPA) and the ASSCAT Faculty Association (AFA), the event highlighted the institution’s strong commitment to employee welfare and holistic well-being. More than just a festivity, the 31st Paghimugso stands as a testament that ASSCAT’s success is built on unity, dedication, and community spirit. ODV is honored to be part of this milestone celebration—championing tradition, teamwork, and leadership in every game we facilitate. 𝑻𝒓𝒂𝒏𝒔𝒇𝒐𝒓𝒎𝒊𝒏𝒈 𝑴𝒊𝒏𝒅𝒔, 𝑩𝒖𝒊𝒍𝒅𝒊𝒏𝒈 𝑳𝒆𝒂𝒅𝒆𝒓𝒔! #ASSCATThreeDecadesAndBeyond #ASSCAT31stPaghimugso #ODVInAction #TransformingMindsBuildingLeaders",
                images: [
                    "img/events/2026-31st-paghimugso-faculty-and-staff-day/First Image to Appear, 31st Paghimugso Faculty and Staff Day(1).jpg",
                    "img/events/2026-31st-paghimugso-faculty-and-staff-day/31st Paghimugso Faculty and Staff Day(2).jpg",
                    "img/events/2026-31st-paghimugso-faculty-and-staff-day/31st Paghimugso Faculty and Staff Day(4).jpg",
                    "img/events/2026-31st-paghimugso-faculty-and-staff-day/31st Paghimugso Faculty and Staff Day(5).jpg",
                    "img/events/2026-31st-paghimugso-faculty-and-staff-day/31st Paghimugso Faculty and Staff Day(6).jpg",
                    "img/events/2026-31st-paghimugso-faculty-and-staff-day/31st Paghimugso Faculty and Staff Day(7).jpg",
                    "img/events/2026-31st-paghimugso-faculty-and-staff-day/31st Paghimugso Faculty and Staff Day(8).jpg",
                    "img/events/2026-31st-paghimugso-faculty-and-staff-day/31st Paghimugso Faculty and Staff Day(9).jpg",
                    "img/events/2026-31st-paghimugso-faculty-and-staff-day/31st Paghimugso Faculty and Staff Day(10).jpg",
                    "img/events/2026-31st-paghimugso-faculty-and-staff-day/31st Paghimugso Faculty and Staff Day(11).jpg",
                    "img/events/2026-31st-paghimugso-faculty-and-staff-day/31st Paghimugso Faculty and Staff Day(12).jpg",
                    "img/events/2026-31st-paghimugso-faculty-and-staff-day/31st Paghimugso Faculty and Staff Day(13).jpg",
                    "img/events/2026-31st-paghimugso-faculty-and-staff-day/31st Paghimugso Faculty and Staff Day(14).jpg",
                    "img/events/2026-31st-paghimugso-faculty-and-staff-day/31st Paghimugso Faculty and Staff Day(15).jpg",
                    "img/events/2026-31st-paghimugso-faculty-and-staff-day/31st Paghimugso Faculty and Staff Day(16).jpg",
                    "img/events/2026-31st-paghimugso-faculty-and-staff-day/31st Paghimugso Faculty and Staff Day(17).jpg",
                    "img/events/2026-31st-paghimugso-faculty-and-staff-day/31st Paghimugso Faculty and Staff Day(18).jpg"
                ]
            },
            {
                title: "31st Paghimugso: Opening Ceremony",
                date: "February 24, 2026",
                venue: "ADSSU Sports and Socio-Cultural Center",
                link: "https://www.facebook.com/share/p/195xATnqVq/",
                description: "𝗢𝗗𝗩 𝗝𝗼𝗶𝗻𝘀 𝘁𝗵𝗲 𝗟𝗮𝘂𝗻𝗰𝗵 𝗼𝗳 𝗔𝗦𝗦𝗖𝗔𝗧’𝘀 𝟯𝟭𝘀𝘁 𝗣𝗮𝗴𝗵𝗶𝗺𝘂𝗴𝘀𝗼 Agusan del Sur State College of Agriculture and   Center, gathering students, faculty, staff, alumni, and valued partners in one vibrant opening ceremony. With the theme “Three Decades and Beyond: Strengthening Academic Excellence, Governance, and Community Impact,” this year’s celebration honors 31 years of dedication, progress, and meaningful service to the community. The evening program featured the much-awaited sashing and presentation of the Mr. and Ms. ASSCAT 2026 candidates, proudly representing their respective colleges and earning loud cheers of support. As the celebration unfolded, a spectacular fireworks display illuminated the campus sky—symbolizing a bright future ahead and officially marking the start of a week-long festivity. The Order of Da Vinci (ODV) stands proud to take part in this milestone celebration, united with the entire ASSCAT community in commemorating three decades of excellence and looking forward to even greater achievements beyond. 𝑻𝒓𝒂𝒏𝒔𝒇𝒐𝒓𝒎𝒊𝒏𝒈 𝑴𝒊𝒏𝒅𝒔, 𝑩𝒖𝒊𝒍𝒅𝒊𝒏𝒈 𝑳𝒆𝒂𝒅𝒆𝒓𝒔! #ASSCATThreeDecadesAndBeyond #ASSCAT31stPaghimugso #ODVInAction #TransformingMindsBuildingLeaders",
                images: [
                    "img/events/2026-31st-paghimugso-opening-ceremony/First Image to Appear, 31st Paghimugso Opening Ceremony(2).jpg",
                    "img/events/2026-31st-paghimugso-opening-ceremony/31st Paghimugso Opening Ceremony(1).jpg",
                    "img/events/2026-31st-paghimugso-opening-ceremony/31st Paghimugso Opening Ceremony(3).jpg",
                    "img/events/2026-31st-paghimugso-opening-ceremony/31st Paghimugso Opening Ceremony(4).jpg",
                    "img/events/2026-31st-paghimugso-opening-ceremony/31st Paghimugso Opening Ceremony(5).jpg",
                    "img/events/2026-31st-paghimugso-opening-ceremony/31st Paghimugso Opening Ceremony(6).jpg",
                    "img/events/2026-31st-paghimugso-opening-ceremony/31st Paghimugso Opening Ceremony(7).jpg"
                ]
            },
            {
                title: "Students Day 2026: Duyog Tu Paghimugso",
                date: "February 26, 2026",
                venue: "ADSSU Sports and Socio-Cultural Center",
                link: "https://www.facebook.com/share/p/1CkcLf8gQk/",
                description: "𝗦𝗧𝗨𝗗𝗘𝗡𝗧𝗦’ 𝗗𝗔𝗬 𝟮𝟬𝟮𝟲: 𝗗𝘂𝘆𝗼𝗴 𝘁𝘂 𝗣𝗮𝗵𝗶𝗺𝘂𝗴𝘀𝗼 The ASSCAT Supreme Student Government spearheaded the Students’ Day 2026 celebration, uniting the campus in a vibrant showcase of leadership, excellence, and student empowerment. The Order of Da Vinci (ODV) was honored to serve as one of the facilitators, helping ensure that every activity reflected teamwork, organization, and meaningful engagement. ODV was entrusted with the full implementation of the Amazing Race, one of the most anticipated highlights of the event. From planning the mechanics and designing station challenges to overseeing execution, our Da Vincians worked tirelessly to create an experience that tested speed, strategy, and collaboration. The success of the activity stands as a testament to ODV’s commitment to service and excellence. During the Registered Student Organization Awards, ODV proudly received the Membership Development Award for Student Organization—a recognition of our dedication to strengthening member engagement and building competent, values-driven leaders. This milestone reflects our mission of transforming minds and shaping empowered Da Vincians. ODV also took part in Bahagi Queen Universe 2026, where we presented the Ms. Bahagi Queen – ODV Choice Award, honoring a candidate who embodied confidence, intelligence, and purpose—qualities that resonate with our core values. Students’ Day 2026 was more than a celebration; it was a powerful reminder that when student leaders unite in purpose, excellence follows. Padayon, ASSCAT! Padayon, Da Vincians! 𝑻𝒓𝒂𝒏𝒔𝒇𝒐𝒓𝒎𝒊𝒏𝒈 𝑴𝒊𝒏𝒅𝒔, 𝑩𝒖𝒊𝒍𝒅𝒊𝒏𝒈 𝑳𝒆𝒂𝒅𝒆𝒓𝒔! #ASSCATThreeDecadesAndBeyond #ASSCAT31stPaghimugso #ODVInAction #TransformingMindsBuildingLeaders",
                images: [
                    "img/events/2026-students-day-2026-duyog-tu-paghimugso/First Image to Appear, STUDENTS DAY 2026 DUYOG TU PAGHIMUGSO(8).jpg",
                    "img/events/2026-students-day-2026-duyog-tu-paghimugso/STUDENTS DAY 2026 DUYOG TU PAGHIMUGSO(1).jpg",
                    "img/events/2026-students-day-2026-duyog-tu-paghimugso/STUDENTS DAY 2026 DUYOG TU PAGHIMUGSO(2).jpg",
                    "img/events/2026-students-day-2026-duyog-tu-paghimugso/STUDENTS DAY 2026 DUYOG TU PAGHIMUGSO(3).jpg",
                    "img/events/2026-students-day-2026-duyog-tu-paghimugso/STUDENTS DAY 2026 DUYOG TU PAGHIMUGSO(4).jpg",
                    "img/events/2026-students-day-2026-duyog-tu-paghimugso/STUDENTS DAY 2026 DUYOG TU PAGHIMUGSO(5).jpg",
                    "img/events/2026-students-day-2026-duyog-tu-paghimugso/STUDENTS DAY 2026 DUYOG TU PAGHIMUGSO(6).jpg",
                    "img/events/2026-students-day-2026-duyog-tu-paghimugso/STUDENTS DAY 2026 DUYOG TU PAGHIMUGSO(7).jpg",
                    "img/events/2026-students-day-2026-duyog-tu-paghimugso/STUDENTS DAY 2026 DUYOG TU PAGHIMUGSO(9).jpg",
                    "img/events/2026-students-day-2026-duyog-tu-paghimugso/STUDENTS DAY 2026 DUYOG TU PAGHIMUGSO(10).jpg"
                ]
            },
            {
                title: "31st Paghimugso: Unity Run",
                date: "February 28, 2026",
                venue: "ADSSU Sports and Socio-Cultural Center",
                link: "https://www.facebook.com/share/p/19A3S9vWUD/",
                description: "𝗢𝗗𝗩 𝗙𝗮𝗰𝗶𝗹𝗶𝘁𝗮𝘁𝗲𝘀 𝗔𝗦𝗦𝗖𝗔𝗧 𝟯𝟭𝘀𝘁 𝗨𝗻𝗶𝘁𝘆 𝗥𝘂𝗻: 𝗥𝘂𝗻𝗻𝗶𝗻𝗴 𝗮𝘀 𝗢𝗻𝗲 In celebration of the 31st Paghimugso of Agusan del Sur State College of Agriculture and Technology, the Order of Da Vinci (ODV) proudly facilitated the 31st Unity Run, a 10-kilometer fun run that brought together students, faculty, staff, and community members in a shared pursuit of wellness, unity, and empowerment. Held as part of the anniversary celebration and in support of National Women’s Month, the early morning run gathered enthusiastic participants who embraced the spirit of health, resilience, and solidarity. The activity highlighted the importance of maintaining an active lifestyle while strengthening the sense of community that has guided ASSCAT through its 31 years of service and impact. Participants showcased determination and sportsmanship throughout the race, with cash prizes awarded to the Top 10 Male and Female Finishers. Special recognitions were also given to the Youngest Registered Participants, Oldest Registered Participants, and the Fastest Couple Runners, adding excitement and inclusivity to the event. More than just a race, the Unity Run symbolized perseverance, equality, and collective progress—values that reflect ASSCAT’s commitment to academic excellence, community engagement, and sustainable development. The event also supported the initiatives of the ASSCAT GAD Focal Point System, reinforcing the celebration of women’s empowerment and advancing the Sustainable Development Goals (SDGs). Through this initiative, ODV continues to serve the community by fostering leadership, teamwork, and meaningful engagement—running forward together toward a stronger and healthier future. 𝑻𝒓𝒂𝒏𝒔𝒇𝒐𝒓𝒎𝒊𝒏𝒈 𝑴𝒊𝒏𝒅𝒔, 𝑩𝒖𝒊𝒍𝒅𝒊𝒏𝒈 𝑳𝒆𝒂𝒅𝒆𝒓𝒔! #ASSCATThreeDecadesAndBeyond #ASSCAT31stPaghimugso #ODVInAction #TransformingMindsBuildingLeaders",
                images: [
                    "img/events/2026-31st-paghimugso-unity-run/First Image to Appear, 31st Paghimugso Unity Run(1).jpg",
                    "img/events/2026-31st-paghimugso-unity-run/31st Paghimugso Unity Run(2).jpg",
                    "img/events/2026-31st-paghimugso-unity-run/31st Paghimugso Unity Run(3).jpg",
                    "img/events/2026-31st-paghimugso-unity-run/31st Paghimugso Unity Run(4).jpg",
                    "img/events/2026-31st-paghimugso-unity-run/31st Paghimugso Unity Run(5).jpg",
                    "img/events/2026-31st-paghimugso-unity-run/31st Paghimugso Unity Run(6).jpg",
                    "img/events/2026-31st-paghimugso-unity-run/31st Paghimugso Unity Run(7).jpg",
                    "img/events/2026-31st-paghimugso-unity-run/31st Paghimugso Unity Run(8).jpg",
                    "img/events/2026-31st-paghimugso-unity-run/31st Paghimugso Unity Run(9).jpg",
                    "img/events/2026-31st-paghimugso-unity-run/31st Paghimugso Unity Run(10).jpg",
                    "img/events/2026-31st-paghimugso-unity-run/31st Paghimugso Unity Run(11).jpg",
                    "img/events/2026-31st-paghimugso-unity-run/31st Paghimugso Unity Run(12).jpg",
                    "img/events/2026-31st-paghimugso-unity-run/31st Paghimugso Unity Run(13).jpg",
                    "img/events/2026-31st-paghimugso-unity-run/31st Paghimugso Unity Run(14).jpg",
                    "img/events/2026-31st-paghimugso-unity-run/31st Paghimugso Unity Run(15).jpg"
                ]
            },
            {
                title: "6th State of the College Address",
                date: "March 1, 2026",
                venue: "ADSSU Sports and Socio-Cultural Center",
                link: "https://www.facebook.com/share/p/19KZTRDJpu/",
                description: "𝗢𝗗𝗩 𝗔𝘁𝘁𝗲𝗻𝗱𝘀 𝘁𝗵𝗲 𝟲𝘁𝗵 𝗦𝘁𝗮𝘁𝗲 𝗼𝗳 𝘁𝗵𝗲 𝗖𝗼𝗹𝗹𝗲𝗴𝗲 𝗔𝗱𝗱𝗿𝗲𝘀𝘀 🌱 Thirty-one years in the field. From its early panglantaw, a vision planted in hopeful soil, Agusan del Sur State College of Agriculture and Technology has grown through seasons of cultivation, discipline, and reform. During the 6th State of the College Address (SOCA), College President Joy C. Capistrano presented the institution’s milestones and collective achievements—honoring the hands that tilled, the minds that planned, and the community that sustained its growth. The Order of Da Vinci (ODV) proudly attended the SOCA, standing in solidarity with the entire ASSCAT community in reflecting on the institution’s journey and celebrating the progress made through years of dedication and collaboration. The foundation was laid. The soil prepared. The roots deepened. The systems strengthened. Anchored on the theme “Three Decades and Beyond: Strengthening Academic Excellence, Governance, and Community Impact,” the institution now stands on ground made firmer by years of steady leadership. Soon, what has long been nurtured will bear fruit in its transition into a full-fledged Agusan del Sur State University—a milestone that reflects the perseverance, vision, and commitment of the entire academic community. Growth is deliberate. Harvest is earned. At 31, ASSCAT stands ready for its next season. Congratulations, Dr. Joy C. Capistrano! Congratulations, ASSCAT! #ASSCATThreeDecadesAndBeyond #ASSCAT31stPaghimugso #ODVInAction #TransformingMindsBuildingLeaders",
                images: [
                    "img/events/2026-6th-state-of-the-college-address/First Image to appear, 6th State of the College Address(5).jpg",
                    "img/events/2026-6th-state-of-the-college-address/6th State of the College Address(1).jpg",
                    "img/events/2026-6th-state-of-the-college-address/6th State of the College Address(2).jpg",
                    "img/events/2026-6th-state-of-the-college-address/6th State of the College Address(3).jpg",
                    "img/events/2026-6th-state-of-the-college-address/6th State of the College Address(4).jpg",
                    "img/events/2026-6th-state-of-the-college-address/6th State of the College Address(6).jpg",
                    "img/events/2026-6th-state-of-the-college-address/6th State of the College Address(7).jpg",
                    "img/events/2026-6th-state-of-the-college-address/6th State of the College Address(8).jpg",
                    "img/events/2026-6th-state-of-the-college-address/6th State of the College Address(9).jpg"
                ]
            },
            {
                title: "BFP Fire Prevention Month: Clean Up Drive",
                date: "March 21, 2026",
                venue: "Poblacion, Bunawan, Agusan del Sur",
                link: "https://www.facebook.com/share/p/1FJSy3uyvd/",
                description: "𝐎𝐃𝐕 𝐱 𝐁𝐅𝐏 𝐁𝐮𝐧𝐚𝐰𝐚𝐧 | 𝐅𝐢𝐫𝐞 𝐏𝐫𝐞𝐯𝐞𝐧𝐭𝐢𝐨𝐧 𝐌𝐨𝐧𝐭𝐡 𝐂𝐥𝐞𝐚𝐧-𝐔𝐩 𝐃𝐫𝐢𝐯𝐞 𝐟𝐨𝐫 𝐚 𝐒𝐚𝐟𝐞𝐫 𝐂𝐨𝐦𝐦𝐮𝐧𝐢𝐭𝐲 The 𝐎𝐫𝐝𝐞𝐫 𝐨𝐟 𝐃𝐚 𝐕𝐢𝐧𝐜𝐢 demonstrated its commitment to service and community safety by actively participating in the Clean-Up Drive Activity organized by the Bunawan Fire Station in observance of Fire Prevention Month 2026. With the theme “Sa Pag-iwas sa Sunog, Hindi Ka Nag-iisa,” the activity was conducted on March 21, 2026, at the Barangay Gymnasium of Barangay Poblacion, Bunawan. Under the leadership of 𝐅𝐒𝐒𝐔𝐏𝐓 𝐉𝐄𝐑𝐎𝐌𝐄 𝐓 𝐑𝐄𝐀𝐍𝐎, Officer-In-Charge, BFP Caraga with the supervision of 𝐅𝐒𝐈𝐍𝐒𝐏 𝐒𝐇𝐈𝐑𝐋𝐘 𝐏 𝐄𝐑𝐋𝐈𝐍𝐀, Acting Provincial Fire Marshal of Agusan del Sur and spearheaded by 𝐒𝐅𝐎𝟑 𝐁𝐞𝐧𝐞𝐝𝐢𝐜𝐭𝐨 𝐂 𝐅𝐮𝐧𝐜𝐢𝐨𝐧 𝐉𝐫, Officer-In-Charge of the Bunawan Fire Station, the activity aimed to promote environmental cleanliness while reducing fire hazards caused by the accumulation of combustible materials such as dried leaves, garbage, and other flammable debris. Through its active involvement, the Order of Da Vinci contributed to raising public awareness, strengthening community cooperation, and promoting a safer, cleaner, and more fire-resilient environment for all. 𝑻𝒓𝒂𝒏𝒔𝒇𝒐𝒓𝒎𝒊𝒏𝒈 𝑴𝒊𝒏𝒅𝒔, 𝑩𝒖𝒊𝒍𝒅𝒊𝒏𝒈 𝑳𝒆𝒂𝒅𝒆𝒓𝒔! #OrderOfDaVinci #ODVLeadership #LeadershipInAction #ServiceAboveAmbition #BuildingLeaders",
                images: [
                    "img/events/2026-bfp-fire-prevention-month-clean-up-drive/First Image to Appear, BFP Fire Prevention Month Clean Up Drive(1).jpg",
                    "img/events/2026-bfp-fire-prevention-month-clean-up-drive/Fire Prevention Month Clean Up Drive(2).jpg",
                    "img/events/2026-bfp-fire-prevention-month-clean-up-drive/Fire Prevention Month Clean Up Drive(3).jpg",
                    "img/events/2026-bfp-fire-prevention-month-clean-up-drive/Fire Prevention Month Clean Up Drive(4).jpg",
                    "img/events/2026-bfp-fire-prevention-month-clean-up-drive/Fire Prevention Month Clean Up Drive(5).jpg",
                    "img/events/2026-bfp-fire-prevention-month-clean-up-drive/Fire Prevention Month Clean Up Drive(6).jpg",
                    "img/events/2026-bfp-fire-prevention-month-clean-up-drive/Fire Prevention Month Clean Up Drive(7).jpg",
                    "img/events/2026-bfp-fire-prevention-month-clean-up-drive/Fire Prevention Month Clean Up Drive(8).jpg",
                    "img/events/2026-bfp-fire-prevention-month-clean-up-drive/Fire Prevention Month Clean Up Drive(9).jpg",
                    "img/events/2026-bfp-fire-prevention-month-clean-up-drive/Fire Prevention Month Clean Up Drive(10).jpg"
                ]
            },
            {
                title: "BFP Fire Prevention Month: Open House and Station Visit",
                date: "March 21, 2026",
                venue: "Poblacion, Bunawan, Agusan del Sur",
                link: "https://www.facebook.com/share/p/1Jqskg39H6/",
                description: "𝐎𝐃𝐕 𝐱 𝐁𝐅𝐏 𝐁𝐮𝐧𝐚𝐰𝐚𝐧 | 𝐅𝐢𝐫𝐞 𝐏𝐫𝐞𝐯𝐞𝐧𝐭𝐢𝐨𝐧 𝐌𝐨𝐧𝐭𝐡 𝐎𝐩𝐞𝐧 𝐇𝐨𝐮𝐬𝐞 𝐚𝐧𝐝 𝐒𝐭𝐚𝐭𝐢𝐨𝐧 𝐕𝐢𝐬𝐢𝐭 The 𝐎𝐫𝐝𝐞𝐫 𝐨𝐟 𝐃𝐚 𝐕𝐢𝐧𝐜𝐢  actively participated in the Open House and Station Visit conducted by the Bunawan Fire Station in celebration of Fire Prevention Month 2026. Led by 𝐅𝐒𝐒𝐔𝐏𝐓 𝐉𝐄𝐑𝐎𝐌𝐄 𝐓 𝐑𝐄𝐀𝐍𝐎, Officer-In-Charge, BFP Caraga with the supervision of 𝐅𝐒𝐈𝐍𝐒𝐏 𝐒𝐇𝐈𝐑𝐋𝐘 𝐏 𝐄𝐑𝐋𝐈𝐍𝐀, Acting Provincial Fire Marshal of Agusan del Sur and spearheaded by 𝐒𝐅𝐎𝟑 𝐁𝐞𝐧𝐞𝐝𝐢𝐜𝐭𝐨 𝐂 𝐅𝐮𝐧𝐜𝐢𝐨𝐧 𝐉𝐫, Officer-In-Charge of the Bunawan Fire Station, the activity provided meaningful learning and engagement in fire safety initiatives. During the visit, the Order of Da Vinci Masters and Aspirants gained valuable knowledge and hands-on experience in Fire Safety Education, proper donning and doffing of Personal Protective Equipment (PPE), and basic Fire Truck Operations. This opportunity strengthened their understanding of emergency response procedures and highlighted the importance of preparedness in fire-related situations. Through their active involvement, the Order of Da Vinci Masters and Aspirants continue to uphold the organization’s commitment to service, leadership, and community engagement, supporting the Bureau of Fire Protection’s mission in promoting safety awareness and fostering a culture of vigilance and shared responsibility toward a fire-resilient community. 𝑻𝒓𝒂𝒏𝒔𝒇𝒐𝒓𝒎𝒊𝒏𝒈 𝑴𝒊𝒏𝒅𝒔, 𝑩𝒖𝒊𝒍𝒅𝒊𝒏𝒈 𝑳𝒆𝒂𝒅𝒆𝒓𝒔! #OrderOfDaVinci #ODVLeadership #LeadershipInAction #ServiceAboveAmbition #BuildingLeaders",
                images: [
                    "img/events/2026-bfp-fire-prevention-month-open-house-and-station-visit/First Image to Appear, BFP Fire Prevention Month Open House and Station Visit(14).jpg",
                    "img/events/2026-bfp-fire-prevention-month-open-house-and-station-visit/BFP Fire Prevention Month Open House and Station Visit(1).jpg",
                    "img/events/2026-bfp-fire-prevention-month-open-house-and-station-visit/BFP Fire Prevention Month Open House and Station Visit(2).jpg",
                    "img/events/2026-bfp-fire-prevention-month-open-house-and-station-visit/BFP Fire Prevention Month Open House and Station Visit(3).jpg",
                    "img/events/2026-bfp-fire-prevention-month-open-house-and-station-visit/BFP Fire Prevention Month Open House and Station Visit(4).jpg",
                    "img/events/2026-bfp-fire-prevention-month-open-house-and-station-visit/BFP Fire Prevention Month Open House and Station Visit(5).jpg",
                    "img/events/2026-bfp-fire-prevention-month-open-house-and-station-visit/BFP Fire Prevention Month Open House and Station Visit(6).jpg",
                    "img/events/2026-bfp-fire-prevention-month-open-house-and-station-visit/BFP Fire Prevention Month Open House and Station Visit(7).jpg",
                    "img/events/2026-bfp-fire-prevention-month-open-house-and-station-visit/BFP Fire Prevention Month Open House and Station Visit(8).jpg",
                    "img/events/2026-bfp-fire-prevention-month-open-house-and-station-visit/BFP Fire Prevention Month Open House and Station Visit(9).jpg",
                    "img/events/2026-bfp-fire-prevention-month-open-house-and-station-visit/BFP Fire Prevention Month Open House and Station Visit(10).jpg",
                    "img/events/2026-bfp-fire-prevention-month-open-house-and-station-visit/BFP Fire Prevention Month Open House and Station Visit(11).jpg",
                    "img/events/2026-bfp-fire-prevention-month-open-house-and-station-visit/BFP Fire Prevention Month Open House and Station Visit(12).jpg",
                    "img/events/2026-bfp-fire-prevention-month-open-house-and-station-visit/BFP Fire Prevention Month Open House and Station Visit(15).jpg",
                    "img/events/2026-bfp-fire-prevention-month-open-house-and-station-visit/BFP Fire Prevention Month Open House and Station Visit(16).jpg",
                    "img/events/2026-bfp-fire-prevention-month-open-house-and-station-visit/BFP Fire Prevention Month Open House and Station Visit(17).jpg"
                ]
            },
        ],
        '2025': [
            {
                title: "Panag Ila-ila 2025",
                date: "February 6, 2025",
                venue: "ADSSU QMSC, BUNAWAN, ADS",
                link: "https://www.facebook.com/share/p/1D2nLHskPF/",
                description: "𝐏𝐀𝐍𝐀𝐆 𝐈𝐋𝐀-𝐈𝐋𝐀: 𝐅𝐨𝐫𝐠𝐢𝐧𝐠 𝐁𝐨𝐧𝐝𝐬, 𝐄𝐦𝐛𝐫𝐚𝐜𝐢𝐧𝐠 𝐁𝐫𝐨𝐭𝐡𝐞𝐫𝐡𝐨𝐨𝐝✨ A night to remember! Together, we welcomed our Aspirants into the Order of Da Vinci with meaningful ceremony, inspirational messages, and shared purpose. From the lighting of the Flame of Brotherhood to the Aspirants’ Oath, every moment was a celebration of unity, growth, and leadership. This unforgettable 𝗣𝗔𝗡𝗔𝗚 𝗜𝗟𝗔-𝗜𝗟𝗔 𝟮𝟬𝟮𝟱 would not have been possible without the unwavering support and dedication of our esteemed leaders and pioneers. We extend our heartfelt gratitude to our 𝗙𝗼𝘂𝗻𝗱𝗲𝗿, 𝐌𝐫. 𝐋𝐨𝐮𝐢𝐞 𝐉𝐚𝐲 𝐓𝐨𝐫𝐫𝐚𝐥𝐛𝐚, our 𝗙𝗼𝘂𝗻𝗱𝗶𝗻𝗴 𝗚𝗿𝗮𝗻𝗱 𝗠𝗮𝘀𝘁𝗲𝗿𝘀, 𝐌𝐫. 𝐈𝐚𝐧 𝐃𝐞𝐥𝐚 𝐏𝐞ñ𝐚 and 𝐌𝐫. 𝐂𝐡𝐫𝐢𝐬𝐭𝐢𝐚𝐧 𝐉𝐚𝐲 𝐆𝐮𝐦𝐚𝐩𝐚𝐜, our 𝗙𝗼𝘂𝗻𝗱𝗶𝗻𝗴 𝗠𝗮𝘀𝘁𝗲𝗿, 𝐌𝐫. 𝐄𝐦𝐚𝐧𝐮𝐞𝐥 𝐌𝐨𝐧𝐭𝐞, our 𝗢𝗗𝗩 𝗣𝗿𝗲𝘀𝗶𝗱𝗲𝗻𝘁, 𝐌𝐫. 𝐑𝐚𝐦𝐢𝐥 𝐏𝐚𝐜𝐢𝐚𝐧𝐨, and our 𝗙𝗼𝘂𝗻𝗱𝗶𝗻𝗴 𝗠𝗲𝗺𝗯𝗲𝗿𝘀. Congratulations to our aspirants as they embark on this transformative path! Let this event serve as a beacon of inspiration, camaraderie, and shared growth. 🫶🏻 𝙏𝙤𝙜𝙚𝙩𝙝𝙚𝙧, 𝙬𝙚 𝙨𝙩𝙖𝙣𝙙 𝙨𝙩𝙧𝙤𝙣𝙜𝙚𝙧. 𝙏𝙤𝙜𝙚𝙩𝙝𝙚𝙧, 𝙬𝙚 𝙨𝙝𝙞𝙣𝙚 𝙗𝙧𝙞𝙜𝙝𝙩𝙚𝙧. 🌟 #PanagIlaIla2025 #OrderOfDaVinci",
                images: [
                    "img/events/2025-panag-ila-ila-2025/First Image to Appear, PANAG ILA-ILA 2025(1).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(2).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(3).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(4).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(5).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(6).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(7).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(8).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(9).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(10).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(11).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(12).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(13).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(14).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(15).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(16).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(17).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(18).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(19).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(20).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(21).jpg"
                ]
            },
            {
                title: "Valentines Day 2025",
                date: "February 14, 2025",
                venue: "ADSSU Main Campus, Bunawan, Agusan del Sur",
                link: "https://www.facebook.com/share/p/1dHwo5aug1/",
                description: "𝐒𝐩𝐫𝐞𝐚𝐝𝐢𝐧𝐠 𝐋𝐨𝐯𝐞 𝐚𝐧𝐝 𝐆𝐫𝐚𝐭𝐢𝐭𝐮𝐝𝐞❤️🎶 A heartfelt serenade and tokens of appreciation for our beloved faculty and staff! 🎤💌 On Valentine’s Day, the Order of Da Vinci expressed gratitude through music, warmth, and sincere messages, reminding our faculty and staff how much they are valued and cherished. 💖 Thank you for your unwavering dedication and guidance; your passion inspires us every day! ✨ #OrderofDaVinci",
                images: [
                    "img/events/2025-valentines-day-2025/First Image to Appear, VALENTINES DAY(1).jpg",
                    "img/events/2025-valentines-day-2025/VALENTINES DAY(2).jpg",
                    "img/events/2025-valentines-day-2025/VALENTINES DAY(3).jpg",
                    "img/events/2025-valentines-day-2025/VALENTINES DAY(4).jpg"
                ]
            },
            {
                title: "Project Halad Gugma",
                date: "February 14, 2025",
                venue: "ADSSU Main Campus, Bunawan, Agusan del Sur",
                link: "https://www.facebook.com/share/p/1BW95mYdUq/",
                description: "𝐏𝐫𝐨𝐣𝐞𝐜𝐭 𝐇𝐚𝐥𝐚𝐝𝐠𝐮𝐠𝐦𝐚: 𝐀 𝐇𝐞𝐚𝐫𝐭𝐟𝐞𝐥𝐭 𝐎𝐟𝐟𝐞𝐫𝐢𝐧𝐠 𝐨𝐟 𝐋𝐨𝐯𝐞 𝐚𝐧𝐝 𝐆𝐫𝐚𝐭𝐢𝐭𝐮𝐝𝐞 𝐭𝐨 𝐬𝐞𝐥𝐞𝐜𝐭𝐞𝐝 𝐀𝐒𝐒𝐂𝐀𝐓 𝐔𝐭𝐢𝐥𝐢𝐭𝐢𝐞𝐬 𝐚𝐧𝐝 𝐆𝐮𝐚𝐫𝐝𝐬 🩷💚 Last Valentine’s Day, the Kab-ot Youth Organization celebrated love and gratitude through Project Haladgugma by giving simple grocery packs to the selected ASSCAT Utilities and Guards. This small gesture was our way of appreciating their hard work and dedication in keeping our school safe and orderly every day. 𝐃𝐚𝐠𝐡𝐚𝐧𝐠 𝐬𝐚𝐥𝐚𝐦𝐚𝐭 𝐬𝐚 𝐢𝐧𝐲𝐨𝐧𝐠 𝐩𝐚𝐝𝐚𝐲𝐨𝐧 𝐧𝐠𝐚 𝐩𝐚𝐠𝐬𝐞𝐫𝐛𝐢𝐬𝐲𝐨! Special thanks to all KYO President, VP and members, our KYO Adviser, and Order of Da Vinci (ODV) for making this activity possible. #ProjectHaladgugma #ServiceAboveAmbition",
                images: [
                    "img/events/2025-project-halad-gugma/First Image to Appear, PROJECT HALAD GUGMA(1).jpg",
                    "img/events/2025-project-halad-gugma/PROJECT HALAD GUGMA(2).jpg",
                    "img/events/2025-project-halad-gugma/PROJECT HALAD GUGMA(3).jpg",
                    "img/events/2025-project-halad-gugma/PROJECT HALAD GUGMA(4).jpg",
                    "img/events/2025-project-halad-gugma/PROJECT HALAD GUGMA(5).jpg",
                    "img/events/2025-project-halad-gugma/PROJECT HALAD GUGMA(6).jpg"
                ]
            },
            {
                title: "ASSCAT 30NITY Run",
                date: "February 22, 2025",
                venue: "ADSSU Main Campus, Bunawan, Agusan del Sur",
                link: "https://www.facebook.com/share/p/1GMq3b1ass/",
                description: "𝟑𝟎𝐍𝐈𝐓𝐘 𝐑𝐔𝐍: 𝐓𝐡𝐫𝐞𝐞 𝐃𝐞𝐜𝐚𝐝𝐞𝐬 𝐨𝐟 𝐔𝐧𝐢𝐭𝐲 𝐚𝐧𝐝 𝐏𝐫𝐨𝐠𝐫𝐞𝐬𝐬🏃🏻 Organized by 𝗔𝗦𝗦𝗖𝗔𝗧 𝗢𝗳𝗳𝗶𝗰𝗲 𝗼𝗳 𝘁𝗵𝗲 𝗣𝗿𝗲𝘀𝗶𝗱𝗲𝗻𝘁 in collaboration with the 𝗚𝗔𝗗 𝗙𝗼𝗰𝗮𝗹 𝗣𝗼𝗶𝗻𝘁 𝗦𝘆𝘀𝘁𝗲𝗺, the event was successfully held on February 22, 2025, to commemorate Agusan del Sur State College of Agriculture and Technology's 𝟑𝟎𝐭𝐡 𝐂𝐡𝐚𝐫𝐭𝐞𝐫 𝐂𝐞𝐥𝐞𝐛𝐫𝐚𝐭𝐢𝐨𝐧, guided by the theme: “𝗔𝗦𝗦𝗖𝗔𝗧 𝗮𝘁 𝟯𝟬: 𝗖𝗲𝗹𝗲𝗯𝗿𝗮𝘁𝗶𝗻𝗴 𝗚𝗿𝗼𝘄𝘁𝗵, 𝗦𝘂𝘀𝘁𝗮𝗶𝗻𝗶𝗻𝗴 𝗔𝗴𝗿𝗶𝗰𝘂𝗹𝘁𝘂𝗿𝗲, 𝗮𝗻𝗱 𝗣𝗿𝗼𝗽𝗲𝗹𝗹𝗶𝗻𝗴 𝗜𝗻𝗻𝗼𝘃𝗮𝘁𝗶𝗼𝗻.\" The 𝐎𝐫𝐝𝐞𝐫 𝐨𝐟 𝐃𝐚 𝐕𝐢𝐧𝐜𝐢 (𝗢𝗗𝗩) proudly took part as facilitators in the concluded 30NITY RUN—joining hands with 𝐊𝐚𝐛-𝐨𝐭 𝐘𝐨𝐮𝐭𝐡 𝐎𝐫𝐠𝐚𝐧𝐢𝐳𝐚𝐭𝐢𝐨𝐧 (𝗞𝗬𝗢) and other volunteers to ensure the event's success. Their dedication and teamwork were evident in every role they played, from coordinating logistics and managing stations to providing hydration and cheering on participants. More than just a run, this event embodied the spirit of unity, service, and youth empowerment, made possible by the collective efforts of dedicated volunteers and generous sponsors. Behind the success of the event were individuals and teams who worked tirelessly to create a seamless and memorable experience for all participants. Each stride symbolized not only physical endurance but also the shared values of leadership, camaraderie, and community that define the ASSCAT family. The 30NITY RUN reminded us that, together, we can go further—strengthening bonds, promoting wellness, and celebrating milestones that shape our institution’s legacy. A heartfelt salute goes out to everyone who ran, volunteered, sponsored, and cheered from the sidelines. Your energy, dedication, and generosity were the driving forces behind the event’s success! Let’s continue to run with purpose, serve with passion, and inspire positive change—because every step forward is a step toward a brighter future! ✨ #ASSCATat30 #30NityRun #OrderofDaVinci",
                images: [
                    "img/events/2025-asscat-30nity-run/First Image to Appear, ASSCAT 30NITY RUN(1).jpg",
                    "img/events/2025-asscat-30nity-run/ASSCAT 30NITY RUN(2).jpg",
                    "img/events/2025-asscat-30nity-run/ASSCAT 30NITY RUN(3).jpg",
                    "img/events/2025-asscat-30nity-run/ASSCAT 30NITY RUN(4).jpg",
                    "img/events/2025-asscat-30nity-run/ASSCAT 30NITY RUN(5).jpg",
                    "img/events/2025-asscat-30nity-run/ASSCAT 30NITY RUN(6).jpg",
                    "img/events/2025-asscat-30nity-run/ASSCAT 30NITY RUN(7).jpg",
                    "img/events/2025-asscat-30nity-run/ASSCAT 30NITY RUN(8).jpg",
                    "img/events/2025-asscat-30nity-run/ASSCAT 30NITY RUN(9).jpg",
                    "img/events/2025-asscat-30nity-run/ASSCAT 30NITY RUN(10).jpg",
                    "img/events/2025-asscat-30nity-run/ASSCAT 30NITY RUN(11).jpg",
                    "img/events/2025-asscat-30nity-run/ASSCAT 30NITY RUN(12).jpg",
                    "img/events/2025-asscat-30nity-run/ASSCAT 30NITY RUN(13).jpg",
                    "img/events/2025-asscat-30nity-run/ASSCAT 30NITY RUN(14).jpg",
                    "img/events/2025-asscat-30nity-run/ASSCAT 30NITY RUN(15).jpg",
                    "img/events/2025-asscat-30nity-run/ASSCAT 30NITY RUN(16).jpg",
                    "img/events/2025-asscat-30nity-run/ASSCAT 30NITY RUN(17).jpg",
                    "img/events/2025-asscat-30nity-run/ASSCAT 30NITY RUN(18).jpg",
                    "img/events/2025-asscat-30nity-run/ASSCAT 30NITY RUN(19).jpg",
                    "img/events/2025-asscat-30nity-run/ASSCAT 30NITY RUN(20).jpg",
                    "img/events/2025-asscat-30nity-run/ASSCAT 30NITY RUN(21).jpg",
                    "img/events/2025-asscat-30nity-run/ASSCAT 30NITY RUN(22).jpg",
                    "img/events/2025-asscat-30nity-run/ASSCAT 30NITY RUN(23).jpg",
                    "img/events/2025-asscat-30nity-run/ASSCAT 30NITY RUN(24).jpg",
                    "img/events/2025-asscat-30nity-run/ASSCAT 30NITY RUN(25).jpg",
                    "img/events/2025-asscat-30nity-run/ASSCAT 30NITY RUN(26).jpg",
                    "img/events/2025-asscat-30nity-run/ASSCAT 30NITY RUN(27).jpg"
                ]
            },
            {
                title: "ASSCAT HIV/AIDS Symposium",
                date: "February 22, 2025",
                venue: "ADSSU Main Campus, Bunawan, Agusan del Sur",
                link: "https://www.facebook.com/share/p/18yAPjjrgf/",
                description: "𝐏𝐫𝐨𝐦𝐨𝐭𝐢𝐧𝐠 𝐇𝐞𝐚𝐥𝐭𝐡 𝐀𝐰𝐚𝐫𝐞𝐧𝐞𝐬𝐬: 𝐇𝐈𝐕/𝐀𝐈𝐃𝐒 𝐒𝐲𝐦𝐩𝐨𝐬𝐢𝐮𝐦, 𝐅𝐫𝐞𝐞 𝐇𝐈𝐕 𝐓𝐞𝐬𝐭𝐢𝐧𝐠, 𝐚𝐧𝐝 𝐁𝐏 𝐂𝐡𝐞𝐜𝐤🩸 On February 22, 2025, NSTP students participated in an 𝐇𝐈𝐕/𝐀𝐈𝐃𝐒 𝐒𝐲𝐦𝐩𝐨𝐬𝐢𝐮𝐦 aimed at raising awareness, breaking stigma, and promoting proactive health choices. Led by health experts, the symposium provided valuable insights into HIV/AIDS prevention, transmission, and the importance of early detection. In support of this advocacy, participants were offered 𝐟𝐫𝐞𝐞 𝐇𝐈𝐕 𝐭𝐞𝐬𝐭𝐢𝐧𝐠 in a safe, confidential, and supportive environment—empowering them to take charge of their well-being. Additionally, the 𝗔𝗦𝗦𝗖𝗔𝗧- 𝗖𝗼𝗹𝗹𝗲𝗴𝗲 𝗥𝗲𝗱 𝗖𝗿𝗼𝘀𝘀 𝗬𝗼𝘂𝘁𝗵 (𝐂𝐑𝐂𝐘) provided 𝐟𝐫𝐞𝐞 𝐛𝐥𝐨𝐨𝐝 𝐩𝐫𝐞𝐬𝐬𝐮𝐫𝐞 (𝐁𝐏) 𝐜𝐡𝐞𝐜𝐤𝐬, reinforcing the importance of regular health monitoring. This collaborative effort highlights the commitment to building a healthier, more informed community—where knowledge, prevention, and compassion come together to protect lives. ❤️ #OrderofDaVinci",
                images: [
                    "img/events/2025-asscat-hiv-aids-symposium/First Image to Appear, ADSSU HIVAIDS SYMPOSIUM(1).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(2).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(3).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(4).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(5).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(6).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(7).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(8).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(9).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(10).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(11).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(12).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(13).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(14).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(15).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(16).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(17).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(18).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(19).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(20).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(21).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(22).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(23).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(24).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(25).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(26).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(27).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(28).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(29).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(30).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(31).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(32).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(33).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(34).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(35).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(36).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(37).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(38).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(39).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(40).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(41).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(42).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(43).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(44).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(45).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(46).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(47).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(48).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(49).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(50).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(51).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(52).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(53).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(54).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(55).jpg",
                    "img/events/2025-asscat-hiv-aids-symposium/ADSSU HIVAIDS SYMPOSIUM(56).jpg"
                ]
            },
            {
                title: "30th ASSCAT Charter Day Celebration: Faculty and Staff Day",
                date: "February 26, 2025",
                venue: "ADSSU Main Campus, Bunawan, Agusan del Sur",
                link: "https://www.facebook.com/share/p/1AkszVBEwH/",
                description: "𝐊𝐚𝐛-𝐨𝐭 𝐘𝐨𝐮𝐭𝐡 𝐎𝐫𝐠𝐚𝐧𝐢𝐳𝐚𝐭𝐢𝐨𝐧: 𝐒𝐭𝐫𝐞𝐧𝐠𝐭𝐡𝐞𝐧𝐢𝐧𝐠 𝐔𝐧𝐢𝐭𝐲 𝐚𝐧𝐝 𝐂𝐚𝐦𝐚𝐫𝐚𝐝𝐞𝐫𝐢𝐞 𝐚𝐭 𝐀𝐒𝐒𝐂𝐀𝐓’𝐬 𝟑𝟎𝐭𝐡 𝐏𝐚𝐠𝐡𝐢𝐦𝐮𝐠𝐬𝐨 𝐅𝐚𝐜𝐮𝐥𝐭𝐲 𝐚𝐧𝐝 𝐒𝐭𝐚𝐟𝐟 𝐃𝐚𝐲 The Kab-ot Youth Organization (KYO), in collaboration with the Order of the Vinci (ODV), proudly played a vital role in the celebration of ASSCAT Uni 30’s Faculty and Staff Day, helping facilitate a series of activities that showcased teamwork, creativity, and unity. The day kicked off with the “Unity Walk” a colorful parade of teams symbolizing solidarity and togetherness. This was followed by an energetic Mass Dance, where participants displayed their spirit and enthusiasm through synchronized performances. Finally, the exciting “Labanan ng Lahi” brought out everyone’s competitive yet collaborative spirit, emphasizing sportsmanship and camaraderie. Despite the unpredictable weather, the event pushed through with high energy and positivity, reflecting the resilience and dedication of the ASSCAT faculty and staff. Their active participation made this milestone celebration truly memorable, honoring three decades of inclusivity, strength, and gender equality. Staying true to the value of service above ambition, KYO remains committed to supporting meaningful initiatives that foster unity and strengthen community bonds. Captioned by: Jehoshabeth Cal #ServiceAboveAmbition #KYOisForSDG #ASSCATat30",
                images: [
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/First Image to Appear, 30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (9).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (1).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (2).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (3).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (4).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (5).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (6).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (7).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (8).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (10).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (11).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (12).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (13).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (14).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (15).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (16).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (17).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (18).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (19).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (20).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (21).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (22).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (23).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (24).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (25).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (26).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (27).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (28).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (29).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (30).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (31).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (32).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (33).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (34).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (35).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (36).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (37).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (38).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (39).jpg",
                    "img/events/2025-30th-asscat-charter-day-celebration-faculty-and-staff-day/30TH ADSSU CHARTER DAY CELEBRATION FACULTY AND STAFF (40).jpg"
                ]
            },
            {
                title: "ODV Pasidungog 2025",
                date: "March 5, 2025",
                venue: "ADSSU Business Center, Bunawan, Agusan del Sur",
                link: "https://www.facebook.com/share/p/1GriFvHHBd/",
                description: "𝗜𝗡 𝗣𝗛𝗢𝗧𝗢𝗦 || 𝐏𝐀𝐒𝐈𝐃𝐔𝐍𝐆𝐎𝐆 𝟐𝟎𝟐𝟓: 𝗔 𝗡𝗶𝗴𝗵𝘁 𝗼𝗳 𝗛𝗼𝗻𝗼𝗿 𝗮𝗻𝗱 𝗥𝗲𝗰𝗼𝗴𝗻𝗶𝘁𝗶𝗼𝗻 🏆🌟 This remarkable evening honored the outstanding achievements of our members and reaffirmed our commitment to inspiring future leaders. Under the leadership of President 𝐌𝐫. 𝐑𝐚𝐦𝐢𝐥 𝐏𝐚𝐜𝐢𝐚𝐧𝐨 together with the ODV Adviser, 𝐌𝐫. 𝐋𝐨𝐮𝐢𝐞 𝐉𝐚𝐲 𝐓𝐨𝐫𝐫𝐚𝐥𝐛𝐚, ODV Grand Masters, 𝐌𝐫. 𝐈𝐚𝐧 𝐀𝐥𝐛𝐞𝐫𝐭 𝐃𝐞𝐥𝐚 𝐏𝐞ñ𝐚 & 𝐌𝐫. 𝐂𝐡𝐫𝐢𝐬𝐭𝐢𝐚𝐧 𝐉𝐚𝐲 𝐆𝐮𝐦𝐚𝐩𝐚𝐜 and the Masters the 𝐅𝐨𝐮𝐧𝐝𝐢𝐧𝐠 𝐌𝐞𝐦𝐛𝐞𝐫𝐬, Pasidungog 2025 illuminated the night with honor, inspiration, and the celebration of excellence. This resounding event brought together the Order of Da Vinci community in a vibrant display of unity and dedication, as we recognized the remarkable achievements of our members and laid the foundation for future leadership. Every captured moment, from heartfelt speeches and inspiring award ceremonies to the camaraderie shared among our Da Vincian family, reflects the passion and commitment that drives our legacy forward. This celebration not only honored our storied past but also ignited a spark for continuous growth, innovation, and transformative change within our community. Together, we celebrate a legacy built on excellence and vision, leaving an indelible mark on the hearts of all who carry the torch of the Order of Da Vinci. 𝘗𝘢𝘥𝘢𝘺𝘰𝘯 𝘋𝘢 𝘝𝘪𝘯𝘤𝘪𝘢𝘯! 𝑀𝑒𝑛𝑡𝑒 𝑒𝑡 𝐶𝑜𝑟𝑑𝑒 𝑆𝑒𝑟𝑣𝑖𝑟𝑒! ✨ #Pasidungog2025 #LegacyInMotion #OrderOfDaVinci",
                images: [
                    "img/events/2025-odv-pasidungog-2025/First Image to Appear, ODV PASIDUNGOG 2025 (42).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (1).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (2).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (3).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (4).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (5).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (6).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (7).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (8).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (9).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (10).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (11).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (12).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (13).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (14).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (15).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (16).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (17).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (18).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (19).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (20).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (21).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (22).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (23).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (24).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (25).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (26).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (27).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (28).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (29).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (30).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (31).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (32).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (33).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (34).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (35).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (36).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (37).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (38).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (39).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (40).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (41).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (43).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (44).jpg",
                    "img/events/2025-odv-pasidungog-2025/ODV PASIDUNGOG 2025 (45).jpg"
                ]
            },
            {
                title: "Project Hope Beyond Bars",
                date: "April 6, 2025",
                venue: "Provincial Correctional and Security Management Office, Prosperidad, Agusan del Sur",
                link: "https://www.facebook.com/share/p/1DYNZ5bj5K/",
                description: "‎𝐇𝐨𝐩𝐞 𝐝𝐨𝐞𝐬 𝐧𝐨𝐭 𝐞𝐧𝐝 𝐰𝐡𝐞𝐫𝐞 𝐭𝐡𝐞 𝐛𝐚𝐫𝐬 𝐛𝐞𝐠𝐢𝐧. ‎ ‎As the Order of Da Vinci, we were deeply honored to take part in 𝑃𝑎𝑔-𝑎𝑠𝑎 𝑠𝑎 𝐿𝑖𝑘𝑜𝑑 𝑛𝑔 𝑅𝑒ℎ𝑎𝑠, an initiative birthed by 𝐒𝐢𝐛𝐨𝐥 𝟐𝟎𝟐𝟓, in collaboration with 𝐊𝐚𝐛-𝐨𝐭 𝐘𝐨𝐮𝐭𝐡 𝐎𝐫𝐠𝐚𝐧𝐢𝐳𝐚𝐭𝐢𝐨𝐧. This wasn’t just an outreach, it was a mission of grace, truth, and restoration. ‎ ‎We walked into the jail not to erase justice, but to extend mercy. Not to excuse wrong, but to proclaim that 𝘦𝘷𝘦𝘯 𝘣𝘦𝘩𝘪𝘯𝘥 𝘣𝘢𝘳𝘴, 𝘵𝘩𝘦𝘳𝘦 𝘪𝘴 𝘢 𝙎𝙖𝙫𝙞𝙤𝙧 𝘸𝘩𝘰 𝘣𝘳𝘦𝘢𝘬𝘴 𝘤𝘩𝘢𝘪𝘯𝘴 𝘧𝘢𝘳 𝘴𝘵𝘳𝘰𝘯𝘨𝘦𝘳 𝘵𝘩𝘢𝘯 𝘴𝘵𝘦𝘦𝘭 — 𝘤𝘩𝘢𝘪𝘯𝘴 𝘰𝘧 𝘨𝘶𝘪𝘭𝘵, 𝘴𝘩𝘢𝘮𝘦, 𝘢𝘯𝘥 𝘥𝘦𝘴𝘱𝘢𝘪𝘳. ‎ ‎𝐖𝐞 𝐥𝐢𝐬𝐭𝐞𝐧𝐞𝐝. 𝐖𝐞 𝐩𝐫𝐚𝐲𝐞𝐝. 𝐖𝐞 𝐬𝐞𝐫𝐯𝐞. 𝐀𝐧𝐝 𝐢𝐧 𝐫𝐞𝐭𝐮𝐫𝐧, 𝐰𝐞 𝐰𝐢𝐭𝐧𝐞𝐬𝐬𝐞𝐝 𝐭𝐡𝐞 𝐡𝐞𝐚𝐫𝐭𝐬 𝐛𝐞𝐠𝐢𝐧𝐧𝐢𝐧𝐠 𝐭𝐨 𝐡𝐨𝐩𝐞 𝐚𝐠𝐚𝐢𝐧. ‎ ‎This experience reminded us that people are more than their pasts. That every soul, no matter how broken, is a soul Jesus died for. That while justice seeks accountability, grace offers redemption. We saw not criminals, but 𝐬𝐨𝐧𝐬 𝐚𝐧𝐝 𝐝𝐚𝐮𝐠𝐡𝐭𝐞𝐫𝐬 𝐬𝐭𝐢𝐥𝐥 𝐬𝐞𝐞𝐧 𝐚𝐧𝐝 𝐥𝐨𝐯𝐞𝐝 𝐛𝐲 𝐆𝐨𝐝. ‎ ‎𝗪𝗲 𝗮𝗿𝗲 𝗻𝗼𝘁 𝗵𝗲𝗿𝗲 𝗯𝗲𝗰𝗮𝘂𝘀𝗲 𝘄𝗲 𝗮𝗿𝗲 𝗯𝗲𝘁𝘁𝗲𝗿. 𝗪𝗲 𝗮𝗿𝗲 𝗵𝗲𝗿𝗲 𝗯𝗲𝗰𝗮𝘂𝘀𝗲, 𝘄𝗲, 𝘁𝗼𝗼, 𝘄𝗲𝗿𝗲 𝗼𝗻𝗰𝗲 𝗹𝗼𝘀𝘁... 𝗮𝗻𝗱 𝗝𝗘𝗦𝗨𝗦 𝗳𝗼𝘂𝗻𝗱 𝘂𝘀. ‎ ‎This is just the beginning. The story is not over. ‎ ‎“𝐓𝐡𝐞 𝐋𝐨𝐫𝐝 𝐢𝐬 𝐜𝐥𝐨𝐬𝐞 𝐭𝐨 𝐭𝐡𝐞 𝐛𝐫𝐨𝐤𝐞𝐧𝐡𝐞𝐚𝐫𝐭𝐞𝐝𝐛𝐚𝐧𝐝 𝐬𝐚𝐯𝐞𝐬 𝐭𝐡𝐨𝐬𝐞 𝐰𝐡𝐨 𝐚𝐫𝐞 𝐜𝐫𝐮𝐬𝐡𝐞𝐝 𝐢𝐧 𝐬𝐩𝐢𝐫𝐢𝐭.“ ‎– 𝗣𝘀𝗮𝗹𝗺𝘀 𝟯𝟰:𝟭𝟴 ‎ ‎𝑻𝒓𝒂𝒏𝒔𝒇𝒐𝒓𝒎𝒊𝒏𝒈 𝑴𝒊𝒏𝒅𝒔, 𝑩𝒖𝒊𝒍𝒅𝒊𝒏𝒈 𝑳𝒆𝒂𝒅𝒆𝒓𝒔! ‎ ‎#LeadershipInAction #ServiceAboveAmbition #BuildingLeaders #OrderOfDaVinci",
                images: [
                    "img/events/2025-project-hope-beyond-bars/First Image to Appear, PROJECT HOPE BEYOND BARS (28).jpg",
                    "img/events/2025-project-hope-beyond-bars/PROJECT HOPE BEYOND BARS (1).jpg",
                    "img/events/2025-project-hope-beyond-bars/PROJECT HOPE BEYOND BARS (2).jpg",
                    "img/events/2025-project-hope-beyond-bars/PROJECT HOPE BEYOND BARS (3).jpg",
                    "img/events/2025-project-hope-beyond-bars/PROJECT HOPE BEYOND BARS (4).jpg",
                    "img/events/2025-project-hope-beyond-bars/PROJECT HOPE BEYOND BARS (5).jpg",
                    "img/events/2025-project-hope-beyond-bars/PROJECT HOPE BEYOND BARS (6).jpg",
                    "img/events/2025-project-hope-beyond-bars/PROJECT HOPE BEYOND BARS (7).jpg",
                    "img/events/2025-project-hope-beyond-bars/PROJECT HOPE BEYOND BARS (8).jpg",
                    "img/events/2025-project-hope-beyond-bars/PROJECT HOPE BEYOND BARS (9).jpg",
                    "img/events/2025-project-hope-beyond-bars/PROJECT HOPE BEYOND BARS (10).jpg",
                    "img/events/2025-project-hope-beyond-bars/PROJECT HOPE BEYOND BARS (11).jpg",
                    "img/events/2025-project-hope-beyond-bars/PROJECT HOPE BEYOND BARS (12).jpg",
                    "img/events/2025-project-hope-beyond-bars/PROJECT HOPE BEYOND BARS (13).jpg",
                    "img/events/2025-project-hope-beyond-bars/PROJECT HOPE BEYOND BARS (14).jpg",
                    "img/events/2025-project-hope-beyond-bars/PROJECT HOPE BEYOND BARS (15).jpg",
                    "img/events/2025-project-hope-beyond-bars/PROJECT HOPE BEYOND BARS (16).jpg",
                    "img/events/2025-project-hope-beyond-bars/PROJECT HOPE BEYOND BARS (17).jpg",
                    "img/events/2025-project-hope-beyond-bars/PROJECT HOPE BEYOND BARS (18).jpg",
                    "img/events/2025-project-hope-beyond-bars/PROJECT HOPE BEYOND BARS (19).jpg",
                    "img/events/2025-project-hope-beyond-bars/PROJECT HOPE BEYOND BARS (20).jpg",
                    "img/events/2025-project-hope-beyond-bars/PROJECT HOPE BEYOND BARS (21).jpg",
                    "img/events/2025-project-hope-beyond-bars/PROJECT HOPE BEYOND BARS (22).jpg",
                    "img/events/2025-project-hope-beyond-bars/PROJECT HOPE BEYOND BARS (23).jpg",
                    "img/events/2025-project-hope-beyond-bars/PROJECT HOPE BEYOND BARS (24).jpg",
                    "img/events/2025-project-hope-beyond-bars/PROJECT HOPE BEYOND BARS (25).jpg",
                    "img/events/2025-project-hope-beyond-bars/PROJECT HOPE BEYOND BARS (26).jpg",
                    "img/events/2025-project-hope-beyond-bars/PROJECT HOPE BEYOND BARS (27).jpg",
                    "img/events/2025-project-hope-beyond-bars/PROJECT HOPE BEYOND BARS (29).jpg"
                ]
            },
            {
                title: "NSTP Day",
                date: "April 12, 2025",
                venue: "ADSSU Main Campus, Bunawan, Agusan del Sur",
                link: "https://www.facebook.com/share/p/1DWfbqcjhh/",
                description: "‎In the spirit of leadership, unity, and service, the 𝐎𝐫𝐝𝐞𝐫 𝐨𝐟 𝐃𝐚 𝐕𝐢𝐧𝐜𝐢 along side with the 𝐊𝐚𝐛-𝐨𝐭 𝐘𝐨𝐮𝐭𝐡 𝐎𝐫𝐠𝐚𝐧𝐢𝐳𝐚𝐭𝐢𝐨𝐧 proudly took part as facilitators during the 𝗡𝗦𝗧𝗣 𝗗𝗮𝘆 𝟮𝟬𝟮𝟱, guiding the flow of simultaneous activities and games with dedication and discipline. ‎ ‎As Da Vincian leaders, we did more than just oversee, we led with purpose, coordinated with precision, and served with integrity. Each station we handled was more than just a game, it was an opportunity to foster teamwork, ignite passion, and create memorable experiences for every NSTP student. ‎ ‎We are honored to have been entrusted with such a vital role, and we remain steadfast in our mission to lead by example, with honor, valor, and service above self. ‎ ‎To everyone who played, cheered, and gave their all, we salute you. ‎ And to our fellow leaders, let us continue to rise and serve where we are needed most. ‎ ‎We are the Order. We lead. We serve. We prevail. ‎ ‎𝑻𝒓𝒂𝒏𝒔𝒇𝒐𝒓𝒎𝒊𝒏𝒈 𝑴𝒊𝒏𝒅𝒔, 𝑩𝒖𝒊𝒍𝒅𝒊𝒏𝒈 𝑳𝒆𝒂𝒅𝒆𝒓𝒔! ‎ ‎#LeadershipInAction #ServiceAboveAmbition #BuildingLeaders #OrderOfDaVinci",
                images: [
                    "img/events/2025-nstp-day/First Image to Appear, NSTP DAY (8).jpg",
                    "img/events/2025-nstp-day/NSTP DAY (1).jpg",
                    "img/events/2025-nstp-day/NSTP DAY (2).jpg",
                    "img/events/2025-nstp-day/NSTP DAY (3).jpg",
                    "img/events/2025-nstp-day/NSTP DAY (4).jpg",
                    "img/events/2025-nstp-day/NSTP DAY (5).jpg",
                    "img/events/2025-nstp-day/NSTP DAY (6).jpg",
                    "img/events/2025-nstp-day/NSTP DAY (7).jpg",
                    "img/events/2025-nstp-day/NSTP DAY (9).jpg",
                    "img/events/2025-nstp-day/NSTP DAY (10).jpg"
                ]
            },
            {
                title: "2nd Quarter Blood Donation Drive",
                date: "May 7, 2025",
                venue: "Valentina Galido Plaza Memorial Hospital, Bunawan, Agusan del Sur",
                link: "https://www.facebook.com/share/p/1DbeVVBLyZ/",
                description: "𝐎𝐃𝐕 𝐁𝐥𝐨𝐨𝐝 𝐋𝐞𝐭𝐭𝐢𝐧𝐠 𝐀𝐜𝐭𝐢𝐯𝐢𝐭𝐲 The 𝗢𝗿𝗱𝗲𝗿 𝗼𝗳 𝗗𝗮 𝗩𝗶𝗻𝗰𝗶 participated the Blood Letting Activity together with Kab-ot Youth Organization last May 07, 2025 at Valentina Galido Plaza Memorial Hospital, Bunawan, ADS with a theme \"Donating Blood is an Act of Solidarity\" in order for us to achieve our Dreams and Advocacy that a Community that is safe and secured to various health problems. Through this Bloodletting Activity, We prolong and save the lives of every persons that needs our Blood. ‎\"𝘛𝘰 𝘴𝘦𝘳𝘷𝘦 𝘪𝘴 𝘵𝘰 𝘭𝘦𝘢𝘥, 𝘢𝘯𝘥 𝘵𝘰 𝘨𝘪𝘷𝘦 𝘪𝘴 𝘵𝘰 𝘩𝘰𝘯𝘰𝘳.\" ‎ ‎𝑻𝒓𝒂𝒏𝒔𝒇𝒐𝒓𝒎𝒊𝒏𝒈 𝑴𝒊𝒏𝒅𝒔, 𝑩𝒖𝒊𝒍𝒅𝒊𝒏𝒈 𝑳𝒆𝒂𝒅𝒆𝒓𝒔! ‎ #ODVYORP ‎#LeadershipInAction ‎ #ServiceAboveAmbition #BuildingLeaders #OrderOfDaVinci",
                images: [
                    "img/events/2025-2nd-quarter-blood-donation-drive/First Image to appear, 2ND QUARTER BLOOD DONATION DRIVE (2).jpg",
                    "img/events/2025-2nd-quarter-blood-donation-drive/2ND QUARTER BLOOD DONATION DRIVE (1).jpg",
                    "img/events/2025-2nd-quarter-blood-donation-drive/2ND QUARTER BLOOD DONATION DRIVE (3).jpg",
                    "img/events/2025-2nd-quarter-blood-donation-drive/2ND QUARTER BLOOD DONATION DRIVE (4).jpg",
                    "img/events/2025-2nd-quarter-blood-donation-drive/2ND QUARTER BLOOD DONATION DRIVE (5).jpg",
                    "img/events/2025-2nd-quarter-blood-donation-drive/2ND QUARTER BLOOD DONATION DRIVE (6).jpg",
                    "img/events/2025-2nd-quarter-blood-donation-drive/2ND QUARTER BLOOD DONATION DRIVE (7).jpg",
                    "img/events/2025-2nd-quarter-blood-donation-drive/2ND QUARTER BLOOD DONATION DRIVE (8).jpg",
                    "img/events/2025-2nd-quarter-blood-donation-drive/2ND QUARTER BLOOD DONATION DRIVE (9).jpg",
                    "img/events/2025-2nd-quarter-blood-donation-drive/2ND QUARTER BLOOD DONATION DRIVE (10).jpg",
                    "img/events/2025-2nd-quarter-blood-donation-drive/2ND QUARTER BLOOD DONATION DRIVE (11).jpg",
                    "img/events/2025-2nd-quarter-blood-donation-drive/2ND QUARTER BLOOD DONATION DRIVE (12).jpg",
                    "img/events/2025-2nd-quarter-blood-donation-drive/2ND QUARTER BLOOD DONATION DRIVE (13).jpg",
                    "img/events/2025-2nd-quarter-blood-donation-drive/2ND QUARTER BLOOD DONATION DRIVE (14).jpg",
                    "img/events/2025-2nd-quarter-blood-donation-drive/2ND QUARTER BLOOD DONATION DRIVE (15).jpg",
                    "img/events/2025-2nd-quarter-blood-donation-drive/2ND QUARTER BLOOD DONATION DRIVE (16).jpg"
                ]
            },
            {
                title: "Buswak 2025: Youth Leadership Summit",
                date: "June 27–29, 2025",
                venue: "Hawilian National High School, Hawilian, Esperanza, Agusan del Sur",
                link: "https://www.facebook.com/share/p/1Gp175rxjE/",
                description: "𝐁𝐔𝐒𝐖𝐀𝐊 𝐘𝐨𝐮𝐭𝐡 𝐋𝐞𝐚𝐝𝐞𝐫𝐬𝐡𝐢𝐩 𝐒𝐮𝐦𝐦𝐢𝐭 𝟐𝟎𝟐𝟓 officially opened with an inspiring message from our Guest of Honor and keynote speaker, Vice Governor of Agusan del Sur, Hon. Patricia Anne \"Ate Pat\" Plaza Vice Governor Ate Pat emphasized the responsible use of social media, highlighting how our words and actions online reflect our values as young leaders. She also shed light on the remarkable efforts of our provincial leaders in uplifting communities, and passionately encouraged the youth to explore agriculture-related courses, recognizing agriculture as a key pillar of our future. The opening day concluded with a warm photo opportunity alongside our esteemed guest, participants, and facilitators — a moment to remember! Padayon mga kabatan-onan! The journey has just begun. #BUSWAK2025 #YouthLeadership #AtePatSaBuswak #AgusanDelSurYouth #FutureInAgriculture",
                images: [
                    "img/events/2025-buswak-2025-youth-leadership-summit/First Image to Appear, BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (33).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (1).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (2).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (3).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (4).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (5).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (6).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (7).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (8).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (9).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (10).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (11).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (12).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (13).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (14).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (15).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (16).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (17).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (18).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (19).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (20).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (21).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (22).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (23).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (24).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (25).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (26).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (27).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (28).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (29).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (30).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (31).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (32).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (34).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (35).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (36).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (37).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (38).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (39).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (40).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (41).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (42).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (43).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (44).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (45).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (46).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (47).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (48).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (49).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (50).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (51).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (52).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (53).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (54).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (55).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (56).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (57).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (58).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (59).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (60).jpg",
                    "img/events/2025-buswak-2025-youth-leadership-summit/BUSWAK 2025 YOUTH LEADERSHIP SUMMIT (61).jpg"
                ]
            },
            {
                title: "Pagsangka 2025: Strategic Planning and Performance Review",
                date: "August 1–2, 2025",
                venue: "RB Vitex Integrated Farm, Tagbayangbang, Bun. Brook, Bunawan, Agusan del Sur",
                link: "https://www.facebook.com/share/p/1BkHRdW362/",
                description: "𝗣𝗮𝗴𝘀𝗮𝗻𝗴𝗸𝗮 𝟮𝟬𝟮𝟱 | 𝐒𝐭𝐫𝐚𝐭𝐞𝐠𝐢𝐜 𝐏𝐥𝐚𝐧𝐧𝐢𝐧𝐠 𝐚𝐧𝐝 𝐏𝐞𝐫𝐟𝐨𝐫𝐦𝐚𝐧𝐜𝐞 𝐑𝐞𝐯𝐢𝐞𝐰 🌱✨ With the theme ‘Celebrating Achievements, Preparing for Greater Challenges,’ the Order of Da Vinci gathered at RB Vitex Integrated Farm last August 1-2, 2025 for a pivotal event that marked both reflection and renewal. This gathering focused on the comprehensive evaluation of all sessions and projects, both school-based and community-based, highlighting their successes, addressing challenges, and identifying key areas for improvement. A major part of the program was the revision of the organization's Vision, Mission, and Objectives (VMO) and Calendar of Activities, ensuring alignment with our evolving purpose and the needs of the communities we serve. We were privileged to learn from and be inspired by our exceptional speakers: Ms. Charlize Karen Grace A. Jimenez, LPT Mr. Ian Albert S. Dela Peña | ODV Grand Master Ms. Rosel A. Renoblas, LPT Mr. Louie Jay Torralba Estrella | ODV Adviser/Founder Mr. Christian Jay B. Gumapac | ODV Grand Master One of the most defining moments of the event was the launch of the new ODV brand of leadership, a bold, refreshed identity that reflects our commitment to purposeful, and transformative leadership. 🔥 With a stronger foundation and a clear direction, the Order of Da Vinci moves forward with renewed passion and unity. #Pagsangka2025 | #OrderOfDaVinci | #StrategicPlanning | #LeadershipWithPurpose | #ODVBrandOfLeadership",
                images: [
                    "img/events/2025-pagsangka-2025-strategic-planning-and-performance-review/First Image to Appear, PAGSANGKA 2025 STRATEGIC PLANNING AND PERFORMANCE REVIEW (12).jpg",
                    "img/events/2025-pagsangka-2025-strategic-planning-and-performance-review/PAGSANGKA 2025 STRATEGIC PLANNING AND PERFORMANCE REVIEW (1).jpg",
                    "img/events/2025-pagsangka-2025-strategic-planning-and-performance-review/PAGSANGKA 2025 STRATEGIC PLANNING AND PERFORMANCE REVIEW (2).jpg",
                    "img/events/2025-pagsangka-2025-strategic-planning-and-performance-review/PAGSANGKA 2025 STRATEGIC PLANNING AND PERFORMANCE REVIEW (3).jpg",
                    "img/events/2025-pagsangka-2025-strategic-planning-and-performance-review/PAGSANGKA 2025 STRATEGIC PLANNING AND PERFORMANCE REVIEW (4).jpg",
                    "img/events/2025-pagsangka-2025-strategic-planning-and-performance-review/PAGSANGKA 2025 STRATEGIC PLANNING AND PERFORMANCE REVIEW (5).jpg",
                    "img/events/2025-pagsangka-2025-strategic-planning-and-performance-review/PAGSANGKA 2025 STRATEGIC PLANNING AND PERFORMANCE REVIEW (6).jpg",
                    "img/events/2025-pagsangka-2025-strategic-planning-and-performance-review/PAGSANGKA 2025 STRATEGIC PLANNING AND PERFORMANCE REVIEW (7).jpg",
                    "img/events/2025-pagsangka-2025-strategic-planning-and-performance-review/PAGSANGKA 2025 STRATEGIC PLANNING AND PERFORMANCE REVIEW (8).jpg",
                    "img/events/2025-pagsangka-2025-strategic-planning-and-performance-review/PAGSANGKA 2025 STRATEGIC PLANNING AND PERFORMANCE REVIEW (9).jpg",
                    "img/events/2025-pagsangka-2025-strategic-planning-and-performance-review/PAGSANGKA 2025 STRATEGIC PLANNING AND PERFORMANCE REVIEW (10).jpg",
                    "img/events/2025-pagsangka-2025-strategic-planning-and-performance-review/PAGSANGKA 2025 STRATEGIC PLANNING AND PERFORMANCE REVIEW (11).jpg",
                    "img/events/2025-pagsangka-2025-strategic-planning-and-performance-review/PAGSANGKA 2025 STRATEGIC PLANNING AND PERFORMANCE REVIEW (13).jpg",
                    "img/events/2025-pagsangka-2025-strategic-planning-and-performance-review/PAGSANGKA 2025 STRATEGIC PLANNING AND PERFORMANCE REVIEW (14).jpg",
                    "img/events/2025-pagsangka-2025-strategic-planning-and-performance-review/PAGSANGKA 2025 STRATEGIC PLANNING AND PERFORMANCE REVIEW (15).jpg",
                    "img/events/2025-pagsangka-2025-strategic-planning-and-performance-review/PAGSANGKA 2025 STRATEGIC PLANNING AND PERFORMANCE REVIEW (16).jpg",
                    "img/events/2025-pagsangka-2025-strategic-planning-and-performance-review/PAGSANGKA 2025 STRATEGIC PLANNING AND PERFORMANCE REVIEW (17).jpg",
                    "img/events/2025-pagsangka-2025-strategic-planning-and-performance-review/PAGSANGKA 2025 STRATEGIC PLANNING AND PERFORMANCE REVIEW (18).jpg"
                ]
            },
            {
                title: "Subida 2025: ASSCAT College Orientation",
                date: "August 11, 2025",
                venue: "ADSSU Main Campus, Bunawan, Agusan del Sur",
                link: "https://www.facebook.com/share/p/1JDNgPSo3K/",
                description: "In the spirit of 𝙕𝙤𝙤𝙩𝙤𝙥𝙞𝙖, a city where \"Anyone can be anything\", the ASSCAT Main Supreme Student Government and the Order of Da Vinci proudly joined the vibrant gathering of 𝗔𝗦𝗦𝗖𝗔𝗧𝗼𝗽𝗶𝗮 for 𝗦𝗨𝗕𝗜𝗗𝗔 𝟮𝟬𝟮𝟱! Just like Judy Hopps leaving Bunnyburrow to make a difference, every ASSCATian took another bold step in their own climb, their own 𝗦𝗨𝗕𝗜𝗗𝗔—and together, we celebrated courage, curiosity, and community. Thank you to everyone who shared this milestone with us. Here’s to more journeys, more victories, and more reasons to keep climbing—because in ASSCATopia, anyone can be anything! 𝑻𝒓𝒂𝒏𝒔𝒇𝒐𝒓𝒎𝒊𝒏𝒈 𝑴𝒊𝒏𝒅𝒔, 𝑩𝒖𝒊𝒍𝒅𝒊𝒏𝒈 𝑳𝒆𝒂𝒅𝒆𝒓𝒔! #SUBIDA2025 #ASSCATopia #OrderOfDaVinci #ClimbTogether",
                images: [
                    "img/events/2025-subida-2025-asscat-college-orientation/First Image to Appear, SUBIDA 2025 ASSCAT COLLEGE ORIENTATION (7).jpg",
                    "img/events/2025-subida-2025-asscat-college-orientation/SUBIDA 2025 ASSCAT COLLEGE ORIENTATION (1).jpg",
                    "img/events/2025-subida-2025-asscat-college-orientation/SUBIDA 2025 ASSCAT COLLEGE ORIENTATION (2).jpg",
                    "img/events/2025-subida-2025-asscat-college-orientation/SUBIDA 2025 ASSCAT COLLEGE ORIENTATION (3).jpg",
                    "img/events/2025-subida-2025-asscat-college-orientation/SUBIDA 2025 ASSCAT COLLEGE ORIENTATION (4).jpg",
                    "img/events/2025-subida-2025-asscat-college-orientation/SUBIDA 2025 ASSCAT COLLEGE ORIENTATION (5).jpg",
                    "img/events/2025-subida-2025-asscat-college-orientation/SUBIDA 2025 ASSCAT COLLEGE ORIENTATION (6).jpg",
                    "img/events/2025-subida-2025-asscat-college-orientation/SUBIDA 2025 ASSCAT COLLEGE ORIENTATION (8).jpg",
                    "img/events/2025-subida-2025-asscat-college-orientation/SUBIDA 2025 ASSCAT COLLEGE ORIENTATION (9).jpg",
                    "img/events/2025-subida-2025-asscat-college-orientation/SUBIDA 2025 ASSCAT COLLEGE ORIENTATION (10).jpg"
                ]
            },
            {
                title: "3rd Quarter Blood Donation Drive",
                date: "August 13, 2025",
                venue: "Valentina Galido Plaza Memorial Hospital, Bunawan, Agusan del Sur",
                link: "https: https://www.facebook.com/share/p/19BZABdAr2/",
                description: "𝐕𝐚𝐥𝐞𝐧𝐭𝐢𝐧𝐚 𝐆𝐚𝐥𝐢𝐝𝐨 𝐏𝐥𝐚𝐳𝐚 𝐌𝐞𝐦𝐨𝐫𝐢𝐚𝐥 𝐇𝐨𝐬𝐩𝐢𝐭𝐚𝐥 3𝐫𝐝 𝐐𝐮𝐚𝐫𝐭𝐞𝐫 𝐁𝐥𝐨𝐨𝐝 𝐃𝐨𝐧𝐚𝐭𝐢𝐨𝐧 𝐃𝐫𝐢𝐯𝐞 𝟮𝟬𝟮𝟱 | 𝐒𝐀𝐕𝐈𝐍𝐆 𝐋𝐈𝐕𝐄𝐒, 𝐎𝐍𝐄 𝐃𝐑𝐎𝐏 𝐀𝐓 𝐀 𝐓𝐈𝐌𝐄 🩸❤️ The 𝐎𝐫𝐝𝐞𝐫 𝐨𝐟 𝐃𝐚 𝐕𝐢𝐧𝐜𝐢 proudly took part in the 𝐕𝐚𝐥𝐞𝐧𝐭𝐢𝐧𝐚 𝐆𝐚𝐥𝐢𝐝𝐨 𝐏𝐥𝐚𝐳𝐚 𝐌𝐞𝐦𝐨𝐫𝐢𝐚𝐥 𝐇𝐨𝐬𝐩𝐢𝐭𝐚𝐥 3𝐫𝐝 𝐐𝐮𝐚𝐫𝐭𝐞𝐫 𝐁𝐥𝐨𝐨𝐝 𝐃𝐨𝐧𝐚𝐭𝐢𝐨𝐧 𝐃𝐫𝐢𝐯𝐞 𝟮𝟬𝟮𝟱, a meaningful mission that proves even the smallest act of kindness can create ripples of hope last August 12, 2025. Through the compassion of generous donors and the dedication of partners, 56 bags of blood were collected, each one holding the power to give trauma victims, surgical patients, and those fighting critical illnesses a second chance at life. We commend our ODV Grand Masters, Mr. Ian Albert Dela Peña and Mr. Christian Jay B. Gumapac, ODV Masters, Mr. Regie N. Tandoc, Mr. Christian Jay P. Eupeña, Mr. Jumarie R. Pastor, Mr. John Dave C. Cadiog, and Mr. Zieff Aaron H. Encluna and our ODV Aspirants, Mr. Jeremy Ybañez, Mr. Danilo Jr. Domingo, and Mr. Rodel J. Pal-ot for stepping up and giving the gift of life through their blood donation. We also extend our heartfelt thanks to Philsaga Mining Hospital, led by Dr. Shareen Jade D. Gaspillo-Lagunsad, for their unwavering commitment to this life-saving cause. Together, let’s keep making a difference. 𝑻𝒓𝒂𝒏𝒔𝒇𝒐𝒓𝒎𝒊𝒏𝒈 𝑴𝒊𝒏𝒅𝒔, 𝑩𝒖𝒊𝒍𝒅𝒊𝒏𝒈 𝑳𝒆𝒂𝒅𝒆𝒓𝒔! ‎ ‎#OrderOfDaVinci #ODVLeadership ‎#LeadershipInAction #ServiceAboveAmbition #BuildingLeaders #ODVForLife #BloodDonationDrive2025 #SavingLivesOneDropAtATime #OrderOfDaVinci",
                images: [
                    "img/events/2025-3rd-quarter-blood-donation-drive/First Image to Appear, 3RD QUARTER BLOOD DONATION DRIVE (15).jpg",
                    "img/events/2025-3rd-quarter-blood-donation-drive/3RD QUARTER BLOOD DONATION DRIVE (1).jpg",
                    "img/events/2025-3rd-quarter-blood-donation-drive/3RD QUARTER BLOOD DONATION DRIVE (2).jpg",
                    "img/events/2025-3rd-quarter-blood-donation-drive/3RD QUARTER BLOOD DONATION DRIVE (3).jpg",
                    "img/events/2025-3rd-quarter-blood-donation-drive/3RD QUARTER BLOOD DONATION DRIVE (4).jpg",
                    "img/events/2025-3rd-quarter-blood-donation-drive/3RD QUARTER BLOOD DONATION DRIVE (5).jpg",
                    "img/events/2025-3rd-quarter-blood-donation-drive/3RD QUARTER BLOOD DONATION DRIVE (6).jpg",
                    "img/events/2025-3rd-quarter-blood-donation-drive/3RD QUARTER BLOOD DONATION DRIVE (7).jpg",
                    "img/events/2025-3rd-quarter-blood-donation-drive/3RD QUARTER BLOOD DONATION DRIVE (8).jpg",
                    "img/events/2025-3rd-quarter-blood-donation-drive/3RD QUARTER BLOOD DONATION DRIVE (9).jpg",
                    "img/events/2025-3rd-quarter-blood-donation-drive/3RD QUARTER BLOOD DONATION DRIVE (10).jpg",
                    "img/events/2025-3rd-quarter-blood-donation-drive/3RD QUARTER BLOOD DONATION DRIVE (11).jpg",
                    "img/events/2025-3rd-quarter-blood-donation-drive/3RD QUARTER BLOOD DONATION DRIVE (12).jpg",
                    "img/events/2025-3rd-quarter-blood-donation-drive/3RD QUARTER BLOOD DONATION DRIVE (13).jpg",
                    "img/events/2025-3rd-quarter-blood-donation-drive/3RD QUARTER BLOOD DONATION DRIVE (14).jpg"
                ]
            },
            {
                title: "NSTP 25 Hour Common Module",
                date: "August 17, 2025",
                venue: "ADSSU Main Campus, Bunawan, Agusan del Sur",
                link: "https://www.facebook.com/share/p/1BaYcNkJLq/",
                description: "𝐀 𝐉𝐨𝐮𝐫𝐧𝐞𝐲 𝐁𝐞𝐠𝐢𝐧𝐬 | 𝐖𝐞𝐞𝐤 1 𝐨𝐟 𝐭𝐡𝐞 𝐍𝐒𝐓𝐏 25-𝐇𝐨𝐮𝐫 𝐂𝐨𝐦𝐦𝐨𝐧 𝐌𝐨𝐝𝐮𝐥𝐞 Last August 17, 2025, the CEIT Covered Court became more than just a venue, it turned into a place of learning, discovery, and inspiration. The 𝐎𝐫𝐝𝐞𝐫 𝐨𝐟 𝐃𝐚 𝐕𝐢𝐧𝐜𝐢, together with the NSTP Seventh-Day Adventist Program and Kab-ot Youth Organization, opened the first chapter of the 25-Hour Common Module. From the very first session, our students were not just listeners, they were dreamers and doers, exploring what it truly means to be a citizen and a youth leader. The discussions on Citizenship Training and Basic Formation and Introduction to the SDGs – YOUth in Action sparked conversations about responsibility, compassion, and the power of collective action. As each voice joined the dialogue, one thing became clear: every ASSCATian carries the potential to shape the future. This was not just an event. It was a reminder that service, leadership, and nation-building begin with us, right here, right now. And this is only the beginning. 𝑻𝒓𝒂𝒏𝒔𝒇𝒐𝒓𝒎𝒊𝒏𝒈 𝑴𝒊𝒏𝒅𝒔, 𝑩𝒖𝒊𝒍𝒅𝒊𝒏𝒈 𝑳𝒆𝒂𝒅𝒆𝒓𝒔! #ODV #ASSCAT #NSTP #25HoursCommonModule #YouthInAction #Volunteerism #NationBuilding #SDGs",
                images: [
                    "img/events/2025-nstp-25-hour-common-module/First Image to Appear, NSTP 25 HOUR COMMON MODULE (5).jpg",
                    "img/events/2025-nstp-25-hour-common-module/NSTP 25 HOUR COMMON MODULE (1).jpg",
                    "img/events/2025-nstp-25-hour-common-module/NSTP 25 HOUR COMMON MODULE (2).jpg",
                    "img/events/2025-nstp-25-hour-common-module/NSTP 25 HOUR COMMON MODULE (3).jpg",
                    "img/events/2025-nstp-25-hour-common-module/NSTP 25 HOUR COMMON MODULE (4).jpg",
                    "img/events/2025-nstp-25-hour-common-module/NSTP 25 HOUR COMMON MODULE (6).jpg",
                    "img/events/2025-nstp-25-hour-common-module/NSTP 25 HOUR COMMON MODULE (7).jpg",
                    "img/events/2025-nstp-25-hour-common-module/NSTP 25 HOUR COMMON MODULE (8).jpg",
                    "img/events/2025-nstp-25-hour-common-module/NSTP 25 HOUR COMMON MODULE (9).jpg",
                    "img/events/2025-nstp-25-hour-common-module/NSTP 25 HOUR COMMON MODULE (10).jpg",
                    "img/events/2025-nstp-25-hour-common-module/NSTP 25 HOUR COMMON MODULE (11).jpg",
                    "img/events/2025-nstp-25-hour-common-module/NSTP 25 HOUR COMMON MODULE (12).jpg",
                    "img/events/2025-nstp-25-hour-common-module/NSTP 25 HOUR COMMON MODULE (13).jpg",
                    "img/events/2025-nstp-25-hour-common-module/NSTP 25 HOUR COMMON MODULE (14).jpg",
                    "img/events/2025-nstp-25-hour-common-module/NSTP 25 HOUR COMMON MODULE (15).jpg",
                    "img/events/2025-nstp-25-hour-common-module/NSTP 25 HOUR COMMON MODULE (16).jpg",
                    "img/events/2025-nstp-25-hour-common-module/NSTP 25 HOUR COMMON MODULE (17).jpg",
                    "img/events/2025-nstp-25-hour-common-module/NSTP 25 HOUR COMMON MODULE (18).jpg",
                    "img/events/2025-nstp-25-hour-common-module/NSTP 25 HOUR COMMON MODULE (19).jpg",
                    "img/events/2025-nstp-25-hour-common-module/NSTP 25 HOUR COMMON MODULE (20).jpg"
                ]
            },
            {
                title: "Panag Ila-ila 2025",
                date: "August 21, 2025",
                venue: "San Andres, Bunawan, Agusan del Sur",
                link: "https:https://www.facebook.com/share/p/18vyuVNdaf/",
                description: "𝐏𝐚𝐧𝐚𝐠𝐢𝐥𝐚-𝐢𝐥𝐚 𝟐𝟎𝟐𝟓: Welcome and Aspirants’ Oath Taking Ceremony On August 21, 2025, at San Andres, Bunawan, Agusan del Sur, the Order of Da Vinci officially welcomed its new Aspirants in the Panagila-ila, a rite of recognition and belonging. The Ceremony was highlighted by the Aspirants’ Oath of Commitment, where they pledged to uphold the ideals of brotherhood, service, and excellence that define the Order. With solemn words and steadfast hearts, they embraced their journey of growth, discipline, and leadership. The Panagila-ila is more than a welcome, it is a covenant. A covenant to honor tradition, to foster unity, and to advance knowledge and transformative action for the good of society. As the voices of the Aspirants echoed their pledge, the hall was filled with an atmosphere of solemnity and hope. The presence of ODV Grand Masters, Masters and Honored Guests stood as living witnesses that the brotherhood continues to grow stronger, ensuring that the legacy of Da Vinci is preserved and passed on. Indeed, this event is not just the start of a new chapter for our Aspirants, but a reminder that every journey begins with a promise, a promise to never walk alone, but to rise together in service, honor, and excellence. To our new Aspirants, welcome to the path of Da Vinci. Your climb has begun, and together, we rise. 𝑻𝒓𝒂𝒏𝒔𝒇𝒐𝒓𝒎𝒊𝒏𝒈 𝑴𝒊𝒏𝒅𝒔, 𝑩𝒖𝒊𝒍𝒅𝒊𝒏𝒈 𝑳𝒆𝒂𝒅𝒆𝒓𝒔! #ODV #PanagilaIla2025 #AspirantsOathTaking #Brotherhood #Excellence #Service #Leadership",
                images: [
                    "img/events/2025-panag-ila-ila-2025/First Image to Appear, PANAG ILA-ILA 2025(1).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(2).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(3).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(4).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(5).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(6).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(7).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(8).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(9).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(10).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(11).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(12).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(13).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(14).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(15).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(16).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(17).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(18).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(19).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(20).jpg",
                    "img/events/2025-panag-ila-ila-2025/PANAG ILA-ILA 2025(21).jpg"
                ]
            },
            {
                title: "Black Jacket Investiture: Training of Trainors Graduation Ceremony",
                date: "August 21, 2025",
                venue: "San Andres, Bunawan, Agusan del Sur",
                link: "https://www.facebook.com/share/p/1NHayrySzz/",
                description: "𝐓𝐡𝐞 𝐁𝐥𝐚𝐜𝐤 𝐉𝐚𝐜𝐤𝐞𝐭 𝐈𝐧𝐯𝐞𝐬𝐭𝐢𝐭𝐮𝐫𝐞: 𝐓𝐫𝐚𝐢𝐧𝐢𝐧𝐠 𝐨𝐟 𝐓𝐫𝐚𝐢𝐧𝐞𝐫𝐬 𝐆𝐫𝐚𝐝𝐮𝐚𝐭𝐢𝐨𝐧 𝐂𝐞𝐫𝐞𝐦𝐨𝐧𝐲 The Order of Da Vinci proudly honors its members who have embraced the mantle of responsibility and leadership through the Training of Trainers Program. On August 21, 2025 at San Andres, Bunawan, Agusan del Sur, the following ODV members were formally conferred the 𝐁𝐥𝐚𝐜𝐤 𝐉𝐚𝐜𝐤𝐞𝐭, a symbol of dedication, service, and excellence: 🖤 Ramil P. Atog 🖤 Emanuel T. Monte Jr. 🖤 Aian James G. Perez 🖤 Grayster Keith R. Ibarra 🖤 Jumarie R. Pastor This milestone marks not just the completion of training, but the beginning of a greater mission — to guide, to lead, and to serve. 𝐓𝐡𝐞 𝐁𝐥𝐚𝐜𝐤 𝐉𝐚𝐜𝐤𝐞𝐭 𝐬𝐭𝐚𝐧𝐝𝐬 𝐚𝐬 𝐚 𝐜𝐨𝐯𝐞𝐧𝐚𝐧𝐭 𝐨𝐟 𝐛𝐫𝐨𝐭𝐡𝐞𝐫𝐡𝐨𝐨𝐝, 𝐝𝐢𝐬𝐜𝐢𝐩𝐥𝐢𝐧𝐞, 𝐚𝐧𝐝 𝐭𝐫𝐚𝐧𝐬𝐟𝐨𝐫𝐦𝐚𝐭𝐢𝐯𝐞 𝐥𝐞𝐚𝐝𝐞𝐫𝐬𝐡𝐢𝐩. 𝑻𝒓𝒂𝒏𝒔𝒇𝒐𝒓𝒎𝒊𝒏𝒈 𝑴𝒊𝒏𝒅𝒔, 𝑩𝒖𝒊𝒍𝒅𝒊𝒏𝒈 𝑳𝒆𝒂𝒅𝒆𝒓𝒔! #ODV #BlackJacketInvestiture #TrainingOfTrainers #Leadership #Excellence #Brotherhood",
                images: [
                    "img/events/2025-black-jacket-investiture-training-of-trainors-graduation-ceremony/First Image to Appear, BLACK JACKET INVESTITURE TRAINING OF TRAINORS GRADUATION CEREMONY (10).jpg",
                    "img/events/2025-black-jacket-investiture-training-of-trainors-graduation-ceremony/BLACK JACKET INVESTITURE TRAINING OF TRAINORS GRADUATION CEREMONY (1).jpg",
                    "img/events/2025-black-jacket-investiture-training-of-trainors-graduation-ceremony/BLACK JACKET INVESTITURE TRAINING OF TRAINORS GRADUATION CEREMONY (2).jpg",
                    "img/events/2025-black-jacket-investiture-training-of-trainors-graduation-ceremony/BLACK JACKET INVESTITURE TRAINING OF TRAINORS GRADUATION CEREMONY (3).jpg",
                    "img/events/2025-black-jacket-investiture-training-of-trainors-graduation-ceremony/BLACK JACKET INVESTITURE TRAINING OF TRAINORS GRADUATION CEREMONY (4).jpg",
                    "img/events/2025-black-jacket-investiture-training-of-trainors-graduation-ceremony/BLACK JACKET INVESTITURE TRAINING OF TRAINORS GRADUATION CEREMONY (5).jpg",
                    "img/events/2025-black-jacket-investiture-training-of-trainors-graduation-ceremony/BLACK JACKET INVESTITURE TRAINING OF TRAINORS GRADUATION CEREMONY (6).jpg",
                    "img/events/2025-black-jacket-investiture-training-of-trainors-graduation-ceremony/BLACK JACKET INVESTITURE TRAINING OF TRAINORS GRADUATION CEREMONY (7).jpg",
                    "img/events/2025-black-jacket-investiture-training-of-trainors-graduation-ceremony/BLACK JACKET INVESTITURE TRAINING OF TRAINORS GRADUATION CEREMONY (8).jpg",
                    "img/events/2025-black-jacket-investiture-training-of-trainors-graduation-ceremony/BLACK JACKET INVESTITURE TRAINING OF TRAINORS GRADUATION CEREMONY (9).jpg",
                    "img/events/2025-black-jacket-investiture-training-of-trainors-graduation-ceremony/BLACK JACKET INVESTITURE TRAINING OF TRAINORS GRADUATION CEREMONY (11).jpg",
                    "img/events/2025-black-jacket-investiture-training-of-trainors-graduation-ceremony/BLACK JACKET INVESTITURE TRAINING OF TRAINORS GRADUATION CEREMONY (12).jpg",
                    "img/events/2025-black-jacket-investiture-training-of-trainors-graduation-ceremony/BLACK JACKET INVESTITURE TRAINING OF TRAINORS GRADUATION CEREMONY (13).jpg",
                    "img/events/2025-black-jacket-investiture-training-of-trainors-graduation-ceremony/BLACK JACKET INVESTITURE TRAINING OF TRAINORS GRADUATION CEREMONY (14).jpg",
                    "img/events/2025-black-jacket-investiture-training-of-trainors-graduation-ceremony/BLACK JACKET INVESTITURE TRAINING OF TRAINORS GRADUATION CEREMONY (15).jpg",
                    "img/events/2025-black-jacket-investiture-training-of-trainors-graduation-ceremony/BLACK JACKET INVESTITURE TRAINING OF TRAINORS GRADUATION CEREMONY (16).jpg",
                    "img/events/2025-black-jacket-investiture-training-of-trainors-graduation-ceremony/BLACK JACKET INVESTITURE TRAINING OF TRAINORS GRADUATION CEREMONY (17).jpg",
                    "img/events/2025-black-jacket-investiture-training-of-trainors-graduation-ceremony/BLACK JACKET INVESTITURE TRAINING OF TRAINORS GRADUATION CEREMONY (18).jpg",
                    "img/events/2025-black-jacket-investiture-training-of-trainors-graduation-ceremony/BLACK JACKET INVESTITURE TRAINING OF TRAINORS GRADUATION CEREMONY (19).jpg",
                    "img/events/2025-black-jacket-investiture-training-of-trainors-graduation-ceremony/BLACK JACKET INVESTITURE TRAINING OF TRAINORS GRADUATION CEREMONY (20).jpg"
                ]
            },
            {
                title: "Linggo Ng Kabataan: Color Fun Run",
                date: "August 23, 2025",
                venue: "Consuelo, Bunawan, Agusan del Sur",
                link: "https://www.facebook.com/share/18zdxsosdw/",
                description: "𝐋𝐍𝐊 𝟐𝟎𝟐𝟓 𝐅𝐮𝐧 𝐑𝐮𝐧 The Order of Da Vinci (ODV) proudly joins hands with the Kab-ot Youth Organization (KYO) in supporting the Sangguniang Kabataan of Barangay Consuelo for this year’s Linggo ng Kabataan Fun Run 2025 last August 23, 2025! This event is more than just a race, it’s a celebration of youth empowerment, health, and camaraderie, proving that when the community runs together, we move closer to a stronger and healthier future. Disclaimer: Some photos used in this post are courtesy of SK Barangay Consuelo. 𝑻𝒓𝒂𝒏𝒔𝒇𝒐𝒓𝒎𝒊𝒏𝒈 𝑴𝒊𝒏𝒅𝒔, 𝑩𝒖𝒊𝒍𝒅𝒊𝒏𝒈 𝑳𝒆𝒂𝒅𝒆𝒓𝒔! #LNK2025 #FUNRUN #BrgyConsuelo #SangguniangKabataan #OrderOfDaVinci #ODVLeadership #LeadershipInAction #ServiceAboveAmbition #BuildingLeaders",
                images: [
                    "img/events/2025-linggo-ng-kabataan-color-fun-run/First Image to Appear, LINGGO NG KABATAAN COLOR FUN RUN (1).jpg",
                    "img/events/2025-linggo-ng-kabataan-color-fun-run/LINGGO NG KABATAAN COLOR FUN RUN (2).jpg",
                    "img/events/2025-linggo-ng-kabataan-color-fun-run/LINGGO NG KABATAAN COLOR FUN RUN (3).jpg",
                    "img/events/2025-linggo-ng-kabataan-color-fun-run/LINGGO NG KABATAAN COLOR FUN RUN (4).jpg",
                    "img/events/2025-linggo-ng-kabataan-color-fun-run/LINGGO NG KABATAAN COLOR FUN RUN (5).jpg",
                    "img/events/2025-linggo-ng-kabataan-color-fun-run/LINGGO NG KABATAAN COLOR FUN RUN (6).jpg",
                    "img/events/2025-linggo-ng-kabataan-color-fun-run/LINGGO NG KABATAAN COLOR FUN RUN (7).jpg",
                    "img/events/2025-linggo-ng-kabataan-color-fun-run/LINGGO NG KABATAAN COLOR FUN RUN (8).jpg",
                    "img/events/2025-linggo-ng-kabataan-color-fun-run/LINGGO NG KABATAAN COLOR FUN RUN (9).jpg",
                    "img/events/2025-linggo-ng-kabataan-color-fun-run/LINGGO NG KABATAAN COLOR FUN RUN (10).jpg",
                    "img/events/2025-linggo-ng-kabataan-color-fun-run/LINGGO NG KABATAAN COLOR FUN RUN (11).jpg",
                    "img/events/2025-linggo-ng-kabataan-color-fun-run/LINGGO NG KABATAAN COLOR FUN RUN (12).jpg",
                    "img/events/2025-linggo-ng-kabataan-color-fun-run/LINGGO NG KABATAAN COLOR FUN RUN (13).jpg",
                    "img/events/2025-linggo-ng-kabataan-color-fun-run/LINGGO NG KABATAAN COLOR FUN RUN (14).jpg",
                    "img/events/2025-linggo-ng-kabataan-color-fun-run/LINGGO NG KABATAAN COLOR FUN RUN (15).jpg",
                    "img/events/2025-linggo-ng-kabataan-color-fun-run/LINGGO NG KABATAAN COLOR FUN RUN (16).jpg",
                    "img/events/2025-linggo-ng-kabataan-color-fun-run/LINGGO NG KABATAAN COLOR FUN RUN (17).jpg",
                    "img/events/2025-linggo-ng-kabataan-color-fun-run/LINGGO NG KABATAAN COLOR FUN RUN (18).jpg",
                    "img/events/2025-linggo-ng-kabataan-color-fun-run/LINGGO NG KABATAAN COLOR FUN RUN (19).jpg",
                    "img/events/2025-linggo-ng-kabataan-color-fun-run/LINGGO NG KABATAAN COLOR FUN RUN (20).jpg",
                    "img/events/2025-linggo-ng-kabataan-color-fun-run/LINGGO NG KABATAAN COLOR FUN RUN (21).jpg",
                    "img/events/2025-linggo-ng-kabataan-color-fun-run/LINGGO NG KABATAAN COLOR FUN RUN (22).jpg",
                    "img/events/2025-linggo-ng-kabataan-color-fun-run/LINGGO NG KABATAAN COLOR FUN RUN (23).jpg",
                    "img/events/2025-linggo-ng-kabataan-color-fun-run/LINGGO NG KABATAAN COLOR FUN RUN (24).jpg"
                ]
            },
            {
                title: "Project Lead: Leadership Empowerment and Development",
                date: "August 27, 2025",
                venue: "Trento National High School, Trento, Agusan del Sur",
                link: "https://www.facebook.com/share/p/189uhxJF3F/",
                description: "𝐒𝐜𝐡𝐨𝐨𝐥-𝐁𝐚𝐬𝐞𝐝 𝐋𝐞𝐚𝐝𝐞𝐫𝐬𝐡𝐢𝐩 𝐚𝐧𝐝 𝐅𝐮𝐧𝐝 𝐋𝐢𝐪𝐮𝐢𝐝𝐚𝐭𝐢𝐨𝐧 𝐓𝐫𝐚𝐢𝐧𝐢𝐧𝐠 Student leaders from various organizations and clubs recently gathered for the School-Based Leadership and Fund Liquidation Training, spearheaded by the Supreme Secondary Learner Government of Trento National High School. Among the invited guest speakers were members of the 𝐎𝐫𝐝𝐞𝐫 𝐨𝐟 𝐃𝐚 𝐕𝐢𝐧𝐜𝐢 which are Mr. Ian Albert S. Dela Peña, Mr. Julianne Tristan E. Dequiña, Mr. Christian Jay B. Gumapac, and Mr. Louie Jay Torralba, together with Sir Jestoni P. Aligway and Ma’am Charlize Karen Grace A. Jimenez. As speakers and facilitators, the ODV members shared their knowledge, experiences, and leadership principles, contributing to the empowerment of young student leaders in embracing responsibility and performing their roles with excellence. 𝑻𝒓𝒂𝒏𝒔𝒇𝒐𝒓𝒎𝒊𝒏𝒈 𝑴𝒊𝒏𝒅𝒔, 𝑩𝒖𝒊𝒍𝒅𝒊𝒏𝒈 𝑳𝒆𝒂𝒅𝒆𝒓𝒔! #OrderOfDaVinci #ODVLeadership #LeadershipInAction #ServiceAboveAmbition #BuildingLeaders",
                images: [
                    "img/events/2025-project-lead-leadership-empowerment-and-development/First Image to Appear, PROJECT LEAD LEADERSHIP EMPOWERMENT AND DEVELOPMENT (18).jpg",
                    "img/events/2025-project-lead-leadership-empowerment-and-development/PROJECT LEAD LEADERSHIP EMPOWERMENT AND DEVELOPMENT (1).jpg",
                    "img/events/2025-project-lead-leadership-empowerment-and-development/PROJECT LEAD LEADERSHIP EMPOWERMENT AND DEVELOPMENT (2).jpg",
                    "img/events/2025-project-lead-leadership-empowerment-and-development/PROJECT LEAD LEADERSHIP EMPOWERMENT AND DEVELOPMENT (3).jpg",
                    "img/events/2025-project-lead-leadership-empowerment-and-development/PROJECT LEAD LEADERSHIP EMPOWERMENT AND DEVELOPMENT (4).jpg",
                    "img/events/2025-project-lead-leadership-empowerment-and-development/PROJECT LEAD LEADERSHIP EMPOWERMENT AND DEVELOPMENT (5).jpg",
                    "img/events/2025-project-lead-leadership-empowerment-and-development/PROJECT LEAD LEADERSHIP EMPOWERMENT AND DEVELOPMENT (6).jpg",
                    "img/events/2025-project-lead-leadership-empowerment-and-development/PROJECT LEAD LEADERSHIP EMPOWERMENT AND DEVELOPMENT (7).jpg",
                    "img/events/2025-project-lead-leadership-empowerment-and-development/PROJECT LEAD LEADERSHIP EMPOWERMENT AND DEVELOPMENT (8).jpg",
                    "img/events/2025-project-lead-leadership-empowerment-and-development/PROJECT LEAD LEADERSHIP EMPOWERMENT AND DEVELOPMENT (9).jpg",
                    "img/events/2025-project-lead-leadership-empowerment-and-development/PROJECT LEAD LEADERSHIP EMPOWERMENT AND DEVELOPMENT (10).jpg",
                    "img/events/2025-project-lead-leadership-empowerment-and-development/PROJECT LEAD LEADERSHIP EMPOWERMENT AND DEVELOPMENT (11).jpg",
                    "img/events/2025-project-lead-leadership-empowerment-and-development/PROJECT LEAD LEADERSHIP EMPOWERMENT AND DEVELOPMENT (12).jpg",
                    "img/events/2025-project-lead-leadership-empowerment-and-development/PROJECT LEAD LEADERSHIP EMPOWERMENT AND DEVELOPMENT (13).jpg",
                    "img/events/2025-project-lead-leadership-empowerment-and-development/PROJECT LEAD LEADERSHIP EMPOWERMENT AND DEVELOPMENT (14).jpg",
                    "img/events/2025-project-lead-leadership-empowerment-and-development/PROJECT LEAD LEADERSHIP EMPOWERMENT AND DEVELOPMENT (15).jpg",
                    "img/events/2025-project-lead-leadership-empowerment-and-development/PROJECT LEAD LEADERSHIP EMPOWERMENT AND DEVELOPMENT (16).jpg",
                    "img/events/2025-project-lead-leadership-empowerment-and-development/PROJECT LEAD LEADERSHIP EMPOWERMENT AND DEVELOPMENT (17).jpg",
                    "img/events/2025-project-lead-leadership-empowerment-and-development/PROJECT LEAD LEADERSHIP EMPOWERMENT AND DEVELOPMENT (19).jpg",
                    "img/events/2025-project-lead-leadership-empowerment-and-development/PROJECT LEAD LEADERSHIP EMPOWERMENT AND DEVELOPMENT (20).jpg",
                    "img/events/2025-project-lead-leadership-empowerment-and-development/PROJECT LEAD LEADERSHIP EMPOWERMENT AND DEVELOPMENT (21).jpg",
                    "img/events/2025-project-lead-leadership-empowerment-and-development/PROJECT LEAD LEADERSHIP EMPOWERMENT AND DEVELOPMENT (22).jpg",
                    "img/events/2025-project-lead-leadership-empowerment-and-development/PROJECT LEAD LEADERSHIP EMPOWERMENT AND DEVELOPMENT (23).jpg",
                    "img/events/2025-project-lead-leadership-empowerment-and-development/PROJECT LEAD LEADERSHIP EMPOWERMENT AND DEVELOPMENT (24).jpg",
                    "img/events/2025-project-lead-leadership-empowerment-and-development/PROJECT LEAD LEADERSHIP EMPOWERMENT AND DEVELOPMENT (25).jpg",
                    "img/events/2025-project-lead-leadership-empowerment-and-development/PROJECT LEAD LEADERSHIP EMPOWERMENT AND DEVELOPMENT (26).jpg",
                    "img/events/2025-project-lead-leadership-empowerment-and-development/PROJECT LEAD LEADERSHIP EMPOWERMENT AND DEVELOPMENT (27).jpg",
                    "img/events/2025-project-lead-leadership-empowerment-and-development/PROJECT LEAD LEADERSHIP EMPOWERMENT AND DEVELOPMENT (28).jpg",
                    "img/events/2025-project-lead-leadership-empowerment-and-development/PROJECT LEAD LEADERSHIP EMPOWERMENT AND DEVELOPMENT (29).jpg",
                    "img/events/2025-project-lead-leadership-empowerment-and-development/PROJECT LEAD LEADERSHIP EMPOWERMENT AND DEVELOPMENT (30).jpg"
                ]
            },
            {
                title: "National Anti-Poverty Commission: Regional Sectoral Assembly Caraga",
                date: "September 4, 2025",
                venue: "Almont Inland Resort, Butuan City",
                link: "https://www.facebook.com/share/p/1BML6PHyas/",
                description: "𝗢𝗗𝗩 𝗣𝗮𝗿𝘁𝗶𝗰𝗶𝗽𝗮𝘁𝗲𝘀 | 𝗥𝗲𝗴𝗶𝗼𝗻𝗮𝗹 𝗦𝗲𝗰𝘁𝗼𝗿𝗮𝗹 𝗖𝗼𝗻𝗳𝗲𝗿𝗲𝗻𝗰𝗲 The Order of Da Vinci (ODV) proudly shares that Mr. Ian Albert S. Dela Peña, ODV Grand Master, attended the Regional Sectoral Conference (RSC) organized by the National Anti-Poverty Commission (NAPC) held in Butuan City last September 4, 2025. With the theme of reaffirming cooperation among Basic Sectors and Civil Society Organizations (BS/CSOs), the conference underscored the vital role of grassroots participation in reducing poverty and promoting inclusive development in the Caraga region. The sessions covered the National Anti-Poverty Action Agenda (N3A), National Poverty Reduction Action Plan (NPRP), Priority Sectoral Agenda, and updated policy guidelines for representation in local and regional governance. The conference concluded with a collaborative workshop, further strengthening unity and partnerships among sectors. By participating in the RSC, ODV reaffirms its commitment to servant-leadership and community engagement, ensuring that its values of Leadership, Honor, Valor, Service, and Brotherhood are extended to platforms addressing social development and poverty reduction. Together with other civil society leaders, ODV continues to stand by its motto Mente et Corde Servire — to serve with mind and heart in building a more resilient and inclusive Caraga. Disclaimer: Some photos used in this post are courtesy of the National Anti-Poverty Commission. 𝑻𝒓𝒂𝒏𝒔𝒇𝒐𝒓𝒎𝒊𝒏𝒈 𝑴𝒊𝒏𝒅𝒔, 𝑩𝒖𝒊𝒍𝒅𝒊𝒏𝒈 𝑳𝒆𝒂𝒅𝒆𝒓𝒔! #OrderOfDaVinci #ODVLeadership #ServiceAboveAmbition #ODVLeadership #LeadershipInAction #NAPC27 #AksyonLabanSaKahirapan",
                images: [
                    "img/events/2025-national-anti-poverty-commission-regional-sectoral-assembly-caraga/First Image, NATIONAL ANTI-POVERTY COMMISSION - REGIONAL SECTORAL ASSEMBLY CARAGA (4).jpg",
                    "img/events/2025-national-anti-poverty-commission-regional-sectoral-assembly-caraga/NATIONAL ANTI-POVERTY COMMISSION - REGIONAL SECTORAL ASSEMBLY CARAGA (1).jpg",
                    "img/events/2025-national-anti-poverty-commission-regional-sectoral-assembly-caraga/NATIONAL ANTI-POVERTY COMMISSION - REGIONAL SECTORAL ASSEMBLY CARAGA (2).jpg",
                    "img/events/2025-national-anti-poverty-commission-regional-sectoral-assembly-caraga/NATIONAL ANTI-POVERTY COMMISSION - REGIONAL SECTORAL ASSEMBLY CARAGA (3).jpg",
                    "img/events/2025-national-anti-poverty-commission-regional-sectoral-assembly-caraga/NATIONAL ANTI-POVERTY COMMISSION - REGIONAL SECTORAL ASSEMBLY CARAGA (5).jpg",
                    "img/events/2025-national-anti-poverty-commission-regional-sectoral-assembly-caraga/NATIONAL ANTI-POVERTY COMMISSION - REGIONAL SECTORAL ASSEMBLY CARAGA (6).jpg",
                    "img/events/2025-national-anti-poverty-commission-regional-sectoral-assembly-caraga/NATIONAL ANTI-POVERTY COMMISSION - REGIONAL SECTORAL ASSEMBLY CARAGA (7).jpg",
                    "img/events/2025-national-anti-poverty-commission-regional-sectoral-assembly-caraga/NATIONAL ANTI-POVERTY COMMISSION - REGIONAL SECTORAL ASSEMBLY CARAGA (8).jpg",
                    "img/events/2025-national-anti-poverty-commission-regional-sectoral-assembly-caraga/NATIONAL ANTI-POVERTY COMMISSION - REGIONAL SECTORAL ASSEMBLY CARAGA (9).jpg",
                    "img/events/2025-national-anti-poverty-commission-regional-sectoral-assembly-caraga/NATIONAL ANTI-POVERTY COMMISSION - REGIONAL SECTORAL ASSEMBLY CARAGA (10).jpg",
                    "img/events/2025-national-anti-poverty-commission-regional-sectoral-assembly-caraga/NATIONAL ANTI-POVERTY COMMISSION - REGIONAL SECTORAL ASSEMBLY CARAGA (11).jpg"
                ]
            },
            {
                title: "Paglawig: Linggo Ng Kabataan SK Hawilian 2025",
                date: "September 20, 2025",
                venue: "Hawilian, Esperanza, Agusan del Sur",
                link: "https://www.facebook.com/share/p/199nhQB5kq/",
                description: "𝗣𝗮𝗴-𝗟𝗮𝘄𝗶𝗴: 𝗦𝗞 𝗛𝗮𝘄𝗶𝗹𝗶𝗮𝗻 𝗟𝗶𝗻𝗴𝗴𝗼 𝗻𝗴 𝗞𝗮𝗯𝗮𝘁𝗮𝗮𝗻 𝟮𝟬𝟮𝟱 The 𝐎𝐫𝐝𝐞𝐫 𝐨𝐟 𝐃𝐚 𝐕𝐢𝐧𝐜𝐢 proudly facilitates Ligtas Kabataang Hawilian: 1-Day Basic First Aid and Life Support Training! In partnership with the Sangguniang Kabataan ng Hawilian, this activity served as one of the highlights of Pag-Lawig: SK Hawilian Linggo ng Kabataan 2025, a celebration dedicated to amplifying the voices, talents, and potential of today’s youth. Through this collaboration, young Hawilians were given the opportunity to gain essential knowledge and hands-on experience in emergency response and life-saving skills. The session was facilitated by Julianne Tristan E. Dequiña and other members of the Order of Da Vinci, who guided the participants through the fundamentals of first aid, CPR, and basic life support. The activity aimed to build confidence, readiness, and a deeper sense of responsibility among the youth when faced with real-life emergencies. Beyond the technical skills, the training also emphasized the value of compassion, teamwork, and service — reminding every young participant that being a responder is not just about saving lives, but about leading with empathy and courage in times of need. Together, we continue to nurture a generation of Batang Responders who are ready to serve their communities with heart, skill, and purpose. 𝑻𝒓𝒂𝒏𝒔𝒇𝒐𝒓𝒎𝒊𝒏𝒈 𝑴𝒊𝒏𝒅𝒔, 𝑩𝒖𝒊𝒍𝒅𝒊𝒏𝒈 𝑳𝒆𝒂𝒅𝒆𝒓𝒔! #OrderOfDaVinci #ODVLeadership #LeadershipInAction #ServiceAboveAmbition #BuildingLeaders",
                images: [
                    "img/events/2025-paglawig-linggo-ng-kabataan-sk-hawilian-2025/First Image to Appear, PAGLAWIG LINGGO NG KABATAAN SK HAWILIAN 2025 (12).jpg",
                    "img/events/2025-paglawig-linggo-ng-kabataan-sk-hawilian-2025/PAGLAWIG LINGGO NG KABATAAN SK HAWILIAN 2025 (1).jpg",
                    "img/events/2025-paglawig-linggo-ng-kabataan-sk-hawilian-2025/PAGLAWIG LINGGO NG KABATAAN SK HAWILIAN 2025 (2).jpg",
                    "img/events/2025-paglawig-linggo-ng-kabataan-sk-hawilian-2025/PAGLAWIG LINGGO NG KABATAAN SK HAWILIAN 2025 (3).jpg",
                    "img/events/2025-paglawig-linggo-ng-kabataan-sk-hawilian-2025/PAGLAWIG LINGGO NG KABATAAN SK HAWILIAN 2025 (4).jpg",
                    "img/events/2025-paglawig-linggo-ng-kabataan-sk-hawilian-2025/PAGLAWIG LINGGO NG KABATAAN SK HAWILIAN 2025 (5).jpg",
                    "img/events/2025-paglawig-linggo-ng-kabataan-sk-hawilian-2025/PAGLAWIG LINGGO NG KABATAAN SK HAWILIAN 2025 (6).jpg",
                    "img/events/2025-paglawig-linggo-ng-kabataan-sk-hawilian-2025/PAGLAWIG LINGGO NG KABATAAN SK HAWILIAN 2025 (7).jpg",
                    "img/events/2025-paglawig-linggo-ng-kabataan-sk-hawilian-2025/PAGLAWIG LINGGO NG KABATAAN SK HAWILIAN 2025 (8).jpg",
                    "img/events/2025-paglawig-linggo-ng-kabataan-sk-hawilian-2025/PAGLAWIG LINGGO NG KABATAAN SK HAWILIAN 2025 (9).jpg",
                    "img/events/2025-paglawig-linggo-ng-kabataan-sk-hawilian-2025/PAGLAWIG LINGGO NG KABATAAN SK HAWILIAN 2025 (10).jpg",
                    "img/events/2025-paglawig-linggo-ng-kabataan-sk-hawilian-2025/PAGLAWIG LINGGO NG KABATAAN SK HAWILIAN 2025 (11).jpg",
                    "img/events/2025-paglawig-linggo-ng-kabataan-sk-hawilian-2025/PAGLAWIG LINGGO NG KABATAAN SK HAWILIAN 2025 (13).jpg",
                    "img/events/2025-paglawig-linggo-ng-kabataan-sk-hawilian-2025/PAGLAWIG LINGGO NG KABATAAN SK HAWILIAN 2025 (14).jpg"
                ]
            },
            {
                title: "Agsurfuture: Cultivating Roots, Empowering Youth",
                date: "October 18, 2025",
                venue: "PRDIO Laboratory, Patin-ay, Prosperidad, Agusan del Sur",
                link: "https://www.facebook.com/share/p/1EaSJudr3P/",
                description: "𝗢𝗥𝗗𝗘𝗥 𝗢𝗙 𝗗𝗔 𝗩𝗜𝗡𝗖𝗜 | 𝗔𝗴𝗦𝘂𝗿 𝗙𝘂𝘁𝘂𝗿𝗲: 𝗖𝘂𝗹𝘁𝗶𝘃𝗮𝘁𝗶𝗻𝗴 𝗥𝗼𝗼𝘁𝘀, 𝗘𝗺𝗽𝗼𝘄𝗲𝗿𝗶𝗻𝗴 𝗬𝗼𝘂𝘁𝗵𝘀 The 𝐎𝐫𝐝𝐞𝐫 𝐨𝐟 𝐃𝐚 𝐕𝐢𝐧𝐜𝐢 together with Kab-ot Youth Organization and other Youth Organizations of the Agusan del Sur Attended the second day of the AgSur Future: Cultivating Roots, Empowering Youths Town Hall Meeting successfully took place at the Provincial Research and Development and Innovation Office (PRDIO) in Patin-ay, Prosperidad, Agusan del Sur last October 18, 2025. The event began with an exclusive PRDIO Facility Tour, giving participants the opportunity to explore state-of-the-art laboratories and advanced research equipment that highlight the province’s commitment to agricultural innovation and sustainability. Through interactive discussions, inspiring talks, and engaging presentations, the youth voiced their visions for agriculture, innovation, academe, and employment, reaffirming their vital role in steering Agusan del Sur toward a future of inclusive and sustainable development. Together, we cultivate roots of purpose and empower the seeds of tomorrow’s leaders. 𝑻𝒓𝒂𝒏𝒔𝒇𝒐𝒓𝒎𝒊𝒏𝒈 𝑴𝒊𝒏𝒅𝒔, 𝑩𝒖𝒊𝒍𝒅𝒊𝒏𝒈 𝑳𝒆𝒂𝒅𝒆𝒓𝒔! #OrderOfDaVinci #ODVLeadership #LeadershipInAction #ServiceAboveAmbition #BuildingLeaders #PPIOagusandelsur #AgsurFutureForum #PRDIO #ProvinceOfAgusanDelSur #LamboAgusanDelSur",
                images: [
                    "img/events/2025-agsurfuture-cultivating-roots-empowering-youth/First Image to Appear, AGSURFUTURE CULTIVATING ROOTS, EMPOWERING YOUTH (2).jpg",
                    "img/events/2025-agsurfuture-cultivating-roots-empowering-youth/AGSURFUTURE CULTIVATING ROOTS, EMPOWERING YOUTH (1).jpg",
                    "img/events/2025-agsurfuture-cultivating-roots-empowering-youth/AGSURFUTURE CULTIVATING ROOTS, EMPOWERING YOUTH (3).jpg",
                    "img/events/2025-agsurfuture-cultivating-roots-empowering-youth/AGSURFUTURE CULTIVATING ROOTS, EMPOWERING YOUTH (4).jpg",
                    "img/events/2025-agsurfuture-cultivating-roots-empowering-youth/AGSURFUTURE CULTIVATING ROOTS, EMPOWERING YOUTH (5).jpg",
                    "img/events/2025-agsurfuture-cultivating-roots-empowering-youth/AGSURFUTURE CULTIVATING ROOTS, EMPOWERING YOUTH (6).jpg",
                    "img/events/2025-agsurfuture-cultivating-roots-empowering-youth/AGSURFUTURE CULTIVATING ROOTS, EMPOWERING YOUTH (7).jpg",
                    "img/events/2025-agsurfuture-cultivating-roots-empowering-youth/AGSURFUTURE CULTIVATING ROOTS, EMPOWERING YOUTH (8).jpg",
                    "img/events/2025-agsurfuture-cultivating-roots-empowering-youth/AGSURFUTURE CULTIVATING ROOTS, EMPOWERING YOUTH (9).jpg",
                    "img/events/2025-agsurfuture-cultivating-roots-empowering-youth/AGSURFUTURE CULTIVATING ROOTS, EMPOWERING YOUTH (10).jpg",
                    "img/events/2025-agsurfuture-cultivating-roots-empowering-youth/AGSURFUTURE CULTIVATING ROOTS, EMPOWERING YOUTH (11).jpg",
                    "img/events/2025-agsurfuture-cultivating-roots-empowering-youth/AGSURFUTURE CULTIVATING ROOTS, EMPOWERING YOUTH (12).jpg",
                    "img/events/2025-agsurfuture-cultivating-roots-empowering-youth/AGSURFUTURE CULTIVATING ROOTS, EMPOWERING YOUTH (13).jpg",
                    "img/events/2025-agsurfuture-cultivating-roots-empowering-youth/AGSURFUTURE CULTIVATING ROOTS, EMPOWERING YOUTH (14).jpg",
                    "img/events/2025-agsurfuture-cultivating-roots-empowering-youth/AGSURFUTURE CULTIVATING ROOTS, EMPOWERING YOUTH (15).jpg"
                ]
            },
            {
                title: "Tertiary Student Leaders Confab on Human Rights Year 3",
                date: "October 20–23, 2025",
                venue: "Hotel Oazis, Butuan City",
                link: "https://www.facebook.com/share/p/185aTBh75n/",
                description: "𝐎𝐫𝐝𝐞𝐫 𝐨𝐟 𝐃𝐚 𝐕𝐢𝐧𝐜𝐢 || 𝐓𝐞𝐫𝐭𝐢𝐚𝐫𝐲 𝐒𝐭𝐮𝐝𝐞𝐧𝐭 𝐋𝐞𝐚𝐝𝐞𝐫𝐬 𝐂𝐨𝐧𝐟𝐚𝐛 𝐨𝐧 𝐇𝐮𝐦𝐚𝐧 𝐑𝐢𝐠𝐡𝐭𝐬 – 𝐘𝐞𝐚𝐫 𝟑 The 𝐎𝐫𝐝𝐞𝐫 𝐨𝐟 𝐃𝐚 𝐕𝐢𝐧𝐜𝐢 proudly takes part in the Tertiary Student Leaders Confab on Human Rights – Year 3, organized by the Commission on Human Rights Caraga in partnership with FNF Philippines. Happening from October 20–23, 2025, at Hotel Oazis, Butuan City, this four-day convergence gathers passionate and dynamic student leaders from various colleges and universities across the Caraga Region. The confab aims to strengthen youth engagement in promoting human rights, democratic values, and civic leadership, empowering the next generation to stand for dignity, equality, and justice for all. Together, we learn, lead, and uphold the rights that unite us as one community. 𝑻𝒓𝒂𝒏𝒔𝒇𝒐𝒓𝒎𝒊𝒏𝒈 𝑴𝒊𝒏𝒅𝒔, 𝑩𝒖𝒊𝒍𝒅𝒊𝒏𝒈 𝑳𝒆𝒂𝒅𝒆𝒓𝒔! #OrderOfDaVinci #ODVForHumanRights #DaVincianLeaders #CHRCaraga #FNFPhilippines #YouthForHumanRights #LeadershipThroughService #ODVLeadership #LeadershipInAction #ServiceAboveAmbition #BuildingLeaders",
                images: [
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/First Image to Appear, TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (2).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (1).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (3).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (4).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (5).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (6).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (7).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (8).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (9).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (10).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (11).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (12).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (13).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (14).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (15).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (16).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (17).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (18).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (19).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (20).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (21).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (22).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (23).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (24).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (25).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (26).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (27).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (28).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (29).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (30).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (31).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (32).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (33).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (34).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (35).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (36).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (37).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (38).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (39).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (40).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (41).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (42).jpg",
                    "img/events/2025-tertiary-student-leaders-confab-on-human-rights-year-3/TERTIARY STUDENT LEADERS CONFAB ON HUMAN RIGHTS YEAR 3 (43).jpg"
                ]
            },
            {
                title: "Tindig 2025: Peace Building and Gender Development Peace Camp 2025",
                date: "October 25–26, 2025",
                venue: "ADSSU Main Campus, Bunawan, Agusan del Sur",
                link: "https://www.facebook.com/share/p/1BL7B3A9yp/",
                description: "In Photos Part 1 | TINDIG: Peace-Building and Gender Development Camp 2025 Moments that inspire. Memories that unite. Here are some highlights from the TINDIG: Peace-Building and Gender Development Camp 2025, a two-day journey of learning, reflection, and empowerment. From team-building activities to peace talks, mental health sessions, and creative expressions — every captured moment tells a story of unity, compassion, and purpose. Our participants, facilitators, and volunteers stood together for peace, leadership, and inclusivity — living out the true essence of TINDIG. Together, we rise. Together, we build peace. #TINDIG2025 #PeaceCamp2025 #InPhotos #NSTPCWTS #LTS #ASSCAT #ASSCATBSP #ASSCATGAD #YouthForSDG #SDG16 #GenderEquality #ASSCATSDGs #WeAreInThisTogether",
                images: [
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/First Image to Appear, TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (32).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (1).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (2).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (3).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (4).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (5).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (6).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (7).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (8).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (9).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (10).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (11).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (12).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (13).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (14).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (15).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (16).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (17).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (18).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (19).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (20).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (21).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (22).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (23).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (24).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (25).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (26).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (27).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (28).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (29).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (30).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (31).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (33).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (34).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (35).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (36).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (37).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (38).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (39).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (40).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (41).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (42).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (43).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (44).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (45).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (46).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (47).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (48).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (49).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (50).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (51).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (52).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (53).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (54).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (55).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (56).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (57).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (58).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (59).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (60).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (61).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (62).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (63).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (64).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (65).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (66).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (67).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (68).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (69).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (70).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (71).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (72).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (73).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (74).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (75).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (76).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (77).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (78).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP (79).jpg"
                ]
            },
            {
                title: "4th Quarter Blood Donation Drive",
                date: "November 13, 2025",
                venue: "Valentina Galido Plaza Memorial Hospital, Bunawan, Agusan del Sur",
                link: "https://www.facebook.com/share/p/1T2ddvaH7E/",
                description: "𝐕𝐚𝐥𝐞𝐧𝐭𝐢𝐧𝐚 𝐆𝐚𝐥𝐢𝐝𝐨 𝐏𝐥𝐚𝐳𝐚 𝐌𝐞𝐦𝐨𝐫𝐢𝐚𝐥 𝐇𝐨𝐬𝐩𝐢𝐭𝐚𝐥 𝟒𝐭𝐡 𝐐𝐮𝐚𝐫𝐭𝐞𝐫 𝐁𝐥𝐨𝐨𝐝 𝐃𝐨𝐧𝐚𝐭𝐢𝐨𝐧 𝐃𝐫𝐢𝐯𝐞 𝟮𝟬𝟮𝟱 | 𝐒𝐀𝐕𝐈𝐍𝐆 𝐋𝐈𝐕𝐄𝐒, 𝐎𝐍𝐄 𝐃𝐑𝐎𝐏 𝐀𝐓 𝐀 𝐓𝐈𝐌𝐄 🩸❤️ The 𝐎𝐫𝐝𝐞𝐫 𝐨𝐟 𝐃𝐚 𝐕𝐢𝐧𝐜𝐢 proudly took part in the 𝐕𝐚𝐥𝐞𝐧𝐭𝐢𝐧𝐚 𝐆𝐚𝐥𝐢𝐝𝐨 𝐏𝐥𝐚𝐳𝐚 𝐌𝐞𝐦𝐨𝐫𝐢𝐚𝐥 𝐇𝐨𝐬𝐩𝐢𝐭𝐚𝐥 𝟒𝐭𝐡 𝐐𝐮𝐚𝐫𝐭𝐞𝐫 𝐁𝐥𝐨𝐨𝐝 𝐃𝐨𝐧𝐚𝐭𝐢𝐨𝐧 𝐃𝐫𝐢𝐯𝐞 𝟮𝟬𝟮𝟱, a meaningful mission that proves even the smallest act of kindness can create ripples of hope last November 13, 2025. We commend our ODV Grand Masters, Mr. Ian Albert Dela Peña and Mr. Louie Jay Torralba, ODV Masters, Mr. Christian Jay P. Eupeña and Mr. John Dave C. Cadiog and our ODV Aspirants, Mr. Jeremy Tribunalo and Mr. Rodel J. Pal-ot for stepping up and giving the gift of life through their blood donation. Together, let’s keep making a difference. So that Others may Live 𝑻𝒓𝒂𝒏𝒔𝒇𝒐𝒓𝒎𝒊𝒏𝒈 𝑴𝒊𝒏𝒅𝒔, 𝑩𝒖𝒊𝒍𝒅𝒊𝒏𝒈 𝑳𝒆𝒂𝒅𝒆𝒓𝒔! ‎ ‎#OrderOfDaVinci #ODVLeadership ‎#LeadershipInAction #ServiceAboveAmbition #BuildingLeaders #ODVForLife #BloodDonationDrive2025 #SavingLivesOneDropAtATime #OrderOfDaVinci",
                images: [
                    "img/events/2025-4th-quarter-blood-donation-drive/First Image to Appear, 4th QUARTER BLOOD DONATION DRIVE (18).jpg",
                    "img/events/2025-4th-quarter-blood-donation-drive/4th QUARTER BLOOD DONATION DRIVE (1).jpg",
                    "img/events/2025-4th-quarter-blood-donation-drive/4th QUARTER BLOOD DONATION DRIVE (2).jpg",
                    "img/events/2025-4th-quarter-blood-donation-drive/4th QUARTER BLOOD DONATION DRIVE (3).jpg",
                    "img/events/2025-4th-quarter-blood-donation-drive/4th QUARTER BLOOD DONATION DRIVE (4).jpg",
                    "img/events/2025-4th-quarter-blood-donation-drive/4th QUARTER BLOOD DONATION DRIVE (5).jpg",
                    "img/events/2025-4th-quarter-blood-donation-drive/4th QUARTER BLOOD DONATION DRIVE (6).jpg",
                    "img/events/2025-4th-quarter-blood-donation-drive/4th QUARTER BLOOD DONATION DRIVE (7).jpg",
                    "img/events/2025-4th-quarter-blood-donation-drive/4th QUARTER BLOOD DONATION DRIVE (8).jpg",
                    "img/events/2025-4th-quarter-blood-donation-drive/4th QUARTER BLOOD DONATION DRIVE (9).jpg",
                    "img/events/2025-4th-quarter-blood-donation-drive/4th QUARTER BLOOD DONATION DRIVE (10).jpg",
                    "img/events/2025-4th-quarter-blood-donation-drive/4th QUARTER BLOOD DONATION DRIVE (11).jpg",
                    "img/events/2025-4th-quarter-blood-donation-drive/4th QUARTER BLOOD DONATION DRIVE (12).jpg",
                    "img/events/2025-4th-quarter-blood-donation-drive/4th QUARTER BLOOD DONATION DRIVE (13).jpg",
                    "img/events/2025-4th-quarter-blood-donation-drive/4th QUARTER BLOOD DONATION DRIVE (14).jpg",
                    "img/events/2025-4th-quarter-blood-donation-drive/4th QUARTER BLOOD DONATION DRIVE (15).jpg",
                    "img/events/2025-4th-quarter-blood-donation-drive/4th QUARTER BLOOD DONATION DRIVE (16).jpg",
                    "img/events/2025-4th-quarter-blood-donation-drive/4th QUARTER BLOOD DONATION DRIVE (17).jpg",
                    "img/events/2025-4th-quarter-blood-donation-drive/4th QUARTER BLOOD DONATION DRIVE (19).jpg",
                    "img/events/2025-4th-quarter-blood-donation-drive/4th QUARTER BLOOD DONATION DRIVE (20).jpg"
                ]
            },
            {
                title: "Tindig 2025: Peace Building and Gender Development Peace Camp 2025 Trento Campus",
                date: "November 15, 2025",
                venue: "ADSSU TRENTO Campus, Bunawan, Agusan del Sur",
                link: "https://www.facebook.com/share/p/1Cb2ynVwRV/",
                description: "𝐓𝐈𝐍𝐃𝐈𝐆 𝟐𝟎𝟐𝟓| 𝐓𝐫𝐞𝐧𝐭𝐨 𝐂𝐚𝐦𝐩𝐮𝐬 The spirit of peace, leadership, and youth empowerment continues at the ASSCAT Trento Campus as students take part in TINDIG: Peace Building and Gender Development Camp 2025. Through a series of meaningful activities, discussions, and collaborative sessions, participants embraced the core values of unity, inclusivity, volunteerism, and compassionate leadership, standing tall for peace within their campus and their communities. TINDIG 2025 in Trento Campus reflects the commitment of ASSCAT to nurture responsible, mindful, and empowered young leaders who can champion peace and positive change. Together, we rise. Together, we build peace. Photo Credits: The Magnate 💛 #TINDIG2025 #PeaceCamp2025 #TrentoCampus #NSTPCWTS #LTS #ASSCAT #ASSCATGAD #ASSCATBSP #YouthForSDG #SDG16 #ASSCATSDGs #WeAreInThisTogether",
                images: [
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/First ImageTINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (67).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (1).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (2).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (3).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (4).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (5).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (6).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (7).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (8).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (9).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (10).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (11).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (12).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (13).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (14).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (15).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (16).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (17).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (18).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (19).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (20).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (21).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (22).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (23).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (24).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (25).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (26).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (27).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (28).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (29).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (30).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (31).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (32).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (33).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (34).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (35).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (36).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (37).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (38).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (39).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (40).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (41).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (42).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (43).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (44).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (45).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (46).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (47).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (48).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (49).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (50).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (51).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (52).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (53).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (54).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (55).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (56).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (57).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (58).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (59).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (60).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (61).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (62).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (63).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (64).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (65).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (66).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (68).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (69).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (70).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (71).jpg",
                    "img/events/2025-tindig-2025-peace-building-and-gender-development-peace-camp-2025-trento-campus/TINDIG 2025PEACE BUILDING AND GENDER DEVELOPMENT PEACE CAMP 2025 TRENTO CAMPUS (72).jpg"
                ]
            },
            {
                title: "Batang Da Vinci 2.0: Nourishing Young Minds with Food",
                date: "November 17, 2025",
                venue: "Binahanan, San Teodoro, Bunawan, Agusan del Sur",
                link: "https://www.facebook.com/share/p/1cQZ1j55wg/",
                description: "𝐁𝐚𝐭𝐚𝐧𝐠 𝐃𝐚 𝐕𝐢𝐧𝐜𝐢 𝟐.𝟎 || 𝐍𝐚𝐭𝐢𝐨𝐧𝐚𝐥 𝐂𝐡𝐢𝐥𝐝𝐫𝐞𝐧'𝐬 𝐌𝐨𝐧𝐭𝐡 𝟐𝟎𝟐𝟓 The 𝐎𝐫𝐝𝐞𝐫 𝐨𝐟 𝐃𝐚 𝐕𝐢𝐧𝐜𝐢 celebrates the National Children's Month 2025 through the successful conduct of 𝐁𝐚𝐭𝐚𝐧𝐠 𝐃𝐚 𝐕𝐢𝐧𝐜𝐢 𝟐.𝟎: 𝐍𝐨𝐮𝐫𝐢𝐬𝐡𝐢𝐧𝐠 𝐘𝐨𝐮𝐧𝐠 𝐌𝐢𝐧𝐝𝐬 𝐰𝐢𝐭𝐡 𝐅𝐨𝐨𝐝 at Sitio Binahanan, San Teodoro, Bunawan, Agusan del Sur last November 17, 2025 facilitated by ODV Grand Master, Mr. Ian Albert Dela Peña and ODV Masters, Mr. Julianne Tristan E. Dequiña, ODV President and Mr. Laurence M. Villaluna, ODV Business Manager. In line with this year’s theme, “OSAEC-CSAEM Wakasan: Kaligtasan at Karapatan ng Bata, Ipaglaban!”, the Order of Da Vinci continues to champion the well-being and holistic development of young children. The activity centered on the distribution of nutritious food packs for Day Care pupils—ensuring that each child receives not only nourishment for the body but also care, joy, and support from the community. Through this initiative, we aim to uplift the lives of our young learners, spark smiles, and remind them that they are valued, protected, and loved. Small acts of kindness today help shape stronger, healthier, and more hopeful futures for every child. Together, let us continue fighting for the rights, safety, and welfare of all Filipino children. The Faces of the Children have been intentionally blurred or covered to comply with the Data Privacy Act of 2012 and other Child Protection Laws. ‎ ‎𝑻𝒓𝒂𝒏𝒔𝒇𝒐𝒓𝒎𝒊𝒏𝒈 𝑴𝒊𝒏𝒅𝒔, 𝑩𝒖𝒊𝒍𝒅𝒊𝒏𝒈 𝑳𝒆𝒂𝒅𝒆𝒓𝒔! ‎#BatangDaVinci2 #NationalChildrensMonth2025 #OrderOfDaVinci #ServiceWithPurpose #LeadershipInAction #ServiceAboveAmbition #BuildingLeaders",
                images: [
                    "img/events/2025-batang-da-vinci-2-0-nourishing-young-minds-with-food/First Image to Appear, BATANG DA VINCI 2.0 NOURISHING YOUNG MINDS WITH FOOD (17).jpg",
                    "img/events/2025-batang-da-vinci-2-0-nourishing-young-minds-with-food/BATANG DA VINCI 2.0 NOURISHING YOUNG MINDS WITH FOOD (1).jpg",
                    "img/events/2025-batang-da-vinci-2-0-nourishing-young-minds-with-food/BATANG DA VINCI 2.0 NOURISHING YOUNG MINDS WITH FOOD (2).jpg",
                    "img/events/2025-batang-da-vinci-2-0-nourishing-young-minds-with-food/BATANG DA VINCI 2.0 NOURISHING YOUNG MINDS WITH FOOD (3).jpg",
                    "img/events/2025-batang-da-vinci-2-0-nourishing-young-minds-with-food/BATANG DA VINCI 2.0 NOURISHING YOUNG MINDS WITH FOOD (4).jpg",
                    "img/events/2025-batang-da-vinci-2-0-nourishing-young-minds-with-food/BATANG DA VINCI 2.0 NOURISHING YOUNG MINDS WITH FOOD (5).jpg",
                    "img/events/2025-batang-da-vinci-2-0-nourishing-young-minds-with-food/BATANG DA VINCI 2.0 NOURISHING YOUNG MINDS WITH FOOD (6).jpg",
                    "img/events/2025-batang-da-vinci-2-0-nourishing-young-minds-with-food/BATANG DA VINCI 2.0 NOURISHING YOUNG MINDS WITH FOOD (7).jpg",
                    "img/events/2025-batang-da-vinci-2-0-nourishing-young-minds-with-food/BATANG DA VINCI 2.0 NOURISHING YOUNG MINDS WITH FOOD (8).jpg",
                    "img/events/2025-batang-da-vinci-2-0-nourishing-young-minds-with-food/BATANG DA VINCI 2.0 NOURISHING YOUNG MINDS WITH FOOD (9).jpg",
                    "img/events/2025-batang-da-vinci-2-0-nourishing-young-minds-with-food/BATANG DA VINCI 2.0 NOURISHING YOUNG MINDS WITH FOOD (10).jpg",
                    "img/events/2025-batang-da-vinci-2-0-nourishing-young-minds-with-food/BATANG DA VINCI 2.0 NOURISHING YOUNG MINDS WITH FOOD (11).jpg",
                    "img/events/2025-batang-da-vinci-2-0-nourishing-young-minds-with-food/BATANG DA VINCI 2.0 NOURISHING YOUNG MINDS WITH FOOD (12).jpg",
                    "img/events/2025-batang-da-vinci-2-0-nourishing-young-minds-with-food/BATANG DA VINCI 2.0 NOURISHING YOUNG MINDS WITH FOOD (13).jpg",
                    "img/events/2025-batang-da-vinci-2-0-nourishing-young-minds-with-food/BATANG DA VINCI 2.0 NOURISHING YOUNG MINDS WITH FOOD (14).jpg",
                    "img/events/2025-batang-da-vinci-2-0-nourishing-young-minds-with-food/BATANG DA VINCI 2.0 NOURISHING YOUNG MINDS WITH FOOD (15).jpg",
                    "img/events/2025-batang-da-vinci-2-0-nourishing-young-minds-with-food/BATANG DA VINCI 2.0 NOURISHING YOUNG MINDS WITH FOOD (16).jpg",
                    "img/events/2025-batang-da-vinci-2-0-nourishing-young-minds-with-food/BATANG DA VINCI 2.0 NOURISHING YOUNG MINDS WITH FOOD (18).jpg",
                    "img/events/2025-batang-da-vinci-2-0-nourishing-young-minds-with-food/BATANG DA VINCI 2.0 NOURISHING YOUNG MINDS WITH FOOD (19).jpg",
                    "img/events/2025-batang-da-vinci-2-0-nourishing-young-minds-with-food/BATANG DA VINCI 2.0 NOURISHING YOUNG MINDS WITH FOOD (20).jpg"
                ]
            },
        ],
        '2024': [
            {
                title: "World Teacher’s Day",
                date: "October 3, 2024",
                venue: "ADSSU Main Campus, Bunawan, Agusan del Sur",
                link: "https://www.facebook.com/share/p/18ePCtMGAC/",
                description: "ASSCAT NSTP-CWTS: Celebrate World Teacher’s Day 🫡💚 The ASSCAT NSTP-CWTS students celebrate and honor teachers by rendering heartfelt songs, accompanied by roses and letters, as a gesture of respect, appreciation, and love. This tribute is not only for the dedicated teachers at ASSCAT but extends to all teachers around the world, recognizing their invaluable contributions to education and society. Happy Araw ng mga Guro aming mahal from ASSCAT NSTP-CWTS Students #WTD2024 #ThankYouSoMuchTeachers",
                images: [
                    "img/events/2024-world-teacher-s-day/First Image to appear, World Teacher%23U2019s Day(7).jpg",
                    "img/events/2024-world-teacher-s-day/World Teacher%23U2019s Day(1).jpg",
                    "img/events/2024-world-teacher-s-day/World Teacher%23U2019s Day(2).jpg",
                    "img/events/2024-world-teacher-s-day/World Teacher%23U2019s Day(3).jpg",
                    "img/events/2024-world-teacher-s-day/World Teacher%23U2019s Day(5).jpg",
                    "img/events/2024-world-teacher-s-day/World Teacher%23U2019s Day(6).jpg",
                    "img/events/2024-world-teacher-s-day/World Teacher%23U2019s Day(8).jpg",
                    "img/events/2024-world-teacher-s-day/World Teacher%23U2019s Day(9).jpg",
                    "img/events/2024-world-teacher-s-day/World Teacher%23U2019s Day(10).jpg",
                    "img/events/2024-world-teacher-s-day/World Teacher%23U2019s Day(11).jpg",
                    "img/events/2024-world-teacher-s-day/World Teacher%23U2019s Day(12).jpg"
                ]
            },
            {
                title: "BeRiceponsible Awareness and Symposium",
                date: "November 16–17, 2024",
                venue: "ADSSU Main Campus, Bunawan, Agusan del Sur",
                link: "https://www.facebook.com/share/p/1Dpc8ZFm9k/",
                description: "National Rice Awareness Month || Be Riceponsible The Department of Agriculture PhilRice Agusan, in collaboration with ASSCAT NSTP, successfully hosted a two-day \"BeRiceponsible Awareness and Symposium\" on November 16-17, 2024, in celebration of National Rice Awareness Month. This event underscored the importance of rice not just as a staple food but as a symbol of culture, identity, and resilience for Filipinos. Rice sustains millions of families, serves as a cornerstone of our economy, and binds us together as a nation. Located at the heart of a region rich in agricultural tradition, ASSCAT plays a vital role in promoting sustainable, efficient, and inclusive rice production. This event served as a timely reminder to be mindful of rice consumption, minimize wastage, and support the farmers who work tirelessly to bring this essential commodity to our tables. ASSCAT’s commitment to agricultural education and research aligns seamlessly with the advocacy for responsible rice consumption. As future leaders, researchers, and advocates, students and stakeholders were encouraged to reflect on their roles in making rice production more sustainable, valuing the efforts of farmers, and honoring rice as a life-giving force for generations of Filipinos. This initiative exemplifies the institution’s dedication to fostering awareness and driving collective action towards a sustainable and rice-secure future. Together, let us champion a culture of respect for rice, for our farmers, and for the earth that sustains us all. As ASSCAT students, you are not just learners, you are changemakers, capable of building a more sustainable and rice-secure future for our nation. #NSTPXPhilRice #ASSCATRiceponsible #ASSCATSustainableAgriculture",
                images: [
                    "img/events/2024-bericeponsible-awareness-and-symposium/First Image to appear, BeRiceponsible Awareness and Symposium(24).jpg",
                    "img/events/2024-bericeponsible-awareness-and-symposium/BeRiceponsible Awareness and Symposium(1).jpg",
                    "img/events/2024-bericeponsible-awareness-and-symposium/BeRiceponsible Awareness and Symposium(2).jpg",
                    "img/events/2024-bericeponsible-awareness-and-symposium/BeRiceponsible Awareness and Symposium(3).jpg",
                    "img/events/2024-bericeponsible-awareness-and-symposium/BeRiceponsible Awareness and Symposium(4).jpg",
                    "img/events/2024-bericeponsible-awareness-and-symposium/BeRiceponsible Awareness and Symposium(5).jpg",
                    "img/events/2024-bericeponsible-awareness-and-symposium/BeRiceponsible Awareness and Symposium(6).jpg",
                    "img/events/2024-bericeponsible-awareness-and-symposium/BeRiceponsible Awareness and Symposium(7).jpg",
                    "img/events/2024-bericeponsible-awareness-and-symposium/BeRiceponsible Awareness and Symposium(8).jpg",
                    "img/events/2024-bericeponsible-awareness-and-symposium/BeRiceponsible Awareness and Symposium(9).jpg",
                    "img/events/2024-bericeponsible-awareness-and-symposium/BeRiceponsible Awareness and Symposium(10).jpg",
                    "img/events/2024-bericeponsible-awareness-and-symposium/BeRiceponsible Awareness and Symposium(11).jpg",
                    "img/events/2024-bericeponsible-awareness-and-symposium/BeRiceponsible Awareness and Symposium(12).jpg",
                    "img/events/2024-bericeponsible-awareness-and-symposium/BeRiceponsible Awareness and Symposium(13).jpg",
                    "img/events/2024-bericeponsible-awareness-and-symposium/BeRiceponsible Awareness and Symposium(14).jpg",
                    "img/events/2024-bericeponsible-awareness-and-symposium/BeRiceponsible Awareness and Symposium(15).jpg",
                    "img/events/2024-bericeponsible-awareness-and-symposium/BeRiceponsible Awareness and Symposium(16).jpg",
                    "img/events/2024-bericeponsible-awareness-and-symposium/BeRiceponsible Awareness and Symposium(17).jpg",
                    "img/events/2024-bericeponsible-awareness-and-symposium/BeRiceponsible Awareness and Symposium(18).jpg",
                    "img/events/2024-bericeponsible-awareness-and-symposium/BeRiceponsible Awareness and Symposium(19).jpg",
                    "img/events/2024-bericeponsible-awareness-and-symposium/BeRiceponsible Awareness and Symposium(20).jpg",
                    "img/events/2024-bericeponsible-awareness-and-symposium/BeRiceponsible Awareness and Symposium(21).jpg",
                    "img/events/2024-bericeponsible-awareness-and-symposium/BeRiceponsible Awareness and Symposium(22).jpg",
                    "img/events/2024-bericeponsible-awareness-and-symposium/BeRiceponsible Awareness and Symposium(23).jpg"
                ]
            },
        ],
    };
    // ------------------------------------------------------------------
    // DOM refs
    // ------------------------------------------------------------------
    var step1        = document.getElementById('evStep1');
    var yearPicker    = document.getElementById('evYearPicker');
    var step2         = document.getElementById('evStep2');
    var backBtn       = document.getElementById('evBackBtn');
    var yearTitle     = document.getElementById('evYearTitle');
    var cardsGrid     = document.getElementById('evCardsGrid');

    var lightbox      = document.getElementById('evLightbox');
    var lbClose       = document.getElementById('evLightboxClose');
    var lbPrev        = document.getElementById('evLbPrev');
    var lbNext        = document.getElementById('evLbNext');
    var viewerStage   = document.getElementById('evViewerStage');

    var activeEvent   = null;
    var pageIdx       = 0; // 0 = detail page, 1..n-1 = gallery-only image pages

    function esc(str) {
        var d = document.createElement('div');
        d.textContent = str == null ? '' : str;
        return d.innerHTML;
    }

    // ------------------------------------------------------------------
    // STEP 1 -> STEP 2 : year selection
    // ------------------------------------------------------------------
    function buildCards(year) {
        var events = EVENTS[year] || [];
        yearTitle.textContent = 'Events of ' + year;
        cardsGrid.innerHTML = '';
        events.forEach(function(ev) {
            var card = document.createElement('div');
            card.className = 'ev-card';
            card.innerHTML =
                '<img class="ev-card-img" src="' + esc(ev.images[0]) + '" alt="' + esc(ev.title) + '" loading="lazy">' +
                '<div class="ev-card-body">' +
                    '<div class="ev-card-title">' + esc(ev.title) + '</div>' +
                    '<div class="ev-card-info"><i class="fas fa-map-marker-alt"></i><span>' + esc(ev.venue) + '</span></div>' +
                    '<div class="ev-card-info"><i class="fas fa-calendar-alt"></i><span>' + esc(ev.date) + '</span></div>' +
                    '<button class="ev-card-btn" type="button">Learn More <i class="fas fa-chevron-right"></i></button>' +
                '</div>';
            card.querySelector('.ev-card-btn').addEventListener('click', function() { openViewer(ev); });
            cardsGrid.appendChild(card);
        });
    }

    yearPicker.querySelectorAll('.ev-year-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            yearPicker.querySelectorAll('.ev-year-btn').forEach(function(b) { b.classList.remove('active'); });
            btn.classList.add('active');
            buildCards(btn.dataset.year);
            step1.style.display = 'none';
            step2.style.display = 'block';
        });
    });

    backBtn.addEventListener('click', function() {
        step2.style.display = 'none';
        step1.style.display = 'block';
        yearPicker.querySelectorAll('.ev-year-btn').forEach(function(b) { b.classList.remove('active'); });
    });

    // ------------------------------------------------------------------
    // STEP 3 : fullscreen viewer
    // ------------------------------------------------------------------
    function renderPage() {
        if (pageIdx === 0) {
            // Detail page: cover image + title, venue, date, description, FB icon
            viewerStage.innerHTML =
                '<div class="ev-viewer-detail">' +
                    '<img class="ev-viewer-detail-img" src="' + esc(activeEvent.images[0]) + '" alt="' + esc(activeEvent.title) + '">' +
                    '<div class="ev-viewer-info">' +
                        '<h3>' + esc(activeEvent.title) + '</h3>' +
                        '<div class="ev-card-info"><i class="fas fa-calendar-alt"></i><span>' + esc(activeEvent.date) + '</span></div>' +
                        '<div class="ev-card-info"><i class="fas fa-map-marker-alt"></i><span>' + esc(activeEvent.venue) + '</span></div>' +
                        '<div class="ev-viewer-desc">' + esc(activeEvent.description) + '</div>' +
                        '<a class="ev-viewer-fb" href="' + esc(activeEvent.link) + '" target="_blank" rel="noopener">' +
                            '<i class="fab fa-facebook"></i>' +
                            '<span>Click this icon to view the official Facebook post.</span>' +
                        '</a>' +
                    '</div>' +
                '</div>';
        } else {
            // Gallery pages: image only, no title/venue/description/FB icon
            var img = document.createElement('img');
            img.className = 'ev-viewer-gallery-img';
            img.src = activeEvent.images[pageIdx];
            img.alt = activeEvent.title + ' — photo ' + (pageIdx + 1);
            viewerStage.innerHTML = '';
            viewerStage.appendChild(img);
        }
        // Manual navigation only — Previous hidden on the first page,
        // Next hidden on the last photo (no automatic slideshow).
        lbPrev.style.visibility = (pageIdx === 0) ? 'hidden' : 'visible';
        lbNext.style.visibility = (pageIdx >= activeEvent.images.length - 1) ? 'hidden' : 'visible';
    }

    function openViewer(ev) {
        activeEvent = ev;
        pageIdx = 0;
        renderPage();
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeViewer() {
        lightbox.classList.remove('open');
        document.body.style.overflow = '';
    }

    function goPrev() { if (pageIdx > 0) { pageIdx--; renderPage(); } }
    function goNext() { if (pageIdx < activeEvent.images.length - 1) { pageIdx++; renderPage(); } }

    lbClose.addEventListener('click', closeViewer);
    lbPrev.addEventListener('click', goPrev);
    lbNext.addEventListener('click', goNext);
    lightbox.addEventListener('click', function(e) { if (e.target === lightbox) closeViewer(); });
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape')     closeViewer();
        if (e.key === 'ArrowLeft')  goPrev();
        if (e.key === 'ArrowRight') goNext();
    });
})();
});