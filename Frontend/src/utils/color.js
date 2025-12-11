export const fixTailwindColors = (element) => {
  const clone = element.cloneNode(true);
  clone.style.position = 'absolute';
  clone.style.left = '-9999px';
  clone.style.top = '0';
  
  // Use clientWidth instead of offsetWidth, or set a fixed width
  const width = element.offsetWidth || element.clientWidth || 800; // Fallback to 800px
  const height = element.offsetHeight || element.clientHeight || 600; // Fallback to 600px
  
  clone.style.width = `${width}px`;
  clone.style.height = `${height}px`;
  clone.style.visibility = 'visible';
  clone.style.opacity = '1';
  
  document.body.appendChild(clone);

  // Convert oklch colors to rgb - SIMPLIFIED VERSION
  const convertOklch = (value) => {
    if (value.includes('oklch')) {
      // Simple fallback colors for common cases
      if (value.includes('0.5')) return 'rgb(107, 114, 128)'; // gray
      if (value.includes('0.7')) return 'rgb(59, 130, 246)'; // blue
      if (value.includes('0.9')) return 'rgb(34, 197, 94)'; // green
      return 'rgb(0, 0, 0)'; // default black
    }
    return value;
  };

  // Process all elements with error handling
  const allElements = clone.querySelectorAll('*');
  allElements.forEach(el => {
    try {
      const computed = window.getComputedStyle(el);

      // Handle background colors
      if (computed.backgroundColor.includes('oklch')) {
        el.style.backgroundColor = convertOklch(computed.backgroundColor);
      }

      // Handle text colors
      if (computed.color.includes('oklch')) {
        el.style.color = convertOklch(computed.color);
      }

      // Handle border colors
      if (computed.borderColor.includes('oklch')) {
        el.style.borderColor = convertOklch(computed.borderColor);
      }
    } catch (error) {
      console.warn('Error processing element style:', error);
    }
  });

  return clone;
};