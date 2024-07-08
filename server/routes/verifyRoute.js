const express = require("express");
const router = express.Router();
const Bill = require("../models/billSchema");
const formatString = require("../../client/public/js/utilityFunction");

// GET /verify-page
router.get("/verify-page", async (req, res) => {
    const locals = {
        title: "Verify Registration",
        description:
            "To verify your purchase bill is registered, Choose your method of verification",
    };

    res.render("verify-pages/verify-page", { locals });
});

// GET /verify-id
router.get("/verify-id", async (req, res) => {
    const locals = {
        title: "Verify with your bill id",
        description: "Enter your bill id to verify registration.",
    };

    res.render("verify-pages/verify-id", { locals });
});

// GET /verify-user
router.get("/verify-user", async (req, res) => {
    const locals = {
        title: "Verify with your credentials",
        description:
            "Enter the required information to verify your bill registration.",
    };

    res.render("verify-pages/verify-user", { locals, formData: {} });
});

// GET /item/:itemId
router.get("/bill/:billId", async (req, res) => {
    try {
        const locals = {
            title: "Verification result",
            description: "Item found for bill id ",
        };

        const { billId } = req.params;

        const bill = await Bill.findOne({ billId });

        if (!bill) {
            return res.status(404).render("bill", {
                bill: null,
                billId,
                locals,
            });
        }

        res.render("bill", { bill, locals });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// POST /item
router.post("/bill", async (req, res) => {
    try {
        const locals = {
            title: "Verification result",
            description: "Item found for bill id ",
        };

        const { registrationId } = req.body;

        const bill = await Bill.findOne({ billId: registrationId });

        if (!bill) {
            return res.status(404).render("bill", {
                bill: null,
                registrationId,
                locals,
            });
        }

        // Render item page
        res.render("bill", {
            locals,
            bill,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// POST /result
router.post("/result", async (req, res) => {
    try {
        const { firstName, middleName, lastName, phoneNumber } = req.body;

        // Format user details
        const formattedFirstName = formatString(firstName);
        const formattedMiddleName = formatString(middleName);
        const formattedLastName = formatString(lastName);

        // Check if the user already exists
        const phoneNumberAlreadyExists = await Bill.findOne({
            "user.phoneNumber": phoneNumber,
        });

        if (
            phoneNumberAlreadyExists &&
            (phoneNumberAlreadyExists.user.firstName !== formattedFirstName ||
                phoneNumberAlreadyExists.user.middleName !==
                    formattedMiddleName ||
                phoneNumberAlreadyExists.user.lastName !== formattedLastName)
        ) {
            const locals = {
                title: "Verify with your credentials",
                description:
                    "Enter the required information to verify your bill registration.",
            };

            const formData = {
                firstName,
                middleName,
                lastName,
                phoneNumber,
            };

            res.render("verify-pages/verify-user", {
                locals,
                errorMessage:
                    "Phone number already exists but does not match the registered name. Please verify and try again!",
                formData,
            });
        }

        const users = await Bill.find({
            "user.firstName": formattedFirstName,
            "user.middleName": formattedMiddleName,
            "user.lastName": formattedLastName,
            "user.phoneNumber": phoneNumber,
        });

        const locals = {
            title: "Verification result",
            description: `${users?.length} ${
                users?.length > 1 ? "results" : "result"
            } found`,
        };

        if (!users || users.length === 0) {
            return res.status(404).render("result", {
                users: null,
                locals,
            });
        }

        res.render("result", { users, locals });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
