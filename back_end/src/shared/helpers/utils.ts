export const countDecimals = (value: number) => {
  if (Math.floor(value) === value) return 0;
  return value.toString().split('.')[1].length || 0;
};

export const limitOfDecimals = (number: number) => {
  if (countDecimals(number) > 5) return number.toFixed(2);
  return number;
};

export const convertImgUrl = (url) => {
  if (url && url.includes('=s20')) {
    url = url.replace(/=s20/, '=s0');
  } else if (url && url.includes('=s40')) {
    url = url.replace(/=s40/, '=s0');
  } else if (url && url.includes('=s60')) {
    url = url.replace(/=s60/, '=s0');
  } else if (url && url.includes('=s80')) {
    url = url.replace(/=s80/, '=s0');
  } else if (url && url.includes('=s100')) {
    url = url.replace(/=s100/, '=s0');
  } else if (url && url.includes('=s120')) {
    url = url.replace(/=s120/, '=s0');
  } else if (url && url.includes('=s140')) {
    url = url.replace(/=s140/, '=s0');
  } else if (url && url.includes('=s160')) {
    url = url.replace(/=s160/, '=s0');
  } else if (url && url.includes('=s180')) {
    url = url.replace(/=s180/, '=s0');
  } else if (url && url.includes('=s200')) {
    url = url.replace(/=s200/, '=s0');
  }
  return url;
};

export const convertImgToProxyURL = (imagePath) => {
  if (
    !imagePath.startsWith('https://elb.ipfs.myx.audio') &&
    !imagePath.startsWith('https://proxy.myx.audio/getFile?url=') &&
    !imagePath.startsWith('https://elb.ipfsprivi.com')
  ) {
    return (
      'https://proxy.myx.audio/getFile?url=' + sanitizeIfIpfsUrl(imagePath)
    );
  } else {
    return imagePath;
  }
};

export const sanitizeIfIpfsUrl = (url) => {
  if (!url) {
    return null;
  }
  if (url.includes('ipfs://')) {
    return url.replace('ipfs://', 'https://ipfs.io/ipfs/');
  }
  return url;
};

export const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const toDecimalFormat = (currency, decimalPlace = 8) =>
  Intl.NumberFormat('en-US', {
    style: 'decimal',
    maximumFractionDigits: decimalPlace
  }).format(currency);

export const parsePrice = (price: string): string => {
  let priceList = price.split(' ');

  if (priceList.length === 1) {
    return `${parseFloat(priceList[0])}`;
  } else if (priceList.length > 1) {
    if (isNaN(parseFloat(priceList[0]))) {
      return `${priceList[0]} ${parseFloat(priceList[1])}`;
    } else {
      return `${parseFloat(priceList[0])} ${priceList[1]}`;
    }
  }

  return price;
};

export function getUnixEpochTimeStamp(value) {
  return Math.floor(value.getTime() / 1000);
}

export const nFormatter = (num, digits) => {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'k' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' }
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol
    : '0';
};

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function processImage(imageUrl) {
  if (imageUrl) {
    if (
      !imageUrl.startsWith('https://elb.ipfs.myx.audio') &&
      !imageUrl.startsWith('https://elb.ipfsmusic.com')
    ) {
      return convertImgUrl(convertImgToProxyURL(imageUrl));
    }
  }
  return imageUrl;
}
