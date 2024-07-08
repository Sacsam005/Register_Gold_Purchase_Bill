const express = require("express");
const router = express.Router();
const Bill = require("../models/billSchema");
const formatString = require("../../client/public/js/utilityFunction");

router.get("/", async (req, res) => {
    const locals = {
        title: "Gold Item Bill Registration App",
        description:
            "This app provides a convenient digital alternative, ensuring the bill's information is securely stored and easily accessible. Register your bill after purchasing gold jewellery.",
    };

    res.render("index", { locals });
});

router.get("/submit", async (req, res) => {
    const locals = {
        title: "Submission Successful!!!",
        description: "You have successfully recorded your item!",
    };

    res.render("success", { locals });
});

router.get("/register", async (req, res) => {
    const locals = {
        title: "Register Page",
        description: "Register your gold items",
    };

    res.render("register", { locals, formData: {} });
});

router.post("/submit", async (req, res) => {
    try {
        const {
            firstName,
            middleName,
            lastName,
            phoneNumber,
            city,
            province,
            purchasedDate,
            vouchedDate,
            itemName,
            tola,
            aana,
            rate,
            tax,
            totalBeforeTax,
            totalAfterTax,
        } = req.body;

        // Check for missing fields
        if (
            !firstName ||
            !lastName ||
            !phoneNumber ||
            !city ||
            !province ||
            !purchasedDate ||
            !vouchedDate ||
            !itemName ||
            !tola ||
            !aana ||
            !rate ||
            !tax ||
            !totalBeforeTax ||
            !totalAfterTax
        ) {
            return res.status(400).json({
                status: "error",
                message: "All required fields must be provided!",
            });
        }

        // Format user details
        const formattedFirstName = formatString(firstName);
        const formattedMiddleName = middleName ? formatString(middleName) : "";
        const formattedLastName = formatString(lastName);
        const formattedCity = formatString(city);
        const formattedProvince = formatString(province);
        const formattedItemName = formatString(itemName);

        // Validate phone number
        if (isNaN(phoneNumber) || phoneNumber.length !== 10) {
            return res.status(400).json({
                status: "error",
                message: "Phone number must be a 10-digit numeric value!",
            });
        }

        const phoneNumAlreadyExists = await Bill.findOne({
            "user.phoneNumber": phoneNumber,
        });

        if (
            phoneNumAlreadyExists &&
            (phoneNumAlreadyExists.user?.firstName !== formattedFirstName ||
                phoneNumAlreadyExists.user?.middleName !==
                    formattedMiddleName ||
                phoneNumAlreadyExists.user?.lastName !== formattedLastName ||
                phoneNumAlreadyExists.user?.address.city !== formattedCity ||
                phoneNumAlreadyExists.user?.address.province !==
                    formattedProvince)
        ) {
            const locals = {
                title: "Register Page",
                description: "Register your gold items",
            };

            const formData = {
                firstName,
                middleName,
                lastName,
                phoneNumber,
                city,
                province,
                purchasedDate,
                vouchedDate,
                itemName,
                tola,
                aana,
                rate,
                tax,
                totalBeforeTax,
                totalAfterTax,
            };

            return res.status(400).render("register", {
                locals,
                warning: "Please verify your details and try again.",
                errorMessage:
                    "The provided phone number does not match the registered name, city, or province. ",
                formData,
            });
        }

        // Validate gold weight in tola and aana
        if (tola > 10) {
            return res.status(400).json({
                status: "error",
                message: "Max quantity in tola is 10!",
            });
        } else if (aana > 160) {
            return res.status(400).json({
                status: "error",
                message: "Max quantity in aana is 160!",
            });
        }

        // Set unique id for the item
        let uniqueId =
            formattedFirstName +
            (formattedMiddleName.length > 3
                ? formattedMiddleName.substring(0, 3)
                : formattedMiddleName) +
            Math.floor(Math.random() * 100000) +
            formattedLastName;

        const bill = {
            billId: uniqueId,
            user: {
                firstName: formattedFirstName,
                middleName: formattedMiddleName,
                lastName: formattedLastName,
                phoneNumber,
                address: {
                    city: formattedCity,
                    province: formattedProvince,
                },
            },
            item: {
                purchasedDate,
                vouchedDate,
                itemName: formattedItemName,
                quantity: {
                    tola,
                    aana,
                },
                rate,
                tax,
                totalBeforeTax,
                totalAfterTax,
            },
        };

        await Bill.create(bill);

        // res.status(200).json({
        //     status: "success",
        //     message: "Record created successfully!",
        //     record,
        // });

        res.render("success", { bill });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
});

module.exports = router;
