import axios from 'axios';
import URL from 'shared/functions/getURL';

// post

export async function createBuySongOffer(payload: any): Promise<any> {
  try {
    const response = await axios.post(
      `${URL()}/musicPod/buySongOffer`,
      payload
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function deleteBuySongOffer(payload: any): Promise<any> {
  try {
    const response = await axios.post(
      `${URL()}/musicPod/deleteBuySongOffer`,
      payload
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function createSalesSongOffer(payload: any): Promise<any> {
  try {
    const response = await axios.post(
      `${URL()}/musicPod/saleSongOffer`,
      payload
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function updateSalesSongOffer(payload: any): Promise<any> {
  try {
    const response = await axios.post(
      `${URL()}/musicPod/updateSaleSongOfferFromOwner`,
      payload
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function updateOwnerSongOffer(payload: any): Promise<any> {
  try {
    const response = await axios.post(
      `${URL()}/musicPod/updateSaleSongOffer`,
      payload
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function deleteSalesSongOffer(payload: any): Promise<any> {
  try {
    const response = await axios.post(
      `${URL()}/musicPod/deleteSaleSongOffer`,
      payload
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function refreshBuyingOffers(payload: any): Promise<any> {
  try {
    const response = await axios.post(
      `${URL()}/marketplace/refreshBuySongOffers`,
      payload
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getMarketFee(): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/musicPod/marketFee`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}
