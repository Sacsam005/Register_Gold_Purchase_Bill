const express = require("express");
const router = express.Router();
const Bill = require("../models/billSchema");
const formatString = require("../../client/public/js/utilityFunction");

router.get("/transfer", async (req, res) => {
    const locals = {
        title: "Transfer Page",
        description:
            "Transfer ownership of your gold jewellery to someone else",
    };

    res.render("transfer", { locals, formData: {} });
});

router.post("/transfer-success", async (req, res) => {
    try {
        const {
            firstName,
            middleName,
            lastName,
            phoneNumber,
            newFirstName,
            newMiddleName,
            newLastName,
            newPhoneNumber,
            billId,
            newCity,
            newProvince,
        } = req.body;

        // Format old user's details
        const formattedFirstName = formatString(firstName);
        const formattedMiddleName = formatString(middleName);
        const formattedLastName = formatString(lastName);

        // Format new user's details
        const formattedNewFirstName = formatString(newFirstName);
        const formattedNewMiddleName = formatString(newMiddleName);
        const formattedNewLastName = formatString(newLastName);
        const formattedNewCity = formatString(newCity);
        const formattedNewProvince = formatString(newProvince);

        const oldBill = await Bill.findOne({
            billId,
            "user.firstName": formattedFirstName,
            "user.middleName": formattedMiddleName,
            "user.lastName": formattedLastName,
            "user.phoneNumber": phoneNumber,
        });

        if (!oldBill) {
            const locals = {
                title: "Transfer Page",
                description:
                    "Transfer ownership of your gold jewellery to someone else",
            };

            const formData = {
                firstName,
                middleName,
                lastName,
                newFirstName,
                newMiddleName,
                newLastName,
                newPhoneNumber,
                billId,
                newCity,
                newProvince,
            };

            return res.status(400).render("transfer", {
                locals,
                warning: "Please verify your details and try again.",
                errorMessage:
                    "The provided phone no. does not match with the owner's registered name, city, province and bill id.",
                formData,
            });
        }

        // Check if the transferee already exists in the record
        const newPhoneNumberExists = await Bill.findOne({
            "user.phoneNumber": newPhoneNumber,
        });

        if (newPhoneNumberExists) {
            if (
                newPhoneNumberExists.user?.firstName !==
                    formattedNewFirstName ||
                newPhoneNumberExists.user?.middleName !==
                    formattedNewMiddleName ||
                newPhoneNumberExists.user?.lastName !== formattedNewLastName ||
                newPhoneNumberExists.user?.address.city !== formattedNewCity ||
                newPhoneNumberExists.user?.address.province !==
                    formattedNewProvince
            ) {
                const locals = {
                    title: "Transfer Page",
                    description:
                        "Transfer ownership of your gold jewellery to someone else",
                };

                const formData = {
                    firstName,
                    middleName,
                    lastName,
                    phoneNumber,
                    newFirstName,
                    newMiddleName,
                    newLastName,
                    newPhoneNumber,
                    billId,
                    newCity,
                    newProvince,
                };

                return res.status(400).render("transfer", {
                    locals,
                    warning: "Please verify your details and try again.",
                    newPhoneNumberError:
                        "Phone number already exists but does not match the registered owner's name, city, and province.",
                    formData,
                });
            }
        }

        // Set unique id for the item
        let uniqueId =
            formattedNewFirstName +
            (formattedNewMiddleName.length > 3
                ? formattedNewMiddleName.substring(0, 3)
                : formattedNewMiddleName) +
            Math.floor(Math.random() * 100000) +
            formattedNewLastName;

        const bill = {
            billId: uniqueId,
            user: {
                firstName: formattedNewFirstName,
                middleName: formattedNewMiddleName,
                lastName: formattedNewLastName,
                phoneNumber: newPhoneNumber,
                address: {
                    city: formattedNewCity,
                    province: formattedNewProvince,
                },
            },
            item: {
                ...oldBill.item,
                vouchedDate: new Date(),
            },
        };

        await Bill.create(bill);
        await Bill.deleteOne({ billId });

        res.render("success", { bill });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
