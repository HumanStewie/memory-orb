export default async function verifyToken(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token")

    const headers = {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json" 
    }
    const response = await fetch(url, { ...options, headers})
    
    if (response.status === 401){
        console.warn("Token expired!")
        localStorage.removeItem("token")
        window.location.reload();
        return null
    }
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    return response;
}