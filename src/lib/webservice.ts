import axios from 'axios';

export async function liveness(url: string): Promise<void> {
    try {
        const uri = new URL(url);
        url = uri.toString().endsWith('/') ? `${uri}liveness` : uri.toString();
        await axios.get(url);
    } catch (e: any) {
        const err = `Fail connect to ${url}. \n ${e.toString()}`
        throw new Error(err);
    }
}
