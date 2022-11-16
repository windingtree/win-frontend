const RND_HOTEL_IMGS = [
  'http://www.cfmedia.vfmleonardo.com/imageRepo/4/0/80/401/37/auhal_phototour05_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/4/0/80/401/77/auhal_phototour15_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/4/0/80/401/21/auhal_phototour01_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/4/0/80/401/41/auhal_phototour06_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/4/0/80/401/25/auhal_phototour02_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/4/0/80/401/57/auhal_phototour10_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/4/0/81/99/696/auhal_phototour25_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/4/0/80/401/145/auhal_phototour23_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/4/0/82/453/277/auhal_phototour28_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/4/0/82/453/281/auhal_phototour29_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/5/0/82/801/280/auhal_phototour47_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/5/0/82/801/289/auhal_phototour48_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/4/0/80/401/29/auhal_phototour03_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/4/0/80/401/33/auhal_phototour04_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/5/0/90/71/41/auhal_phototour52_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/5/0/90/71/45/auhal_phototour53_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/4/0/80/401/45/auhal_phototour07_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/4/0/80/401/49/auhal_phototour08_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/4/0/80/401/53/auhal_phototour09_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/4/0/80/401/61/auhal_phototour11_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/4/0/80/401/65/auhal_phototour13_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/4/0/80/401/69/auhal_phototour12_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/4/0/80/401/73/auhal_phototour14_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/4/0/80/401/81/auhal_phototour16_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/4/0/80/401/85/auhal_phototour17_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/5/0/82/801/308/auhal_phototour50_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/5/0/82/801/318/auhal_phototour49_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/5/0/82/945/448/auhal_phototour51_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/4/0/82/453/289/auhal_phototour31_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/4/0/82/453/293/auhal_phototour32_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/4/0/82/453/297/auhal_phototour33_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/4/0/82/453/301/auhal_phototour34_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/5/0/82/640/101/auhal_phototour35_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/5/0/90/71/49/auhal_phototour56_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/4/0/82/453/305/auhal_phototour36_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/4/0/82/453/309/auhal_phototour37_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/4/0/82/453/313/auhal_phototour38_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/5/0/90/71/53/auhal_phototour57_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/4/0/82/453/285/auhal_phototour30_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/5/0/90/71/57/auhal_phototour55_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/5/0/90/71/61/auhal_phototour58_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/4/0/81/99/700/auhal_phototour26_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/5/0/90/71/65/auhal_phototour62_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/5/0/90/71/69/auhal_phototour59_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/5/0/90/71/73/auhal_phototour60_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/5/0/90/71/77/auhal_phototour61_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/5/0/90/71/81/auhal_phototour63_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/5/0/90/71/85/auhal_phototour64_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/5/0/90/71/89/auhal_phototour65_S.jpg',
  'http://www.cfmedia.vfmleonardo.com/imageRepo/5/0/90/100/684/auhal_phototour73_S.jpg'
];

let useRndHotelImg = false;
if (process.env.REACT_APP_USE_RND_HOTEL_IMG === 'true') {
  useRndHotelImg = true;
}

function getRndHotelImg(): string {
  // Skip this for production.
  if (!useRndHotelImg) {
    return '';
  }

  const imgSetSize = RND_HOTEL_IMGS.length;
  const rndIdx = Math.floor(Math.random() * (imgSetSize - 1));
  const rndImg = RND_HOTEL_IMGS[rndIdx];

  return rndImg;
}

function thisIsTestImage(image: string | undefined): boolean {
  // Skip this for production.
  if (!useRndHotelImg) {
    return false;
  }

  // Test images that have the text "TEST IMAGE: This image is not a bug" have the
  // following sub-string in their URL:
  //   - uat.multimediarepository.testing.amadeus.com
  //   - 0796D584C500433995B3A5B5EF9F471E
  // Also, we check if URL is defined (and not empty).
  if (
    !image ||
    image.length === 0 ||
    image.match('uat.multimediarepository.testing.amadeus.com') ||
    image.match('0796D584C500433995B3A5B5EF9F471E')
  ) {
    return true;
  }

  return false;
}

function getAccommodationImage(originalUrl, substituteUrl): string | undefined {
  // Skip this for production.
  if (!useRndHotelImg) {
    return originalUrl;
  }

  let imgUrl: string | undefined = '';

  if (thisIsTestImage(originalUrl)) {
    imgUrl = substituteUrl;
  } else {
    imgUrl = originalUrl;
  }

  return imgUrl;
}

export { getRndHotelImg, thisIsTestImage, getAccommodationImage };
