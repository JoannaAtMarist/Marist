/**
 * Account Controller - Handles all logic for managing user accounts
 */

const { Account } = require('../models/Account'); // Destructure Account
const bcrypt = require('bcryptjs');

/* Account Management */

/**
 * Fetch all accounts (Admin functionality)
 */
exports.getAllAccounts = async function (req, res) {
    try {
        const accounts = await Account.find();
        res.status(200).json(accounts);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Failed to get accounts' });
    }
};

/**
 * Create a new account
 */
exports.createAccount = async function (req, res) {
    console.log('Creating new account:', req.body);
    try {
        const { email, password, firstName, lastName, dob, phoneNumber, zipCode, zipCodePref } = req.body;

        const newAccount = new Account({ email, password, firstName, lastName, dob, phoneNumber, zipCode, zipCodePref });

        await newAccount.save(); // Save to the database

        res.status(201).json({ message: 'Account created successfully', account: newAccount });
    } catch (err) {
        res.status(400).send(err);
    }
};

/**
 * Get account details by ID
 */
exports.getAccountInfo = async function (req, res) {
    const { id } = req.params;
    try {
        const account = await Account.findById(id);
        if (!account) {
            res.status(404).json({ message: 'Account not found' });
            return;
        }
        res.status(200).json(account);
    } catch (error) {
        console.error('Error fetching account info:', error);
        res.status(500).json({ message: 'Failed to fetch account info' });
    }
};

/**
 * Update account details
 */
exports.updateAccount = async function (req, res) {
    try {
        console.log('Update request received for userId:', req.params.id);
        console.log('Update data:', req.body);

        const userId = req.params.id;
        const updates = req.body;

        const updatedUser = await Account.findByIdAndUpdate(userId, updates, { new: true });

        if (!updatedUser) {
            console.error('User not found:', userId);
            return res.status(404).send({ message: 'User not found.' });
        }

        // Update session data
        req.session.user = {
            _id: updatedUser._id,
            email: updatedUser.email,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            dob: updatedUser.dob,
            phoneNumber: updatedUser.phoneNumber,
            zipCode: updatedUser.zipCode,
            zipCodePref: updatedUser.zipCodePref,
        };

        console.log('Updated user:', updatedUser);
        res.status(200).send(updatedUser);


    } catch (err) {
        console.error('Error updating user:', err);
        res.status(400).send(err);
    }
};

/**
 * Delete an account by ID
 */
exports.deleteAccount = async function (req, res) {
    try {
        await Account.findOneAndDelete({ _id: req.params.id });
        res.status(201).json({ message: 'Account deleted successfully' });
    } catch (err) {
        res.status(500).send(err);
    }
};


/* Authentication */

/**
 * Login function - Authenticates user and starts session
 */
exports.login = async function (req, res) {
    console.log('Received login request:', req.body);

    try {
        // Find the user in the database
        let user = await Account
            .findOne({ email: req.body.email })
            .exec();

        // If the user is not found, return an error
        if (!user) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }

        // Compare the provided password with the stored hash
        const passwordMatches = bcrypt.compareSync(req.body.password, user.password);
        if (passwordMatches) {
            // If the password matches, set the session
            req.session.user = {
                _id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                dob: user.dob,
                phoneNumber: user.phoneNumber,
                zipCode: user.zipCode,
                zipCodePref: user.zipCodePref || '12601', // add a default zip code for mongo
            };

            console.log('User logged in:', req.session.user); // what is happening?
            res.json({ success: true });

        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).send(err);
    }
};

/**
 * Logout function - Destroys user session
 */
exports.logout = async function (req, res) {
    try {
        req.session.destroy(err => { // Destroy the session
            if (err) {
                console.error('Error logging out:', err);
                return res.status(500).json({ message: 'Logout failed due to server error.' });
            }
            res.status(200).json({ message: `User logged out successfully` });
        });
    } catch (error) {
        res.status(500).send(err);
    }
};


/* Preferences */

/**
 * Update ZIP code preference
 */
exports.updateZipCodePref = async function (req, res) {
    try {
        const userId = req.session.user._id;
        const { zipCodePref } = req.body;

        console.log('Updating ZIP code preference:', zipCodePref);
        console.log('Session user ID:', userId);

        if (!userId || !zipCodePref) {
            return res.status(400).json({ message: 'Missing user ID or ZIP code preference.' });
        }

        const updatedUser = await Account.findByIdAndUpdate(
            userId,
            { zipCodePref },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        req.session.user.zipCodePref = updatedUser.zipCodePref; // Update session with zipCodePref

        console.log('Updated user:', updatedUser); // what is happening?
        res.status(200).json({ message: 'ZIP code preference updated.', user: updatedUser });
    } catch (error) {
        console.error('Error updating ZIP code preference:', error);
        res.status(500).json({ message: 'Failed to update ZIP code preference.' });
    }
};