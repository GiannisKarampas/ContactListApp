export interface ContactObj {
    firstName: String,
    lastName: String,
    birthdate: String,
    email: String,
    street1: String,
    city: String,
    stateProvince: String,
    postalCode: String,
    country: String
}

export function createContact(username, userLastName, userBirthday, userEmail, userAddress, userCity, userState, userPostalCode, userCountry): ContactObj{
    return {
        firstName: username,
        lastName: userLastName,
        birthdate: userBirthday,
        email: userEmail,
        street1: userAddress,
        city: userCity,
        stateProvince: userState,
        postalCode: userPostalCode,
        country: userCountry
    }
}