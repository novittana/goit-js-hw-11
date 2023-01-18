import axios from "axios";

export class PixabayAPI {
    static BASE_URL = 'https://pixabay.com/api/';
    static API_KEY = '32927345-79f6601b1939de315bd5cd7a6';

    constructor() {
        this.page = 1;
        this.query = null;
    }

    async fetchPhotosByQuery() {
        const searchParams = {
            params: {
                q: this.query,
                page: this.page,
                per_page: 40,
                orientation: 'horizontal',
                image_type: 'photo',
                key: PixabayAPI.API_KEY,
                safesearch: true,
            },
        };

        const { data } = await axios.get(`${PixabayAPI.BASE_URL}`, searchParams);
        return data;
    }
}