const bar = document.getElementById('bar');
const close = document.getElementById('close');
const nav = document.getElementById('navbar');

if (bar){
    bar.addEventListener('click',()=>{
        nav.classList.add('active')
    })
}
if (close){
    close.addEventListener('click',()=>{
        nav.classList.remove('active')
    })
}
document.addEventListener('DOMContentLoaded', () => {
    const cartButtons = document.querySelectorAll('.cart');

    cartButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const product = btn.closest('.pro');
            const title = product.querySelector('h5').innerText;
            const price = parseInt(product.querySelector('h4').innerText.replace('₹',''));
            const img = product.querySelector('img').src;

            let cart = JSON.parse(localStorage.getItem('cart')) || [];

            // Check if item already in cart
            const existing = cart.find(item => item.title === title);
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({ title, price, img, quantity: 1 });
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            alert(`${title} has been added to your cart!`);
        });
    });
});
