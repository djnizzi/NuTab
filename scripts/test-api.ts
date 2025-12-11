
const BASE_URL = "http://localhost:3000/api/sites";

async function testApi() {
    console.log("Starting API Test...");

    // 1. GET initial
    console.log("1. GET /api/sites");
    let res = await fetch(BASE_URL);
    let sites = await res.json();
    console.log("   Initial count:", sites.length);

    // 2. POST create
    console.log("2. POST /api/sites (Create 'Test Site')");
    const formData = new FormData();
    formData.append("name", "Test Site");
    formData.append("url", "https://example.com");

    res = await fetch(BASE_URL, {
        method: "POST",
        body: formData,
    });

    if (!res.ok) throw new Error(`POST failed: ${res.statusText}`);
    const newSite = await res.json();
    console.log("   Created:", newSite.id, newSite.name);

    // 3. GET verify
    console.log("3. GET /api/sites (Verify creation)");
    res = await fetch(BASE_URL);
    sites = await res.json();
    const created = sites.find((s: any) => s.id === newSite.id);
    if (!created) throw new Error("Created site not found in list");
    console.log("   Verified creation.");

    // 4. PUT update
    console.log("4. PUT /api/sites/[id] (Update name)");
    const updateData = new FormData();
    updateData.append("name", "Updated Test Site");
    updateData.append("url", "https://example.com");

    res = await fetch(`${BASE_URL}/${newSite.id}`, {
        method: "PUT",
        body: updateData, // fetch in Node 18 might handle FormData if recent enough, else we might need headers. 
        // Node 18 native fetch supports FormData.
    });

    if (!res.ok) throw new Error(`PUT failed: ${res.statusText}`);
    const updatedSite = await res.json();
    if (updatedSite.name !== "Updated Test Site") throw new Error("Name update failed");
    console.log("   Updated name.");

    // 5. DELETE
    console.log("5. DELETE /api/sites/[id]");
    res = await fetch(`${BASE_URL}/${newSite.id}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error(`DELETE failed: ${res.statusText}`);
    console.log("   Deleted.");

    console.log("API Test Passed!");
}

testApi().catch(console.error);
