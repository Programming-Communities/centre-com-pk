import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query || query.length < 2) {
      return NextResponse.json({ success: true, results: [] });
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=${limit}&addressdetails=1`
    );

    const data = await response.json();

    const results = data.map((item: any, index: number) => ({
      id: item.place_id,
      key: `location-${item.place_id || index}`,
      display_name: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      type: item.type,
      class: item.class,
      address: {
        city: item.address?.city || item.address?.town || item.address?.village || '',
        state: item.address?.state || '',
        country: item.address?.country || '',
        country_code: item.address?.country_code || '',
        postcode: item.address?.postcode || '',
        road: item.address?.road || '',
        house_number: item.address?.house_number || '',
      },
    }));

    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, results: [] });
  }
}
