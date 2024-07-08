import axios from 'axios';
import URL from 'shared/functions/getURL';

// PIX PROFILE ITEMS
export async function getTraxProfileItems(
  userId: string,
  isVisitor: boolean,
  tab: string
): Promise<any> {
  try {
    const config = {
      params: {
        userId,
        isVisitor,
        tab
      }
    };
    const response = await axios.get(
      `${URL()}/user/getPixProfileItems`,
      config
    );
    return response?.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getOwnedMediaUserInfo(userId: string): Promise<any> {
  try {
    const response = await axios.get(
      `${URL()}/user/getOwnedMediaUserInfo/${userId}`
    );
    return response?.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export interface IAutocompleteUsers {
  name: string;
  urlSlug: string;
  address: string;
  imageUrl: string;
  anonAvatar: string;
  avatar: string;
}

export async function getMatchingUsers(
  searchValue: string,
  properties: string[],
  lastValue: string = ''
): Promise<any> {
  try {
    let url = `${URL()}/user/getMatchingUsers`;
    if (searchValue) url += `?value=${searchValue}`;
    properties.forEach((prop, index) => {
      if (index > 0 || searchValue) url += `&properties=${prop}`;
      else if (index === 0) {
        url += `?properties=${prop}`;
      }
    });
    if (lastValue) url += `&lastValue=${lastValue}`;
    const response = await axios.get(url);
    return response?.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function checkUserConnected(userId: string): Promise<any> {
  try {
    const response = await axios.get(
      `${URL()}/user/checkUserConnected/${userId}`
    );
    return response?.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getArtistsByLabel(): Promise<any> {
  try {
    let url = `${URL()}/user/getArtistsByLabel`;
    const response = await axios.get(url);
    return response?.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function createArtist(
  name: string,
  twitter: string,
  instagram: string,
  image: string,
  infoImage: any,
  address?: string
): Promise<any> {
  try {
    let url = `${URL()}/user/createArtist`;
    const response = await axios.post(url, {
      name,
      twitter,
      instagram,
      image,
      infoImage,
      address
    });
    return response?.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}
