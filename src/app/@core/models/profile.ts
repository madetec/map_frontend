export class Profile {
    user_id: number;
    name: string;
    last_name: string;
    father_name: string;
    subdivision: string;
    position: string;
    main_phone: number;
    main_address: string;
    phones: number[];
    addresses: string[];
    status: {
        code: number,
        name: string
    };
}
