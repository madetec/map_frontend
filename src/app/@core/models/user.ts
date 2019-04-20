import {Profile} from './profile';

export class User {
    username: string;
    access_token: string;
    expires_in: number;
    token_type: string;
    scope?: string;
    refresh_token: string;
    profile: Profile = new Profile();
    role: string;
    roleName: string;

    constructor(data = null) {
        if (data) {
            this.setAuthData(
                data.username,
                data.access_token,
                data.expires_in,
                data.token_type,
                data.scope,
                data.refresh_token
            );
            this.setProfile(
                data.profile.name,
                data.profile.last_name,
                data.profile.father_name,
                data.profile.subdivision,
                data.profile.position,
                data.profile.main_phone,
                data.profile.main_address,
                data.profile.phones,
                data.profile.addresses,
                data.profile.status
            );
            this.setRole(data.role, data.roleName);
        }
    }


    public setAuthData(username, access_token, expires_in, token_type, scope, refresh_token) {
        this.username = username;
        this.access_token = access_token;
        this.expires_in = expires_in;
        this.token_type = token_type;
        this.scope = scope;
        this.refresh_token = refresh_token;
    }

    public setRole(role, roleName) {
        this.role = role;
        this.roleName = roleName;
    }

    public setProfile(
        name,
        last_name,
        father_name,
        subdivision,
        position,
        main_phone,
        main_address,
        phones,
        addresses,
        status) {
        this.profile.name = name;
        this.profile.last_name = last_name;
        this.profile.father_name = father_name;
        this.profile.subdivision = subdivision;
        this.profile.position = position;
        this.profile.main_phone = main_phone;
        this.profile.main_address = main_address;
        this.profile.phones = phones;
        this.profile.addresses = addresses;
        this.profile.status = status;
    }
}
