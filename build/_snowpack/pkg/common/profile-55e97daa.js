import { e as extractProfile, s as signProfileToken } from './profileTokens-673e20ae.js';
import { d as dist } from './index-b8e17bd2.js';
import { s as schemaInspector } from './index-9c645bf7.js';
import { c as createFetchFn } from './fetch-31299d03.js';
import { L as Logger } from './keys-10ec8e4e.js';

function formatAccount(serviceName, data) {
    let proofUrl;
    if (data.proof && data.proof.url) {
        proofUrl = data.proof.url;
    }
    return {
        '@type': 'Account',
        service: serviceName,
        identifier: data.username,
        proofType: 'http',
        proofUrl,
    };
}
function getPersonFromLegacyFormat(profile) {
    const profileData = {
        '@type': 'Person',
    };
    if (profile) {
        if (profile.name && profile.name.formatted) {
            profileData.name = profile.name.formatted;
        }
        if (profile.bio) {
            profileData.description = profile.bio;
        }
        if (profile.location && profile.location.formatted) {
            profileData.address = {
                '@type': 'PostalAddress',
                addressLocality: profile.location.formatted,
            };
        }
        const images = [];
        if (profile.avatar && profile.avatar.url) {
            images.push({
                '@type': 'ImageObject',
                name: 'avatar',
                contentUrl: profile.avatar.url,
            });
        }
        if (profile.cover && profile.cover.url) {
            images.push({
                '@type': 'ImageObject',
                name: 'cover',
                contentUrl: profile.cover.url,
            });
        }
        if (images.length) {
            profileData.image = images;
        }
        if (profile.website) {
            profileData.website = [
                {
                    '@type': 'WebSite',
                    url: profile.website,
                },
            ];
        }
        const accounts = [];
        if (profile.bitcoin && profile.bitcoin.address) {
            accounts.push({
                '@type': 'Account',
                role: 'payment',
                service: 'bitcoin',
                identifier: profile.bitcoin.address,
            });
        }
        if (profile.twitter && profile.twitter.username) {
            accounts.push(formatAccount('twitter', profile.twitter));
        }
        if (profile.facebook && profile.facebook.username) {
            accounts.push(formatAccount('facebook', profile.facebook));
        }
        if (profile.github && profile.github.username) {
            accounts.push(formatAccount('github', profile.github));
        }
        if (profile.auth) {
            if (profile.auth.length > 0) {
                if (profile.auth[0] && profile.auth[0].publicKeychain) {
                    accounts.push({
                        '@type': 'Account',
                        role: 'key',
                        service: 'bip32',
                        identifier: profile.auth[0].publicKeychain,
                    });
                }
            }
        }
        if (profile.pgp && profile.pgp.url) {
            accounts.push({
                '@type': 'Account',
                role: 'key',
                service: 'pgp',
                identifier: profile.pgp.fingerprint,
                contentUrl: profile.pgp.url,
            });
        }
        profileData.account = accounts;
    }
    return profileData;
}

function getName(profile) {
    if (!profile) {
        return null;
    }
    let name = null;
    if (profile.name) {
        name = profile.name;
    }
    else if (profile.givenName || profile.familyName) {
        name = '';
        if (profile.givenName) {
            name = profile.givenName;
        }
        if (profile.familyName) {
            name += ` ${profile.familyName}`;
        }
    }
    return name;
}
function getGivenName(profile) {
    if (!profile) {
        return null;
    }
    let givenName = null;
    if (profile.givenName) {
        givenName = profile.givenName;
    }
    else if (profile.name) {
        const nameParts = profile.name.split(' ');
        givenName = nameParts.slice(0, -1).join(' ');
    }
    return givenName;
}
function getFamilyName(profile) {
    if (!profile) {
        return null;
    }
    let familyName = null;
    if (profile.familyName) {
        familyName = profile.familyName;
    }
    else if (profile.name) {
        const nameParts = profile.name.split(' ');
        familyName = nameParts.pop();
    }
    return familyName;
}
function getDescription(profile) {
    if (!profile) {
        return null;
    }
    let description = null;
    if (profile.description) {
        description = profile.description;
    }
    return description;
}
function getAvatarUrl(profile) {
    if (!profile) {
        return null;
    }
    let avatarContentUrl = null;
    if (profile.image) {
        profile.image.map((image) => {
            if (image.name === 'avatar') {
                avatarContentUrl = image.contentUrl;
                return avatarContentUrl;
            }
            else {
                return null;
            }
        });
    }
    return avatarContentUrl;
}
function getVerifiedAccounts(profile, verifications) {
    if (!profile) {
        return null;
    }
    const filteredAccounts = [];
    if (profile.hasOwnProperty('account') && verifications) {
        profile.account.map((account) => {
            let accountIsValid = false;
            let proofUrl = null;
            verifications.map(verification => {
                if (verification.hasOwnProperty('proof_url')) {
                    verification.proofUrl = verification.proof_url;
                }
                if (verification.valid &&
                    verification.service === account.service &&
                    verification.identifier === account.identifier &&
                    verification.proofUrl) {
                    accountIsValid = true;
                    proofUrl = verification.proofUrl;
                    return true;
                }
                else {
                    return false;
                }
            });
            if (accountIsValid) {
                account.proofUrl = proofUrl;
                filteredAccounts.push(account);
                return account;
            }
            else {
                return null;
            }
        });
    }
    return filteredAccounts;
}
function getOrganizations(profile) {
    if (!profile) {
        return null;
    }
    const organizations = [];
    if (profile.hasOwnProperty('worksFor')) {
        return profile.worksFor;
    }
    return organizations;
}
function getConnections(profile) {
    if (!profile) {
        return null;
    }
    let connections = [];
    if (profile.hasOwnProperty('knows')) {
        connections = profile.knows;
    }
    return connections;
}
function getAddress(profile) {
    if (!profile) {
        return null;
    }
    let addressString = null;
    if (profile.hasOwnProperty('address')) {
        const addressParts = [];
        if (profile.address.hasOwnProperty('streetAddress')) {
            addressParts.push(profile.address.streetAddress);
        }
        if (profile.address.hasOwnProperty('addressLocality')) {
            addressParts.push(profile.address.addressLocality);
        }
        if (profile.address.hasOwnProperty('postalCode')) {
            addressParts.push(profile.address.postalCode);
        }
        if (profile.address.hasOwnProperty('addressCountry')) {
            addressParts.push(profile.address.addressCountry);
        }
        if (addressParts.length) {
            addressString = addressParts.join(', ');
        }
    }
    return addressString;
}
function getBirthDate(profile) {
    if (!profile) {
        return null;
    }
    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    let birthDateString = null;
    if (profile.hasOwnProperty('birthDate')) {
        const date = new Date(profile.birthDate);
        birthDateString = `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }
    return birthDateString;
}

const schemaDefinition = {
    type: 'object',
    properties: {
        '@context': { type: 'string', optional: true },
        '@type': { type: 'string' },
    },
};
class Profile {
    constructor(profile = {}) {
        this._profile = Object.assign({}, {
            '@context': 'http://schema.org/',
        }, profile);
    }
    toJSON() {
        return Object.assign({}, this._profile);
    }
    toToken(privateKey) {
        return signProfileToken(this.toJSON(), privateKey);
    }
    static validateSchema(profile, strict = false) {
        schemaDefinition.strict = strict;
        return schemaInspector.validate(schemaDefinition, profile);
    }
    static fromToken(token, publicKeyOrAddress = null) {
        const profile = extractProfile(token, publicKeyOrAddress);
        return new Profile(profile);
    }
    static makeZoneFile(domainName, tokenFileURL) {
        return makeProfileZoneFile(domainName, tokenFileURL);
    }
}
class Person extends Profile {
    constructor(profile = { '@type': 'Person' }) {
        super(profile);
        this._profile = Object.assign({}, {
            '@type': 'Person',
        }, this._profile);
    }
    static validateSchema(profile, strict = false) {
        return schemaInspector.validate(schemaDefinition, profile);
    }
    static fromToken(token, publicKeyOrAddress = null) {
        const profile = extractProfile(token, publicKeyOrAddress);
        return new Person(profile);
    }
    static fromLegacyFormat(legacyProfile) {
        const profile = getPersonFromLegacyFormat(legacyProfile);
        return new Person(profile);
    }
    toJSON() {
        return {
            profile: this.profile(),
            name: this.name(),
            givenName: this.givenName(),
            familyName: this.familyName(),
            description: this.description(),
            avatarUrl: this.avatarUrl(),
            verifiedAccounts: this.verifiedAccounts(),
            address: this.address(),
            birthDate: this.birthDate(),
            connections: this.connections(),
            organizations: this.organizations(),
        };
    }
    profile() {
        return Object.assign({}, this._profile);
    }
    name() {
        return getName(this.profile());
    }
    givenName() {
        return getGivenName(this.profile());
    }
    familyName() {
        return getFamilyName(this.profile());
    }
    description() {
        return getDescription(this.profile());
    }
    avatarUrl() {
        return getAvatarUrl(this.profile());
    }
    verifiedAccounts(verifications) {
        return getVerifiedAccounts(this.profile(), verifications);
    }
    address() {
        return getAddress(this.profile());
    }
    birthDate() {
        return getBirthDate(this.profile());
    }
    connections() {
        return getConnections(this.profile());
    }
    organizations() {
        return getOrganizations(this.profile());
    }
}
function makeProfileZoneFile(origin, tokenFileUrl) {
    if (!tokenFileUrl.includes('://')) {
        throw new Error('Invalid token file url');
    }
    const urlScheme = tokenFileUrl.split('://')[0];
    const urlParts = tokenFileUrl.split('://')[1].split('/');
    const domain = urlParts[0];
    const pathname = `/${urlParts.slice(1).join('/')}`;
    const zoneFile = {
        $origin: origin,
        $ttl: 3600,
        uri: [
            {
                name: '_http._tcp',
                priority: 10,
                weight: 1,
                target: `${urlScheme}://${domain}${pathname}`,
            },
        ],
    };
    const zoneFileTemplate = '{$origin}\n{$ttl}\n{uri}\n';
    return dist.makeZoneFile(zoneFile, zoneFileTemplate);
}
function getTokenFileUrl(zoneFileJson) {
    if (!zoneFileJson.hasOwnProperty('uri')) {
        return null;
    }
    if (!Array.isArray(zoneFileJson.uri)) {
        return null;
    }
    if (zoneFileJson.uri.length < 1) {
        return null;
    }
    const validRecords = zoneFileJson.uri.filter((record) => record.hasOwnProperty('target') && record.name === '_http._tcp');
    if (validRecords.length < 1) {
        return null;
    }
    const firstValidRecord = validRecords[0];
    if (!firstValidRecord.hasOwnProperty('target')) {
        return null;
    }
    let tokenFileUrl = firstValidRecord.target;
    if (tokenFileUrl.startsWith('https')) ;
    else if (tokenFileUrl.startsWith('http')) ;
    else {
        tokenFileUrl = `https://${tokenFileUrl}`;
    }
    return tokenFileUrl;
}
function resolveZoneFileToProfile(zoneFile, publicKeyOrAddress, fetchFn = createFetchFn()) {
    return new Promise((resolve, reject) => {
        let zoneFileJson = null;
        try {
            zoneFileJson = dist.parseZoneFile(zoneFile);
            if (!zoneFileJson.hasOwnProperty('$origin')) {
                zoneFileJson = null;
            }
        }
        catch (e) {
            reject(e);
        }
        let tokenFileUrl = null;
        if (zoneFileJson && Object.keys(zoneFileJson).length > 0) {
            tokenFileUrl = getTokenFileUrl(zoneFileJson);
        }
        else {
            try {
                return resolve(Person.fromLegacyFormat(JSON.parse(zoneFile)).profile());
            }
            catch (error) {
                return reject(error);
            }
        }
        if (tokenFileUrl) {
            fetchFn(tokenFileUrl)
                .then(response => response.text())
                .then(responseText => JSON.parse(responseText))
                .then(responseJson => {
                const tokenRecords = responseJson;
                const profile = extractProfile(tokenRecords[0].token, publicKeyOrAddress);
                resolve(profile);
            })
                .catch(error => {
                Logger.error(`resolveZoneFileToProfile: error fetching token file ${tokenFileUrl}: ${error}`);
                reject(error);
            });
        }
        else {
            Logger.debug('Token file url not found. Resolving to blank profile.');
            resolve({});
        }
    });
}

export { resolveZoneFileToProfile as r };
