import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs/promises';
import metascraper from 'metascraper';
import date from 'metascraper-date';
import { template } from './templates.js';
import probe from 'probe-image-size';

const dateScraper = metascraper([date()]);

const COLLECTION_ID = '17692473';

async function getCollection() {
  try {
    const res = await fetch(
      `https://api.raindrop.io/rest/v1/collection/${COLLECTION_ID}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    console.log(data);
  } catch (e) {
    console.log(e);
  }
}

async function getCollectionItems() {
  try {
    const res = await fetch(
      `https://api.raindrop.io/rest/v1/raindrops/${COLLECTION_ID}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.API}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const { items } = await res.json();
    return items;
  } catch (e) {
    console.log(e);
  }
}

async function getImageDimensions(url) {
  if (!url) return { width: 0, height: 0 };

  try {
   
   const res = await probe(url);
   return {width: res.width, height: res.height}
  } catch (e) {
    console.log(e);
  }
}

async function getWebsitePublicationDate(url) {
  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const html = await res.text();
    const pubDate =  await dateScraper({ html, url });
    console.log("🚀 ~ file: index.js:80 ~ getWebsitePublicationDate ~ pubDate:", pubDate)
    if (!pubDate.date) return null;
    const dateObj =  new Date(pubDate.date);
    console.log("🚀 ~ file: index.js:86 ~ getWebsitePublicationDate ~ dateObj:", dateObj)
    const formattedDate = dateObj.toLocaleDateString('en-US');
    console.log("🚀 ~ file: index.js:88 ~ getWebsitePublicationDate ~ formattedDate", formattedDate)
    return formattedDate


  } catch (e) {
    console.log(e);
  }
}

async function buildTemplate() {
  const items = await getCollectionItems();

  const parsedItems = await Promise.all(
    items.map(async (item) => {
      const { link, image, title, excerpt, cover, domain } = item;
      const pubDate = await getWebsitePublicationDate(link);
      const { width, height } = await getImageDimensions(cover);

      return {
        link,
        image,
        title,
        excerpt,
        cover,
        domain,
        pubDate,
        width,
        height,
      };
    })
  );

  const list = parsedItems.map(template
  ).join('');

  try {
    fs.writeFile('index.html', list);
  } catch (e) {
    console.log(e);
  }
}

buildTemplate();
