
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialiser les fonctionnalités
    initTheme();
    initMenuMobile();
    initFormulaire();
    initScrollAnimations();
    
});


/*  1. MODE JOUR / NUIT */
function initTheme() {
    
    // Récupérer le bouton de thème
    var btnTheme = document.getElementById('btn-theme');
    
    // Récupérer le thème sauvegardé (si existe)
    var themeSauvegarde = localStorage.getItem('theme');
    
    // Par défaut = mode sombre (Ombre & Lumière)
    // Si l'utilisateur a choisi le mode jour, l'appliquer
    if (themeSauvegarde === 'jour') {
        document.body.classList.add('mode-jour');
        btnTheme.innerHTML = '<i class="bi bi-moon-fill"></i>';
    } else {
        // Mode sombre par défaut
        btnTheme.innerHTML = '<i class="bi bi-sun-fill"></i>';
    }
    
    // Au clic sur le bouton, changer le thème
    btnTheme.addEventListener('click', function() {
        
        // Basculer la classe mode-jour sur le body
        document.body.classList.toggle('mode-jour');
        
        // Changer l'icône du bouton
        if (document.body.classList.contains('mode-jour')) {
            // Mode jour activé -> afficher icône lune
            btnTheme.innerHTML = '<i class="bi bi-moon-fill"></i>';
            localStorage.setItem('theme', 'jour');
        } else {
            // Mode sombre activé -> afficher icône soleil
            btnTheme.innerHTML = '<i class="bi bi-sun-fill"></i>';
            localStorage.setItem('theme', 'sombre');
        }
    });
}

/* 
   2. MENU HAMBURGER (MOBILE)
*/
function initMenuMobile() {
    
    // Récupérer le bouton hamburger et le menu
    var btnMenu = document.getElementById('btn-menu');
    var menuNav = document.getElementById('menu-nav');
    
    // Au clic sur le bouton hamburger
    btnMenu.addEventListener('click', function() {
        // Basculer la classe "show" sur le menu
        menuNav.classList.toggle('show');
    });
    
    // Fermer le menu quand on clique sur un lien
    var liens = document.querySelectorAll('#menu-nav .nav-link');
    
    liens.forEach(function(lien) {
        lien.addEventListener('click', function() {
            // Fermer le menu
            menuNav.classList.remove('show');
        });
    });
}

/* 
   3. FORMULAIRE DE CONTACT (Formspree avec Fetch API)
   */
function initFormulaire() {
    
    var formulaire = document.getElementById('form-contact');
    
    if (!formulaire) return;
    
    formulaire.addEventListener('submit', function(e) {
        e.preventDefault(); // On gère l'envoi nous-mêmes
        
        // Récupérer les valeurs
        var nom = document.getElementById('nom').value.trim();
        var email = document.getElementById('email').value.trim();
        var message = document.getElementById('message').value.trim();
        
        // Validation
        if (nom === '' || email === '' || message === '') {
            alert('Veuillez remplir tous les champs.');
            return;
        }
        
        if (!email.includes('@') || !email.includes('.')) {
            alert('Veuillez entrer un email valide.');
            return;
        }
        
        if (message.length < 20) {
            alert('Le message doit contenir au moins 20 caractères.');
            return;
        }
        
        // Envoi via Fetch API
        var formData = new FormData(formulaire);
        
        fetch('https://formspree.io/f/mblnkdea', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(function(response) {
            if (response.ok) {
                alert(' Merci ' + nom + ' ! Votre message a été envoyé avec succès.');
                formulaire.reset();
            } else {
                alert(' Erreur lors de l\'envoi. Veuillez réessayer.');
            }
        })
        .catch(function(error) {
            alert(' Erreur de connexion. Vérifiez votre connexion internet.');
        });
    });
}

/* 
   4. ANIMATIONS AU SCROLL - Intersection Observer
*/
function initScrollAnimations() {
    
    // Appliquer les classes d'animation aux éléments
    applyAnimationClasses();
    
    // Créer l'observer pour détecter les éléments visibles
    var observerOptions = {
        root: null, // viewport
        rootMargin: '0px 0px -50px 0px', // déclenche un peu avant
        threshold: 0.1 // 10% visible suffit
    };
    
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                // Ajouter la classe visible pour déclencher l'animation
                entry.target.classList.add('visible');
                // Ne plus observer cet élément (animation unique)
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observer tous les éléments animables
    var elementsToAnimate = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in, .section-title-anim, .card-anim');
    
    elementsToAnimate.forEach(function(el) {
        observer.observe(el);
    });
}

/* 
   Appliquer les classes d'animation aux éléments de la page
*/
function applyAnimationClasses() {
    
    // Titres de sections (h2)
    var sectionTitles = document.querySelectorAll('section:not(.hero) h2');
    sectionTitles.forEach(function(title) {
        title.classList.add('section-title-anim');
    });
    
    // Cartes dans les sections
    var allCards = document.querySelectorAll('section:not(.hero) .card');
    allCards.forEach(function(card, index) {
        card.classList.add('card-anim');
        // Stagger pour les cartes dans la même rangée (1 à 6)
        var staggerClass = 'stagger-' + ((index % 6) + 1);
        card.classList.add(staggerClass);
    });
    
    // Hero - apparition initiale rapide
    var heroLeft = document.querySelector('.hero-left');
    var heroRight = document.querySelector('.hero-right');
    
    if (heroLeft) {
        heroLeft.classList.add('fade-in-left');
        heroLeft.classList.add('stagger-1');
        // Déclencher après 0.5s pour le hero
        setTimeout(function() {
            heroLeft.classList.add('visible');
        }, 600);
    }
    
    if (heroRight) {
        heroRight.classList.add('fade-in-right');
        heroRight.classList.add('stagger-2');
        setTimeout(function() {
            heroRight.classList.add('visible');
        }, 700);
    }
    
    // Lignes dans les sections (row)
    var sectionRows = document.querySelectorAll('section:not(.hero) .row');
    sectionRows.forEach(function(row) {
        row.classList.add('fade-in');
    });
    
    // Formulaire de contact
    var formContact = document.querySelector('#form-contact');
    if (formContact) {
        formContact.classList.add('fade-in');
        formContact.classList.add('stagger-2');
    }
    
    // Infos contact
    var contactInfo = document.querySelector('.contact-info');
    if (contactInfo) {
        contactInfo.classList.add('fade-in-left');
        contactInfo.classList.add('stagger-1');
    }
    
    // Réseaux sociaux dans contact
    var socialBtns = document.querySelectorAll('#contact .btn-dark, #contact .btn-linkedin');
    socialBtns.forEach(function(btn, index) {
        btn.classList.add('scale-in');
        btn.classList.add('stagger-' + (index + 3));
    });
}

