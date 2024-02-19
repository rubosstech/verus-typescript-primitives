import {
  Utf8DataVdxfObject,
  HexDataVdxfObject,
  BufferDataVdxfObject,
  PNGImageVdxfObject,
  VDXFObject
} from "..";
import * as identitykeys from '../identityDataKeys';
import * as keylist from '../keys';
import bufferutils from '../../utils/bufferutils';
import createHash = require("create-hash");
import { fromBase58Check, toBase58Check } from '../../utils/address';
import varuint from '../../utils/varuint'
import { I_ADDR_VERSION, HASH160_BYTE_LENGTH } from '../../constants/vdxf';
const { BufferReader, BufferWriter } = bufferutils;

export const enum AttestationClassTypes {
  BUFFER_DATA_STRING = 1,
  BUFFER_DATA_BYTES = 2,
  BUFFER_DATA_BASE64 = 3,
  URL = 4,
  PNG_IMAGE = 5,
  KEY_ONLY = 6,
  BOOLEAN = 7,
}

export const AttestationVdxfidMap = {
  [identitykeys.IDENTITYDATA_FIRSTNAME.vdxfid]: { name: "First Name", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_LASTNAME.vdxfid]: { name: "Last Name", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_ATTESTOR.vdxfid]: { name: "Attestor ID", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDENTITY.vdxfid]: { name: "Identity", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_ID.vdxfid]: { name: "ID", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_USERID.vdxfid]: { name: "User ID", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_CREATEDAT.vdxfid]: { name: "Created at", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_COMPLETEDAT.vdxfid]: { name: "Completed at", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_PREVIOUSATTEMPTID.vdxfid]: { name: "Previous attempt ID", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_SHAREABLEURL.vdxfid]: { name: "Shareable URL", type: AttestationClassTypes.URL },
  [identitykeys.IDENTITYDATA_TEMPLATEID.vdxfid]: { name: "Template ID", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_TEMPLATEVERSION.vdxfid]: { name: "Template Version", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_PHONENUMBER.vdxfid]: { name: "Phone Number", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DATEOFBIRTH.vdxfid]: { name: "Date of Birth", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_OVER18.vdxfid]: { name: "Over 18", type: AttestationClassTypes.BOOLEAN },
  [identitykeys.IDENTITYDATA_OVER21.vdxfid]: { name: "Over 21", type: AttestationClassTypes.BOOLEAN },
  [identitykeys.IDENTITYDATA_OVER25.vdxfid]: { name: "Over 25", type: AttestationClassTypes.BOOLEAN },
  [identitykeys.IDENTITYDATA_IPADDRESS.vdxfid]: { name: "IP Address", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_EMAIL.vdxfid]: { name: "Email Address", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_HOMEADDRESS.vdxfid]: { name: "Home address", type: AttestationClassTypes.KEY_ONLY },
  [identitykeys.IDENTITYDATA_HOMEADDRESS_STREET1.vdxfid]: { name: "Street 1", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_HOMEADDRESS_STREET2.vdxfid]: { name: "Street 2", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_HOMEADDRESS_CITY.vdxfid]: { name: "City", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_HOMEADDRESS_REGION.vdxfid]: { name: "Region", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_HOMEADDRESS_POSTCODE.vdxfid]: { name: "Post Code", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_HOMEADDRESS_COUNTRY.vdxfid]: { name: "Country", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDNUMBER_VALUE.vdxfid]: { name: "ID Number", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDNUMBER_TYPE.vdxfid]: { name: "ID Type", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_STATUS.vdxfid]: { name: "Status", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_APPROVALS_ACCEPTEDTOS.vdxfid]: { name: "Accepted Terms and Conditions", type: AttestationClassTypes.BOOLEAN },
  [identitykeys.IDENTITYDATA_APPROVALS_VERIFIEDSMS.vdxfid]: { name: "SMS Verified", type: AttestationClassTypes.BOOLEAN },
  [identitykeys.IDENTITYDATA_APPROVALS_KYCCHECKED.vdxfid]: { name: "KYC Checked ok", type: AttestationClassTypes.BOOLEAN },
  [identitykeys.IDENTITYDATA_APPROVALS_DOCUMENTSVERIFIED.vdxfid]: { name: "Documents Verified", type: AttestationClassTypes.BOOLEAN },
  [identitykeys.IDENTITYDATA_APPROVALS_SELFIECHECKED.vdxfid]: { name: "Selfie Checked", type: AttestationClassTypes.BOOLEAN },
  [identitykeys.IDENTITYDATA_APPROVALS_WATCHLIST_OK.vdxfid]: { name: "Watchlist ok", type: AttestationClassTypes.BOOLEAN },
  [identitykeys.IDENTITYDATA_APPROVALS_RISKCHECKOK.vdxfid]: { name: "Riskcheck ok", type: AttestationClassTypes.BOOLEAN },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE.vdxfid]: { name: "Driving Licence", type: AttestationClassTypes.KEY_ONLY },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_ORIGINAL_FRONT.vdxfid]: { name: "Driving Licence Front", type: AttestationClassTypes.URL },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_ORIGINAL_BACK.vdxfid]: { name: "Driving Licence Back", type: AttestationClassTypes.URL },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_CROPPED_FRONT.vdxfid]: { name: "Driving Licence Front", type: AttestationClassTypes.URL },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_CROPPED_BACK.vdxfid]: { name: "Driving Licence Back", type: AttestationClassTypes.URL },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_FACE.vdxfid]: { name: "Driving Licence Face", type: AttestationClassTypes.URL },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_IDNUMBER.vdxfid]: { name: "Driving Licence Number", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_CATEGORY.vdxfid]: { name: "Driving Licence Catagory", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_EXPIRATIONDATE.vdxfid]: { name: "Driving Licence expiry date", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_ISSUING_COUNTRY_MATCHED.vdxfid]: { name: "Driving Licence matches country", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_ISSUING_REGION.vdxfid]: { name: "Driving Licence issuing reigon", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_DATEOFBIRTH.vdxfid]: { name: "Driving Licence Date of Birth", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_ADDRESS.vdxfid]: { name: "Driving Licence Address", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_STREET1.vdxfid]: { name: "Driving Licence Street 1", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_CITY.vdxfid]: { name: "Driving Licence City", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_REGION.vdxfid]: { name: "Driving Licence Region", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_POSTCODE.vdxfid]: { name: "Driving Licence ZIP/Post Code", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_COUNTRY.vdxfid]: { name: "Driving Licence Country", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_MATCHED.vdxfid]: { name: "Driving Licence Matched all", type: AttestationClassTypes.BOOLEAN },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_NAME_MATCHED.vdxfid]: { name: "Driving Licence name matched", type: AttestationClassTypes.BOOLEAN },
  [identitykeys.IDENTITYDATA_DRIVINGLICENCE_DATEOFBIRTH_MATCHED.vdxfid]: { name: "Driving Licence Date of Birth Matched", type: AttestationClassTypes.BOOLEAN },
  [identitykeys.IDENTITYDATA_SELFIECHECK_SUCCESS.vdxfid]: { name: "Selfie Check success", type: AttestationClassTypes.BOOLEAN },
  [identitykeys.IDENTITYDATA_SELFIECHECK_IMAGE.vdxfid]: { name: "Selfie Check image", type: AttestationClassTypes.URL },
  [identitykeys.IDENTITYDATA_SELFIECHECK_VIDEO.vdxfid]: { name: "Selfie Check video", type: AttestationClassTypes.URL },
  [identitykeys.IDENTITYDATA_SELFIECHECK_DRIVINGLICENCE_MATCH.vdxfid]: { name: "Selfie Driving Licence match", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_KYC_SUCCESS.vdxfid]: { name: "KYC Success", type: AttestationClassTypes.BOOLEAN },
  [identitykeys.IDENTITYDATA_KYC_ADDRESS_MATCHED.vdxfid]: { name: "KYC Address Matched", type: AttestationClassTypes.BOOLEAN },
  [identitykeys.IDENTITYDATA_KYC_TYPE.vdxfid]: { name: "KYC Type", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_KYC_NAME_MATCHED.vdxfid]: { name: "KYC Name Matched", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_KYC_DATEOFBIRTH_MATCHED.vdxfid]: { name: "KYC Date of Birth Matched", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_KYC_IDNUMBER_MATCHED.vdxfid]: { name: "KYC ID Matched", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_KYC_PHONENUMBER_MATCHED.vdxfid]: { name: "KYC Phone number matched", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_KYC_AREACODE_MATCHED.vdxfid]: { name: "KYC Areacode Matched", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RISKCHECK_STATUS.vdxfid]: { name: "Risk Check Status", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RISKCHECK_USERINTERACTIONS.vdxfid]: { name: "Risck Check User Interactions", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RISKCHECK_FRAUDRINGOK.vdxfid]: { name: "Risk Check No Fraudring", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RISKCHECK_BOTNOTDETECTED.vdxfid]: { name: "Risk Check bot free", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_EMAIL_ISDELIVERABLE.vdxfid]: { name: "Email address is deliverable", type: AttestationClassTypes.BOOLEAN },
  [identitykeys.IDENTITYDATA_EMAIL_BREACHCOUNT.vdxfid]: { name: "Email breach count", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_EMAIL_FIRSTBREACHEDAT.vdxfid]: { name: "Email first breach date", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_EMAIL_LASTBREACHEDAT.vdxfid]: { name: "Email last breach date", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_EMAIL_DOMAIN_REGISTEREDAT.vdxfid]: { name: "Email domain registered at", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_EMAIL_DOMAIN_FREEPROVIDER.vdxfid]: { name: "Email is free provider", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_EMAIL_DOMAIN_CUSTOM.vdxfid]: { name: "Email Domain is custom", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_EMAIL_DOMAIN_DISPOSABLE.vdxfid]: { name: "Email Domain Disposable", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_EMAIL_DOMAIN_TOPLEVEL_SUSPICIOUS.vdxfid]: { name: "Email top level Domain Suspicious", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDCARD.vdxfid]: { name: "ID Card", type: AttestationClassTypes.KEY_ONLY },
  [identitykeys.IDENTITYDATA_IDCARD_ORIGINAL_FRONT.vdxfid]: { name: "ID Card Front", type: AttestationClassTypes.URL },
  [identitykeys.IDENTITYDATA_IDCARD_ORIGINAL_BACK.vdxfid]: { name: "ID Card Back", type: AttestationClassTypes.URL },
  [identitykeys.IDENTITYDATA_IDCARD_CROPPED_FRONT.vdxfid]: { name: "ID Card Front", type: AttestationClassTypes.URL },
  [identitykeys.IDENTITYDATA_IDCARD_CROPPED_BACK.vdxfid]: { name: "ID Card Back", type: AttestationClassTypes.URL },
  [identitykeys.IDENTITYDATA_IDCARD_FACE.vdxfid]: { name: "ID Card Face", type: AttestationClassTypes.URL },
  [identitykeys.IDENTITYDATA_IDCARD_IDNUMBER.vdxfid]: { name: "ID Card ID Number", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDCARD_CATEGORY.vdxfid]: { name: "ID Card Category", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDCARD_EXPIRATIONDATE.vdxfid]: { name: "ID Card Expiry date", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDCARD_ISSUING_COUNTRY_MATCHED.vdxfid]: { name: "ID Card Issuing Country Matched", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDCARD_ISSUING_REGION.vdxfid]: { name: "ID Card Issuing Region", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDCARD_DATEOFBIRTH.vdxfid]: { name: "ID Card Date of Birth", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDCARD_ADDRESS.vdxfid]: { name: "ID Card Address", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDCARD_ADDRESS_STREET1.vdxfid]: { name: "ID Card Street 1", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDCARD_ADDRESS_CITY.vdxfid]: { name: "ID Card City", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDCARD_ADDRESS_REGION.vdxfid]: { name: "ID Card Region", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDCARD_ADDRESS_POSTCODE.vdxfid]: { name: "ID Card Zip/Post Code", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDCARD_ADDRESS_COUNTRY.vdxfid]: { name: "ID Card Country", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDCARD_DOCUMENTVERIFICATION_MATCHED.vdxfid]: { name: "ID Card Matched", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_IDCARD_NAME_MATCHED.vdxfid]: { name: "ID Card Name Matched", type: AttestationClassTypes.BOOLEAN },
  [identitykeys.IDENTITYDATA_IDCARD_DATEOFBIRTHMATCHED.vdxfid]: { name: "ID Card Date of Birth Matched", type: AttestationClassTypes.BOOLEAN },
  [identitykeys.IDENTITYDATA_PASSPORT.vdxfid]: { name: "Passport", type: AttestationClassTypes.KEY_ONLY },
  [identitykeys.IDENTITYDATA_PASSPORT_ORIGINAL_FRONT.vdxfid]: { name: "Passport front", type: AttestationClassTypes.URL },
  [identitykeys.IDENTITYDATA_PASSPORT_ORIGINAL_BACK.vdxfid]: { name: "Passport back", type: AttestationClassTypes.URL },
  [identitykeys.IDENTITYDATA_PASSPORT_CROPPED_FRONT.vdxfid]: { name: "Passport front", type: AttestationClassTypes.URL },
  [identitykeys.IDENTITYDATA_PASSPORT_CROPPED_BACK.vdxfid]: { name: "Passport back", type: AttestationClassTypes.URL },
  [identitykeys.IDENTITYDATA_PASSPORT_FACE.vdxfid]: { name: "Passport face", type: AttestationClassTypes.URL },
  [identitykeys.IDENTITYDATA_PASSPORT_IDNUMBER.vdxfid]: { name: "Passport ID Number", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_PASSPORT_CATEGORY.vdxfid]: { name: "Passport Category", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_PASSPORT_EXPIRATIONDATE.vdxfid]: { name: "Passport expiry date", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_PASSPORT_ISSUING_COUNTRY_MATCHED.vdxfid]: { name: "Passport issuing country matched", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_PASSPORT_ISSUING_REGION.vdxfid]: { name: "Passport issuing region matched", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_PASSPORT_DATEOFBIRTH.vdxfid]: { name: "Passport date of birth", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_PASSPORT_ADDRESS.vdxfid]: { name: "Passport address", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_PASSPORT_ADDRESS_STREET1.vdxfid]: { name: "Passport street 1", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_PASSPORT_ADDRESS_CITY.vdxfid]: { name: "Passport city", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_PASSPORT_ADDRESS_REGION.vdxfid]: { name: "Passport region", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_PASSPORT_ADDRESS_POSTCODE.vdxfid]: { name: "Passport zip/post code", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_PASSPORT_ADDRESS_COUNTRY.vdxfid]: { name: "Passport country", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_PASSPORT_DOCUMENTVERIFICATION_MATCHED.vdxfid]: { name: "Passport matched", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_PASSPORT_NAME_MATCHED.vdxfid]: { name: "Passport Name Matched", type: AttestationClassTypes.BOOLEAN },
  [identitykeys.IDENTITYDATA_PASSPORT_DATEOFBIRTHMATCHED.vdxfid]: { name: "Passport date of birth matched", type: AttestationClassTypes.BOOLEAN },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT.vdxfid]: { name: "Residence Permit", type: AttestationClassTypes.KEY_ONLY },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_ORIGINAL_FRONT.vdxfid]: { name: "Residence Permit front", type: AttestationClassTypes.URL },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_ORIGINAL_BACK.vdxfid]: { name: "Residence Permit back", type: AttestationClassTypes.URL },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_CROPPED_FRONT.vdxfid]: { name: "Residence Permit front", type: AttestationClassTypes.URL },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_CROPPED_BACK.vdxfid]: { name: "Residence Permit back", type: AttestationClassTypes.URL },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_FACE.vdxfid]: { name: "Residence Permit face", type: AttestationClassTypes.URL },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_IDNUMBER.vdxfid]: { name: "Residence Permit ID Number", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_CATEGORY.vdxfid]: { name: "Residence Permit category", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_EXPIRATIONDATE.vdxfid]: { name: "Residence Permit expiry date", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_ISSUING_COUNTRY_MATCHED.vdxfid]: { name: "Residence Permit issuing country matched", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_ISSUING_REGION.vdxfid]: { name: "Residence Permit issuing region matched", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_DATEOFBIRTH.vdxfid]: { name: "Residence Permit date of birth", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_ADDRESS.vdxfid]: { name: "Residence Permit Address", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_ADDRESS_STREET1.vdxfid]: { name: "Residence Permit Street 1", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_ADDRESS_CITY.vdxfid]: { name: "Residence Permit City", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_ADDRESS_REGION.vdxfid]: { name: "Residence Permit Region", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_ADDRESS_POSTCODE.vdxfid]: { name: "Residence Permit Zip/Post code", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_ADDRESS_COUNTRY.vdxfid]: { name: "Residence Permit Country", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_DOCUMENTVERIFICATION_MATCHED.vdxfid]: { name: "Residence Permit Matched", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_NAME_MATCHED.vdxfid]: { name: "Residence Permit name matched", type: AttestationClassTypes.BOOLEAN },
  [identitykeys.IDENTITYDATA_RESIDENCEPERMIT_DATEOFBIRTHMATCHED.vdxfid]: { name: "Residence Permit date of birth matched", type: AttestationClassTypes.BOOLEAN },
  [identitykeys.IDENTITYDATA_RESIDENTCARD.vdxfid]: { name: "Resident Card", type: AttestationClassTypes.KEY_ONLY },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_ORIGINAL_FRONT.vdxfid]: { name: "Resident Card Front", type: AttestationClassTypes.URL },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_ORIGINAL_BACK.vdxfid]: { name: "Resident Card Back", type: AttestationClassTypes.URL },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_CROPPED_FRONT.vdxfid]: { name: "Resident Card Front", type: AttestationClassTypes.URL },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_CROPPED_BACK.vdxfid]: { name: "Resident Card Back", type: AttestationClassTypes.URL },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_FACE.vdxfid]: { name: "Resident Card Face", type: AttestationClassTypes.URL },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_IDNUMBER.vdxfid]: { name: "Resident Card ID Number", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_CATEGORY.vdxfid]: { name: "Resident Card Category", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_EXPIRATIONDATE.vdxfid]: { name: "Resident Card Expiry Date", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_ISSUING_COUNTRY_MATCHED.vdxfid]: { name: "Resident Card Issuing Country Matched", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_ISSUING_REGION.vdxfid]: { name: "Resident Card Issuing Region", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_DATEOFBIRTH.vdxfid]: { name: "Resident Card date of birth", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_ADDRESS.vdxfid]: { name: "Resident Card address", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_ADDRESS_STREET1.vdxfid]: { name: "Resident Card Street 1", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_ADDRESS_CITY.vdxfid]: { name: "Resident Card City", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_ADDRESS_REGION.vdxfid]: { name: "Resident Card Region", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_ADDRESS_POSTCODE.vdxfid]: { name: "Resident Card Zip/Post Code", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_ADDRESS_COUNTRY.vdxfid]: { name: "Resident Card Country", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_DOCUMENTVERIFICATION_MATCHED.vdxfid]: { name: "Resident Card Matched", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_NAME_MATCHED.vdxfid]: { name: "Resident Card Name Matched", type: AttestationClassTypes.BOOLEAN },
  [identitykeys.IDENTITYDATA_RESIDENTCARD_DATEOFBIRTHMATCHED.vdxfid]: { name: "Resident Card date of birth Matched", type: AttestationClassTypes.BOOLEAN },
  [identitykeys.IDENTITYDATA_VISA.vdxfid]: { name: "Visa", type: AttestationClassTypes.KEY_ONLY },
  [identitykeys.IDENTITYDATA_VISA_ORIGINAL_FRONT.vdxfid]: { name: "Visa front", type: AttestationClassTypes.URL },
  [identitykeys.IDENTITYDATA_VISA_ORIGINAL_BACK.vdxfid]: { name: "Visa back", type: AttestationClassTypes.URL },
  [identitykeys.IDENTITYDATA_VISA_CROPPED_FRONT.vdxfid]: { name: "Visa front", type: AttestationClassTypes.URL },
  [identitykeys.IDENTITYDATA_VISA_CROPPED_BACK.vdxfid]: { name: "Visa back", type: AttestationClassTypes.URL },
  [identitykeys.IDENTITYDATA_VISA_FACE.vdxfid]: { name: "Visa face", type: AttestationClassTypes.URL },
  [identitykeys.IDENTITYDATA_VISA_IDNUMBER.vdxfid]: { name: "Visa ID Number", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_VISA_CATEGORY.vdxfid]: { name: "Visa Category", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_VISA_EXPIRATIONDATE.vdxfid]: { name: "Visa expiry date", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_VISA_ISSUING_COUNTRY_MATCHED.vdxfid]: { name: "Visa issuing country matched", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_VISA_ISSUING_REGION.vdxfid]: { name: "Visa issuing region", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_VISA_DATEOFBIRTH.vdxfid]: { name: "Visa date of birth", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_VISA_ADDRESS.vdxfid]: { name: "Visa address", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_VISA_ADDRESS_STREET1.vdxfid]: { name: "Visa Street 1", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_VISA_ADDRESS_CITY.vdxfid]: { name: "Visa City", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_VISA_ADDRESS_REGION.vdxfid]: { name: "Visa Region", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_VISA_ADDRESS_POSTCODE.vdxfid]: { name: "Visa Zip/Post Code", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_VISA_ADDRESS_COUNTRY.vdxfid]: { name: "Visa Country", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_VISA_DOCUMENTVERIFICATION_MATCHED.vdxfid]: { name: "Visa document matched", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_VISA_NAME_MATCHED.vdxfid]: { name: "Visa name matched", type: AttestationClassTypes.BOOLEAN },
  [identitykeys.IDENTITYDATA_VISA_DATEOFBIRTHMATCHED.vdxfid]: { name: "Visa date of birth matched", type: AttestationClassTypes.BOOLEAN },
  [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_ORIGINALFRONT.vdxfid]: { name: "Original Front", type: AttestationClassTypes.URL },
  [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_ORIGINALBACK.vdxfid]: { name: "Original Back", type: AttestationClassTypes.URL },
  [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_CROPPEDFRONT.vdxfid]: { name: "Cropped Front", type: AttestationClassTypes.URL },
  [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_CROPPEDBACK.vdxfid]: { name: "Cropped Back", type: AttestationClassTypes.URL },
  [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_FACE.vdxfid]: { name: "Face", type: AttestationClassTypes.URL },
  [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_IDNUMBER.vdxfid]: { name: "ID Number", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_CATEGORY.vdxfid]: { name: "Category", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_EXPIRATIONDATE.vdxfid]: { name: "Expiry Date", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_ISSUINGCOUNTRY.vdxfid]: { name: "Issuing Country", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_ISSUING_REGION.vdxfid]: { name: "Issuing Region", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_DATEOFBIRTH.vdxfid]: { name: "Date of Birth", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_ADDRESS.vdxfid]: { name: "Address", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_ADDRESS_STREET1.vdxfid]: { name: "Street 1", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_ADDRESS_STREET2.vdxfid]: { name: "Street 2", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_ADDRESS_CITY.vdxfid]: { name: "City", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_ADDRESS_REGION.vdxfid]: { name: "Region", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_ADDRESS_POSTCODE.vdxfid]: { name: "Zip/Postal Code", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_ADDRESS_COUNTRY.vdxfid]: { name: "Country", type: AttestationClassTypes.BUFFER_DATA_STRING },
  [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_MATCHED.vdxfid]: { name: "Document Matched", type: AttestationClassTypes.BOOLEAN },
  [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_NAME_MATCHED.vdxfid]: { name: "Name Matched", type: AttestationClassTypes.BOOLEAN },
  [identitykeys.IDENTITYDATA_DOCUMENTVERIFICATION_DATEOFBIRTHMATCHED.vdxfid]: { name: "Date of Birth Matched", type: AttestationClassTypes.BOOLEAN },
  [keylist.ATTESTATION_TYPE.vdxfid]: { name: "Attestation Type", type: AttestationClassTypes.BUFFER_DATA_STRING },
};

export class AttestationDataType {

  dataItem: Utf8DataVdxfObject | HexDataVdxfObject | BufferDataVdxfObject | PNGImageVdxfObject | VDXFObject;
  salt: Buffer = Buffer.alloc(0);

  constructor(data?: any, vdxfkey?: string, salt?: string) {

    this.getDataItem(vdxfkey, data);

    if (salt) {
      this.salt = Buffer.from(salt, "hex");
    }
  }

  getDataItem(vdxfkey, data): any {
    switch (vdxfkey && AttestationVdxfidMap[vdxfkey].type || null) {
      case AttestationClassTypes.BUFFER_DATA_STRING:
        this.dataItem = new Utf8DataVdxfObject(data, vdxfkey);
        break;
      case AttestationClassTypes.BUFFER_DATA_BYTES:
        this.dataItem = new HexDataVdxfObject(data, vdxfkey);
        break;
      case AttestationClassTypes.BUFFER_DATA_BASE64:
        this.dataItem = new BufferDataVdxfObject(data, vdxfkey, "base64");
        break;
      case AttestationClassTypes.URL:
        this.dataItem = new BufferDataVdxfObject(data, vdxfkey, "utf8");
        break;
      case AttestationClassTypes.PNG_IMAGE:
        this.dataItem = new PNGImageVdxfObject(data, vdxfkey);
        break;
      case AttestationClassTypes.KEY_ONLY:
        this.dataItem = new VDXFObject(vdxfkey);
        break;
      case AttestationClassTypes.BOOLEAN: 
        this.dataItem = new HexDataVdxfObject(data, vdxfkey);
        break;
      default:
        this.dataItem = new HexDataVdxfObject(data, vdxfkey);
        break;
    }
  }

  dataBytelength(): number {

    let length = 0;

    length += this.dataItem.byteLength();
    length += varuint.encodingLength(this.salt.length);
    length += this.salt.length;

    return length;
  }

  toBuffer(): Buffer {

    const buffer = Buffer.alloc(this.dataBytelength());
    const writer = new bufferutils.BufferWriter(buffer);
    writer.writeSlice(this.dataItem.toBuffer());
    writer.writeVarSlice(this.salt);

    return writer.buffer;
  }

  fromDataBuffer(buffer: Buffer, offset = 0, vdxfkey?: string): number {

    const reader = new bufferutils.BufferReader(buffer, offset);
    reader.offset = this.dataItem.fromBuffer(reader.buffer, reader.offset, vdxfkey);
    this.salt = reader.readVarSlice();

    return reader.offset;
  }
}

export const friendlyNames = (vdfxkey) => {

  if (vdfxkey in AttestationVdxfidMap) {

    return AttestationVdxfidMap[vdfxkey].name;

  } else {
    throw new Error("Unknown VDXF key");
  }
}

export class AttestationData {

  components: Map<number, AttestationDataType>;
  constructor(components: Map<number, AttestationDataType> = new Map()) {
    this.components = components;
  }

  dataByteLength(): number {
    let byteLength = 0;
    byteLength += varuint.encodingLength(this.components.size)

    for (const [key, item] of this.components) {
      byteLength += varuint.encodingLength(key);
      byteLength += item.dataBytelength();
    }

    return byteLength;
  }

  toDataBuffer(): Buffer {
    const bufferWriter = new BufferWriter(Buffer.alloc(this.dataByteLength()));

    bufferWriter.writeCompactSize(this.components.size);

    for (const [key, item] of this.components) {
      bufferWriter.writeCompactSize(key);
      bufferWriter.writeSlice(item.toBuffer());
    }

    return bufferWriter.buffer;
  }

  fromDataBuffer(buffer: Buffer, offset?: number): number {

    const reader = new bufferutils.BufferReader(buffer, offset);
    const componentsLength = reader.readCompactSize();
    this.components = new Map();

    for (var i = 0; i < componentsLength; i++) {
      const key = reader.readCompactSize();
      const vdxfid = toBase58Check(reader.readSlice(20), I_ADDR_VERSION);
      const attestationData = new AttestationDataType(null, vdxfid);
      reader.offset = attestationData.fromDataBuffer(reader.buffer, reader.offset, vdxfid);

      this.components.set(key, attestationData);
    }

    return reader.offset;
  }

  size(): number {
    return this.components.size;
  }

  setDataFromJson(data: Array<AttestationDataType>, getSalt: Function) {

    if (!this.components) {
      this.components = new Map();
    }

    for (let i = 0; i < data.length; i++) {

      const item = data[i];

      if (!(item.salt instanceof Buffer) || item.salt.length !== 32) {
        if (typeof getSalt === "function") {
          item.salt = getSalt();
        } else {
          throw new Error("Salt is required to be a 32 random byte Buffer");
        }
      }

      try {
        fromBase58Check(item.dataItem.vdxfkey)
      } catch (e) {
        throw new Error("Attestation Key is required to be base58 format");
      }

      this.components.set(i, item);
    }

  }

  getHash(key): Buffer {

    let value: Buffer;

    value = this.components.get(key).toBuffer();

    return createHash("sha256").update(value).digest();
  }

}