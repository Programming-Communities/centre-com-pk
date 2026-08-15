import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');

    if (!lat || !lng) {
      return NextResponse.json({ success: false, error: 'Latitude and longitude required' }, { status: 400 });
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=18&addressdetails=1`
    );

    const data = await response.json();

    if (!data || data.error) {
      return NextResponse.json({ success: false, error: 'Location not found' }, { status: 404 });
    }

    const address = data.address || {};
    
    const result = {
      display_name: data.display_name || '',
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lon),
      address: {
        city: address.city || address.town || address.village || '',
        state: address.state || '',
        country: address.country || '',
        country_code: address.country_code || '',
        postcode: address.postcode || '',
        road: address.road || '',
        house_number: address.house_number || '',
        suburb: address.suburb || '',
        neighbourhood: address.neighbourhood || '',
      },
    };

    return NextResponse.json({ success: true, location: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
