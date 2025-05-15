// ==UserScript==
// @name         BoxmineWorld - Bypass AdBlock
// @namespace    https://github.com/Elpapiema
// @version      1.2_Beta-1
// @description  Elimina el bloqueo de Adblock y Restaura la interactividad completa en BoxmineWorld
// @author       Emma (Violets Version)
// @match        https://panel.boxmineworld.com/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';

    // 1. CSS crítico para restaurar interactividad inmediatamente
    GM_addStyle(`
        /* Eliminar overlays bloqueantes */
        body > div[style*="fixed"],
        body > div[style*="absolute"],
        .blocking-overlay,
        .intercept-events {
            display: none !important;
            pointer-events: none !important;
        }

        /* Restaurar eventos en toda la página */
        body, html, #app, [data-reactroot] {
            pointer-events: auto !important;
            overflow: auto !important;
        }

        /* Elementos específicos de BoxmineWorld */
        .modal-backdrop, .backdrop-blur {
            opacity: 0 !important;
            visibility: hidden !important;
        }
    `);

    // 2. Función para restaurar interactividad
    function restoreInteractivity() {
        // Eliminar overlays de bloqueo
        document.querySelectorAll('body > div').forEach(div => {
            const style = window.getComputedStyle(div);
            if ((style.position === 'fixed' || style.position === 'absolute') &&
                style.zIndex === '999999' &&
                style.pointerEvents === 'none') {
                div.remove();
            }
        });

        // Restaurar eventos en elementos principales
        ['body', 'html', '#app', '[data-reactroot]'].forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.pointerEvents = 'auto';
                element.style.overflow = 'auto';
            }
        });

        // Eliminar event listeners bloqueantes
        document.body.onclick = null;
        document.body.onmousedown = null;
        document.body.onmouseup = null;
    }

    // 3. Observador de mutaciones para overlays dinámicos
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    const style = window.getComputedStyle(node);
                    if (style.position === 'fixed' && style.zIndex > '1000') {
                        node.remove();
                    }
                }
            });
        });
    });

    // 4. Comando de menú para forzar restauración
    GM_registerMenuCommand("Restaurar Interactividad", restoreInteractivity);

    // 5. Inicialización
    document.addEventListener('DOMContentLoaded', () => {
        // Ejecutar inmediatamente
        restoreInteractivity();

        // Configurar observador
        observer.observe(document, {
            childList: true,
            subtree: true,
            attributes: true
        });

        // Verificación periódica
        setInterval(() => {
            if (document.body.style.pointerEvents === 'none') {
                restoreInteractivity();
            }
        }, 2000);
    });

    console.log('[BoxmineWorld] Interactividad restaurada');
})();