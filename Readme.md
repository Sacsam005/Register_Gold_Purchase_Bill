# Gold Item Bill Registration App

### Overview

This is a Node.js and Express.js web application designed to help users register and manage their gold purchase bills digitally. In Nepal, a bill issued by a shopkeeper serves as proof of legitimate ownership of gold items. Traditionally, buyers must keep this physical bill safe for years to come. This app provides a convenient digital alternative, ensuring the bill's information is securely stored and easily accessible.

### Features

-   <b>Bill Registration:</b> Users can register their gold purchase bills, storing buyer information and item details digitally.
-   <b>Unique Bill ID:</b> Upon registration, users receive a unique bill ID, serving as a token to verify the authenticity of their purchase.
-   <b>Verification:</b> Users can verify their purchase using the bill ID, buyer's name, or phone number.
-   <b>Ownership Transfer:</b> Owners can transfer the ownership of their gold items. The new owner receives a new bill ID, and the previous owner is removed from the record.
-   <b>Contact Information Update:</b> Owners can update their contact information including name, city, province, and phone number if they have registered at least one bill previously. Note that if multiple bills were registered under the same owner's name and phone number, updating the contact info will affect all those bills.

### Bill Information

The app stores the following details:

-   <b>Buyer Information:</b> First name, middle name, last name, address (city and province), and phone number.
-   <b>Item Information:</b> Item name, purchase rate, tax, total cost before and after tax, purchase date, and vouched date.

### Usage

##### Registering a Bill

-   <b>Access the Register Page:</b> Navigate to the register page and fill in the required fields.
-   <b>Submit the Form:</b> Ensure all details are correct and submit the form. The app will validate the information and check for duplicate phone numbers.
-   <b>Receive Bill ID:</b> Upon successful registration, a unique bill ID will be generated and provided to the user.
-   <b>Re-registering with Same Phone Number:</b> If a user registers another bill using the same phone number, they must use the same name, city, and province as in the initial registration with that number. This ensures that multiple bills can be registered under the same user.

##### Verifying a Bill

-   <b>Access the Verification Page:</b> Navigate to the verification page.
-   <b>Enter Bill ID or Buyer Information:</b> Use the bill ID, buyer's name, or phone number to verify the purchase.
-   <b>View Details:</b> The app will display the details of the registered bill if the information is correct.

##### Transferring Ownership

-   <b>Initiate Transfer:</b> Access the transfer ownership page and enter the required details.
-   <b>Submit Transfer Request:</b> Confirm the transfer details and submit the request.
-   <b>New Owner Details:</b> The new owner will receive a new bill ID, and the previous owner will be removed from the record. Previous bill id will no longer be valid.

##### Updating Contact Information

-   <b>Access the Update Page:</b> Navigate to the update contact information page.
-   <b>Enter Phone Number:</b> Verify your identity by entering the phone number used during the bill registration.
-   <b>Update Information:</b> Update the required fields (name, city, province, phone number) and submit the form.
-   <b>Affect on Multiple Bills:</b> Note that if multiple bills were registered under the same owner's name and phone number, updating the contact info will affect all those bills.

### Benefits

-   <b>Digital Storage:</b> Eliminates the need to store physical bills for years.
-   <b>Easy Verification:</b> Quickly verify the authenticity of purchases using a unique bill ID or buyer information.
-   <b>Ownership Management:</b> Seamlessly transfer ownership of gold items with updated records.
-   <b>Updated Contact Information:</b> Easily update your contact information, ensuring all your registered bills reflect the correct details.

### Technical Details

-   <b>Backend:</b> Node.js, Express.js
-   <b>Frontend:</b> EJS (Embedded JavaScript)
-   <b>Database:</b> MongoDB (via Mongoose)

### Installation and Setup

-   Clone the Repository: git clone <repository-url>
-   Install Dependencies: npm install
-   Run the Server: npm run dev
-   Access the App: Open your browser and navigate to http://localhost:PORT

### Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

### License

This project is licensed under the MIT License. See the LICENSE file for details.
