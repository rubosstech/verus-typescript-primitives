"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttestationData = exports.friendlyNames = exports.AttestationDataType = exports.AttestationVdxfidMap = void 0;
const __1 = require("..");
const identitykeys = require("../identitydatakeys");
const keylist = require("../keys");
const bufferutils_1 = require("../../utils/bufferutils");
const createHash = require("create-hash");
const address_1 = require("../../utils/address");
const varuint_1 = require("../../utils/varuint");
const vdxf_1 = require("../../constants/vdxf");
const { BufferReader, BufferWriter } = bufferutils_1.default;
exports.AttestationVdxfidMap = {
    [identitykeys.IDENTITYDATA_FIRSTNAME.vdxfid]: { name: "First Name", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_LASTNAME.vdxfid]: { name: "Last Name", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_ATTESTOR.vdxfid]: { name: "Attestor ID", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_IDENTITY.vdxfid]: { name: "Identity", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_ID.vdxfid]: { name: "ID", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_USERID.vdxfid]: { name: "User ID", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_CREATEDAT.vdxfid]: { name: "Created at", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_COMPLETEDAT.vdxfid]: { name: "Completed at", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_PREVIOUSATTEMPTID.vdxfid]: { name: "Previous attempt ID", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_SHAREABLEURL.vdxfid]: { name: "Shareable URL", type: 4 /* AttestationClassTypes.URL */ },
    [identitykeys.IDENTITYDATA_TEMPLATEID.vdxfid]: { name: "Template ID", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_TEMPLATEVERSION.vdxfid]: { name: "Template Version", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_PHONENUMBER.vdxfid]: { name: "Phone Number", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_DATEOFBIRTH.vdxfid]: { name: "Date of Birth", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_OVER18.vdxfid]: { name: "Over 18", type: 7 /* AttestationClassTypes.BOOLEAN */ },
    [identitykeys.IDENTITYDATA_OVER21.vdxfid]: { name: "Over 21", type: 7 /* AttestationClassTypes.BOOLEAN */ },
    [identitykeys.IDENTITYDATA_OVER25.vdxfid]: { name: "Over 25", type: 7 /* AttestationClassTypes.BOOLEAN */ },
    [identitykeys.IDENTITYDATA_IPADDRESS.vdxfid]: { name: "IP Address", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_EMAIL.vdxfid]: { name: "Email Address", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_HOMEADDRESS.vdxfid]: { name: "Home address", type: 6 /* AttestationClassTypes.KEY_ONLY */ },
    [identitykeys.IDENTITYDATA_HOMEADDRESS_STREET1.vdxfid]: { name: "Street 1", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_HOMEADDRESS_STREET2.vdxfid]: { name: "Street 2", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_HOMEADDRESS_CITY.vdxfid]: { name: "City", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_HOMEADDRESS_REGION.vdxfid]: { name: "Region", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_HOMEADDRESS_POSTCODE.vdxfid]: { name: "Post Code", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_HOMEADDRESS_COUNTRY.vdxfid]: { name: "Country", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_IDNUMBER_VALUE.vdxfid]: { name: "ID Number", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_IDNUMBER_TYPE.vdxfid]: { name: "ID Type", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_STATUS.vdxfid]: { name: "Status", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_APPROVALS_ACCEPTEDTOS.vdxfid]: { name: "Accepted Terms and Conditions", type: 7 /* AttestationClassTypes.BOOLEAN */ },
    [identitykeys.IDENTITYDATA_APPROVALS_VERIFIEDSMS.vdxfid]: { name: "SMS Verified", type: 7 /* AttestationClassTypes.BOOLEAN */ },
    [identitykeys.IDENTITYDATA_APPROVALS_KYCCHECKED.vdxfid]: { name: "KYC Checked ok", type: 7 /* AttestationClassTypes.BOOLEAN */ },
    [identitykeys.IDENTITYDATA_APPROVALS_DOCUMENTSVERIFIED.vdxfid]: { name: "Documents Verified", type: 7 /* AttestationClassTypes.BOOLEAN */ },
    [identitykeys.IDENTITYDATA_APPROVALS_SELFIECHECKED.vdxfid]: { name: "Selfie Checked", type: 7 /* AttestationClassTypes.BOOLEAN */ },
    [identitykeys.IDENTITYDATA_APPROVALS_WATCHLIST_OK.vdxfid]: { name: "Watchlist ok", type: 7 /* AttestationClassTypes.BOOLEAN */ },
    [identitykeys.IDENTITYDATA_APPROVALS_RISKCHECKOK.vdxfid]: { name: "Riskcheck ok", type: 7 /* AttestationClassTypes.BOOLEAN */ },
    [identitykeys.IDENTITYDATA_DRIVINGLICENCE.vdxfid]: { name: "Driving Licence", type: 6 /* AttestationClassTypes.KEY_ONLY */ },
    [identitykeys.IDENTITYDATA_DRIVINGLICENCE_ORIGINAL_FRONT.vdxfid]: { name: "Driving Licence Front", type: 4 /* AttestationClassTypes.URL */ },
    [identitykeys.IDENTITYDATA_DRIVINGLICENCE_ORIGINAL_BACK.vdxfid]: { name: "Driving Licence Back", type: 4 /* AttestationClassTypes.URL */ },
    [identitykeys.IDENTITYDATA_DRIVINGLICENCE_CROPPED_FRONT.vdxfid]: { name: "Driving Licence Front", type: 4 /* AttestationClassTypes.URL */ },
    [identitykeys.IDENTITYDATA_DRIVINGLICENCE_CROPPED_BACK.vdxfid]: { name: "Driving Licence Back", type: 4 /* AttestationClassTypes.URL */ },
    [identitykeys.IDENTITYDATA_DRIVINGLICENCE_FACE.vdxfid]: { name: "Driving Licence Face", type: 4 /* AttestationClassTypes.URL */ },
    [identitykeys.IDENTITYDATA_DRIVINGLICENCE_IDNUMBER.vdxfid]: { name: "Driving Licence Number", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_DRIVINGLICENCE_CATEGORY.vdxfid]: { name: "Driving Licence Catagory", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_DRIVINGLICENCE_EXPIRATIONDATE.vdxfid]: { name: "Driving Licence expiry date", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_DRIVINGLICENCE_ISSUING_COUNTRY_MATCHED.vdxfid]: { name: "Driving Licence matches country", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_DRIVINGLICENCE_ISSUING_REGION.vdxfid]: { name: "Driving Licence issuing reigon", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_DRIVINGLICENCE_DATEOFBIRTH.vdxfid]: { name: "Driving Licence Date of Birth", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_DRIVINGLICENCE_ADDRESS.vdxfid]: { name: "Driving Licence Address", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_DRIVINGLICENCE_STREET1.vdxfid]: { name: "Driving Licence Street 1", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_DRIVINGLICENCE_CITY.vdxfid]: { name: "Driving Licence City", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_DRIVINGLICENCE_REGION.vdxfid]: { name: "Driving Licence Region", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_DRIVINGLICENCE_POSTCODE.vdxfid]: { name: "Driving Licence ZIP/Post Code", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_DRIVINGLICENCE_COUNTRY.vdxfid]: { name: "Driving Licence Country", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_DRIVINGLICENCE_MATCHED.vdxfid]: { name: "Driving Licence Matched all", type: 7 /* AttestationClassTypes.BOOLEAN */ },
    [identitykeys.IDENTITYDATA_DRIVINGLICENCE_NAME_MATCHED.vdxfid]: { name: "Driving Licence name matched", type: 7 /* AttestationClassTypes.BOOLEAN */ },
    [identitykeys.IDENTITYDATA_DRIVINGLICENCE_DATEOFBIRTH_MATCHED.vdxfid]: { name: "Driving Licence Date of Birth Matched", type: 7 /* AttestationClassTypes.BOOLEAN */ },
    [identitykeys.IDENTITYDATA_SELFIECHECK_SUCCESS.vdxfid]: { name: "Selfie Check success", type: 7 /* AttestationClassTypes.BOOLEAN */ },
    [identitykeys.IDENTITYDATA_SELFIECHECK_IMAGE.vdxfid]: { name: "Selfie Check image", type: 4 /* AttestationClassTypes.URL */ },
    [identitykeys.IDENTITYDATA_SELFIECHECK_VIDEO.vdxfid]: { name: "Selfie Check video", type: 4 /* AttestationClassTypes.URL */ },
    [identitykeys.IDENTITYDATA_SELFIECHECK_DRIVINGLICENCE_MATCH.vdxfid]: { name: "Selfie Driving Licence match", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_KYC_SUCCESS.vdxfid]: { name: "KYC Success", type: 7 /* AttestationClassTypes.BOOLEAN */ },
    [identitykeys.IDENTITYDATA_KYC_ADDRESS_MATCHED.vdxfid]: { name: "KYC Address Matched", type: 7 /* AttestationClassTypes.BOOLEAN */ },
    [identitykeys.IDENTITYDATA_KYC_TYPE.vdxfid]: { name: "KYC Type", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_KYC_NAME_MATCHED.vdxfid]: { name: "KYC Name Matched", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_KYC_DATEOFBIRTH_MATCHED.vdxfid]: { name: "KYC Date of Birth Matched", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_KYC_IDNUMBER_MATCHED.vdxfid]: { name: "KYC ID Matched", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_KYC_PHONENUMBER_MATCHED.vdxfid]: { name: "KYC Phone number matched", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_KYC_AREACODE_MATCHED.vdxfid]: { name: "KYC Areacode Matched", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_RISKCHECK_STATUS.vdxfid]: { name: "Risk Check Status", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_RISKCHECK_USERINTERACTIONS.vdxfid]: { name: "Risck Check User Interactions", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_RISKCHECK_FRAUDRINGOK.vdxfid]: { name: "Risk Check No Fraudring", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_RISKCHECK_BOTNOTDETECTED.vdxfid]: { name: "Risk Check bot free", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_EMAIL_ISDELIVERABLE.vdxfid]: { name: "Email address is deliverable", type: 7 /* AttestationClassTypes.BOOLEAN */ },
    [identitykeys.IDENTITYDATA_EMAIL_BREACHCOUNT.vdxfid]: { name: "Email breach count", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_EMAIL_FIRSTBREACHEDAT.vdxfid]: { name: "Email first breach date", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_EMAIL_LASTBREACHEDAT.vdxfid]: { name: "Email last breach date", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_EMAIL_DOMAIN_REGISTEREDAT.vdxfid]: { name: "Email domain registered at", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_EMAIL_DOMAIN_FREEPROVIDER.vdxfid]: { name: "Email is free provider", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_EMAIL_DOMAIN_CUSTOM.vdxfid]: { name: "Email Domain is custom", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_EMAIL_DOMAIN_DISPOSABLE.vdxfid]: { name: "Email Domain Disposable", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_EMAIL_DOMAIN_TOPLEVEL_SUSPICIOUS.vdxfid]: { name: "Email top level Domain Suspicious", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_IDCARD.vdxfid]: { name: "ID Card", type: 6 /* AttestationClassTypes.KEY_ONLY */ },
    [identitykeys.IDENTITYDATA_IDCARD_ORIGINAL_FRONT.vdxfid]: { name: "ID Card Front", type: 4 /* AttestationClassTypes.URL */ },
    [identitykeys.IDENTITYDATA_IDCARD_ORIGINAL_BACK.vdxfid]: { name: "ID Card Back", type: 4 /* AttestationClassTypes.URL */ },
    [identitykeys.IDENTITYDATA_IDCARD_CROPPED_FRONT.vdxfid]: { name: "ID Card Front", type: 4 /* AttestationClassTypes.URL */ },
    [identitykeys.IDENTITYDATA_IDCARD_CROPPED_BACK.vdxfid]: { name: "ID Card Back", type: 4 /* AttestationClassTypes.URL */ },
    [identitykeys.IDENTITYDATA_IDCARD_FACE.vdxfid]: { name: "ID Card Face", type: 4 /* AttestationClassTypes.URL */ },
    [identitykeys.IDENTITYDATA_IDCARD_IDNUMBER.vdxfid]: { name: "ID Card ID Number", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_IDCARD_CATEGORY.vdxfid]: { name: "ID Card Category", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_IDCARD_EXPIRATIONDATE.vdxfid]: { name: "ID Card Expiry date", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_IDCARD_ISSUING_COUNTRY_MATCHED.vdxfid]: { name: "ID Card Issuing Country Matched", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_IDCARD_ISSUING_REGION.vdxfid]: { name: "ID Card Issuing Region", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_IDCARD_DATEOFBIRTH.vdxfid]: { name: "ID Card Date of Birth", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_IDCARD_ADDRESS.vdxfid]: { name: "ID Card Address", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_IDCARD_ADDRESS_STREET1.vdxfid]: { name: "ID Card Street 1", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_IDCARD_ADDRESS_CITY.vdxfid]: { name: "ID Card City", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_IDCARD_ADDRESS_REGION.vdxfid]: { name: "ID Card Region", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_IDCARD_ADDRESS_POSTCODE.vdxfid]: { name: "ID Card Zip/Post Code", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_IDCARD_ADDRESS_COUNTRY.vdxfid]: { name: "ID Card Country", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_IDCARD_DOCUMENTVERIFICATION_MATCHED.vdxfid]: { name: "ID Card Matched", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_IDCARD_NAME_MATCHED.vdxfid]: { name: "ID Card Name Matched", type: 7 /* AttestationClassTypes.BOOLEAN */ },
    [identitykeys.IDENTITYDATA_IDCARD_DATEOFBIRTHMATCHED.vdxfid]: { name: "ID Card Date of Birth Matched", type: 7 /* AttestationClassTypes.BOOLEAN */ },
    [identitykeys.IDENTITYDATA_PASSPORT.vdxfid]: { name: "Passport", type: 6 /* AttestationClassTypes.KEY_ONLY */ },
    [identitykeys.IDENTITYDATA_PASSPORT_ORIGINAL_FRONT.vdxfid]: { name: "Passport front", type: 4 /* AttestationClassTypes.URL */ },
    [identitykeys.IDENTITYDATA_PASSPORT_ORIGINAL_BACK.vdxfid]: { name: "Passport back", type: 4 /* AttestationClassTypes.URL */ },
    [identitykeys.IDENTITYDATA_PASSPORT_CROPPED_FRONT.vdxfid]: { name: "Passport front", type: 4 /* AttestationClassTypes.URL */ },
    [identitykeys.IDENTITYDATA_PASSPORT_CROPPED_BACK.vdxfid]: { name: "Passport back", type: 4 /* AttestationClassTypes.URL */ },
    [identitykeys.IDENTITYDATA_PASSPORT_FACE.vdxfid]: { name: "Passport face", type: 4 /* AttestationClassTypes.URL */ },
    [identitykeys.IDENTITYDATA_PASSPORT_IDNUMBER.vdxfid]: { name: "Passport ID Number", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_PASSPORT_CATEGORY.vdxfid]: { name: "Passport Category", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_PASSPORT_EXPIRATIONDATE.vdxfid]: { name: "Passport expiry date", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_PASSPORT_ISSUING_COUNTRY_MATCHED.vdxfid]: { name: "Passport issuing country matched", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_PASSPORT_ISSUING_REGION.vdxfid]: { name: "Passport issuing region matched", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_PASSPORT_DATEOFBIRTH.vdxfid]: { name: "Passport date of birth", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_PASSPORT_ADDRESS.vdxfid]: { name: "Passport address", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_PASSPORT_ADDRESS_STREET1.vdxfid]: { name: "Passport street 1", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_PASSPORT_ADDRESS_CITY.vdxfid]: { name: "Passport city", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_PASSPORT_ADDRESS_REGION.vdxfid]: { name: "Passport region", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_PASSPORT_ADDRESS_POSTCODE.vdxfid]: { name: "Passport zip/post code", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_PASSPORT_ADDRESS_COUNTRY.vdxfid]: { name: "Passport country", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_PASSPORT_DOCUMENTVERIFICATION_MATCHED.vdxfid]: { name: "Passport matched", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_PASSPORT_NAME_MATCHED.vdxfid]: { name: "Passport Name Matched", type: 7 /* AttestationClassTypes.BOOLEAN */ },
    [identitykeys.IDENTITYDATA_PASSPORT_DATEOFBIRTHMATCHED.vdxfid]: { name: "Passport date of birth matched", type: 7 /* AttestationClassTypes.BOOLEAN */ },
    [identitykeys.IDENTITYDATA_RESIDENCEPERMIT.vdxfid]: { name: "Residence Permit", type: 6 /* AttestationClassTypes.KEY_ONLY */ },
    [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_ORIGINAL_FRONT.vdxfid]: { name: "Residence Permit front", type: 4 /* AttestationClassTypes.URL */ },
    [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_ORIGINAL_BACK.vdxfid]: { name: "Residence Permit back", type: 4 /* AttestationClassTypes.URL */ },
    [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_CROPPED_FRONT.vdxfid]: { name: "Residence Permit front", type: 4 /* AttestationClassTypes.URL */ },
    [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_CROPPED_BACK.vdxfid]: { name: "Residence Permit back", type: 4 /* AttestationClassTypes.URL */ },
    [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_FACE.vdxfid]: { name: "Residence Permit face", type: 4 /* AttestationClassTypes.URL */ },
    [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_IDNUMBER.vdxfid]: { name: "Residence Permit ID Number", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_CATEGORY.vdxfid]: { name: "Residence Permit category", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_EXPIRATIONDATE.vdxfid]: { name: "Residence Permit expiry date", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_ISSUING_COUNTRY_MATCHED.vdxfid]: { name: "Residence Permit issuing country matched", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_ISSUING_REGION.vdxfid]: { name: "Residence Permit issuing region matched", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_DATEOFBIRTH.vdxfid]: { name: "Residence Permit date of birth", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_ADDRESS.vdxfid]: { name: "Residence Permit Address", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_ADDRESS_STREET1.vdxfid]: { name: "Residence Permit Street 1", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_ADDRESS_CITY.vdxfid]: { name: "Residence Permit City", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_ADDRESS_REGION.vdxfid]: { name: "Residence Permit Region", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_ADDRESS_POSTCODE.vdxfid]: { name: "Residence Permit Zip/Post code", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_ADDRESS_COUNTRY.vdxfid]: { name: "Residence Permit Country", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_DOCUMENTVERIFICATION_MATCHED.vdxfid]: { name: "Residence Permit Matched", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_NAME_MATCHED.vdxfid]: { name: "Residence Permit name matched", type: 7 /* AttestationClassTypes.BOOLEAN */ },
    [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_DATEOFBIRTHMATCHED.vdxfid]: { name: "Residence Permit date of birth matched", type: 7 /* AttestationClassTypes.BOOLEAN */ },
    [identitykeys.IDENTITYDATA_RESIDENTCARD.vdxfid]: { name: "Resident Card", type: 6 /* AttestationClassTypes.KEY_ONLY */ },
    [identitykeys.IDENTITYDATA_RESIDENTCARD_ORIGINAL_FRONT.vdxfid]: { name: "Resident Card Front", type: 4 /* AttestationClassTypes.URL */ },
    [identitykeys.IDENTITYDATA_RESIDENTCARD_ORIGINAL_BACK.vdxfid]: { name: "Resident Card Back", type: 4 /* AttestationClassTypes.URL */ },
    [identitykeys.IDENTITYDATA_RESIDENTCARD_CROPPED_FRONT.vdxfid]: { name: "Resident Card Front", type: 4 /* AttestationClassTypes.URL */ },
    [identitykeys.IDENTITYDATA_RESIDENTCARD_CROPPED_BACK.vdxfid]: { name: "Resident Card Back", type: 4 /* AttestationClassTypes.URL */ },
    [identitykeys.IDENTITYDATA_RESIDENTCARD_FACE.vdxfid]: { name: "Resident Card Face", type: 4 /* AttestationClassTypes.URL */ },
    [identitykeys.IDENTITYDATA_RESIDENTCARD_IDNUMBER.vdxfid]: { name: "Resident Card ID Number", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_RESIDENTCARD_CATEGORY.vdxfid]: { name: "Resident Card Category", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_RESIDENTCARD_EXPIRATIONDATE.vdxfid]: { name: "Resident Card Expiry Date", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_RESIDENTCARD_ISSUING_COUNTRY_MATCHED.vdxfid]: { name: "Resident Card Issuing Country Matched", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_RESIDENTCARD_ISSUING_REGION.vdxfid]: { name: "Resident Card Issuing Region", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_RESIDENTCARD_DATEOFBIRTH.vdxfid]: { name: "Resident Card date of birth", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_RESIDENTCARD_ADDRESS.vdxfid]: { name: "Resident Card address", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_RESIDENTCARD_ADDRESS_STREET1.vdxfid]: { name: "Resident Card Street 1", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_RESIDENTCARD_ADDRESS_CITY.vdxfid]: { name: "Resident Card City", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_RESIDENTCARD_ADDRESS_REGION.vdxfid]: { name: "Resident Card Region", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_RESIDENTCARD_ADDRESS_POSTCODE.vdxfid]: { name: "Resident Card Zip/Post Code", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_RESIDENTCARD_ADDRESS_COUNTRY.vdxfid]: { name: "Resident Card Country", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_RESIDENTCARD_DOCUMENTVERIFICATION_MATCHED.vdxfid]: { name: "Resident Card Matched", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_RESIDENTCARD_NAME_MATCHED.vdxfid]: { name: "Resident Card Name Matched", type: 7 /* AttestationClassTypes.BOOLEAN */ },
    [identitykeys.IDENTITYDATA_RESIDENTCARD_DATEOFBIRTHMATCHED.vdxfid]: { name: "Resident Card date of birth Matched", type: 7 /* AttestationClassTypes.BOOLEAN */ },
    [identitykeys.IDENTITYDATA_VISA.vdxfid]: { name: "Visa", type: 6 /* AttestationClassTypes.KEY_ONLY */ },
    [identitykeys.IDENTITYDATA_VISA_ORIGINAL_FRONT.vdxfid]: { name: "Visa front", type: 4 /* AttestationClassTypes.URL */ },
    [identitykeys.IDENTITYDATA_VISA_ORIGINAL_BACK.vdxfid]: { name: "Visa back", type: 4 /* AttestationClassTypes.URL */ },
    [identitykeys.IDENTITYDATA_VISA_CROPPED_FRONT.vdxfid]: { name: "Visa front", type: 4 /* AttestationClassTypes.URL */ },
    [identitykeys.IDENTITYDATA_VISA_CROPPED_BACK.vdxfid]: { name: "Visa back", type: 4 /* AttestationClassTypes.URL */ },
    [identitykeys.IDENTITYDATA_VISA_FACE.vdxfid]: { name: "Visa face", type: 4 /* AttestationClassTypes.URL */ },
    [identitykeys.IDENTITYDATA_VISA_IDNUMBER.vdxfid]: { name: "Visa ID Number", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_VISA_CATEGORY.vdxfid]: { name: "Visa Category", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_VISA_EXPIRATIONDATE.vdxfid]: { name: "Visa expiry date", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_VISA_ISSUING_COUNTRY_MATCHED.vdxfid]: { name: "Visa issuing country matched", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_VISA_ISSUING_REGION.vdxfid]: { name: "Visa issuing region", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_VISA_DATEOFBIRTH.vdxfid]: { name: "Visa date of birth", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_VISA_ADDRESS.vdxfid]: { name: "Visa address", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_VISA_ADDRESS_STREET1.vdxfid]: { name: "Visa Street 1", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_VISA_ADDRESS_CITY.vdxfid]: { name: "Visa City", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_VISA_ADDRESS_REGION.vdxfid]: { name: "Visa Region", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_VISA_ADDRESS_POSTCODE.vdxfid]: { name: "Visa Zip/Post Code", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_VISA_ADDRESS_COUNTRY.vdxfid]: { name: "Visa Country", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_VISA_DOCUMENTVERIFICATION_MATCHED.vdxfid]: { name: "Visa document matched", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_VISA_NAME_MATCHED.vdxfid]: { name: "Visa name matched", type: 7 /* AttestationClassTypes.BOOLEAN */ },
    [identitykeys.IDENTITYDATA_VISA_DATEOFBIRTHMATCHED.vdxfid]: { name: "Visa date of birth matched", type: 7 /* AttestationClassTypes.BOOLEAN */ },
    [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_ORIGINALFRONT.vdxfid]: { name: "Original Front", type: 4 /* AttestationClassTypes.URL */ },
    [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_ORIGINALBACK.vdxfid]: { name: "Original Back", type: 4 /* AttestationClassTypes.URL */ },
    [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_CROPPEDFRONT.vdxfid]: { name: "Cropped Front", type: 4 /* AttestationClassTypes.URL */ },
    [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_CROPPEDBACK.vdxfid]: { name: "Cropped Back", type: 4 /* AttestationClassTypes.URL */ },
    [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_FACE.vdxfid]: { name: "Face", type: 4 /* AttestationClassTypes.URL */ },
    [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_IDNUMBER.vdxfid]: { name: "ID Number", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_CATEGORY.vdxfid]: { name: "Category", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_EXPIRATIONDATE.vdxfid]: { name: "Expiry Date", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_ISSUINGCOUNTRY.vdxfid]: { name: "Issuing Country", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_ISSUING_REGION.vdxfid]: { name: "Issuing Region", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_DATEOFBIRTH.vdxfid]: { name: "Date of Birth", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_ADDRESS.vdxfid]: { name: "Address", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_ADDRESS_STREET1.vdxfid]: { name: "Street 1", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_ADDRESS_STREET2.vdxfid]: { name: "Street 2", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_ADDRESS_CITY.vdxfid]: { name: "City", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_ADDRESS_REGION.vdxfid]: { name: "Region", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_ADDRESS_POSTCODE.vdxfid]: { name: "Zip/Postal Code", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_ADDRESS_COUNTRY.vdxfid]: { name: "Country", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
    [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_MATCHED.vdxfid]: { name: "Document Matched", type: 7 /* AttestationClassTypes.BOOLEAN */ },
    [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_NAME_MATCHED.vdxfid]: { name: "Name Matched", type: 7 /* AttestationClassTypes.BOOLEAN */ },
    [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_DATEOFBIRTHMATCHED.vdxfid]: { name: "Date of Birth Matched", type: 7 /* AttestationClassTypes.BOOLEAN */ },
    [keylist.ATTESTATION_TYPE.vdxfid]: { name: "Attestation Type", type: 1 /* AttestationClassTypes.BUFFER_DATA_STRING */ },
};
class AttestationDataType {
    constructor(data, vdxfkey, salt) {
        this.salt = Buffer.alloc(0);
        this.getDataItem(vdxfkey, data);
        if (salt) {
            this.salt = Buffer.from(salt, "hex");
        }
    }
    getDataItem(vdxfkey, data) {
        switch (vdxfkey && exports.AttestationVdxfidMap[vdxfkey].type || null) {
            case 1 /* AttestationClassTypes.BUFFER_DATA_STRING */:
                this.dataItem = new __1.Utf8DataVdxfObject(data, vdxfkey);
                break;
            case 2 /* AttestationClassTypes.BUFFER_DATA_BYTES */:
                this.dataItem = new __1.HexDataVdxfObject(data, vdxfkey);
                break;
            case 3 /* AttestationClassTypes.BUFFER_DATA_BASE64 */:
                this.dataItem = new __1.BufferDataVdxfObject(data, vdxfkey, "base64");
                break;
            case 4 /* AttestationClassTypes.URL */:
                this.dataItem = new __1.BufferDataVdxfObject(data, vdxfkey, "utf8");
                break;
            case 5 /* AttestationClassTypes.PNG_IMAGE */:
                this.dataItem = new __1.PNGImageVdxfObject(data, vdxfkey);
                break;
            case 6 /* AttestationClassTypes.KEY_ONLY */:
                this.dataItem = new __1.VDXFObject(vdxfkey);
                break;
            case 7 /* AttestationClassTypes.BOOLEAN */:
                this.dataItem = new __1.HexDataVdxfObject(data, vdxfkey);
                break;
            default:
                this.dataItem = new __1.HexDataVdxfObject(data, vdxfkey);
                break;
        }
    }
    dataBytelength() {
        let length = 0;
        length += this.dataItem.byteLength();
        length += varuint_1.default.encodingLength(this.salt.length);
        length += this.salt.length;
        return length;
    }
    toBuffer() {
        const buffer = Buffer.alloc(this.dataBytelength());
        const writer = new bufferutils_1.default.BufferWriter(buffer);
        writer.writeSlice(this.dataItem.toBuffer());
        writer.writeVarSlice(this.salt);
        return writer.buffer;
    }
    fromDataBuffer(buffer, offset = 0, vdxfkey) {
        const reader = new bufferutils_1.default.BufferReader(buffer, offset);
        reader.offset = this.dataItem.fromBuffer(reader.buffer, reader.offset, vdxfkey);
        this.salt = reader.readVarSlice();
        return reader.offset;
    }
}
exports.AttestationDataType = AttestationDataType;
const friendlyNames = (vdfxkey) => {
    if (vdfxkey in exports.AttestationVdxfidMap) {
        return exports.AttestationVdxfidMap[vdfxkey].name;
    }
    else {
        throw new Error("Unknown VDXF key");
    }
};
exports.friendlyNames = friendlyNames;
class AttestationData {
    constructor(components = new Map()) {
        this.components = components;
    }
    dataByteLength() {
        let byteLength = 0;
        byteLength += varuint_1.default.encodingLength(this.components.size);
        for (const [key, item] of this.components) {
            byteLength += varuint_1.default.encodingLength(key);
            byteLength += item.dataBytelength();
        }
        return byteLength;
    }
    toDataBuffer() {
        const bufferWriter = new BufferWriter(Buffer.alloc(this.dataByteLength()));
        bufferWriter.writeCompactSize(this.components.size);
        for (const [key, item] of this.components) {
            bufferWriter.writeCompactSize(key);
            bufferWriter.writeSlice(item.toBuffer());
        }
        return bufferWriter.buffer;
    }
    fromDataBuffer(buffer, offset) {
        const reader = new bufferutils_1.default.BufferReader(buffer, offset);
        const componentsLength = reader.readCompactSize();
        this.components = new Map();
        for (var i = 0; i < componentsLength; i++) {
            const key = reader.readCompactSize();
            const vdxfid = (0, address_1.toBase58Check)(reader.readSlice(20), vdxf_1.I_ADDR_VERSION);
            const attestationData = new AttestationDataType(null, vdxfid);
            reader.offset = attestationData.fromDataBuffer(reader.buffer, reader.offset, vdxfid);
            this.components.set(key, attestationData);
        }
        return reader.offset;
    }
    size() {
        return this.components.size;
    }
    setDataFromJson(data, getSalt) {
        if (!this.components) {
            this.components = new Map();
        }
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if (!(item.salt instanceof Buffer) || item.salt.length !== 32) {
                if (typeof getSalt === "function") {
                    item.salt = getSalt();
                }
                else {
                    throw new Error("Salt is required to be a 32 random byte Buffer");
                }
            }
            try {
                (0, address_1.fromBase58Check)(item.dataItem.vdxfkey);
            }
            catch (e) {
                throw new Error("Attestation Key is required to be base58 format");
            }
            this.components.set(i, item);
        }
    }
    getHash(key) {
        let value;
        value = this.components.get(key).toBuffer();
        return createHash("sha256").update(value).digest();
    }
}
exports.AttestationData = AttestationData;
