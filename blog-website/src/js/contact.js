document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    const mailtoLink = `mailto:gemini-cansat@outlook.com?subject=Blog Contact from ${name}&body=${message}%0D%0A%0D%0AFrom: ${email}`;
    
    window.location.href = mailtoLink;
    
    this.reset();
    
    alert('Thank you for your message! Your email client will open shortly.');
});