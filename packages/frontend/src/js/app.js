import gsap from 'gsap';

// API functions
import { authLogin, authVerify, authLogout } from './api.js';

// CSS imports
import '@/main.css';                     
import '@css/auth.css';
import '@css/panel/panel.css';
import '@css/panel/sidebar.css';
import '@css/panel/screens/register-customer.css';
import '@css/panel/screens/register-product.css';
import '@css/panel/screens/register-sale.css';
import '@css/panel/screens/show-customers.css';
import '@css/panel/screens/show-products.css';
import '@css/panel/screens/show-sales.css';

// SVG Icons imports
import iconCustomer from '@/assets/svg/sidebar/register-customer.svg?raw';
import iconProduct from '@/assets/svg/sidebar/register-product.svg?raw';
import iconSale from '@/assets/svg/sidebar/register-sale.svg?raw';
import iconShowCust from '@/assets/svg/sidebar/show-customers.svg?raw';
import iconShowSale from '@/assets/svg/sidebar/show-sales.svg?raw';
import iconShowProd from '@/assets/svg/sidebar/show-products.svg?raw';
import iconLogout from '@/assets/svg/sidebar/logout.svg?raw';

const App = {
    icons: {
        'register-employee': iconCustomer,
        'register-customer': iconCustomer,
        'register-product': iconProduct,
        'register-sale': iconSale,
        'show-customers': iconShowCust,
        'show-employees': iconShowCust,
        'show-sales': iconShowSale,
        'show-products': iconShowProd,
        'logout': iconLogout
    },

    elements: {
        views: {
            login: document.getElementById('login-view'),
            panel: document.getElementById('panel-view')
        },
        sidebar: document.querySelector('.panel-sidebar'),
        panelMain: document.querySelector('#panel-view > main'),
        
        formLogin: document.getElementById('form-login'),
        menuItems: document.querySelectorAll('.menu-item'),
        sections: document.querySelectorAll('.content-section'),
        btnLogout: document.getElementById('btn-logout'),
        
        inputEmail: document.getElementById('login-email'),
        inputPass: document.getElementById('login-pass'),
        btnLoginSubmit: document.querySelector('#form-login button'),
        
        errorEmail: document.getElementById('error-email'),
        errorPass: document.getElementById('error-pass')
    },

    async init() {
        this.loadIcons();
        this.setupEventListeners();
        await this.checkSession();
    },

    loadIcons() {
        const iconPlaces = document.querySelectorAll('[data-icon]');
        iconPlaces.forEach(el => {
            const key = el.getAttribute('data-icon');
            if (this.icons[key]) {
                el.innerHTML = this.icons[key];
            }
        });
    },

    setupEventListeners() {
        this.elements.formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        this.elements.menuItems.forEach(item => {
            item.addEventListener('click', () => {
                const targetId = item.getAttribute('data-target');
                if (!item.classList.contains('active')) {
                    this.navigateTo(targetId);
                    this.updateMenuState(item);
                }
            });
        });

        if (this.elements.btnLogout) {
            this.elements.btnLogout.addEventListener('click', () => {
                this.handleLogout();
            });
        }
    },

    async checkSession() {
        const session = await authVerify();

        if (session && session.authenticated) {
            this.elements.views.login.classList.add('hidden');
            this.elements.views.panel.classList.remove('hidden');
            this.elements.views.panel.style.opacity = 1;
            
            gsap.set(this.elements.sidebar, { width: "22.5vw" });
            gsap.set(this.elements.panelMain, { opacity: 1 });
            
            this.navigateTo('register-customer');
        } else {
            this.elements.views.login.classList.remove('hidden');
        }
    },

    showError(inputElement, msgElement, message) {
        if(inputElement) inputElement.classList.add('input-error');
        if(msgElement) msgElement.innerText = message;
    },

    clearErrors() {
        this.elements.inputEmail.classList.remove('input-error');
        this.elements.inputPass.classList.remove('input-error');
        this.elements.errorEmail.innerText = "";
        this.elements.errorPass.innerText = "";
    },

    async handleLogin() {
        const email = this.elements.inputEmail.value.trim();
        const pass = this.elements.inputPass.value.trim();

        this.clearErrors();

        let hasError = false;

        if (!email) {
            this.showError(this.elements.inputEmail, this.elements.errorEmail, "Digite seu usuário ou e-mail.");
            hasError = true;
        }

        if (!pass) {
            this.showError(this.elements.inputPass, this.elements.errorPass, "Digite sua senha.");
            hasError = true;
        }

        if (hasError) return;

        const btnOriginalText = this.elements.btnLoginSubmit.innerText;
        this.elements.btnLoginSubmit.disabled = true;
        this.elements.btnLoginSubmit.innerText = "Verificando...";

        try {
            const result = await authLogin(email, pass);
            
            if (result.authenticated) {
                this.animateLoginToPanel();
            }

        } catch (error) {
            console.error(error);
            
            if (error.target === 'identifier') {
                this.showError(this.elements.inputEmail, this.elements.errorEmail, error.message);
                this.elements.inputEmail.focus(); 
            } 
            else if (error.target === 'password') {
                this.showError(this.elements.inputPass, this.elements.errorPass, error.message);
                this.elements.inputPass.value = '';
                this.elements.inputPass.focus();
            } 
            else {
                alert(error.message || "Erro desconhecido ao conectar.");
            }

        } finally {
            this.elements.btnLoginSubmit.disabled = false;
            this.elements.btnLoginSubmit.innerText = btnOriginalText;
        }
    },

    async handleLogout() {
        if(confirm("Deseja realmente sair?")) {
            await authLogout();
            
            gsap.to(this.elements.views.panel, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    this.elements.views.panel.classList.add('hidden');
                    this.elements.views.login.classList.remove('hidden');
                    
                    this.elements.inputEmail.value = '';
                    this.elements.inputPass.value = '';
                    
                    gsap.to(this.elements.views.login, { opacity: 1, duration: 0.5 });
                    
                    gsap.set(this.elements.sidebar, { clearProps: "all" });
                    gsap.set(this.elements.panelMain, { clearProps: "all" });
                }
            });
        }
    },

    animateLoginToPanel() {
        const tl = gsap.timeline();
        
        tl.to(this.elements.views.login, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                this.elements.views.login.classList.add('hidden');
                this.elements.views.panel.classList.remove('hidden');
            }
        });

        tl.set(this.elements.sidebar, { width: 0, overflow: 'hidden', whiteSpace: 'nowrap' });
        tl.set(this.elements.panelMain, { opacity: 0 });

        tl.to(this.elements.sidebar, {
            width: "22.5vw", 
            duration: 0.8,
            ease: "power2.out"
        });

        tl.to(this.elements.panelMain, {
            opacity: 1,
            duration: 0.6,
            onStart: () => {
                this.navigateTo('register-customer');
                this.updateMenuState(this.elements.menuItems[0]);
            },
            onComplete: () => {
                gsap.set(this.elements.sidebar, { clearProps: "overflow,whiteSpace" });
            }
        });
    },

    navigateTo(targetId) {
        this.elements.sections.forEach(section => {
            section.classList.add('hidden');
            gsap.set(section, { clearProps: "all" });
        });

        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            targetSection.classList.remove('hidden');
            gsap.fromTo(targetSection, 
                { opacity: 0, y: 10 }, 
                { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
            );
        }
    },

    updateMenuState(activeItem) {
        this.elements.menuItems.forEach(item => item.classList.remove('active'));
        activeItem.classList.add('active');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});