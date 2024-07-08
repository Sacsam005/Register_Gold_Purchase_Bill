const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
    billId: {
        type: String,
        unique: true,
    },
    user: {
        firstName: {
            type: String,
            required: [true, "First Name is required!"],
        },
        middleName: {
            type: String,
        },
        lastName: {
            type: String,
            required: [true, "Last Name is required!"],
        },
        phoneNumber: {
            type: Number,
            require: [true, "Phone Number is required!"],
        },
        address: {
            city: {
                type: String,
                required: [true, "City Name is required!"],
            },
            province: {
                type: String,
                required: [true, "Province Name is required!"],
            },
        },
    },
    item: {
        purchasedDate: {
            type: Date,
            required: [true, "Purchased date is required!"],
        },
        vouchedDate: {
            type: Date,
            required: [true, "Vouched date is required!"],
        },
        itemName: {
            type: String,
            required: [true, "Item name is required!"],
        },
        quantity: {
            tola: {
                type: Number,
                required: [true, "Quantity in tola is required!"],
            },
            aana: {
                type: Number,
                required: [true, "Quantity in aana is required!"],
            },
        },
        rate: {
            type: Number,
            required: [true, "Rate is required!"],
        },
        totalBeforeTax: {
            type: Number,
        },
        tax: {
            type: Number,
        },
        totalAfterTax: {
            type: Number,
        },
    },
});

module.exports = mongoose.model("Bill", billSchema);
