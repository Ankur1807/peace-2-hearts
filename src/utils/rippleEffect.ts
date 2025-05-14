
/**
 * Creates a ripple effect on the clicked element
 * @param element - The element to create the ripple effect on
 * @param event - The mouse event that triggered the ripple
 */
export const createRipple = (element: HTMLElement, event: MouseEvent) => {
  // Find the ripple container inside the element
  const rippleContainer = element.querySelector('.ripple-container');
  if (!rippleContainer) return;

  // Remove any existing ripples
  const existingRipple = rippleContainer.querySelector('.ripple-effect');
  if (existingRipple) {
    existingRipple.remove();
  }

  // Create a new ripple element
  const ripple = document.createElement('div');
  ripple.classList.add('ripple-effect');

  // Position the ripple relative to where the user clicked
  const rect = element.getBoundingClientRect();
  
  const left = event.clientX - rect.left;
  const top = event.clientY - rect.top;
  
  ripple.style.left = `${left}px`;
  ripple.style.top = `${top}px`;

  // Add the ripple to the container
  rippleContainer.appendChild(ripple);

  // Remove the ripple after animation completes
  setTimeout(() => {
    if (ripple.parentElement) {
      ripple.remove();
    }
  }, 1000);
};

/**
 * Initializes ripple effects on all interactive service cards
 */
export const initRippleEffects = () => {
  document.addEventListener('DOMContentLoaded', () => {
    // Find all service card elements
    const serviceCards = document.querySelectorAll('.ripple-container').forEach(container => {
      const card = container.parentElement;
      if (card) {
        card.addEventListener('click', (event) => {
          createRipple(card as HTMLElement, event as MouseEvent);
        });
      }
    });
  });
};

// Auto-initialize when imported
window.addEventListener('load', initRippleEffects);
