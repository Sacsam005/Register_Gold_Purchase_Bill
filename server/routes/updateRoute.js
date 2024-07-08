const express = require("express");
const router = express.Router();
const Bill = require("../models/billSchema");
const formatString = require("../../client/public/js/utilityFunction");

/* 
GET /update-prompt
Here owner enters their phone no to check if they are registered, if yes - they can update!
*/
router.get("/update-prompt", async (req, res) => {
    try {
        const locals = {
            title: "Update your contact information",
            description:
                "To update your details, please ensure you have registered at least one bill with your phone number. If this is your first time, please go to the registration page to register your bill.",
        };

        res.render("update-contact/update-prompt", { locals, formData: {} });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
});

/* 
GET /update
Here owner can update their contact info
*/
router.post("/update", async (req, res) => {
    try {
        const locals = {
            title: "Update your contact information",
            description:
                "If you have used you phone number to register at least one of more bill, you can  update your information here",
        };

        const { phoneNumber } = req.body;

        const owner = await Bill.findOne({ "user.phoneNumber": phoneNumber });

        if (!owner) {
            return res.status(400).json({
                status: "Not Found!",
                message: "Phone number does not exist on our record.",
            });
        }

        const formattedFirstName = formatString(owner.user?.firstName);
        const formattedMiddleName = formatString(owner.user?.middleName);
        const formattedLastName = formatString(owner.user?.lastName);
        const formattedCity = formatString(owner.user?.address?.city);
        const formattedProvince = formatString(owner.user?.address?.province);

        const formData = {
            firstName: formattedFirstName,
            middleName: formattedMiddleName,
            lastName: formattedLastName,
            phoneNumber,
            city: formattedCity,
            province: formattedProvince,
        };

        res.render("update-contact/update-contact", { locals, formData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
});

/* 
PUT /update-success
Here after successful update, the updated contact is displayed 
*/
router.post("/update-success", async (req, res) => {
    try {
        const locals = {
            title: "Update Successful",
            description:
                "Your contact information has been successfully updated.",
        };

        const {
            firstName,
            middleName,
            lastName,
            phoneNumber, // original phone number
            city,
            province,
            newPhoneNumber, // new phone number
        } = req.body;

        const formattedPhoneNumber = Number(phoneNumber);
        const formattedNewPhoneNumber = Number(newPhoneNumber);
        const formattedFirstName = formatString(firstName);
        const formattedMiddleName = formatString(middleName);
        const formattedLastName = formatString(lastName);
        const formattedCity = formatString(city);
        const formattedProvince = formatString(province);

        const formData = {
            firstName: formattedFirstName,
            middleName: formattedMiddleName,
            lastName: formattedLastName,
            phoneNumber: formattedNewPhoneNumber,
            city: formattedCity,
            province: formattedProvince,
        };

        const newPhoneNumberAlreadyExists = await Bill.findOne({
            "user.phoneNumber": formattedNewPhoneNumber,
        });

        if (newPhoneNumberAlreadyExists) {
            if (
                newPhoneNumberAlreadyExists.user?.firstName !==
                    formattedFirstName &&
                newPhoneNumberAlreadyExists.user?.middleName !==
                    formattedMiddleName &&
                newPhoneNumberAlreadyExists.user?.lastName !==
                    formattedLastName &&
                newPhoneNumberAlreadyExists.user?.address?.city !==
                    formattedCity &&
                newPhoneNumberAlreadyExists.user?.address?.province !==
                    formattedProvince
            )
                return res.render("update-contact/update-contact", {
                    locals,
                    warning: "Please verify your details and try again.",
                    errorMessage:
                        "This phone number is already registered with different owner name, city and province.",
                    formData,
                });
        }

        const updatedUserDetails = {
            "user.firstName": formattedFirstName,
            "user.middleName": formattedMiddleName,
            "user.lastName": formattedLastName,
            "user.phoneNumber": formattedNewPhoneNumber,
            "user.address.city": formattedCity,
            "user.address.province": formattedProvince,
        };

        // Find and update all records with the matching original phone number
        const result = await Bill.updateMany(
            { "user.phoneNumber": formattedPhoneNumber },
            { $set: updatedUserDetails }
        );
        console.log(result);

        res.render("update-contact/update-success", {
            locals,
            formData,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
});

module.exports = router;
