// Configurações do Efeito de Digitação
const textElement = document.querySelector(".text-animation");
const textStrings = [
    "Desenvolvedora Frontend",
    "UI/UX Designer",
    "Criadora de Soluções",
];

let stringIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 150;

function typeWriter() {
    const currentString = textStrings[stringIndex];
    let displayText = "";

    if (isDeleting) {
        displayText = currentString.substring(0, charIndex - 1);
        charIndex--;
    } else {
        displayText = currentString.substring(0, charIndex + 1);
        charIndex++;
    }

    if (textElement) textElement.textContent = displayText;

    let currentSpeed = isDeleting ? typingSpeed / 2 : typingSpeed;

    if (!isDeleting && charIndex === currentString.length) {
        currentSpeed = 2000; // Pausa no final da frase
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        stringIndex = (stringIndex + 1) % textStrings.length;
        currentSpeed = 500;
    }

    setTimeout(typeWriter, currentSpeed);
}

// Scroll Suave
function smoothScroll() {
    const navLinks = document.querySelectorAll(".nav-link, .navbar a");

    navLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (targetId.startsWith("#")) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    const headerHeight = document.querySelector(".header").offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: "smooth",
                    });
                }
            }
        });
    });
}

// Destacar Link Ativo no Menu ao rolar
function updateActiveNav() {
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".navbar a");
    const headerHeight = document.querySelector(".header").offsetHeight;

    window.addEventListener("scroll", () => {
        let current = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute("id");
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${current}`) {
                link.classList.add("active");
            }
        });
    });
}

// Animações de Fade-In ao rolar a página
function scrollAnimations() {
    const animateElements = document.querySelectorAll(".fade-in");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.1 });

    animateElements.forEach((el) => observer.observe(el));
}

// Barras de Skills
function animateSkills() {
    const skillBars = document.querySelectorAll(".skill-progress");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const width = skillBar.getAttribute("data-width");
                skillBar.style.setProperty("--skill-width", `${width}%`);
                skillBar.classList.add("animate");
                setTimeout(() => { skillBar.style.width = `${width}%`; }, 100);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach((bar) => observer.observe(bar));
}

// Validação e Envio do Formulário (EmailJS)
function handleContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(form);
        const submitBtn = form.querySelector(".submit-btn");
        const originalText = submitBtn.innerHTML;

        // Validação Simples
        if (!formData.get("name") || !formData.get("email") || !formData.get("message")) {
            showNotification("Preencha todos os campos obrigatórios.", "error");
            return;
        }

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;

        const templateParams = {
            name: formData.get("name"),
            email: formData.get("email"),
            subject: formData.get("subject"),
            message: formData.get("message"),
            to_name: "Ana Andrade"
        };

        emailjs.send("service_p2fom5j", "template_pkh6p1t", templateParams, "OaRVf052mgJIm77C4")
            .then(() => {
                showNotification("Mensagem enviada com sucesso!", "success");
                form.reset();
            })
            .catch((error) => {
                console.error("Erro EmailJS:", error);
                showNotification("Erro ao enviar. Tente novamente.", "error");
            })
            .finally(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
    });
}

// Notificações
function showNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `<span>${message}</span>`;

    // Estilo básico rápido (você já tem um bom no seu JS original)
    Object.assign(notification.style, {
        position: 'fixed', bottom: '20px', right: '20px',
        padding: '15px 25px', borderRadius: '8px', zIndex: '9999',
        color: 'white', backgroundColor: type === 'success' ? '#00eeff' : '#ff4757'
    });

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 4000);
}

// Inicialização de tudo
document.addEventListener("DOMContentLoaded", () => {
    typeWriter();
    smoothScroll();
    updateActiveNav();
    scrollAnimations();
    animateSkills();
    handleContactForm();

    // Efeito visual de entrada da página
    document.body.style.opacity = "1";
});