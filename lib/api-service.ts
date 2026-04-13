export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
export const COMPANY_ID = process.env.NEXT_PUBLIC_COMPANY_ID || "42";
export const CATALOG_SLUG = process.env.NEXT_PUBLIC_CATALOG_SLUG || "demo";
export const COMPANY_TOKEN = process.env.NEXT_PUBLIC_COMPANY_TOKEN;

const getPublicHeaders = () => {
  const headers: any = {
    "Content-Type": "application/json",
    "x-company-id": COMPANY_ID,
  };

  if (COMPANY_TOKEN) {
    headers["Authorization"] = `Bearer ${COMPANY_TOKEN}`;
    headers["x-company-token"] = COMPANY_TOKEN;
  }

  return headers;
};

export async function fetchCategories() {
  const response = await fetch(`${API_URL}/categories`, {
    headers: getPublicHeaders(),
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
}

export async function fetchProducts(
  page = 1,
  size = 50,
  categoryIds = "",
  minPrice?: number,
  maxPrice?: number,
) {
  const url = new URL(`${API_URL}/products/ecommerce/${COMPANY_ID}`);
  url.searchParams.append("page", page.toString());
  url.searchParams.append("size", size.toString());
  if (categoryIds) {
    url.searchParams.append("categoryIds", categoryIds);
  }
  if (minPrice !== undefined) {
    url.searchParams.append("minPrice", minPrice.toString());
  }
  if (maxPrice !== undefined) {
    url.searchParams.append("maxPrice", maxPrice.toString());
  }

  const response = await fetch(url.toString(), {
    headers: getPublicHeaders(),
    next: { revalidate: 60 }, // Cache for 1 minute
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

export async function createOrder(orderData: any) {
  const response = await fetch(`${API_URL}/sales/public-order`, {
    method: "POST",
    headers: getPublicHeaders(),
    body: JSON.stringify({
      ...orderData,
      catalogSlug: CATALOG_SLUG,
      companyId: COMPANY_ID,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create order");
  }

  return response.json();
}

export async function fetchProductById(productId: string) {
  const response = await fetch(
    `${API_URL}/products/ecommerce/${COMPANY_ID}/product/${productId}`,
    {
      headers: getPublicHeaders(),
      next: { revalidate: 60 },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch product details");
  }

  const result = await response.json();
  return result.info.data;
}
