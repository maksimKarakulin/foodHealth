export async function getFoodDetails(id: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/foods/${id}`);
    return response.json();
}
