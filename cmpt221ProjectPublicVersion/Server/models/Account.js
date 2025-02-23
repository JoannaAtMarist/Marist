/**
 * Account Model - Defines the schema and behavior for user accounts
 */

const bcrypt = require('bcryptjs/dist/bcrypt');
const mongoose = require('mongoose');

/* User Schema */

/**
 * Schema for storing user accounts
 */
const accountSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dob: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    zipCode: { type: String, required: true },
    zipCodePref: { type: String, required: false },
});


/* Password Hashing Middleware */

/**
 * Hashes password before saving the user object
 * Assisted by Parijat Das & Miles Byrnes
 */
accountSchema.pre('save', async function (next) {
    console.log('Hashing password for:', this.email);

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    console.log('Password hashing complete.');
    next();
});


/* Model Export */
const Account = mongoose.model('Account', accountSchema);
module.exports = { Account };