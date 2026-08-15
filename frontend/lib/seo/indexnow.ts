const INDEXNOW_KEY = process.env.INDEXNOW_KEY || '481f2ed0ec522bb21a7aaf1f358d4194';
const BASE_URL = 'https://www.centre.com.pk';

export async function submitToIndexNow(url: string) {
  try {
    await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: 'www.centre.com.pk',
        key: INDEXNOW_KEY,
        urlList: [url],
      }),
    });
    console.log(`✅ IndexNow submitted: ${url}`);
  } catch (error) {
    console.error(`❌ IndexNow failed: ${url}`, error);
  }
}

export async function submitMultipleToIndexNow(urls: string[]) {
  try {
    await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        host: 'www.centre.com.pk',
        key: INDEXNOW_KEY,
        urlList: urls,
      }),
    });
    console.log(`✅ IndexNow submitted: ${urls.length} URLs`);
  } catch (error) {
    console.error('❌ IndexNow batch failed', error);
  }
}