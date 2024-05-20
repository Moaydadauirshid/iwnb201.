let shoppingCart = [];

function calculateTotalPrice() {
    let total = 0;
    for (let i = 0; i < shoppingCart.length; i++) {
        total += shoppingCart[i].price * shoppingCart[i].quantity;
    }
    return total;
}

function addToCart(product) {
    const existingProductIndex = shoppingCart.findIndex(item => item.name === product.name);

    if (existingProductIndex !== -1) {
        shoppingCart[existingProductIndex].quantity += 1;
    } else {
        shoppingCart.push(product);
    }

    updateCartCount();
    updateCartDisplay();
}

function removeFromCart(index) {
    shoppingCart.splice(index, 1);
    updateCartDisplay();
    updateCartCount();
}

function updateCartDisplay() {
    const cartContainer = document.getElementById('shopping-cart');
    let cartHTML = '<h3>عربة التسوق</h3>';

    if (shoppingCart.length === 0) {
        cartHTML += '<p>عربتك فارغة.</p>';
    } else {
        for (let i = 0; i < shoppingCart.length; i++) {
            const item = shoppingCart[i];
            cartHTML += `
            <div class="cart-item">
                <span>${item.name} - ${item.price}</span>
                <div class="cart-buttons">
                    <input class="quantity-input" type="text" value="${item.quantity}" disabled>
                    <button onclick="removeFromCart(${i})">إزالة</button>
                </div>
            </div>
        `;
        }

        const totalPrice = calculateTotalPrice();
        cartHTML += `<p id="total-price">السعر الإجمالي: ${totalPrice}</p>`;
    }

    cartHTML += '<button onclick="cancelCart()">إلغاء</button>';
    cartHTML += '<button onclick="showBuyForm()">متابعة</button>';

    cartContainer.innerHTML = cartHTML;
}

function cancelCart() {
    shoppingCart = [];
    updateCartCount();
    updateCartDisplay();
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    cartCount.innerText = shoppingCart.reduce((total, item) => total + item.quantity, 0);
}

function showBuyForm() {
    console.log('تم النقر على زر عرض نموذج الشراء');

    const buyForm = document.getElementById('buy-form');

    buyForm.style.display = 'block';

    initializeCaptcha();
}

function hideBuyForm() {
    console.log('تم النقر على زر إخفاء نموذج الشراء');

    const buyForm = document.getElementById('buy-form');

    buyForm.style.display = 'none';
}

function generateCaptchaChallenge() {
    const randomNumber = Math.floor(Math.random() * 10000);
    return randomNumber.toString();
}

function initializeCaptcha() {
    const captchaChallenge = generateCaptchaChallenge();
    document.getElementById('captcha-challenge').textContent = captchaChallenge;
}

function buy() {
    const fullName = document.getElementById('full-Name').value;
    const nationalNumber = document.getElementById('national-number').value;

    const mobileNumber = document.getElementById('mobile-number').value;
    const email = document.getElementById('email').value;

    const isFullNameValid = validateFullName(fullName);
    const isNationalNumberValid = validateNationalNumber(nationalNumber);

    const isMobileNumberValid = validateMobileNumber(mobileNumber);
    const isEmailValid = validateEmail(email);

    const userEnteredCaptcha = document.getElementById('captcha').value;
    const captchaChallenge = document.getElementById('captcha-challenge').textContent;
    const isCaptchaValid = validateCaptcha(userEnteredCaptcha, captchaChallenge);

    if (isFullNameValid && isNationalNumberValid && isMobileNumberValid && isEmailValid && isCaptchaValid) {

        const totalPrice = calculateTotalPrice();
        const confirmationMessage = `السعر الإجمالي: $${totalPrice}\n\nمعلومات إضافية: أضف أي معلومات ذات صلة هنا.`;

        const userConfirmed = window.confirm(confirmationMessage);

        if (userConfirmed) {

            console.log('تم الشراء بنجاح!');

            shoppingCart = [];
            updateCartCount();
            updateCartDisplay();

            hideBuyForm();
        } else {

            console.log('تم إلغاء الشراء.');
        }
    } else {

        const errorMessage = 'يرجى التحقق من النموذج للأخطاء.';
        alert(errorMessage);
    }
}

function validateFullName(fullName) {
    const arabicLettersRegex = /^[\u0600-\u06FF\s]+$/;

    if (arabicLettersRegex.test(fullName.trim())) {
        return true;
    } else {
        alert('يرجى إدخال اسم كامل صالح يحتوي على أحرف عربية فقط.');
        return false;
    }
}

function validateNationalNumber(nationalNumber) {
    if (nationalNumber.length === 11 && nationalNumber.substring(0, 2) >= '01' && nationalNumber.substring(0, 2) <= '14') {
        return true;
    } else {
        alert('يرجى إدخال رقم وطني صالح.');
        return false;
    }
}

function validateMobileNumber(phoneNumber) {
    const syriatelRegex = /^(098|095|093|099)\d{7}$/;
    const mtnRegex = /^(094|096)\d{7}$/;

    if (syriatelRegex.test(phoneNumber) || mtnRegex.test(phoneNumber)) {
        return true;
    } else {
        alert('يرجى إدخال رقم هاتف صالح لسيرياتل أو إم تي إن.');
        return false;
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(email)) {
        return true;
    } else {
        alert('يرجى إدخال عنوان بريد إلكتروني صالح.');
        return false;
    }
}

function validateCaptcha(userEnteredCaptcha, captchaChallenge) {
    if (userEnteredCaptcha === captchaChallenge) {
        return true;
    } else {
        alert('فشل التحقق من الكابتشا. يرجى المحاولة مرة أخرى.');
        return false;
    }
}
