import {faker} from "@faker-js/faker";

interface UserObj {
    _id: string;
    firstName: string;
    lastName: string;
    birthday: string;
    email: string;
    businessOrIndividual: string;
    company: string;
    phoneNumber: string;
    address: string;
}

export function createRandomUser(): UserObj {
    return {
        _id: faker.string.uuid(),
        firstName: faker.person.firstName("male"),
        lastName: faker.person.lastName("male"),
        birthday: faker.date.birthdate({min: 18, max: 70, mode: "age"}).toLocaleDateString(),
        email: faker.internet.email(),
        businessOrIndividual: faker.helpers.arrayElement(["Business", "Individual"]),
        company: faker.company.name(),
        phoneNumber: faker.phone.number(),
        address: faker.location.streetAddress(true),
    };
}
