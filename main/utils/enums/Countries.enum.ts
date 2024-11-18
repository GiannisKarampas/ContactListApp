import {Region} from "@enums/Region.enum";
import {allure} from "allure-playwright";
import {RegistrationSystem} from "./RegistrationSystem.enum";

/**
 * The available countries for each Region
 */
export const Country = {
    //EMEA countries
    BAHRAIN: {
        name: "BAHRAIN",
        code: "048",
        region: Region.EMEA,
        countryCode: "BH",
        regSystem: RegistrationSystem.GENIUS
    },
    BERMUDA: {
        name: "BERMUDA",
        code: "060",
        region: Region.EMEA,
        countryCode: "BM",
        regSystem: RegistrationSystem.GENIUS
    },
    CZECH_REPUBLIC: {
        name: "CZECH REPUBLIC",
        code: "203",
        region: Region.EMEA,
        countryCode: "CZ",
        regSystem: RegistrationSystem.GENIUS
    },
    DENMARK: {
        name: "DENMARK",
        code: "208",
        region: Region.EMEA,
        countryCode: "DK",
        regSystem: RegistrationSystem.GENIUS
    },
    FRANCE: {name: "FRANCE", code: "250", region: Region.EMEA, countryCode: "FR", regSystem: RegistrationSystem.GENIUS},
    GERMANY: {
        name: "GERMANY",
        code: "276",
        region: Region.EMEA,
        countryCode: "DE",
        regSystem: RegistrationSystem.GENIUS
    },
    ITALY: {name: "ITALY", code: "380", region: Region.EMEA, countryCode: "IT", regSystem: RegistrationSystem.GENIUS},
    NETHERLANDS: {
        name: "NETHERLANDS",
        code: "528",
        region: Region.EMEA,
        countryCode: "NL",
        regSystem: RegistrationSystem.GENIUS
    },
    NORWAY: {name: "NORWAY", code: "578", region: Region.EMEA, countryCode: "NO", regSystem: RegistrationSystem.GENIUS},
    PAKISTAN: {
        name: "PAKISTAN",
        code: "586",
        region: Region.EMEA,
        countryCode: "PK",
        regSystem: RegistrationSystem.GENIUS
    },
    POLAND: {name: "POLAND", code: "616", region: Region.EMEA, countryCode: "PL", regSystem: RegistrationSystem.GENIUS},
    PORTUGAL: {
        name: "PORTUGAL",
        code: "616",
        region: Region.EMEA,
        countryCode: "PT",
        regSystem: RegistrationSystem.GENIUS
    },
    RUSSIA: {
        name: "RUSSIA (RUSSIAN FEDERATION)",
        code: "643",
        region: Region.EMEA,
        countryCode: "RU",
        regSystem: RegistrationSystem.GENIUS
    },
    SOUTH_AFRICA: {
        name: "SOUTH AFRICA",
        code: "710",
        region: Region.EMEA,
        countryCode: "ZA",
        regSystem: RegistrationSystem.GENIUS
    },
    SPAIN: {name: "SPAIN", code: "724", region: Region.EMEA, countryCode: "ES", regSystem: RegistrationSystem.GENIUS},
    SWEDEN: {name: "SWEDEN", code: "752", region: Region.EMEA, countryCode: "SE", regSystem: RegistrationSystem.GENIUS},
    SWITZERLAND: {
        name: "SWITZERLAND",
        code: "756",
        region: Region.EMEA,
        countryCode: "CH",
        regSystem: RegistrationSystem.GENIUS
    },
    TURKEY: {name: "TURKEY", code: "792", region: Region.EMEA, countryCode: "TR", regSystem: RegistrationSystem.GENIUS},
    EGYPT: {name: "EGYPT", code: "818", region: Region.EMEA, countryCode: "EG", regSystem: RegistrationSystem.GENIUS},
    UNITED_KINGDOM: {
        name: "UNITED KINGDOM",
        code: "826",
        region: Region.EMEA,
        countryCode: "GB",
        regSystem: RegistrationSystem.GENIUS
    },
    AUSTRIA: {
        name: "AUSTRIA",
        code: "040",
        region: Region.EMEA,
        countryCode: "AT",
        regSystem: RegistrationSystem.GENIUS
    },
    BELGIUM: {
        name: "BELGIUM",
        code: "056",
        region: Region.EMEA,
        countryCode: "BE",
        regSystem: RegistrationSystem.GENIUS
    },
    FINLAND: {
        name: "FINLAND",
        code: "246",
        region: Region.EMEA,
        countryCode: "FI",
        regSystem: RegistrationSystem.GENIUS
    },
    HUNGARY: {
        name: "HUNGARY",
        code: "348",
        region: Region.EMEA,
        countryCode: "HU",
        regSystem: RegistrationSystem.GENIUS
    },
    IRELAND: {
        name: "IRELAND",
        code: "372",
        region: Region.EMEA,
        countryCode: "IE",
        regSystem: RegistrationSystem.GENIUS
    },
    SWITZERLAND_TEMPEST: {
        name: "SWITZERLAND TEMPEST RE",
        code: "979",
        region: Region.EMEA,
        countryCode: "CH",
        regSystem: RegistrationSystem.GENIUS
    },
    COMBINED: {
        name: "COMBINED",
        code: "978",
        region: Region.EMEA,
        countryCode: "",
        regSystem: RegistrationSystem.GENIUS
    },
    GLOBAL_TREATY: {
        name: "GLOBAL TREATY",
        code: "980",
        region: Region.EMEA,
        countryCode: "",
        regSystem: RegistrationSystem.GENIUS
    },

    //APAC countries
    AUSTRALIA: {
        name: "AUSTRALIA",
        code: "036",
        region: Region.APAC,
        countryCode: "AU",
        regSystem: RegistrationSystem.MERIDIAN
    },
    TAIWAN: {
        name: "TAIWAN",
        code: "158",
        region: Region.APAC,
        countryCode: "TW",
        regSystem: RegistrationSystem.MERIDIAN
    },
    HONG_KONG: {
        name: "HONG KONG",
        code: "344",
        region: Region.APAC,
        countryCode: "HK",
        regSystem: RegistrationSystem.MERIDIAN
    },
    MALAYSIA: {
        name: "MALAYSIA",
        code: "458",
        region: Region.APAC,
        countryCode: "MY",
        regSystem: RegistrationSystem.MERIDIAN
    },
    PHILIPPINES: {
        name: "Philippines",
        code: "608",
        region: Region.APAC,
        countryCode: "PH",
        regSystem: RegistrationSystem.MERIDIAN
    },
    SINGAPORE: {
        name: "SINGAPORE",
        code: "702",
        region: Region.APAC,
        countryCode: "SG",
        regSystem: RegistrationSystem.MERIDIAN
    },
    VIETNAM: {
        name: "VIETNAM",
        code: "704",
        region: Region.APAC,
        countryCode: "VN",
        regSystem: RegistrationSystem.MERIDIAN
    },
    THAILAND: {
        name: "THAILAND",
        code: "764",
        region: Region.APAC,
        countryCode: "TH",
        regSystem: RegistrationSystem.MERIDIAN
    },
    INDONESIA: {
        name: "INDONESIA",
        code: "360",
        region: Region.APAC,
        countryCode: "ID",
        regSystem: RegistrationSystem.MERIDIAN
    },
    NEW_ZEALAND: {
        name: "NEW ZEALAND",
        code: "554",
        region: Region.APAC,
        countryCode: "NZ",
        regSystem: RegistrationSystem.GENIUS
    },

    //LATAM countries
    ARGENTINA: {
        name: "ARGENTINA",
        code: "032",
        region: Region.LATAM,
        countryCode: "AR",
        regSystem: RegistrationSystem.SIS
    },
    PERU: {name: "PERU", code: "604", region: Region.LATAM, countryCode: "PE", regSystem: RegistrationSystem.SIS},
    BRAZIL: {name: "BRAZIL", code: "076", region: Region.LATAM, countryCode: "BR", regSystem: RegistrationSystem.SIS},
    CHILE: {name: "CHILE", code: "152", region: Region.LATAM, countryCode: "CL", regSystem: RegistrationSystem.SIS},
    COLOMBIA: {
        name: "COLOMBIA",
        code: "170",
        region: Region.LATAM,
        countryCode: "CO",
        regSystem: RegistrationSystem.SIS
    },
    MEXICO: {name: "MEXICO", code: "484", region: Region.LATAM, countryCode: "MX", regSystem: RegistrationSystem.SIS},
    PANAMA: {name: "PANAMA", code: "591", region: Region.LATAM, countryCode: "PA", regSystem: RegistrationSystem.SIS},
    ECUADOR_LIFE: {
        name: "ECUADOR LIFE",
        code: "964",
        region: Region.LATAM,
        countryCode: "EC",
        regSystem: RegistrationSystem.SIS
    },
    PUERTO_RICO: {
        name: "PUERTO RICO",
        code: "630",
        region: Region.LATAM,
        countryCode: "PR",
        regSystem: RegistrationSystem.MERIDIAN
    },
    CHILE_LIFE: {
        name: "CHILE LIFE",
        code: "965",
        region: Region.LATAM,
        countryCode: "CL",
        regSystem: RegistrationSystem.SIS
    },
    ARGENTINA_REINSURANCE: {
        name: "ARGENTINA REINSURANCE",
        code: "975",
        region: Region.LATAM,
        countryCode: "AR",
        regSystem: RegistrationSystem.SIS
    },
    ECUADOR: {name: "ECUADOR", code: "218", region: Region.LATAM, countryCode: "EC", regSystem: RegistrationSystem.SIS},
    BRASIL_RESSEGURO: {
        name: "BRASIL RESSEGURO",
        code: "977",
        region: Region.LATAM,
        countryCode: "BR",
        regSystem: RegistrationSystem.SIS
    },
    /**
     * Returns the name of the specified country
     * @param selectedCountry
     * @returns
     */
    async getCountryName(selectedCountry: typeof Country) {
        return selectedCountry.name;
    },

    /**
     * Returns the country code of the specified country.
     * @param selectedCountry
     * @returns
     */
    async getCountryCode(selectedCountry: typeof Country) {
        return selectedCountry.code;
    },

    /**
     * Returns the region that the specified country belongs to.
     * @param selectedCountry
     * @returns
     */
    async getCountryRegion(selectedCountry: typeof Country) {
        return selectedCountry.region;
    },

    /**
     * Returns the 2 digit country code that the specified country belongs to.
     * @param selectedCountry
     * @returns
     */
    async get2DigitCountryCode(selectedCountry: typeof Country) {
        return selectedCountry.countryCode;
    }
};

export enum EMEA_Countries {
    BAHRAIN = Country.BAHRAIN.code,
    BERMUDA = Country.BERMUDA.code,
    CZECH_REPUBLIC = Country.CZECH_REPUBLIC.code,
    DENMARK = Country.DENMARK.code,
    FRANCE = Country.FRANCE.code,
    GERMANY = Country.GERMANY.code,
    ITALY = Country.ITALY.code,
    NETHERLANDS = Country.NETHERLANDS.code,
    NORWAY = Country.NORWAY.code,
    PAKISTAN = Country.PAKISTAN.code,
    POLAND = Country.POLAND.code,
    PORTUGAL = Country.PORTUGAL.code,
    RUSSIA = Country.RUSSIA.code,
    SOUTH_AFRICA = Country.SOUTH_AFRICA.code,
    SPAIN = Country.SPAIN.code,
    SWEDEN = Country.SWEDEN.code,
    SWITZERLAND = Country.SWITZERLAND.code,
    TURKEY = Country.TURKEY.code,
    EGYPT = Country.EGYPT.code,
    UNITED_KINGDOM = Country.UNITED_KINGDOM.code,
    AUSTRIA = Country.AUSTRIA.code,
    BELGIUM = Country.BELGIUM.code,
    FINLAND = Country.FINLAND.code,
    HUNGARY = Country.HUNGARY.code,
    IRELAND = Country.IRELAND.code,
    SWITZERLAND_TEMPEST = Country.SWITZERLAND_TEMPEST.code,
    COMBINED = Country.COMBINED.code,
    GLOBAL_TREATY = Country.GLOBAL_TREATY.code,
}

/**
 * The available APAC region countries
 */
export enum APAC_Countries {
    AUSTRALIA = Country.AUSTRALIA.code,
    TAIWAN = Country.TAIWAN.code,
    HONG_KONG = Country.HONG_KONG.code,
    MALAYSIA = Country.MALAYSIA.code,
    PHILIPPINES = Country.PHILIPPINES.code,
    SINGAPORE = Country.SINGAPORE.code,
    VIETNAM = Country.VIETNAM.code,
    THAILAND = Country.THAILAND.code,
    INDONESIA = Country.INDONESIA.code,
    NEW_ZEALAND = Country.NEW_ZEALAND.code,
}

/**
 * The available LATAM region countries
 */
export enum LATAM_Countries {
    ARGENTINA = Country.ARGENTINA.code,
    PERU = Country.PERU.code,
    BRAZIL = Country.BRAZIL.code,
    CHILE = Country.CHILE.code,
    COLOMBIA = Country.COLOMBIA.code,
    MEXICO = Country.MEXICO.code,
    PANAMA = Country.PANAMA.code,
    ECUADOR_LIFE = Country.ECUADOR_LIFE.code,
    PUERTO_RICO = Country.PUERTO_RICO.code,
    CHILE_LIFE = Country.CHILE_LIFE.code,
    ARGENTINA_REINSURANCE = Country.ARGENTINA_REINSURANCE.code,
    ECUADOR = Country.ECUADOR.code,
    BRASIL_RESSEGURO = Country.BRASIL_RESSEGURO.code,
}

/**
 * Changes the country to the specified APAC country if the current region is APAC.
 * If the current region is not APAC or the country is null, it returns the relative country code.
 *
 * @param {APAC_Countries} country - The APAC country to change to.
 * @return {string} The string representation of the country or the relative country code.
 */
function changeCountryApac(country: APAC_Countries): string {
    const region = process.env.REGION;
    if (region !== Region.APAC || country == null) {
        return selectRelativeCountryCode();
    }
    allure.parameter("country", country.toString());
    return country.toString();
}

/**
 * Changes the country to the specified EMEA country if the current region is EMEA.
 * If the current region is not EMEA or the country is null, it returns the relative country code.
 *
 * @param {EMEA_Countries} country - The EMEA country to change to.
 * @return {string} The string representation of the country or the relative country code.
 */
function changeCountryEmea(country: EMEA_Countries): string {
    const region = process.env.REGION;
    if (region !== Region.EMEA || country == null) {
        return selectRelativeCountryCode();
    }
    allure.parameter("country", country.toString());
    return country.toString();
}

/**
 * Changes the country to the specified LATAM country if the current region is LATAM.
 * If the current region is not LATAM or the country is null, it returns the relative country code.
 *
 * @param {LATAM_Countries} country - The LATAM country to change to.
 * @return {string} The string representation of the country or the relative country code.
 */
function changeCountryLatam(country: LATAM_Countries): string {
    const region = process.env.REGION;
    if (region !== Region.LATAM || country == null) {
        return selectRelativeCountryCode();
    }
    allure.parameter("country", country.toString());
    return country.toString();
}

/**
 * Changes the country based on the current region.
 *
 * @param {EMEA_Countries | null} emeaCountry - The EMEA country to change to.
 * @param {APAC_Countries | null} apacCountry - The APAC country to change to.
 * @param {LATAM_Countries | null} latamCountry - The LATAM country to change to.
 * @return {string} The string representation of the country or the relative country code.
 */
export function changeCountry(emeaCountry: EMEA_Countries | null, apacCountry: APAC_Countries | null, latamCountry: LATAM_Countries | null): string {
    const region = process.env.REGION;
    switch (region) {
        case Region.APAC:
            return apacCountry.toString() ? changeCountryApac(apacCountry) : selectRelativeCountryCode();
        case Region.EMEA:
            return emeaCountry.toString() ? changeCountryEmea(emeaCountry) : selectRelativeCountryCode();
        case Region.LATAM:
            return latamCountry.toString() ? changeCountryLatam(latamCountry) : selectRelativeCountryCode();
    }
    return selectRelativeCountryCode();
}

/**
 * Selects the relative country code based on the current region.
 *
 * @return {string} The string representation of the country code.
 */
export function selectRelativeCountryCode(): string {
    let countryCodeNumber: string = Country[process.env.DEFAULT_COUNTRY as typeof Country].code || EMEA_Countries.UNITED_KINGDOM.toString();
    const region = process.env.REGION;
    switch (region) {
        case Region.APAC:
            countryCodeNumber = Country[process.env.DEFAULT_COUNTRY as typeof Country].code || APAC_Countries.AUSTRALIA.toString();
            break;
        case Region.EMEA:
            countryCodeNumber = Country[process.env.DEFAULT_COUNTRY as typeof Country].code || EMEA_Countries.UNITED_KINGDOM.toString();
            break;
        case Region.LATAM:
            countryCodeNumber = Country[process.env.DEFAULT_COUNTRY as typeof Country].code || LATAM_Countries.MEXICO.toString();
            break;
    }
    return countryCodeNumber;
}
