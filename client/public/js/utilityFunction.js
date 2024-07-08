// Utility Function
function formatString(str) {
    return str.length !== 0
        ? str.charAt(0).toUpperCase() + str.substring(1).toLowerCase()
        : "";
}

module.exports = formatString;
