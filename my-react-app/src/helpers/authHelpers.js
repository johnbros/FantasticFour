export const isValidPassword = (password) => {
    if (!password) {
        throw new Error('Password is required');
    }
    if (typeof password !== 'string' || password.trim() === '') {
        throw new Error('Password must be a string and not empty');
    }
    if (password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
    }
    if (password.length > 20) {
        throw new Error('Password must be less than 20 characters');
    }
    if (!/[A-Z]/.test(password)) {
        throw new Error('Password must contain at least one capital letter');
    }
    if (!/[a-z]/.test(password)) {
        throw new Error('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
        throw new Error('Password must contain at least one number');
    }

    return true;
}

export const isValidEmail = (email) => {
    if (!email) {
        throw new Error('Email is required');
    }
    if (typeof email !== 'string' || email.trim() === '') {
        throw new Error('Email must be a string and not empty');
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Invalid email address');
    }
    return true;
}

export const isValidFirstName = (firstName) => {
    if (!firstName) {
        throw new Error('First name is required');
    }
    if (typeof firstName !== 'string' || firstName.trim() === '') {
        throw new Error('First name must be a string and not empty');
    }
    if (firstName.length < 1 || firstName.length > 20) {
        throw new Error('First name must be between 1 and 20 characters');
    }
    return true;
}

export const isValidLastName = (lastName) => {
    if (!lastName) {
        throw new Error('Last name is required');
    }
    if (typeof lastName !== 'string' || lastName.trim() === '') {
        throw new Error('Last name must be a string and not empty');
    }
    if (lastName.length < 1 || lastName.length > 20) {
        throw new Error('Last name must be between 1 and 20 characters');
    }
    return true;
}




