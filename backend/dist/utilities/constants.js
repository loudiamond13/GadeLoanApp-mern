"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numberWithCommas = exports.formatDateYYYYmmDD = exports.formatDateMMddYYYY = exports.LoanStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["CUSTOMER"] = "customer";
    UserRole["EMPLOYEE"] = "employee";
})(UserRole || (exports.UserRole = UserRole = {}));
;
var LoanStatus;
(function (LoanStatus) {
    LoanStatus["APPROVED"] = "Approved";
    LoanStatus["PENDING"] = "Pending";
    LoanStatus["PAID"] = "Paid";
    LoanStatus["DECLINED"] = "Declined";
    LoanStatus["CANCELED"] = "Canceled";
    LoanStatus["REFUNDED"] = "Refunded";
})(LoanStatus || (exports.LoanStatus = LoanStatus = {}));
;
function formatDateMMddYYYY(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    return `${month}-${day}-${year}`;
}
exports.formatDateMMddYYYY = formatDateMMddYYYY;
function formatDateYYYYmmDD(dateToFormat) {
    const year = dateToFormat.getFullYear();
    const month = (dateToFormat.getMonth() + 1).toString().padStart(2, '0');
    const day = (dateToFormat.getDate() + 1).toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}
exports.formatDateYYYYmmDD = formatDateYYYYmmDD;
function numberWithCommas(x) {
    if (x === undefined)
        return ""; // Handle undefined case
    return x.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
exports.numberWithCommas = numberWithCommas;
